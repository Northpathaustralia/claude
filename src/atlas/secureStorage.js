// ---------------------------------------------------------------------------
// Secure storage engine: optional passphrase lock with encryption at rest.
//
// When the lock is enabled, both application stores (atlas.v1, npaos.v1 —
// including AI provider keys) are AES-GCM-256 encrypted with a key derived
// from the owner's passphrase (PBKDF2-SHA-256, 310k iterations). The derived
// key lives only in memory for the session; locking drops it. When the lock
// is disabled the module is a transparent passthrough to localStorage, so
// existing behaviour is unchanged.
//
// Storage layout with lock enabled:
//   atlas.lock.v1   → {v, salt, check:{iv,ct}, autoLockMinutes}   (metadata)
//   enc.<storeKey>  → {iv, ct}                                    (ciphertext)
// Plaintext store keys are removed the moment the lock is enabled.
//
// The backend is injectable so the whole engine is unit-tested in Node with
// a Map-backed store (tests/atlasSecure.test.js).
// ---------------------------------------------------------------------------

export const MANAGED_KEYS = ['atlas.v1', 'npaos.v1'];
const META_KEY = 'atlas.lock.v1';
const ENC_PREFIX = 'enc.';
const CHECK_SENTINEL = 'atlas-one-lock-check';
const PBKDF2_ITERATIONS = 310000;

let backend = null;
let sessionKey = null; // CryptoKey while unlocked
const cache = new Map(); // decrypted values while unlocked
const pendingPersist = new Map(); // key -> promise chain (write ordering)

function store() {
  if (backend) return backend;
  if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  throw new Error('secureStorage: no storage backend configured');
}

/** Inject a storage backend ({getItem,setItem,removeItem}) — used by tests. */
export function configureBackend(b) {
  backend = b;
  sessionKey = null;
  cache.clear();
  pendingPersist.clear();
}

// --- base64 helpers (browser + Node 18+) ---------------------------------

function toB64(bytes) {
  let bin = '';
  const arr = new Uint8Array(bytes);
  for (let i = 0; i < arr.length; i += 1) bin += String.fromCharCode(arr[i]);
  return btoa(bin);
}

function fromB64(b64) {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) arr[i] = bin.charCodeAt(i);
  return arr;
}

// --- crypto core ----------------------------------------------------------

async function deriveKey(passphrase, saltBytes) {
  const enc = new TextEncoder();
  const material = await crypto.subtle.importKey('raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: saltBytes, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

async function encryptString(key, plain) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(plain));
  return { iv: toB64(iv), ct: toB64(ct) };
}

async function decryptString(key, payload) {
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromB64(payload.iv) }, key, fromB64(payload.ct));
  return new TextDecoder().decode(pt);
}

// --- lock metadata --------------------------------------------------------

export function lockMeta() {
  try {
    const raw = store().getItem(META_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isLockEnabled() {
  return !!lockMeta();
}

export function isUnlocked() {
  return !isLockEnabled() || !!sessionKey;
}

// --- enable / unlock / lock / disable --------------------------------------

/**
 * Turn the lock on: derive a key, encrypt every managed store, remove the
 * plaintext copies. Idempotent-safe: throws if already enabled.
 */
export async function enableLock(passphrase, { autoLockMinutes = 0 } = {}) {
  if (isLockEnabled()) throw new Error('Lock is already enabled.');
  if (!passphrase || passphrase.length < 6) throw new Error('Passphrase must be at least 6 characters.');

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(passphrase, salt);
  const check = await encryptString(key, CHECK_SENTINEL);

  for (const k of MANAGED_KEYS) {
    const plain = store().getItem(k);
    cache.set(k, plain ?? null);
    if (plain != null) {
      const payload = await encryptString(key, plain);
      store().setItem(ENC_PREFIX + k, JSON.stringify(payload));
      store().removeItem(k);
    }
  }

  store().setItem(META_KEY, JSON.stringify({ v: 1, salt: toB64(salt), check, autoLockMinutes }));
  sessionKey = key;
}

/** Verify the passphrase and load decrypted stores into memory. */
export async function unlock(passphrase) {
  const meta = lockMeta();
  if (!meta) return true; // nothing to unlock
  let key;
  try {
    key = await deriveKey(passphrase, fromB64(meta.salt));
    const check = await decryptString(key, meta.check);
    if (check !== CHECK_SENTINEL) return false;
  } catch {
    return false; // wrong passphrase (GCM auth failure)
  }

  for (const k of MANAGED_KEYS) {
    const raw = store().getItem(ENC_PREFIX + k);
    if (raw != null) {
      cache.set(k, await decryptString(key, JSON.parse(raw)));
    } else {
      cache.set(k, null);
    }
  }
  sessionKey = key;
  return true;
}

/** Drop the in-memory key + decrypted data. Ciphertext stays in storage. */
export function lock() {
  sessionKey = null;
  cache.clear();
}

/** Verify passphrase, restore plaintext stores, remove lock metadata. */
export async function disableLock(passphrase) {
  const meta = lockMeta();
  if (!meta) return true;
  const ok = await unlock(passphrase);
  if (!ok) return false;
  await flush();
  for (const k of MANAGED_KEYS) {
    const val = cache.get(k);
    if (val != null) store().setItem(k, val);
    store().removeItem(ENC_PREFIX + k);
  }
  store().removeItem(META_KEY);
  sessionKey = null;
  return true;
}

/** Re-key everything under a new passphrase. */
export async function changePassphrase(oldPass, newPass) {
  const meta = lockMeta();
  if (!meta) throw new Error('Lock is not enabled.');
  const ok = await disableLock(oldPass);
  if (!ok) return false;
  await enableLock(newPass, { autoLockMinutes: meta.autoLockMinutes || 0 });
  return true;
}

/** Update the auto-lock timeout (minutes; 0 = off). */
export function setAutoLockMinutes(minutes) {
  const meta = lockMeta();
  if (!meta) return;
  store().setItem(META_KEY, JSON.stringify({ ...meta, autoLockMinutes: minutes }));
}

/**
 * Emergency escape hatch for a forgotten passphrase: erases the encrypted
 * stores and the lock so the app can start fresh (owner restores from a
 * backup). Deliberately destructive and confirmed twice in the UI.
 */
export function eraseLockedData() {
  for (const k of MANAGED_KEYS) store().removeItem(ENC_PREFIX + k);
  store().removeItem(META_KEY);
  sessionKey = null;
  cache.clear();
}

// --- read/write path used by the app stores --------------------------------

export function getItem(key) {
  if (isLockEnabled()) {
    if (!sessionKey) return null; // providers only mount after unlock
    return cache.get(key) ?? null;
  }
  return store().getItem(key);
}

export function setItem(key, value) {
  if (isLockEnabled()) {
    if (!sessionKey) return; // never write plaintext while locked
    cache.set(key, value);
    const keyRef = sessionKey;
    const prev = pendingPersist.get(key) || Promise.resolve();
    const next = prev.then(async () => {
      // Skip stale writes: only persist if this is still the latest value.
      if (cache.get(key) !== value || sessionKey !== keyRef) return;
      const payload = await encryptString(keyRef, value);
      if (cache.get(key) === value && sessionKey === keyRef) {
        store().setItem(ENC_PREFIX + key, JSON.stringify(payload));
      }
    }).catch(() => {});
    pendingPersist.set(key, next);
    return;
  }
  store().setItem(key, value);
}

/** Await all pending encrypted writes (used before lock/disable and in tests). */
export async function flush() {
  await Promise.all([...pendingPersist.values()]);
}
