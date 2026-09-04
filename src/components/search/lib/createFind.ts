import { computed, ref, toValue, watch, type MaybeRefOrGetter } from 'vue'
import { mergeConfig } from '../config'
import { findRanges } from './match'
import type { Find, FindOptions, Match } from '../types'

const NONE: readonly never[] = Object.freeze([])

/** Read a property off an item whose shape the module does not know. */
const prop = (item: object, key: string): unknown => (item as Record<string, unknown>)[key]

/**
 * Find-in-page state over a list of messages. Knows about text and indices,
 * nothing about the DOM.
 */
export function createFind<T extends object>(
  items: MaybeRefOrGetter<T[]>,
  {
    fields = { text: (item) => prop(item, 'text') },
    getId = (item) => prop(item, 'id') as PropertyKey,
    startAt = () => 0,
    config,
  }: FindOptions<T> = {},
): Find<T> {
  const query = ref('')
  const isOpen = ref(false)
  /** Position in the flat match list, -1 when there is nothing to point at. */
  const current = ref(-1)

  const fieldText = (item: T, field: string) => String(fields[field]?.(item) ?? '')

  const results = computed(() => {
    const list: Match<T>[] = []
    const byId = new Map<PropertyKey, Record<string, Match<T>[]>>()
    if (!isOpen.value || !query.value) return { list, byId }

    for (const item of toValue(items)) {
      const id = getId(item)
      const byField: Record<string, Match<T>[]> = {}
      for (const field of Object.keys(fields)) {
        const ranges = findRanges(fieldText(item, field), query.value)
        if (ranges.length === 0) continue
        byField[field] = ranges.map((r, i) => ({ ...r, id, item, field, index: list.length + i }))
        list.push(...byField[field])
      }
      if (Object.keys(byField).length) byId.set(id, byField)
    }
    return { list, byId }
  })

  const matches = computed(() => results.value.list)
  const total = computed(() => matches.value.length)

  // Any new result set (typing, reopening, items changing) gets a fresh
  // pointer, even when the count happens to stay the same.
  watch(results, async (set) => {
    current.value = -1
    if (set.list.length === 0) return
    const index = await startAt(set.list)
    if (results.value === set) current.value = index
  })

  const step = (delta: number) => {
    if (total.value) current.value = (current.value + delta + total.value) % total.value
  }

  return {
    config: mergeConfig(config),
    query,
    isOpen,
    matches,
    total,
    current,
    fieldText,
    matchesFor: (id, field = 'text') => results.value.byId.get(id)?.[field] ?? NONE,
    open: () => (isOpen.value = true),
    close: () => (isOpen.value = false),
    next: () => step(1),
    prev: () => step(-1),
    goTo: (index) => {
      if (index >= 0 && index < total.value) current.value = index
    },
  }
}
