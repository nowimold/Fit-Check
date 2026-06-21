import test from 'node:test';
import assert from 'node:assert/strict';
import { createChecklistService } from '../src/services/checklist-service.js';

test('getTodayChecklist marks today items and warns when work remains', async () => {
  const calls = [];
  const service = createChecklistService({
    ensureUser(userId) {
      calls.push(['ensureUser', userId]);
      return Promise.resolve();
    },
    listActiveChecklistItems(userId) {
      calls.push(['listActiveChecklistItems', userId]);
      return Promise.resolve([
        { id: 'item-1', itemText: '물 2리터 마시기', sortOrder: 1 },
        { id: 'item-2', itemText: '10분 걷기', sortOrder: 2 }
      ]);
    },
    listDailyChecklistRecords(userId, fromDate, toDate) {
      calls.push(['listDailyChecklistRecords', userId, fromDate, toDate]);
      return Promise.resolve([
        { recordDate: '2026-06-21', checklistItemId: 'item-1', isDone: true },
        { recordDate: '2026-06-21', checklistItemId: 'item-2', isDone: false }
      ]);
    },
    upsertDailyChecklistRecord() {
      throw new Error('not used');
    }
  }, {
    now: () => new Date('2026-06-21T10:00:00.000Z')
  });

  const result = await service.getTodayChecklist('user-123', '2026-06-21');

  assert.deepEqual(result, {
    date: '2026-06-21',
    userId: 'user-123',
    items: [
      { id: 'item-1', itemText: '물 2리터 마시기', isDone: true },
      { id: 'item-2', itemText: '10분 걷기', isDone: false }
    ],
    encouragement: { type: 'warning', message: '오늘은 아직 남았어요.' }
  });
  assert.deepEqual(calls, [
    ['ensureUser', 'user-123'],
    ['listActiveChecklistItems', 'user-123'],
    ['listDailyChecklistRecords', 'user-123', '2026-06-15', '2026-06-21']
  ]);
});

test('getTodayChecklist celebrates a 3 day streak when today is complete', async () => {
  const service = createChecklistService({
    ensureUser() {
      return Promise.resolve();
    },
    listActiveChecklistItems() {
      return Promise.resolve([
        { id: 'item-1', itemText: '물 2리터 마시기', sortOrder: 1 }
      ]);
    },
    listDailyChecklistRecords() {
      return Promise.resolve([
        { recordDate: '2026-06-19', checklistItemId: 'item-1', isDone: true },
        { recordDate: '2026-06-20', checklistItemId: 'item-1', isDone: true },
        { recordDate: '2026-06-21', checklistItemId: 'item-1', isDone: true }
      ]);
    },
    upsertDailyChecklistRecord() {
      throw new Error('not used');
    }
  }, {
    now: () => new Date('2026-06-21T10:00:00.000Z')
  });

  const result = await service.getTodayChecklist('user-123', '2026-06-21');

  assert.equal(result.encouragement.type, 'success');
  assert.equal(result.encouragement.message, '3일 연속 성공했어요!');
});

test('toggleChecklistItem saves the requested state', async () => {
  const calls = [];
  const service = createChecklistService({
    ensureUser() {
      calls.push(['ensureUser']);
      return Promise.resolve();
    },
    listActiveChecklistItems() {
      throw new Error('not used');
    },
    listDailyChecklistRecords() {
      throw new Error('not used');
    },
    upsertDailyChecklistRecord(payload) {
      calls.push(['upsertDailyChecklistRecord', payload]);
      return Promise.resolve({
        recordDate: payload.date,
        checklistItemId: payload.itemId,
        itemText: payload.itemText,
        isDone: payload.isDone,
        updatedAt: '2026-06-21T00:00:00.000Z'
      });
    }
  });

  const result = await service.toggleChecklistItem('user-123', 'item-2', '2026-06-21', true, {
    itemText: '10분 걷기'
  });

  assert.deepEqual(result, {
    date: '2026-06-21',
    itemId: 'item-2',
    itemText: '10분 걷기',
    isDone: true,
    updatedAt: '2026-06-21T00:00:00.000Z'
  });
  assert.deepEqual(calls, [
    ['ensureUser'],
    ['upsertDailyChecklistRecord', {
      userId: 'user-123',
      itemId: 'item-2',
      date: '2026-06-21',
      itemText: '10분 걷기',
      isDone: true
    }]
  ]);
});
