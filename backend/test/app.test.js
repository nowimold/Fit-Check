import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createApp } from '../src/app.js';

async function withServer(app, fn) {
  const server = createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();

  try {
    await fn(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test('health endpoint returns ok', async () => {
  const app = createApp({
    checklistService: {
      getTodayChecklist() {
        return Promise.resolve({ date: '2026-06-21', items: [], encouragement: null });
      },
      toggleChecklistItem() {
        throw new Error('not used');
      }
    }
  });

  await withServer(app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, { status: 'ok' });
  });
});

test('today checklist requires a user id', async () => {
  const app = createApp({
    checklistService: {
      getTodayChecklist() {
        return Promise.resolve({ date: '2026-06-21', items: [], encouragement: null });
      },
      toggleChecklistItem() {
        throw new Error('not used');
      }
    }
  });

  await withServer(app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/checklists/today`);
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.deepEqual(body, { error: 'Missing x-user-id header' });
  });
});

test('today checklist returns items from the service', async () => {
  const app = createApp({
    checklistService: {
      getTodayChecklist(userId, date) {
        return Promise.resolve({
          date,
          userId,
          items: [
            { id: 'item-1', itemText: '물 2리터 마시기', isDone: true },
            { id: 'item-2', itemText: '10분 걷기', isDone: false }
          ],
          encouragement: { type: 'warning', message: '오늘은 아직 남았어요.' }
        });
      },
      toggleChecklistItem() {
        throw new Error('not used');
      }
    }
  });

  await withServer(app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/checklists/today?date=2026-06-21`, {
      headers: {
        'x-user-id': 'user-123'
      }
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, {
      date: '2026-06-21',
      userId: 'user-123',
      items: [
        { id: 'item-1', itemText: '물 2리터 마시기', isDone: true },
        { id: 'item-2', itemText: '10분 걷기', isDone: false }
      ],
      encouragement: { type: 'warning', message: '오늘은 아직 남았어요.' }
    });
  });
});

test('toggle endpoint forwards to the service', async () => {
  const calls = [];
  const app = createApp({
    checklistService: {
      getTodayChecklist() {
        return Promise.resolve({ date: '2026-06-21', items: [], encouragement: null });
      },
      toggleChecklistItem(userId, itemId, date, isDone) {
        calls.push({ userId, itemId, date, isDone });
        return Promise.resolve({
          date,
          itemId,
          isDone,
          updatedAt: '2026-06-21T00:00:00.000Z'
        });
      }
    }
  });

  await withServer(app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/checklists/items/item-2`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        'x-user-id': 'user-123'
      },
      body: JSON.stringify({
        date: '2026-06-21',
        isDone: true
      })
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(calls, [
      {
        userId: 'user-123',
        itemId: 'item-2',
        date: '2026-06-21',
        isDone: true
      }
    ]);
    assert.deepEqual(body, {
      date: '2026-06-21',
      itemId: 'item-2',
      isDone: true,
      updatedAt: '2026-06-21T00:00:00.000Z'
    });
  });

  test('encouragement endpoint returns the service message', async () => {
    const app = createApp({
      checklistService: {
        getTodayChecklist(userId, date) {
          return Promise.resolve({
            date,
            userId,
            items: [],
            encouragement: { type: 'success', message: '3일 연속 성공했어요!' }
          });
        },
        toggleChecklistItem() {
          throw new Error('not used');
        }
      }
    });

    await withServer(app, async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/encouragement?date=2026-06-21`, {
        headers: {
          'x-user-id': 'user-123'
        }
      });
      const body = await response.json();

      assert.equal(response.status, 200);
      assert.deepEqual(body, {
        type: 'success',
        message: '3일 연속 성공했어요!'
      });
    });
  });
});
