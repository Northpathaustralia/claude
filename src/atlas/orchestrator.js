// ---------------------------------------------------------------------------
// Turn orchestrator: builds context, routes to a model, and executes the
// mode's pass pipeline (single pass, Deep Think draft->critique, X10 staged
// council). The model call is injected (deps.callModel) so the whole engine
// is unit-testable offline; the UI injects providers/index.js streamChat.
// ---------------------------------------------------------------------------

import { buildSystemPrompt } from './persona.js';
import { route } from './router.js';
import { selectMemories } from './memory.js';
import { searchChunks } from './knowledge.js';
import { SPECIALISTS, selectSpecialists, specialistPrompt, synthesisPrompt } from './council.js';
import { estimateCost } from './models.js';
import { pickSearchProvider } from './providers/search.js';

function addUsage(total, u) {
  return {
    inputTokens: total.inputTokens + (u?.inputTokens || 0),
    outputTokens: total.outputTokens + (u?.outputTokens || 0),
  };
}

/**
 * Run one conversational turn.
 * @param {object} opts
 * @param {string} opts.message              latest user message
 * @param {Array<{role:string, content:string}>} opts.history prior turns (user/assistant)
 * @param {string} opts.mode                 intelligence mode id
 * @param {object} opts.settings             {profile, provider, modelOverride, keys, tone}
 * @param {object} [opts.project]            {name, instructions}
 * @param {Array}  [opts.memories]           approved memory records
 * @param {Array}  [opts.chunks]             knowledge chunk index
 * @param {(delta:string)=>void} [opts.onDelta]   streaming callback for the FINAL pass
 * @param {(stage:{id:string,label:string,detail?:string})=>void} [opts.onStage]
 * @param {AbortSignal} [opts.signal]
 * @param {object} deps  {callModel, searchWeb?} injected provider dispatchers
 */
export async function runTurn(opts, deps) {
  const {
    message,
    history = [],
    mode = 'smart',
    settings = {},
    project,
    memories = [],
    chunks = [],
    onDelta,
    onStage,
    signal,
  } = opts;
  const { callModel, searchWeb } = deps;

  const availableProviders = Object.entries(settings.keys || {})
    .filter(([, v]) => v)
    .map(([k]) => k);

  const routed = route({
    mode,
    profile: settings.profile,
    provider: settings.provider,
    modelOverride: settings.modelOverride,
    availableProviders,
  });

  const memoriesUsed = selectMemories(memories, message);
  const knowledgeUsed = searchChunks(chunks, message, 4);

  const meta = {
    mode,
    model: routed.model ? routed.model.id : null,
    modelLabel: routed.model ? routed.model.label : null,
    routeReason: routed.reason,
    memoriesUsed: memoriesUsed.map((m) => m.id),
    knowledgeUsed: knowledgeUsed.map((k) => ({ docId: k.docId, title: k.title })),
    specialists: [],
    passes: [],
    sources: [],
    demo: false,
  };

  // No provider connected: honest, clearly-labelled demonstration reply.
  if (!routed.model) {
    meta.demo = true;
    const text = demoReply(message, mode);
    if (onDelta) onDelta(text);
    return { text, meta, usage: { inputTokens: 0, outputTokens: 0 }, cost: null };
  }

  // Research mode: real web search when a search provider is connected.
  let sources = [];
  if (mode === 'research' && searchWeb) {
    const searchCfg = pickSearchProvider(settings);
    if (searchCfg) {
      if (onStage) onStage({ id: 'search', label: `Searching the web (${searchCfg.provider})` });
      try {
        sources = await searchWeb({ ...searchCfg, query: message, count: 5 });
        meta.sources = sources;
        meta.searchProvider = searchCfg.provider;
      } catch (err) {
        // Continue without live sources, but say so honestly.
        meta.searchError = err?.message || 'Web search failed.';
        if (onStage) onStage({ id: 'search-failed', label: 'Web search failed — continuing without live sources' });
      }
    }
  }

  const system = buildSystemPrompt({
    mode,
    projectName: project?.name,
    projectInstructions: project?.instructions,
    memories: memoriesUsed,
    knowledge: knowledgeUsed.map((k) => ({ title: k.title, excerpt: k.excerpt.slice(0, 1500) })),
    sources,
    tone: settings.tone,
  });

  const baseMessages = [...history, { role: 'user', content: message }];
  const modeDef = routed.mode;
  let totalUsage = { inputTokens: 0, outputTokens: 0 };

  const call = async (label, { systemOverride, messages, stream }) => {
    if (onStage) onStage({ id: label, label });
    const res = await callModel({
      model: routed.model,
      keys: settings.keys,
      system: systemOverride || system,
      messages,
      maxTokens: modeDef.maxTokens,
      adaptiveThinking: !!modeDef.adaptiveThinking,
      onDelta: stream ? onDelta : undefined,
      signal,
    });
    totalUsage = addUsage(totalUsage, res.usage);
    meta.passes.push({ id: label, usage: res.usage });
    return res;
  };

  let finalText = '';
  let thinkingSummary = '';

  if (mode === 'deep') {
    const draft = await call('Draft analysis', { messages: baseMessages, stream: false });
    const critiqueMessages = [
      ...baseMessages,
      { role: 'assistant', content: draft.text },
      {
        role: 'user',
        content:
          'Critique your draft above: find weak assumptions, missing options, contradictions and risks you underweighted. Then produce the improved FINAL answer only, in the Deep Think output format. Do not mention that this is a revision.',
      },
    ];
    const final = await call('Critique & improve', { messages: critiqueMessages, stream: true });
    finalText = final.text;
    thinkingSummary = final.thinkingSummary || draft.thinkingSummary || '';
  } else if (mode === 'x10') {
    // Stage 1: objective, success criteria, assumptions, angle plan.
    const plan = await call('Define objective & plan', {
      messages: [
        ...baseMessages,
        {
          role: 'user',
          content:
            'X10 Stage 1 only: define the objective, what success looks like, key assumptions to test, information gaps, and the 3-6 analysis angles that matter most. Be compact — this is an internal working note, not the final answer.',
        },
      ],
      stream: false,
    });

    // Stage 2: council specialists analyse in sequence.
    const specialistIds = selectSpecialists(message).filter((s) => s !== 'ATLAS');
    meta.specialists = specialistIds;
    const analyses = [];
    for (const id of specialistIds) {
      const res = await call(`Council: ${id}`, {
        systemOverride: specialistPrompt(id),
        messages: [
          {
            role: 'user',
            content: `Task from James: ${message}\n\nAtlas working plan:\n${plan.text}\n\nGive your ${id} specialist analysis.`,
          },
        ],
        stream: false,
      });
      analyses.push({ id, text: res.text });
    }

    // Stage 3: Atlas synthesis, streamed to the user.
    const councilBlock = analyses.map((a) => `=== ${a.id} ===\n${a.text}`).join('\n\n');
    const final = await call('Synthesis & recommendation', {
      systemOverride: `${system}\n\n${synthesisPrompt(['ATLAS', ...specialistIds])}`,
      messages: [
        ...baseMessages,
        {
          role: 'user',
          content: `Internal working plan:\n${plan.text}\n\nSpecialist council analyses:\n${councilBlock}\n\nNow produce the full X10 decision brief for James.`,
        },
      ],
      stream: true,
    });
    finalText = final.text;
    thinkingSummary = final.thinkingSummary || '';
  } else {
    const res = await call(modeDef.label, { messages: baseMessages, stream: true });
    finalText = res.text;
    thinkingSummary = res.thinkingSummary || '';
  }

  meta.thinkingSummary = thinkingSummary;
  const cost = estimateCost(routed.model.id, totalUsage.inputTokens, totalUsage.outputTokens);
  return { text: finalText, meta, usage: totalUsage, cost };
}

/**
 * Convene the council on a standalone question (Council page).
 * Same engine as X10 stages 2-3 without the plan pass.
 */
export async function runCouncil({ question, settings = {}, onStage, onDelta, signal }, deps) {
  const { callModel } = deps;
  const availableProviders = Object.entries(settings.keys || {})
    .filter(([, v]) => v)
    .map(([k]) => k);
  const routed = route({ mode: 'x10', profile: settings.profile, provider: settings.provider, availableProviders });

  const specialistIds = selectSpecialists(question).filter((s) => s !== 'ATLAS');
  const meta = { specialists: specialistIds, model: routed.model?.id || null, passes: [], demo: !routed.model };
  let totalUsage = { inputTokens: 0, outputTokens: 0 };

  if (!routed.model) {
    const text = demoCouncil(question, specialistIds);
    if (onDelta) onDelta(text);
    return { text, analyses: [], meta, usage: totalUsage, cost: null };
  }

  const analyses = [];
  for (const id of specialistIds) {
    if (onStage) onStage({ id, label: `Consulting ${id}` });
    const res = await callModel({
      model: routed.model,
      keys: settings.keys,
      system: specialistPrompt(id),
      messages: [{ role: 'user', content: `Task from James: ${question}\n\nGive your ${id} specialist analysis.` }],
      maxTokens: 4096,
      adaptiveThinking: true,
      signal,
    });
    totalUsage = addUsage(totalUsage, res.usage);
    meta.passes.push({ id, usage: res.usage });
    analyses.push({ id, role: SPECIALISTS[id]?.role, text: res.text });
  }

  if (onStage) onStage({ id: 'ATLAS', label: 'Atlas synthesis' });
  const councilBlock = analyses.map((a) => `=== ${a.id} ===\n${a.text}`).join('\n\n');
  const final = await callModel({
    model: routed.model,
    keys: settings.keys,
    system: `${buildSystemPrompt({ mode: 'executive' })}\n\n${synthesisPrompt(['ATLAS', ...specialistIds])}`,
    messages: [
      { role: 'user', content: `Question for the council: ${question}\n\nSpecialist analyses:\n${councilBlock}\n\nProduce the council decision brief.` },
    ],
    maxTokens: 16000,
    adaptiveThinking: true,
    onDelta,
    signal,
  });
  totalUsage = addUsage(totalUsage, final.usage);
  meta.passes.push({ id: 'ATLAS', usage: final.usage });

  const cost = estimateCost(routed.model.id, totalUsage.inputTokens, totalUsage.outputTokens);
  return { text: final.text, analyses, meta, usage: totalUsage, cost };
}

// --- Demonstration mode (no provider connected) -------------------------

function demoReply(message, mode) {
  return `**[Demonstration reply — no AI provider is connected yet]**

Atlas can't think for real until you connect an AI provider, which takes about two minutes:

1. Open **Settings** (left menu) and find **AI Providers**.
2. Click **Get a key** next to Anthropic (recommended) — it opens the key page in a new tab.
3. Create a key there, copy it, paste it into the Anthropic field, and click **Save**.
4. Come back to this chat and ask your question again.

Once connected, this exact question ("${(message || '').slice(0, 120)}${(message || '').length > 120 ? '…' : ''}") would run in **${mode.toUpperCase()}** mode with real reasoning, your project context, approved memories and any relevant uploaded documents.

*Everything you see in demonstration mode is labelled as such — Atlas never fakes a real answer.*`;
}

function demoCouncil(question, specialistIds) {
  return `**[Demonstration — no AI provider connected]**

For this question the council would convene: **${specialistIds.join(', ')}**, each producing an independent specialist analysis before Atlas synthesises a decision brief (consensus, minority opinions, trade-offs, risks, recommended action).

Connect a provider in **Settings → AI Providers** to run the real council.`;
}
