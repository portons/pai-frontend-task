import { computed, ref, toValue, watch } from 'vue'
import { mergeConfig } from './config'
import { findRanges } from './match'

/** @typedef {{ start: number, end: number, index: number, id: unknown, item: object, field: string }} Match */

const NONE = Object.freeze([])

/**
 * Find-in-page state over a list of messages. Knows about text and indices,
 * nothing about the DOM.
 *
 * @param {import('vue').MaybeRefOrGetter<object[]>} items
 * @param {object} [options]
 * @param {Record<string, (item: object) => unknown>} [options.fields]
 *   Searchable fields by name, in the order they appear on screen (that
 *   order is the order matches are stepped through). Defaults to `text`.
 * @param {(item: object) => unknown} [options.getId]
 * @param {(matches: Match[]) => number | Promise<number>} [options.startAt]
 *   Which match to land on when the result set changes. Defaults to the first.
 * @param {Partial<typeof import('./config').defaultConfig>} [options.config]
 *   Colours, motion and copy overrides; see config.js for the defaults.
 */
export function createFind(
  items,
  {
    fields = { text: (item) => item.text },
    getId = (item) => item.id,
    startAt = () => 0,
    config,
  } = {},
) {
  const query = ref('')
  const isOpen = ref(false)
  /** Position in the flat match list, -1 when there is nothing to point at. */
  const current = ref(-1)

  /** The text of one field of one item, always a string. */
  const fieldText = (item, field) => String(fields[field]?.(item) ?? '')

  const results = computed(() => {
    /** @type {Match[]} */
    const list = []
    /** @type {Map<unknown, Record<string, Match[]>>} */
    const byId = new Map()
    if (!isOpen.value || !query.value) return { list, byId }

    for (const item of toValue(items)) {
      const id = getId(item)
      const byField = {}
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

  const step = (delta) => {
    if (total.value) current.value = (current.value + delta + total.value) % total.value
  }

  return {
    config: mergeConfig(config),
    fieldText,
    query,
    isOpen,
    /** Every match in document order, each with its global index. */
    matches,
    total,
    current,
    /** Matches inside one field of one message; the same empty array whenever there are none. */
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
