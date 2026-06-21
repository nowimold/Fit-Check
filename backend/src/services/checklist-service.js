import { addDays, todayIsoDate, toIsoDate } from '../lib/date.js';

function chooseEncouragement(todayComplete, streakDays) {
  if (!todayComplete) {
    return { type: 'warning', message: '오늘은 아직 남았어요.' };
  }

  if (streakDays >= 3) {
    return { type: 'success', message: '3일 연속 성공했어요!' };
  }

  return { type: 'success', message: '오늘도 잘했어요!' };
}

function buildCompletionMap(records) {
  const map = new Map();

  for (const record of records) {
    const key = record.recordDate;
    if (!map.has(key)) {
      map.set(key, new Map());
    }

    map.get(key).set(record.checklistItemId, record.isDone);
  }

  return map;
}

function isDayComplete(items, recordsByDate, date) {
  if (items.length === 0) {
    return false;
  }

  const dayRecords = recordsByDate.get(date);
  if (!dayRecords) {
    return false;
  }

  return items.every((item) => dayRecords.get(item.id) === true);
}

function calculateStreak(items, recordsByDate, date) {
  let streak = 0;
  let currentDate = date;

  for (let i = 0; i < 7; i += 1) {
    if (!isDayComplete(items, recordsByDate, currentDate)) {
      break;
    }

    streak += 1;
    currentDate = addDays(currentDate, -1);
  }

  return streak;
}

export function createChecklistService(repository, { now = () => new Date() } = {}) {
  return {
    async getTodayChecklist(userId, dateInput) {
      const date = dateInput ? toIsoDate(dateInput) : todayIsoDate(now());
      const fromDate = addDays(date, -6);

      await repository.ensureUser(userId);

      const [items, records] = await Promise.all([
        repository.listActiveChecklistItems(userId),
        repository.listDailyChecklistRecords(userId, fromDate, date)
      ]);

      const recordsByDate = buildCompletionMap(records);
      const sortedItems = [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      const todayRecords = recordsByDate.get(date) ?? new Map();
      const mappedItems = sortedItems.map((item) => ({
        id: item.id,
        itemText: item.itemText,
        isDone: todayRecords.get(item.id) === true
      }));
      const todayComplete = isDayComplete(sortedItems, recordsByDate, date);
      const streakDays = calculateStreak(sortedItems, recordsByDate, date);

      return {
        date,
        userId,
        items: mappedItems,
        encouragement: chooseEncouragement(todayComplete, streakDays)
      };
    },

    async toggleChecklistItem(userId, itemId, dateInput, isDone, options = {}) {
      const date = toIsoDate(dateInput);
      await repository.ensureUser(userId);

      const itemText = options.itemText || (repository.getChecklistItemText
        ? await repository.getChecklistItemText(userId, itemId)
        : null);

      const record = await repository.upsertDailyChecklistRecord({
        userId,
        itemId,
        date,
        itemText,
        isDone
      });

      return {
        date,
        itemId,
        itemText: record.itemText ?? itemText,
        isDone: record.isDone,
        updatedAt: record.updatedAt
      };
    }
  };
}
