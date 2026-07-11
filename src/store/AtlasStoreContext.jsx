// ---------------------------------------------------------------------------
// ATLAS ONE store: settings, conversations, projects, memories, knowledge,
// artifacts, businesses, finance entries, usage + activity logs.
// Persisted to localStorage under a versioned key (atlas.v1), separate from
// the NorthPath workspace store (npaos.v1) so either can be exported or
// cleared independently. Flat and serialisable throughout.
// ---------------------------------------------------------------------------

import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { uid } from '../utils/format.js';
import * as secureStorage from '../atlas/secureStorage.js';

const STORAGE_KEY = 'atlas.v1';

const AtlasContext = createContext(null);

function now() {
  return new Date().toISOString();
}

export function emptyAtlasState() {
  return {
    settings: {
      keys: {}, // {providerId: apiKey} — stored locally on this device only
      searchKeys: {}, // {tavily|brave: apiKey} for Research mode web search
      searchProvider: 'tavily',
      profile: 'balanced',
      provider: 'anthropic',
      tone: '',
      voiceReplies: false,
      ownerName: 'James',
    },
    conversations: [], // {id, title, projectId, mode, messages[], createdAt, updatedAt}
    projects: [], // {id, name, instructions, status, archived, createdAt, updatedAt}
    memories: [], // {id, category, text, createdAt}
    knowledgeDocs: [], // {id, title, text, size, projectId, addedAt}
    artifacts: [], // {id, title, type, ext, content, engine, projectId, createdAt}
    businesses: [], // {id, name, category, summary, nextAction, createdAt, updatedAt}
    financeEntries: [], // {id, business, month, revenue, expenses, note}
    usageLog: [], // {id, ts, model, mode, inputTokens, outputTokens, cost}
    activityLog: [], // {id, ts, kind, detail}
  };
}

function log(state, kind, detail) {
  const entry = { id: uid('act'), ts: now(), kind, detail };
  return [entry, ...state.activityLog].slice(0, 500);
}

function touch(list, id, patch) {
  return list.map((r) => (r.id === id ? { ...r, ...patch, updatedAt: now() } : r));
}

function reducer(state, action) {
  switch (action.type) {
    // --- Settings ---
    case 'settings/update':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'settings/setKey': {
      const keys = { ...state.settings.keys, [action.provider]: action.key };
      if (!action.key) delete keys[action.provider];
      return {
        ...state,
        settings: { ...state.settings, keys },
        activityLog: log(state, 'settings', `${action.key ? 'Saved' : 'Removed'} API key for ${action.provider}`),
      };
    }
    case 'settings/setSearchKey': {
      const searchKeys = { ...(state.settings.searchKeys || {}), [action.provider]: action.key };
      if (!action.key) delete searchKeys[action.provider];
      return {
        ...state,
        settings: { ...state.settings, searchKeys },
        activityLog: log(state, 'settings', `${action.key ? 'Saved' : 'Removed'} search API key for ${action.provider}`),
      };
    }

    // --- Conversations ---
    case 'conversation/create': {
      const conv = {
        id: action.id || uid('conv'),
        title: action.title || 'New conversation',
        projectId: action.projectId || null,
        mode: action.mode || 'smart',
        messages: [],
        createdAt: now(),
        updatedAt: now(),
      };
      return { ...state, conversations: [conv, ...state.conversations] };
    }
    case 'conversation/update':
      return { ...state, conversations: touch(state.conversations, action.id, action.payload) };
    case 'conversation/appendMessage': {
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === action.id
            ? { ...c, messages: [...c.messages, action.message], updatedAt: now() }
            : c,
        ),
      };
    }
    case 'conversation/replaceMessages':
      return { ...state, conversations: touch(state.conversations, action.id, { messages: action.messages }) };
    case 'conversation/remove':
      return { ...state, conversations: state.conversations.filter((c) => c.id !== action.id) };

    // --- Projects ---
    case 'project/add': {
      const p = { id: uid('proj'), name: action.payload.name, instructions: action.payload.instructions || '', status: 'Active', archived: false, createdAt: now(), updatedAt: now() };
      return { ...state, projects: [p, ...state.projects], activityLog: log(state, 'project', `Created project ${p.name}`) };
    }
    case 'project/update':
      return { ...state, projects: touch(state.projects, action.id, action.payload) };
    case 'project/remove':
      return { ...state, projects: state.projects.filter((p) => p.id !== action.id) };

    // --- Memory (always user-visible, user-controlled) ---
    case 'memory/add': {
      const m = { id: uid('mem'), category: action.payload.category || 'general', text: action.payload.text, createdAt: now() };
      return { ...state, memories: [m, ...state.memories], activityLog: log(state, 'memory', `Remembered: ${m.text.slice(0, 80)}`) };
    }
    case 'memory/update':
      return { ...state, memories: touch(state.memories, action.id, action.payload) };
    case 'memory/remove': {
      const gone = state.memories.find((m) => m.id === action.id);
      return {
        ...state,
        memories: state.memories.filter((m) => m.id !== action.id),
        activityLog: log(state, 'memory', `Forgot: ${(gone?.text || '').slice(0, 80)}`),
      };
    }
    case 'memory/clearAll':
      return { ...state, memories: [], activityLog: log(state, 'memory', 'Cleared all memories') };

    // --- Knowledge ---
    case 'knowledge/add': {
      const d = { id: uid('doc'), title: action.payload.title, text: action.payload.text, size: action.payload.text.length, projectId: action.payload.projectId || null, addedAt: now() };
      return { ...state, knowledgeDocs: [d, ...state.knowledgeDocs], activityLog: log(state, 'knowledge', `Added document ${d.title}`) };
    }
    case 'knowledge/remove':
      return { ...state, knowledgeDocs: state.knowledgeDocs.filter((d) => d.id !== action.id) };

    // --- Artifacts ---
    case 'artifact/add': {
      const a = { id: uid('art'), ...action.payload, createdAt: now() };
      return { ...state, artifacts: [a, ...state.artifacts], activityLog: log(state, 'studio', `Created ${a.type} artifact: ${a.title}`) };
    }
    case 'artifact/remove':
      return { ...state, artifacts: state.artifacts.filter((a) => a.id !== action.id) };

    // --- Businesses ---
    case 'business/add': {
      const b = { id: uid('biz'), ...action.payload, createdAt: now(), updatedAt: now() };
      return { ...state, businesses: [b, ...state.businesses] };
    }
    case 'business/update':
      return { ...state, businesses: touch(state.businesses, action.id, action.payload) };
    case 'business/remove':
      return { ...state, businesses: state.businesses.filter((b) => b.id !== action.id) };

    // --- Finance (manual entries — real data James types in) ---
    case 'finance/add':
      return { ...state, financeEntries: [{ id: uid('fin'), ...action.payload }, ...state.financeEntries] };
    case 'finance/remove':
      return { ...state, financeEntries: state.financeEntries.filter((f) => f.id !== action.id) };

    // --- Usage & activity ---
    case 'usage/record':
      return { ...state, usageLog: [{ id: uid('use'), ts: now(), ...action.payload }, ...state.usageLog].slice(0, 1000) };
    case 'activity/record':
      return { ...state, activityLog: log(state, action.kind || 'general', action.detail) };
    case 'activity/clear':
      return { ...state, activityLog: [] };

    // --- Whole state ---
    case 'state/replace':
      return { ...emptyAtlasState(), ...action.payload, settings: { ...emptyAtlasState().settings, ...(action.payload.settings || {}) } };
    case 'state/clearAll':
      return emptyAtlasState();

    default:
      return state;
  }
}

function loadInitialState() {
  try {
    // Routed through secureStorage: plaintext passthrough normally, decrypted
    // in-memory reads when the owner's app lock is enabled.
    const raw = secureStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...emptyAtlasState(), ...parsed, settings: { ...emptyAtlasState().settings, ...(parsed.settings || {}) } };
    }
  } catch {
    // Corrupt storage — start clean rather than crash.
  }
  return emptyAtlasState();
}

export function AtlasStoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState);

  useEffect(() => {
    try {
      secureStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage full — app keeps working in memory.
    }
  }, [state]);

  const value = useMemo(() => ({ atlas: state, dispatchAtlas: dispatch }), [state]);
  return <AtlasContext.Provider value={value}>{children}</AtlasContext.Provider>;
}

export function useAtlas() {
  const ctx = useContext(AtlasContext);
  if (!ctx) throw new Error('useAtlas must be used within an AtlasStoreProvider');
  return ctx;
}

export const ATLAS_STORAGE_KEY = STORAGE_KEY;
