// ---------------------------------------------------------------------------
// Security section for Settings: enable/disable the app lock (encryption at
// rest), change the passphrase, set auto-lock, and lock immediately.
// ---------------------------------------------------------------------------
import { useState } from 'react';
import * as secureStorage from '../../atlas/secureStorage.js';
import StatusBadge from './StatusBadge.jsx';

const AUTO_LOCK_OPTIONS = [
  { v: 0, label: 'Never (manual lock only)' },
  { v: 5, label: 'After 5 minutes idle' },
  { v: 15, label: 'After 15 minutes idle' },
  { v: 30, label: 'After 30 minutes idle' },
  { v: 60, label: 'After 1 hour idle' },
];

export default function SecuritySettings({ onActivity }) {
  const [enabled, setEnabled] = useState(secureStorage.isLockEnabled());
  const [autoLock, setAutoLock] = useState(secureStorage.lockMeta()?.autoLockMinutes || 0);
  const [pass, setPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [nextConfirm, setNextConfirm] = useState('');
  const [msg, setMsg] = useState(null); // {ok, text}
  const [busy, setBusy] = useState(false);
  const [showChange, setShowChange] = useState(false);

  const note = (ok, text) => setMsg({ ok, text });

  async function enable(e) {
    e.preventDefault();
    if (busy) return;
    if (pass.length < 6) return note(false, 'Use at least 6 characters.');
    if (pass !== confirm) return note(false, 'The two passphrases do not match.');
    setBusy(true);
    try {
      await secureStorage.enableLock(pass, { autoLockMinutes: autoLock });
      setEnabled(true);
      setPass('');
      setConfirm('');
      note(true, 'App lock is ON. Your data and keys are now encrypted on this device.');
      onActivity?.('Enabled app lock (encryption at rest)');
    } catch (err) {
      note(false, err?.message || 'Could not enable the lock.');
    } finally {
      setBusy(false);
    }
  }

  async function disable(e) {
    e.preventDefault();
    if (busy) return;
    if (!window.confirm('Remove the app lock? Your data returns to unencrypted storage on this device.')) return;
    setBusy(true);
    try {
      const ok = await secureStorage.disableLock(current);
      if (ok) {
        setEnabled(false);
        setCurrent('');
        note(true, 'App lock removed. Data is stored unencrypted again.');
        onActivity?.('Disabled app lock');
      } else {
        note(false, 'That passphrase is not correct.');
      }
    } finally {
      setBusy(false);
    }
  }

  async function change(e) {
    e.preventDefault();
    if (busy) return;
    if (next.length < 6) return note(false, 'The new passphrase needs at least 6 characters.');
    if (next !== nextConfirm) return note(false, 'The new passphrases do not match.');
    setBusy(true);
    try {
      const ok = await secureStorage.changePassphrase(current, next);
      if (ok) {
        setCurrent('');
        setNext('');
        setNextConfirm('');
        setShowChange(false);
        note(true, 'Passphrase changed.');
        onActivity?.('Changed app lock passphrase');
      } else {
        note(false, 'The current passphrase is not correct.');
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="atlas-card">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-sm font-semibold text-white">Security — app lock & encryption</h2>
        {enabled ? <StatusBadge status="good" label="Encryption ON" /> : <StatusBadge status="warn" label="Not encrypted" />}
      </div>
      <p className="mt-0.5 text-[11px] leading-4 text-navy-400">
        The app lock encrypts everything ATLAS stores on this device — conversations, memory, business data and your AI keys — with a passphrase only you know (AES-256, key derived on this device).
        {' '}<strong className="text-navy-300">If you forget the passphrase it cannot be recovered</strong>; your weekly backup file is the safety net (backups export readable, so store them somewhere private).
      </p>

      {!enabled ? (
        <form onSubmit={enable} className="mt-3 flex flex-wrap items-end gap-2">
          <div>
            <label className="field-label !text-navy-400">Passphrase (min 6 characters)</label>
            <input type="password" className="field-dark" value={pass} onChange={(e) => setPass(e.target.value)} />
          </div>
          <div>
            <label className="field-label !text-navy-400">Repeat passphrase</label>
            <input type="password" className="field-dark" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
          <div>
            <label className="field-label !text-navy-400">Auto-lock</label>
            <select className="field-dark" value={autoLock} onChange={(e) => setAutoLock(Number(e.target.value))}>
              {AUTO_LOCK_OPTIONS.map((o) => (
                <option key={o.v} value={o.v}>{o.label}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-emerald" disabled={busy}>
            {busy ? 'Encrypting…' : 'Turn on app lock'}
          </button>
        </form>
      ) : (
        <div className="mt-3 space-y-3">
          <div className="flex flex-wrap items-end gap-2">
            <div>
              <label className="field-label !text-navy-400">Auto-lock</label>
              <select
                className="field-dark"
                value={autoLock}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setAutoLock(v);
                  secureStorage.setAutoLockMinutes(v);
                  note(true, v ? `Auto-lock set to ${v} minutes.` : 'Auto-lock turned off.');
                }}
              >
                {AUTO_LOCK_OPTIONS.map((o) => (
                  <option key={o.v} value={o.v}>{o.label}</option>
                ))}
              </select>
            </div>
            <button type="button" className="btn-ghost-dark text-xs" onClick={() => window.dispatchEvent(new Event('atlas-lock-now'))}>
              🔒 Lock now
            </button>
            <button type="button" className="btn-ghost-dark text-xs" onClick={() => setShowChange(!showChange)}>
              Change passphrase
            </button>
          </div>

          {showChange && (
            <form onSubmit={change} className="flex flex-wrap items-end gap-2 rounded-lg border border-navy-700/60 bg-navy-900 p-2.5">
              <div>
                <label className="field-label !text-navy-400">Current</label>
                <input type="password" className="field-dark" value={current} onChange={(e) => setCurrent(e.target.value)} />
              </div>
              <div>
                <label className="field-label !text-navy-400">New</label>
                <input type="password" className="field-dark" value={next} onChange={(e) => setNext(e.target.value)} />
              </div>
              <div>
                <label className="field-label !text-navy-400">Repeat new</label>
                <input type="password" className="field-dark" value={nextConfirm} onChange={(e) => setNextConfirm(e.target.value)} />
              </div>
              <button type="submit" className="btn-emerald text-xs" disabled={busy}>{busy ? 'Re-encrypting…' : 'Change'}</button>
            </form>
          )}

          <form onSubmit={disable} className="flex flex-wrap items-end gap-2">
            <div>
              <label className="field-label !text-navy-400">Remove lock (enter passphrase)</label>
              <input type="password" className="field-dark" value={current} onChange={(e) => setCurrent(e.target.value)} />
            </div>
            <button type="submit" className="btn-ghost-dark text-xs !border-red-500/40 !text-red-400" disabled={busy || !current}>
              Remove app lock
            </button>
          </form>
        </div>
      )}

      {msg && (
        <p className={`mt-2 rounded-lg px-3 py-1.5 text-xs ${msg.ok ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-300'}`}>{msg.text}</p>
      )}
    </section>
  );
}
