const CREATED = /^(\d{2})\/(\d{2})\/(\d{2}) (\d{1,2}):(\d{2}) (AM|PM)$/;

/** Parse the API's "MM/DD/YY hh:mm AM" timestamps as local time. */
export function parseCreated(created: string): Date {
  const m = CREATED.exec(created);
  if (!m) throw new Error(`Unrecognised timestamp: ${created}`);
  const hour = (Number(m[4]) % 12) + (m[6] === 'PM' ? 12 : 0);
  return new Date(2000 + Number(m[3]), Number(m[1]) - 1, Number(m[2]), hour, Number(m[5]));
}

const dateTime = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' });
const day = new Intl.DateTimeFormat(undefined, { dateStyle: 'full' });

/** "Jan 1, 2024, 12:00 AM" in the reader's locale. */
export const formatDateTime = (d: Date) => dateTime.format(d);

/** "Monday, January 1, 2024" in the reader's locale. */
export const formatDay = (d: Date) => day.format(d);
