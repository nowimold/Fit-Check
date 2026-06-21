function pad(value) {
  return String(value).padStart(2, '0');
}

export function toIsoDate(value) {
  if (!value) {
    throw new Error('Date is required');
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${value}`);
  }

  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

export function addDays(dateString, days) {
  const date = new Date(`${dateString}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return toIsoDate(date);
}

export function todayIsoDate(now = new Date()) {
  return toIsoDate(now);
}
