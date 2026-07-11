// ---------------------------------------------------------------------------
// Core chat experience: streaming multi-provider conversations with modes,
// user-controlled memory commands, knowledge/project context, voice
// push-to-talk (Beta), an emergency Stop, and a right-hand intelligence panel.
// ---------------------------------------------------------------------------
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAtlas } from '../../store/AtlasStoreContext.jsx';
import { runTurn } from '../../atlas/orchestrator.js';
import { streamChat } from '../../atlas/providers/index.js';
import { searchWeb, pickSearchProvider } from '../../atlas/providers/search.js';
import { route, MODES } from '../../atlas/router.js';
import { parseMemoryCommand, findMemoryMatches } from '../../atlas/memory.js';
import { buildChunkIndex } from '../../atlas/knowledge.js';
import { voiceSupport, startListening, speak, stopSpeaking } from '../../atlas/voice.js';
import { uid } from '../../utils/format.js';
import Markdown from '../../components/atlas/Markdown.jsx';
import StatusBadge from '../../components/atlas/StatusBadge.jsx';

function relTime(iso) {
  const mins = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m ago`;
  if (mins < 60 * 24) return `${Math.floor(mins / 60)}h ago`;
  return `${Math.floor(mins / 1440)}d ago`;
}

export default function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { atlas, dispatchAtlas } = useAtlas();

  const [input, setInput] = useState('');
  const [convSearch, setConvSearch] = useState('');
  const [mode, setMode] = useState('smart');
  const [sending, setSending] = useState(false);
  const [stage, setStage] = useState('');
  const [streamText, setStreamText] = useState('');
  const [error, setError] = useState('');
  const [listening, setListening] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);

  const abortRef = useRef(null);
  const listenRef = useRef(null);
  const bottomRef = useRef(null);

  const conv = atlas.conversations.find((c) => c.id === id) || null;
  const support = voiceSupport();

  // "new" route: create a conversation then jump to it.
  useEffect(() => {
    if (id === 'new') {
      const newId = uid('conv');
      dispatchAtlas({ type: 'conversation/create', id: newId, mode });
      navigate(`/chat/${newId}`, { replace: true });
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (conv?.mode && conv.messages.length === 0) setMode(conv.mode);
  }, [conv?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conv?.messages.length, streamText]);

  useEffect(() => () => {
    abortRef.current?.abort();
    listenRef.current?.stop();
    stopSpeaking();
  }, []);

  const chunks = useMemo(() => buildChunkIndex(atlas.knowledgeDocs.map((d) => ({ id: d.id, title: d.title, text: d.text }))), [atlas.knowledgeDocs]);
  const availableProviders = Object.entries(atlas.settings.keys || {}).filter(([, v]) => v).map(([k]) => k);
  const routed = route({ mode, profile: atlas.settings.profile, provider: atlas.settings.provider, availableProviders });
  const project = conv?.projectId ? atlas.projects.find((p) => p.id === conv.projectId) : null;

  const appendMessage = (convId, message) => dispatchAtlas({ type: 'conversation/appendMessage', id: convId, message });

  async function send(text, { skipUserAppend = false } = {}) {
    const message = (text ?? input).trim();
    if (!message || sending || !conv) return;
    setError('');
    setInput('');

    if (!skipUserAppend) {
      appendMessage(conv.id, { id: uid('msg'), role: 'user', content: message, createdAt: new Date().toISOString() });
      if (conv.messages.length === 0) {
        dispatchAtlas({ type: 'conversation/update', id: conv.id, payload: { title: message.slice(0, 48) + (message.length > 48 ? '…' : ''), mode } });
      }
    }

    // Memory commands are handled locally — memory stays user-controlled.
    const memCmd = parseMemoryCommand(message);
    if (memCmd) {
      let reply = '';
      if (memCmd.action === 'remember') {
        if (memCmd.sensitive) {
          const ok = window.confirm('This looks like sensitive information (passwords, financial or personal identifiers). Atlas stores memory unencrypted in this browser. Store it anyway?');
          if (!ok) {
            appendMessage(conv.id, { id: uid('msg'), role: 'assistant', content: 'Understood — I have **not** stored that. Nothing was saved.', meta: { kind: 'memory' }, createdAt: new Date().toISOString() });
            return;
          }
        }
        dispatchAtlas({ type: 'memory/add', payload: { text: memCmd.text, category: memCmd.category } });
        reply = `Saved to memory (${memCmd.category}): "${memCmd.text}"\n\nYou can review, edit or delete it any time in **Memory**.`;
      } else if (memCmd.action === 'forget') {
        const matches = findMemoryMatches(atlas.memories, memCmd.text);
        if (matches.length) {
          matches.forEach((m) => dispatchAtlas({ type: 'memory/remove', id: m.id }));
          reply = `Forgotten:\n${matches.map((m) => `- "${m.text}"`).join('\n')}`;
        } else {
          reply = `I couldn't find a stored memory matching "${memCmd.text}". Open **Memory** to see everything I've stored.`;
        }
      } else {
        reply = atlas.memories.length
          ? `Here is everything you've asked me to remember:\n\n${atlas.memories.map((m) => `- **${m.category}** — ${m.text}`).join('\n')}\n\nManage these in **Memory** (edit, delete, export, or clear all).`
          : 'I have no stored memories yet. Say "Remember that …" and I\'ll keep it — you stay in full control in the **Memory** page.';
      }
      appendMessage(conv.id, { id: uid('msg'), role: 'assistant', content: reply, meta: { kind: 'memory' }, createdAt: new Date().toISOString() });
      return;
    }

    setSending(true);
    setStreamText('');
    setStage('');
    const controller = new AbortController();
    abortRef.current = controller;

    const history = conv.messages.map((m) => ({ role: m.role, content: m.content }));

    try {
      let acc = '';
      const res = await runTurn(
        {
          message,
          history,
          mode,
          settings: atlas.settings,
          project: project ? { name: project.name, instructions: project.instructions } : null,
          memories: atlas.memories,
          chunks,
          onDelta: (d) => {
            acc += d;
            setStreamText(acc);
          },
          onStage: (s) => setStage(s.label),
          signal: controller.signal,
        },
        { callModel: streamChat, searchWeb },
      );

      appendMessage(conv.id, {
        id: uid('msg'),
        role: 'assistant',
        content: res.text,
        meta: { ...res.meta, usage: res.usage, cost: res.cost },
        createdAt: new Date().toISOString(),
      });
      if (!res.meta.demo) {
        dispatchAtlas({
          type: 'usage/record',
          payload: { model: res.meta.model, mode, inputTokens: res.usage.inputTokens, outputTokens: res.usage.outputTokens, cost: res.cost },
        });
      }
      if (atlas.settings.voiceReplies) speak(res.text);
    } catch (err) {
      if (err?.name === 'AbortError' || /abort/i.test(err?.message || '')) {
        appendMessage(conv.id, {
          id: uid('msg'),
          role: 'assistant',
          content: `${streamText || ''}\n\n*[Stopped by you before the answer finished.]*`.trim(),
          meta: { stopped: true },
          createdAt: new Date().toISOString(),
        });
      } else {
        setError(err?.message || 'Something went wrong calling the AI provider.');
      }
    } finally {
      setSending(false);
      setStreamText('');
      setStage('');
      abortRef.current = null;
    }
  }

  function stop() {
    abortRef.current?.abort();
    stopSpeaking();
  }

  function regenerate() {
    if (!conv || sending) return;
    const msgs = [...conv.messages];
    while (msgs.length && msgs[msgs.length - 1].role === 'assistant') msgs.pop();
    const lastUser = msgs[msgs.length - 1];
    if (!lastUser) return;
    dispatchAtlas({ type: 'conversation/replaceMessages', id: conv.id, messages: msgs.slice(0, -1) });
    // Re-append the user message and rerun (store update is async; run with explicit history)
    setTimeout(() => {
      appendMessage(conv.id, lastUser);
      send(lastUser.content, { skipUserAppend: true });
    }, 0);
  }

  /** Edit a past user message: truncate the conversation to before it and
   *  load the text into the composer for editing + resend. */
  function editMessage(msgId) {
    if (!conv || sending) return;
    const idx = conv.messages.findIndex((m) => m.id === msgId);
    if (idx < 0) return;
    const original = conv.messages[idx];
    if (idx < conv.messages.length - 1 && !window.confirm('Editing this message removes the replies that came after it. Continue?')) return;
    dispatchAtlas({ type: 'conversation/replaceMessages', id: conv.id, messages: conv.messages.slice(0, idx) });
    setInput(original.content);
  }

  /** Save an assistant reply into Saved Outputs (artifact library). */
  function saveReply(m) {
    dispatchAtlas({
      type: 'artifact/add',
      payload: {
        title: `Chat: ${(conv?.title || 'reply').slice(0, 50)}`,
        type: 'markdown',
        ext: 'md',
        content: m.content,
        engine: 'chat',
        projectId: conv?.projectId || null,
      },
    });
  }

  function toggleMic() {
    if (listening) {
      listenRef.current?.stop();
      setListening(false);
      return;
    }
    setError('');
    listenRef.current = startListening({
      onResult: (text) => setInput(text),
      onEnd: () => setListening(false),
      onError: (msg) => {
        setError(msg);
        setListening(false);
      },
    });
    setListening(true);
  }

  const lastMeta = [...(conv?.messages || [])].reverse().find((m) => m.role === 'assistant' && m.meta && !m.meta.kind)?.meta;
  const convCost = (conv?.messages || []).reduce((s, m) => s + (m.meta?.cost || 0), 0);

  return (
    <div className="flex h-screen max-h-screen bg-navy-950 text-navy-100">
      {/* Conversation list */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-navy-800 bg-navy-900 md:flex">
        <div className="space-y-2 p-3">
          <button type="button" className="btn-emerald w-full" onClick={() => navigate('/chat/new')}>+ New</button>
          <input
            className="field-dark !py-1.5 text-xs"
            placeholder="Search conversations…"
            value={convSearch}
            onChange={(e) => setConvSearch(e.target.value)}
          />
        </div>
        <div className="flex-1 space-y-0.5 overflow-y-auto px-2 pb-3">
          {atlas.conversations.length === 0 && <p className="px-2 pt-2 text-xs text-navy-400">No conversations yet.</p>}
          {atlas.conversations.filter((c) => !convSearch || c.title.toLowerCase().includes(convSearch.toLowerCase())).map((c) => (
            <div
              key={c.id}
              className={`group flex cursor-pointer items-start justify-between gap-1 rounded-lg px-2.5 py-2 ${c.id === id ? 'bg-navy-800' : 'hover:bg-navy-850'}`}
              onClick={() => navigate(`/chat/${c.id}`)}
            >
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-navy-100">{c.title}</p>
                <p className="text-[10px] text-navy-400">
                  {relTime(c.updatedAt)}
                  {c.projectId && atlas.projects.find((p) => p.id === c.projectId) ? ` · ${atlas.projects.find((p) => p.id === c.projectId).name}` : ''}
                </p>
              </div>
              <button
                type="button"
                aria-label="Delete conversation"
                className="hidden text-navy-500 hover:text-red-400 group-hover:block"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('Delete this conversation?')) {
                    dispatchAtlas({ type: 'conversation/remove', id: c.id });
                    if (c.id === id) navigate('/chat');
                  }
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b border-navy-800 bg-navy-900/70 px-4 py-2.5">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{conv?.title || 'Conversations'}</p>
            <p className="text-[11px] text-navy-400">
              {routed.model ? `${routed.model.label} · ${routed.reason}` : 'No provider connected — replies run in labelled Demonstration mode'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {conv && (
              <select
                className="field-dark !w-auto !py-1.5 text-xs"
                value={conv.projectId || ''}
                onChange={(e) => dispatchAtlas({ type: 'conversation/update', id: conv.id, payload: { projectId: e.target.value || null } })}
                title="Attach to project"
              >
                <option value="">No project</option>
                {atlas.projects.filter((p) => !p.archived).map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            )}
            <button type="button" className="btn-ghost-dark !px-2.5 !py-1.5 text-xs xl:hidden" onClick={() => setPanelOpen(!panelOpen)}>
              Panel
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {!conv && (
            <div className="mx-auto mt-16 max-w-md text-center">
              <p className="text-lg font-semibold text-white">Talk to Atlas</p>
              <p className="mt-2 text-sm text-navy-300">Start a new conversation, or pick one from the list. Try: “Remember that I prefer short answers”, or switch to Deep Think for a big decision.</p>
              <button type="button" className="btn-emerald mt-4" onClick={() => navigate('/chat/new')}>Start a conversation</button>
            </div>
          )}
          {conv && conv.messages.length === 0 && !sending && (
            <div className="mx-auto mt-12 max-w-lg text-center text-sm text-navy-300">
              <p className="text-base font-semibold text-white">What are we working on?</p>
              <p className="mt-2">Ask anything. Pick a mode below — <span className="text-emerald-400">Deep Think</span> for decisions, <span className="text-emerald-400">X10</span> to convene the specialist council on your hardest problems.</p>
            </div>
          )}
          <div className="mx-auto max-w-3xl space-y-4">
            {conv?.messages.map((m) => (
              <div key={m.id} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div className={m.role === 'user' ? 'max-w-[85%] rounded-2xl rounded-br-sm bg-navy-700 px-4 py-2.5 text-sm text-white' : 'max-w-[95%] rounded-2xl rounded-bl-sm border border-navy-800 bg-navy-900 px-4 py-3 text-sm'}>
                  {m.role === 'user' ? (
                    <div>
                      <p className="whitespace-pre-wrap">{m.content}</p>
                      <div className="mt-1 text-right">
                        <button type="button" title="Edit and resend" className="text-[10px] text-navy-300 hover:text-white" onClick={() => editMessage(m.id)}>
                          ✏️ Edit
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Markdown text={m.content} />
                      {m.meta?.sources?.length > 0 && (
                        <div className="mt-2 space-y-1 rounded-lg border border-navy-700/60 bg-navy-850 p-2">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-400">Live sources ({m.meta.searchProvider})</p>
                          {m.meta.sources.map((s, i) => (
                            <a key={s.url + i} href={s.url} target="_blank" rel="noopener noreferrer" className="block truncate text-[11px] text-navy-200 hover:text-emerald-400">
                              [{i + 1}] {s.title} <span className="text-navy-500">— {(() => { try { return new URL(s.url).hostname; } catch { return s.url; } })()}</span>
                            </a>
                          ))}
                        </div>
                      )}
                      {m.meta?.searchError && (
                        <p className="mt-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[11px] text-amber-300">
                          Web search failed for this answer ({m.meta.searchError}) — the reply relies on training knowledge only.
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-navy-800 pt-1.5 text-[10px] text-navy-400">
                        {m.meta?.demo && <StatusBadge status="demo" />}
                        {m.meta?.kind === 'memory' && <StatusBadge status="working" label="Memory" />}
                        {m.meta?.modelLabel && <span>{m.meta.modelLabel}</span>}
                        {m.meta?.usage && <span>{m.meta.usage.inputTokens + m.meta.usage.outputTokens} tokens</span>}
                        {m.meta?.cost != null && <span>≈ ${m.meta.cost.toFixed(4)}</span>}
                        {m.meta?.specialists?.length > 0 && <span>Council: {m.meta.specialists.join(', ')}</span>}
                        <button type="button" className="ml-auto hover:text-emerald-400" onClick={() => navigator.clipboard?.writeText(m.content)}>Copy</button>
                        {!m.meta?.kind && <button type="button" title="Save to Saved Outputs" className="hover:text-emerald-400" onClick={() => saveReply(m)}>Save</button>}
                        {support.tts && <button type="button" className="hover:text-emerald-400" onClick={() => speak(m.content)}>Speak</button>}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="max-w-[95%] rounded-2xl rounded-bl-sm border border-navy-800 bg-navy-900 px-4 py-3 text-sm">
                  {stage && <p className="mb-1.5 text-[11px] font-medium text-emerald-400">⏳ {stage}</p>}
                  {streamText ? <Markdown text={streamText} /> : <p className="animate-pulse text-navy-300">Atlas is thinking…</p>}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {error && (
          <div className="mx-4 mb-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {error}
          </div>
        )}

        {/* Composer */}
        {conv && (
          <div className="border-t border-navy-800 bg-navy-900/70 p-3">
            <div className="mx-auto max-w-3xl">
              <div className="mb-2 flex flex-wrap items-center gap-1.5">
                {Object.values(MODES).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    title={m.description}
                    onClick={() => setMode(m.id)}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                      mode === m.id ? 'bg-emerald-500 text-navy-950' : 'bg-navy-800 text-navy-300 hover:text-white'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              <div className="flex items-end gap-2">
                <textarea
                  rows={2}
                  className="field-dark flex-1 resize-none"
                  placeholder={listening ? '🎙️ Listening… speak now' : 'Message Atlas… (Enter to send, Shift+Enter for a new line)'}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                />
                <div className="flex flex-col gap-1.5">
                  {support.stt && (
                    <button
                      type="button"
                      onClick={toggleMic}
                      title="Push-to-talk (Beta)"
                      className={`rounded-lg px-3 py-2 text-sm ${listening ? 'animate-pulse bg-red-500 text-white' : 'bg-navy-800 text-navy-200 hover:text-white'}`}
                    >
                      {listening ? '■ Stop mic' : '🎙️'}
                    </button>
                  )}
                  {sending ? (
                    <button type="button" onClick={stop} className="rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-400">
                      ■ Stop
                    </button>
                  ) : (
                    <button type="button" onClick={() => send()} disabled={!input.trim()} className="btn-emerald">
                      Send
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-1.5 flex items-center gap-3 text-[10px] text-navy-400">
                <label className="flex cursor-pointer items-center gap-1">
                  <input
                    type="checkbox"
                    checked={!!atlas.settings.voiceReplies}
                    onChange={(e) => dispatchAtlas({ type: 'settings/update', payload: { voiceReplies: e.target.checked } })}
                  />
                  Read replies aloud <StatusBadge status="beta" />
                </label>
                {conv.messages.length > 0 && !sending && (
                  <button type="button" className="hover:text-emerald-400" onClick={regenerate}>↻ Regenerate last answer</button>
                )}
                <span className="ml-auto">Voice mode: push-to-talk {support.stt ? '' : '(not supported in this browser)'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Intelligence panel */}
      {panelOpen && (
        <aside className="hidden w-72 shrink-0 flex-col gap-3 overflow-y-auto border-l border-navy-800 bg-navy-900 p-3 xl:flex">
          <div className="atlas-card">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-navy-400">Intelligence</p>
            <p className="text-sm font-semibold text-white">{MODES[mode].label} mode</p>
            <p className="mt-1 text-xs text-navy-300">{MODES[mode].description}</p>
            <p className="mt-2 text-xs text-navy-300">
              Model: <span className="text-emerald-400">{routed.model ? routed.model.label : 'none connected'}</span>
            </p>
            {project && <p className="mt-1 text-xs text-navy-300">Project: <span className="text-white">{project.name}</span></p>}
          </div>

          <div className="atlas-card">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-navy-400">Context in use</p>
            <p className="text-xs text-navy-300">Approved memories: <span className="text-white">{atlas.memories.length}</span></p>
            <p className="text-xs text-navy-300">Knowledge documents: <span className="text-white">{atlas.knowledgeDocs.length}</span></p>
            <p className="text-xs text-navy-300">
              Live web search:{' '}
              {pickSearchProvider(atlas.settings) ? (
                <span className="text-emerald-400">{pickSearchProvider(atlas.settings).provider} connected</span>
              ) : (
                <span className="text-navy-400">not connected (Research mode uses training knowledge only)</span>
              )}
            </p>
            {lastMeta?.knowledgeUsed?.length > 0 && (
              <p className="mt-1 text-[11px] text-emerald-400">Last answer used: {[...new Set(lastMeta.knowledgeUsed.map((k) => k.title))].join(', ')}</p>
            )}
            {lastMeta?.sources?.length > 0 && (
              <p className="mt-1 text-[11px] text-emerald-400">Last answer cited {lastMeta.sources.length} live web sources</p>
            )}
          </div>

          {lastMeta && (
            <div className="atlas-card">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-navy-400">Last turn</p>
              {lastMeta.specialists?.length > 0 && <p className="text-xs text-navy-300">Specialists: <span className="text-white">{lastMeta.specialists.join(', ')}</span></p>}
              {lastMeta.passes?.length > 0 && <p className="text-xs text-navy-300">Passes: <span className="text-white">{lastMeta.passes.length}</span></p>}
              {lastMeta.usage && <p className="text-xs text-navy-300">Tokens: <span className="text-white">{lastMeta.usage.inputTokens + lastMeta.usage.outputTokens}</span></p>}
              {lastMeta.cost != null && <p className="text-xs text-navy-300">Cost: <span className="text-white">≈ ${Number(lastMeta.cost).toFixed(4)}</span></p>}
              {lastMeta.thinkingSummary && (
                <details className="mt-1.5">
                  <summary className="cursor-pointer text-[11px] text-navy-400 hover:text-white">Reasoning summary</summary>
                  <p className="mt-1 max-h-40 overflow-y-auto whitespace-pre-wrap text-[11px] text-navy-300">{lastMeta.thinkingSummary}</p>
                </details>
              )}
            </div>
          )}

          <div className="atlas-card">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-navy-400">Conversation</p>
            <p className="text-xs text-navy-300">Messages: <span className="text-white">{conv?.messages.length || 0}</span></p>
            {convCost > 0 && <p className="text-xs text-navy-300">Total cost: <span className="text-white">≈ ${convCost.toFixed(4)}</span></p>}
          </div>

          <div className="atlas-card">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-navy-400">Feature status</p>
            <div className="space-y-1 text-[11px] text-navy-300">
              <p>Chat, modes, memory, knowledge <StatusBadge status="working" /></p>
              <p>Live web research {pickSearchProvider(atlas.settings) ? <StatusBadge status="working" /> : <StatusBadge status="neutral" label="Needs search key" />}</p>
              <p>Voice push-to-talk & read-aloud <StatusBadge status="beta" /></p>
              <p>Wake word, continuous voice <StatusBadge status="planned" /></p>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
