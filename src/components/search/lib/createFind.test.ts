import { nextTick } from 'vue';
import { describe, expect, it } from 'vitest';
import { createFind } from './createFind';

const messages = [
  { id: '1', from: 'Jane', text: 'First order' },
  { id: '2', from: 'Agent', text: 'Order received. Order confirmed.' },
];

async function runSearch(query: string) {
  const find = createFind(messages, {
    fields: {
      from: (message) => message.from,
      text: (message) => message.text,
    },
  });

  find.open();
  find.query.value = query;
  await nextTick();
  await Promise.resolve();

  return find;
}

describe('createFind', () => {
  it('orders matches by item and field', async () => {
    const find = await runSearch('order');

    expect(
      find.matches.value.map(({ id, field, start, end }) => ({ id, field, start, end })),
    ).toEqual([
      { id: '1', field: 'text', start: 6, end: 11 },
      { id: '2', field: 'text', start: 0, end: 5 },
      { id: '2', field: 'text', start: 16, end: 21 },
    ]);
    expect(find.current.value).toBe(0);
  });

  it('returns matches for one item and field', async () => {
    const find = await runSearch('order');

    expect(find.matchesFor('2', 'text')).toHaveLength(2);
    expect(find.matchesFor('2', 'from')).toEqual([]);
  });

  it('wraps next and previous navigation', async () => {
    const find = await runSearch('order');

    find.prev();
    expect(find.current.value).toBe(2);

    find.next();
    expect(find.current.value).toBe(0);
  });

  it('clears results when search closes', async () => {
    const find = await runSearch('order');

    find.close();
    await nextTick();

    expect(find.total.value).toBe(0);
    expect(find.current.value).toBe(-1);
  });
});
