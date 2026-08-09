import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { loadState, saveState } from '../lib/storage.js';
import { parseMonitorUrl, pingUrl, appendCheck } from '../lib/monitor.js';

const MonitorsContext = createContext(null);

// Matches the "Up to 5 monitors" limit advertised on the Pricing page and
// docs/STILLUP_PRODUCT_SPEC.md — unlimited monitors is the Pro differentiator.
export const FREE_TIER_MONITOR_LIMIT = 5;

function makeId() {
  return `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function MonitorsProvider({ children }) {
  const [state, setState] = useState(() => {
    const loaded = loadState();
    return { monitors: loaded.monitors || [], autoCheck: !!loaded.autoCheck };
  });
  const checkingRef = useRef(new Set());
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  useEffect(() => { saveState(state); }, [state]);

  const addMonitor = useCallback((name, rawUrl) => {
    if (stateRef.current.monitors.length >= FREE_TIER_MONITOR_LIMIT) {
      return { ok: false, error: `Free tier is limited to ${FREE_TIER_MONITOR_LIMIT} monitors. Remove one to add another.` };
    }
    const parsed = parseMonitorUrl(rawUrl);
    if (!parsed.ok) return { ok: false, error: parsed.error };
    const monitor = {
      id: makeId(),
      name: (name || '').trim() || parsed.url.replace(/^https?:\/\//, '').replace(/\/$/, ''),
      url: parsed.url,
      createdAt: Date.now(),
      checks: [],
    };
    setState((s) => ({ ...s, monitors: [...s.monitors, monitor] }));
    return { ok: true, id: monitor.id };
  }, []);

  const removeMonitor = useCallback((id) => {
    setState((s) => ({ ...s, monitors: s.monitors.filter((m) => m.id !== id) }));
  }, []);

  const checkMonitor = useCallback(async (id) => {
    if (checkingRef.current.has(id)) return; // avoid overlapping checks on the same monitor
    checkingRef.current.add(id);
    try {
      const target = stateRef.current.monitors.find((m) => m.id === id);
      if (!target) return;
      const result = await pingUrl(target.url);
      setState((s) => ({
        ...s,
        monitors: s.monitors.map((m) => (m.id === id ? { ...m, checks: appendCheck(m.checks, result) } : m)),
      }));
    } finally {
      checkingRef.current.delete(id);
    }
  }, []);

  const checkAll = useCallback(() => {
    stateRef.current.monitors.forEach((m) => checkMonitor(m.id));
  }, [checkMonitor]);

  const setAutoCheck = useCallback((on) => {
    setState((s) => ({ ...s, autoCheck: on }));
  }, []);

  // While auto-check is on and this provider is mounted (i.e. the dashboard
  // tab is open), re-check every monitor on a fixed interval. This is a
  // deliberate, disclosed limitation of the free browser-only tier: checks
  // only run while the tab is open. 24/7 checking while offline is the
  // paid, server-side product described in docs/STILLUP_PRODUCT_SPEC.md.
  useEffect(() => {
    if (!state.autoCheck) return undefined;
    const id = setInterval(() => checkAll(), 60_000);
    return () => clearInterval(id);
  }, [state.autoCheck, checkAll]);

  const value = { monitors: state.monitors, autoCheck: state.autoCheck, addMonitor, removeMonitor, checkMonitor, checkAll, setAutoCheck };
  return <MonitorsContext.Provider value={value}>{children}</MonitorsContext.Provider>;
}

export function useMonitors() {
  const ctx = useContext(MonitorsContext);
  if (!ctx) throw new Error('useMonitors must be used inside <MonitorsProvider>');
  return ctx;
}
