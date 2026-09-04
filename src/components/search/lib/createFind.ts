import { computed, ref, toValue, watch, type MaybeRefOrGetter } from 'vue';
import { DEFAULT_FIELD, defaultOptions, mergeConfig } from '../config';
import { findRanges } from './match';
import type { Find, FindOptions, FindResults, Match, MatchesByField } from '../types';

const NONE: readonly never[] = Object.freeze([]);

/**
 * Find-in-page state over a list of messages. Knows about text and indices,
 * nothing about the DOM.
 */
export function createFind<T extends object>(
  items: MaybeRefOrGetter<T[]>,
  options: FindOptions<T> = {},
): Find<T> {
  const { fields, getId, startAt, config } = { ...defaultOptions, ...options };
  const query = ref('');
  const isOpen = ref(false);
  /** Position in the flat match list, -1 when there is nothing to point at. */
  const current = ref(-1);

  const fieldText = (item: T, field: string) => String(fields[field]?.(item) ?? '');

  /** Where `query` occurs in one item, field by field in on-screen order. Not yet numbered. */
  function matchesIn(item: T, query: string): Omit<Match<T>, 'index'>[] {
    const id = getId(item);
    return Object.keys(fields).flatMap((field) =>
      findRanges(fieldText(item, field), query).map((range) => ({ ...range, id, item, field })),
    );
  }

  /** Every match across all items, numbered in document order, plus the per-message lookup. */
  function search(list: T[], query: string): FindResults<T> {
    const matches = list
      .flatMap((item) => matchesIn(item, query))
      .map((match, index) => ({ ...match, index }));

    const byId = new Map<PropertyKey, MatchesByField<T>>();
    for (const match of matches) {
      const byField = byId.get(match.id) ?? {};
      const inField = byField[match.field] ?? [];
      inField.push(match);
      byField[match.field] = inField;
      byId.set(match.id, byField);
    }
    return { matches, byId };
  }

  const nothing: FindResults<T> = { matches: [], byId: new Map() };
  const results = computed(() =>
    isOpen.value && query.value ? search(toValue(items), query.value) : nothing,
  );

  const matches = computed(() => results.value.matches);
  const total = computed(() => matches.value.length);

  // Any new result set (typing, reopening, items changing) gets a fresh
  // pointer, even when the count happens to stay the same.
  watch(results, async (found) => {
    current.value = -1;
    if (found.matches.length === 0) return;
    const index = await startAt(found.matches);
    if (results.value === found) current.value = index;
  });

  const step = (delta: number) => {
    if (total.value) current.value = (current.value + delta + total.value) % total.value;
  };

  return {
    config: mergeConfig(config),
    query,
    isOpen,
    matches,
    total,
    current,
    fieldText,
    matchesFor: (id, field = DEFAULT_FIELD) => results.value.byId.get(id)?.[field] ?? NONE,
    open: () => (isOpen.value = true),
    close: () => (isOpen.value = false),
    next: () => step(1),
    prev: () => step(-1),
    goTo: (index) => {
      if (index >= 0 && index < total.value) current.value = index;
    },
  };
}
