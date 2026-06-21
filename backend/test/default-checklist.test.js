import test from 'node:test';
import assert from 'node:assert/strict';
import { createDefaultChecklistItems } from '../src/lib/default-checklist.js';

test('createDefaultChecklistItems builds the three MVP seed items', () => {
  let counter = 0;
  const rows = createDefaultChecklistItems('user-123', () => `id-${++counter}`);

  assert.deepEqual(rows, [
    {
      id: 'id-1',
      userId: 'user-123',
      itemText: '물 마시기',
      sortOrder: 1
    },
    {
      id: 'id-2',
      userId: 'user-123',
      itemText: '10분 걷기',
      sortOrder: 2
    },
    {
      id: 'id-3',
      userId: 'user-123',
      itemText: '식단 기록하기',
      sortOrder: 3
    }
  ]);
});
