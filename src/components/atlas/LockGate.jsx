// ---------------------------------------------------------------------------
// LockGate: renders the app only once secure storage is readable. When the
// owner's app lock is enabled it shows the lock screen, verifies the
// passphrase, handles auto-lock on inactivity and the "Lock now" event
// (window event 'atlas-lock-now', dispatched from the sidebar/settings).
// Providers mount beneath this gate, so their initial reads always see
// decrypted data — and remount after every unlock via a session counter.
// ---------------------------------------------------------------------------
import { useEffect, useRef, useState } from 'react';
import * as secureStorage from '../../atlas/secureStorage.js';

function AtlasMark() {
  return (
    <svg viewBox="0 0 100 100" className="h-14 w-14" aria-hidden>
      <rect width="100" height="100" rx="22" fill="#0d1a2f" />
      <path d="M50 16 80 84H66.5L50 45 33.5 84H20Z" fill="#34d399" />
      <circle cx="50" cy="76" r="7" fill="#34d399" />
    </svg>
  );
}

export default function LockGate({ children }) {
  const [locked, setLocked] = useState(() => secureStorage.isLockEnabled() && !secureStorage.isUnlocked());
  const [session, setSession] = useState(0); // bumps on unlock → providers remount
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [showErase, setShowErase] = useState(false);
  const [eraseText, setEraseText] = useState('');
  const timerRef = useRef(null);

  async function doLock() {
    await secureStorage.flush();
    secureStorage.lock();
    setPass('');
    setError('');
    setLocked(true);
  }

  // "Lock now" from anywhere in the app.
  useEffect(() => {
    const onLockNow = () => {
      if (secureStorage.isLockEnabled()) doLock();
    };
    window.addEventListener('atlas-lock-now', onLockNow);
    return () => window.removeEventListener('atlas-lock-now', onLockNow);
  }, []);

  // Auto-lock on inactivity.
  useEffect(() => {
    if (locked || !secureStorage.isLockEnabled()) return undefined;
    const arm = () => {
      const mins = secureStorage.lockMeta()?.autoLockMinutes || 0;
      clearTimeout(timerRef.current);
      if (mins > 0) timerRef.current = setTimeout(doLock, mins * 60 * 1000);
    };
    arm();
    const events = ['pointerdown', 'keydown'];
    events.forEach((e) => window.addEventListener(e, arm));
    return () => {
      clearTimeout(timerRef.current);
      events.forEach((e) => window.removeEventListener(e, arm));
    };
  }, [locked]);

  async function tryUnlock(e) {
    e?.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const ok = await secureStorage.unlock(pass);
      if (ok) {
        setPass('');
        setSession((s) => s + 1);
        setLocked(false);
      } else {
        setError('That passphrase is not correct. Try again.');
      }
    } catch {
      setError('Could not unlock. Try again.');
    } finally {
      setBusy(false);
    }
  }

  if (!locked) {
    // key= forces providers to re-read storage after each unlock cycle.
    return <div key={session} className="contents">{children}</div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-navy-800 bg-navy-900 p-6 text-center">
        <div className="flex justify-center"><AtlasMark /></div>
        <h1 className="mt-3 text-lg font-bold text-white">ATLAS ONE is locked</h1>
        <p className="mt-1 text-xs text-navy-300">Your data and keys are encrypted on this device. Enter your passphrase to continue.</p>
        <form onSubmit={tryUnlock} className="mt-4 space-y-2">
          <input
            type="password"
            autoFocus
            className="field-dark text-center"
            placeholder="Passphrase"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            aria-label="Passphrase"
          />
          <button type="submit" className="btn-emerald w-full" disabled={busy || !pass}>
            {busy ? 'Unlocking…' : 'Unlock'}
          </button>
        </form>
        {error && <p className="mt-2 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>}

        <div className="mt-4 border-t border-navy-800 pt-3 text-[11px] leading-4 text-navy-400">
          Forgot it? The passphrase can't be recovered — that's what makes the encryption real.
          {!showErase ? (
            <button type="button" className="ml-1 text-navy-300 underline hover:text-white" onClick={() => setShowErase(true)}>
              Reset options…
            </button>
          ) : (
            <div className="mt-2 rounded-lg border border-red-500/30 bg-red-500/5 p-2 text-left">
              <p className="text-red-300">Last resort: erase the encrypted data on this device and start fresh (you can then import a backup file). Type <strong>ERASE</strong> to enable the button.</p>
              <div className="mt-1.5 flex gap-1.5">
                <input className="field-dark !py-1 text-xs" value={eraseText} onChange={(e) => setEraseText(e.target.value)} placeholder="ERASE" />
                <button
                  type="button"
                  className="rounded-lg bg-red-500 px-2.5 text-xs font-semibold text-white disabled:opacity-40"
                  disabled={eraseText !== 'ERASE'}
                  onClick={() => {
                    if (window.confirm('Really erase all encrypted ATLAS data on this device? This cannot be undone.')) {
                      secureStorage.eraseLockedData();
                      window.location.reload();
                    }
                  }}
                >
                  Erase
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
