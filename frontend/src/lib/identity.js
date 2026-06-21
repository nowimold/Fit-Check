export function getOrCreateUserId(storage, randomUUID) {
  const existing = storage.getItem('fit-check-user-id');
  if (existing) {
    return existing;
  }

  const userId = randomUUID();
  storage.setItem('fit-check-user-id', userId);
  return userId;
}
