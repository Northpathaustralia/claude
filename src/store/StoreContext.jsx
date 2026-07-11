// ---------------------------------------------------------------------------
// Central data store.
//
// A single React context backed by useReducer, persisted to localStorage
// under a versioned key. The shape is deliberately flat and serialisable so
// the whole state can be exported as JSON (Settings page) and later synced to
// external systems (HubSpot, Google Contacts, Zapier webhooks) without
// transformation.
//
// Collections: leads, partners, tasks, contentItems, appointments.
// Each record carries id / createdAt / updatedAt for clean incremental sync.
// ---------------------------------------------------------------------------

import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { buildSeedData } from '@/data/seedData.js';
import { uid } from '@/utils/format.js';
import * as secureStorage from '@/atlas/secureStorage.js';

const STORAGE_KEY = 'npaos.v1';

const StoreContext = createContext(null);

function nowStamp() {
  return new Date().toISOString();
}

/** Generic collection reducer helpers keep every entity consistent. */
function addTo(list, record, prefix) {
  return [{ id: uid(prefix), createdAt: nowStamp(), updatedAt: nowStamp(), ...record }, ...list];
}
function updateIn(list, id, patch) {
  return list.map((r) => (r.id === id ? { ...r, ...patch, updatedAt: nowStamp() } : r));
}
function removeFrom(list, id) {
  return list.filter((r) => r.id !== id);
}

function reducer(state, action) {
  switch (action.type) {
    // --- Leads ---
    case 'lead/add':
      return { ...state, leads: addTo(state.leads, action.payload, 'lead') };
    case 'lead/update':
      return { ...state, leads: updateIn(state.leads, action.id, action.payload) };
    case 'lead/remove':
      return { ...state, leads: removeFrom(state.leads, action.id) };
    case 'lead/importMany':
      return {
        ...state,
        leads: [
          ...action.payload.map((l) => ({ id: uid('lead'), createdAt: nowStamp(), updatedAt: nowStamp(), ...l })),
          ...state.leads,
        ],
      };

    // --- Referral partners ---
    case 'partner/add':
      return { ...state, partners: addTo(state.partners, action.payload, 'partner') };
    case 'partner/update':
      return { ...state, partners: updateIn(state.partners, action.id, action.payload) };
    case 'partner/remove':
      return { ...state, partners: removeFrom(state.partners, action.id) };

    // --- Tasks ---
    case 'task/add':
      return { ...state, tasks: addTo(state.tasks, action.payload, 'task') };
    case 'task/update':
      return { ...state, tasks: updateIn(state.tasks, action.id, action.payload) };
    case 'task/remove':
      return { ...state, tasks: removeFrom(state.tasks, action.id) };

    // --- Content items (published/recorded content with performance data) ---
    case 'content/add':
      return { ...state, contentItems: addTo(state.contentItems, action.payload, 'content') };
    case 'content/update':
      return { ...state, contentItems: updateIn(state.contentItems, action.id, action.payload) };
    case 'content/remove':
      return { ...state, contentItems: removeFrom(state.contentItems, action.id) };

    // --- Appointments ---
    case 'appointment/add':
      return { ...state, appointments: addTo(state.appointments, action.payload, 'appt') };
    case 'appointment/remove':
      return { ...state, appointments: removeFrom(state.appointments, action.id) };

    // --- Whole-state operations (Settings page) ---
    case 'state/replace':
      return { ...emptyState(), ...action.payload };
    case 'state/resetToSeed':
      return buildSeedData();
    case 'state/clearAll':
      return emptyState();

    default:
      return state;
  }
}

function emptyState() {
  return { leads: [], partners: [], tasks: [], contentItems: [], appointments: [] };
}

function loadInitialState() {
  try {
    // Routed through secureStorage: plaintext passthrough normally, decrypted
    // in-memory reads when the owner's app lock is enabled.
    const raw = secureStorage.getItem(STORAGE_KEY);
    if (raw) return { ...emptyState(), ...JSON.parse(raw) };
  } catch {
    // Corrupt storage — fall through to seed.
  }
  return buildSeedData();
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState);

  // Persist on every change. State is small enough that this stays instant.
  useEffect(() => {
    try {
      secureStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage full or unavailable — the app keeps working in memory.
    }
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

/** Access the store anywhere below <StoreProvider>. */
export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within a StoreProvider');
  return ctx;
}
