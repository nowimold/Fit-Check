export async function fetchTodayChecklist({
  baseUrl = '',
  userId,
  date,
  fetchImpl = fetch
}) {
  const url = new URL('/api/checklists/today', baseUrl || 'http://localhost');
  if (date) {
    url.searchParams.set('date', date);
  }

  const response = await fetchImpl(url.toString(), {
    headers: {
      'x-user-id': userId
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to load checklist');
  }

  return response.json();
}

export async function toggleChecklistItem({
  baseUrl = '',
  userId,
  itemId,
  date,
  isDone,
  fetchImpl = fetch
}) {
  const url = new URL(`/api/checklists/items/${itemId}`, baseUrl || 'http://localhost');
  const response = await fetchImpl(url.toString(), {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      'x-user-id': userId
    },
    body: JSON.stringify({ date, isDone })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update checklist item');
  }

  return response.json();
}
