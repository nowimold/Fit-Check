import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchTodayChecklist, toggleChecklistItem } from '../src/lib/api.js';

test('fetchTodayChecklist sends the user id and date', async () => {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push([url, options]);
    return {
      ok: true,
      async json() {
        return {
          date: '2026-06-21',
          items: [],
          encouragement: null
        };
      }
    };
  };

  const result = await fetchTodayChecklist({
    baseUrl: 'http://localhost:3000',
    userId: 'user-123',
    date: '2026-06-21',
    fetchImpl
  });

  assert.deepEqual(result, {
    date: '2026-06-21',
    items: [],
    encouragement: null
  });
  assert.deepEqual(calls, [
    [
      'http://localhost:3000/api/checklists/today?date=2026-06-21',
      {
        headers: {
          'x-user-id': 'user-123'
        }
      }
    ]
  ]);
});

test('toggleChecklistItem sends the selected item state', async () => {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push([url, options]);
    return {
      ok: true,
      async json() {
        return {
          date: '2026-06-21',
          itemId: 'item-1',
          isDone: true
        };
      }
    };
  };

  const result = await toggleChecklistItem({
    baseUrl: 'http://localhost:3000',
    userId: 'user-123',
    itemId: 'item-1',
    date: '2026-06-21',
    isDone: true,
    fetchImpl
  });

  assert.deepEqual(result, {
    date: '2026-06-21',
    itemId: 'item-1',
    isDone: true
  });
  assert.deepEqual(calls, [
    [
      'http://localhost:3000/api/checklists/items/item-1',
      {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          'x-user-id': 'user-123'
        },
        body: JSON.stringify({
          date: '2026-06-21',
          isDone: true
        })
      }
    ]
  ]);
});
