import test from 'node:test';
import assert from 'node:assert/strict';
import { getOrCreateUserId } from '../src/lib/identity.js';

test('getOrCreateUserId returns the stored id when it exists', () => {
  const storage = {
    getItem() {
      return 'user-123';
    },
    setItem() {
      throw new Error('not used');
    }
  };

  const userId = getOrCreateUserId(storage, () => 'generated-id');

  assert.equal(userId, 'user-123');
});

test('getOrCreateUserId creates and stores a new id when missing', () => {
  const calls = [];
  const storage = {
    value: null,
    getItem() {
      return this.value;
    },
    setItem(key, value) {
      calls.push([key, value]);
      this.value = value;
    }
  };

  const userId = getOrCreateUserId(storage, () => 'generated-id');

  assert.equal(userId, 'generated-id');
  assert.deepEqual(calls, [['fit-check-user-id', 'generated-id']]);
});
