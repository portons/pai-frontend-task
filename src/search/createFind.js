import { computed, ref, toValue, watch } from 'vue'
import { mergeConfig } from './config'
import { findRanges } from './match'

/** @typedef {{ start: number, end: number, index: number, id: unknown, item: object }} Match */

const NONE = Object.freeze([])

/**
 * Find-in-page state over a list of messages. Knows about text and indices,
 * nothing about the DOM.
 *
 * @param {import('vue').MaybeRefOrGetter<object[]>} items
 * @param {object} [options]
 * @param {(item: object) => string} [options.getText]
 * @param {(item: object) => unknown} [options.getId]
 * @param {(item: object) => { title?: string, subtitle?: string }} [options.getMeta]
 *   Who and when, for the tick-mark preview. Defaults to nothing.
 * @param {(matches: Match[]) => number | Promise<number>} [options.startAt]
 *   Which match to land on when the result set changes. Defaults to the first.
 * @param {Partial<typeof import('./config').defaultConfig>} [options.config]
 *   Colours, motion and copy overrides; see config.js for the defaults.
 */
export function createFind(
  items,
  {
    getText = (item) => item.text ?? '',
    getId = (item) => item.id,
    getMeta = () => ({}),
    startAt = () => 0,
    config,
  } = {},
) {
  const query = ref('')
  const isOpen = ref(false)
  /** Position in the flat match list, -1 when there is nothing to point at. */
  const current = ref(-1)

  const results = computed(() => {
    /** @type {Match[]} */
    const list = []
    /** @type {Map<unknown, Match[]>} */
    const byId = new Map()
    if (!isOpen.value || !query.value) return { list, byId }

    for (const item of toValue(items)) {
      const ranges = findRanges(getText(item), query.value)
      if (ranges.length === 0) continue
      const id = getId(item)
      const matches = ranges.map((range, i) => ({ ...range, id, item, index: list.length + i }))
      byId.set(id, matches)
      list.push(...matches)
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
    getText,
    getMeta,
    query,
    isOpen,
    /** Every match in document order, each with its global index. */
    matches,
    total,
    current,
    /** Matches inside one message; the same empty array whenever there are none. */
    matchesFor: (id) => results.value.byId.get(id) ?? NONE,
    open: () => (isOpen.value = true),
    close: () => (isOpen.value = false),
    next: () => step(1),
    prev: () => step(-1),
    goTo: (index) => {
      if (index >= 0 && index < total.value) current.value = index
    },
  }
}
