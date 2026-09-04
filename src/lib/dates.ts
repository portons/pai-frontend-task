const CREATED = /^(\d{2})\/(\d{2})\/(\d{2}) (\d{1,2}):(\d{2}) (AM|PM)$/;

export function parseCreated(created: string): Date {
  const parts = CREATED.exec(created);
  if (!parts) throw new Error(`Unrecognised timestamp: ${created}`);
  const [, month, dayOfMonth, year, hour12, minute, meridiem] = parts;
  const hour = (Number(hour12) % 12) + (meridiem === 'PM' ? 12 : 0);
  return new Date(2000 + Number(year), Number(month) - 1, Number(dayOfMonth), hour, Number(minute));
}

const dateTime = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' });
const day = new Intl.DateTimeFormat(undefined, { dateStyle: 'full' });

export const formatDateTime = (date: Date) => dateTime.format(date);

export const formatDay = (date: Date) => day.format(date);
