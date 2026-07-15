export function toDateInputValue(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function parseChecklistDate(value?: string) {
  if (!value) {
    return toDateInputValue();
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    return toDateInputValue();
  }

  return value;
}

export function toDatabaseDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}
