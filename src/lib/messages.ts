import type { ApiMessage, DayGroup, Message } from '../types';
import { formatDay, parseCreated } from './dates';

export function fromApi(rows: ApiMessage[]): Message[] {
  return rows.map((row) => ({
    id: row.id,
    incoming: row.incoming,
    from: row.from,
    text: row.text,
    created: parseCreated(row.created),
  }));
}

export function groupByDay(messages: Message[]): DayGroup[] {
  const days: DayGroup[] = [];
  for (const message of messages) {
    const key = message.created.toDateString();
    const last = days.at(-1);
    if (last?.key === key) last.items.push(message);
    else days.push({ key, label: formatDay(message.created), items: [message] });
  }
  return days;
}
