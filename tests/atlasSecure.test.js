// Secure storage engine tests: encryption at rest, lock/unlock semantics,
// wrong-passphrase rejection, re-keying, and passthrough behaviour.
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import {
  configureBackend,
  enableLock,
  unlock,
  lock,
  disableLock,
  changePassphrase,
  isLockEnabled,
  isUnlocked,
  getItem,
  setItem,
  flush,
  lockMeta,
  setAutoLockMinutes,
  eraseLockedData,
} from '../src/atlas/secureStorage.js';

function fakeStorage() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    _map: m,
  };
}

let backend;
beforeEach(() => {
  backend = fakeStorage();
  configureBackend(backend);
});

test('passthrough mode reads/writes plaintext when lock is disabled', () => {
  setItem('atlas.v1', '{"a":1}');
  assert.equal(backend.getItem('atlas.v1'), '{"a":1}');
  assert.equal(getItem('atlas.v1'), '{"a":1}');
  assert.equal(isLockEnabled(), false);
  assert.equal(isUnlocked(), true);
});

test('enableLock encrypts existing stores and removes plaintext', async () => {
  backend.setItem('atlas.v1', '{"secret":"keys"}');
  backend.setItem('npaos.v1', '{"leads":[]}');
  await enableLock('correct horse', { autoLockMinutes: 15 });

  assert.equal(backend.getItem('atlas.v1'), null, 'plaintext removed');
  assert.equal(backend.getItem('npaos.v1'), null);
  const enc = JSON.parse(backend.getItem('enc.atlas.v1'));
  assert.ok(enc.iv && enc.ct, 'ciphertext payload stored');
  assert.ok(!backend.getItem('enc.atlas.v1').includes('secret'), 'no plaintext leakage');
  assert.equal(lockMeta().autoLockMinutes, 15);
  assert.equal(isUnlocked(), true, 'session stays unlocked after enabling');
  assert.equal(getItem('atlas.v1'), '{"secret":"keys"}', 'reads served from memory');
});

test('writes while unlocked persist encrypted; lock drops memory; unlock restores', async () => {
  await enableLock('pass-123456');
  setItem('atlas.v1', '{"memories":["prefers short answers"]}');
  await flush();
  assert.ok(!String(backend.getItem('enc.atlas.v1')).includes('short answers'), 'persisted value is encrypted');

  lock();
  assert.equal(isUnlocked(), false);
  assert.equal(getItem('atlas.v1'), null, 'no reads while locked');

  assert.equal(await unlock('wrong-pass'), false, 'wrong passphrase rejected');
  assert.equal(isUnlocked(), false);

  assert.equal(await unlock('pass-123456'), true);
  assert.equal(getItem('atlas.v1'), '{"memories":["prefers short answers"]}', 'data intact after unlock');
});

test('disableLock verifies passphrase and restores plaintext', async () => {
  backend.setItem('atlas.v1', '{"x":1}');
  await enableLock('pass-123456');
  assert.equal(await disableLock('nope'), false);
  assert.equal(isLockEnabled(), true);

  assert.equal(await disableLock('pass-123456'), true);
  assert.equal(isLockEnabled(), false);
  assert.equal(backend.getItem('atlas.v1'), '{"x":1}', 'plaintext restored');
  assert.equal(backend.getItem('enc.atlas.v1'), null);
  assert.equal(lockMeta(), null);
});

test('changePassphrase re-keys: old fails, new works, data survives', async () => {
  backend.setItem('npaos.v1', '{"leads":["Grace"]}');
  await enableLock('old-pass-1');
  assert.equal(await changePassphrase('old-pass-1', 'new-pass-2'), true);

  lock();
  assert.equal(await unlock('old-pass-1'), false);
  assert.equal(await unlock('new-pass-2'), true);
  assert.equal(getItem('npaos.v1'), '{"leads":["Grace"]}');
});

test('short passphrases are rejected and never write while locked', async () => {
  await assert.rejects(() => enableLock('abc'), /at least 6/);
  await enableLock('long enough');
  lock();
  setItem('atlas.v1', 'should-not-write');
  await flush();
  assert.equal(await unlock('long enough'), true);
  assert.notEqual(getItem('atlas.v1'), 'should-not-write');
});

test('setAutoLockMinutes updates metadata; eraseLockedData wipes ciphertext + meta', async () => {
  backend.setItem('atlas.v1', '{"a":1}');
  await enableLock('pass-123456');
  setAutoLockMinutes(30);
  assert.equal(lockMeta().autoLockMinutes, 30);

  eraseLockedData();
  assert.equal(lockMeta(), null);
  assert.equal(backend.getItem('enc.atlas.v1'), null);
  assert.equal(backend.getItem('atlas.v1'), null, 'plaintext was already gone; erase does not resurrect it');
});
