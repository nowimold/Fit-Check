export function createDefaultChecklistItems(userId, idGenerator) {
  return [
    {
      id: idGenerator(),
      userId,
      itemText: '물 마시기',
      sortOrder: 1
    },
    {
      id: idGenerator(),
      userId,
      itemText: '10분 걷기',
      sortOrder: 2
    },
    {
      id: idGenerator(),
      userId,
      itemText: '식단 기록하기',
      sortOrder: 3
    }
  ];
}
