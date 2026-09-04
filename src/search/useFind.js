import { inject, provide } from 'vue'
import { createFind } from './createFind'
import { nearestVisibleMatch } from './nearestVisibleMatch'

const KEY = Symbol('find')

/**
 * Create the find state and make it available to every <FindBar> and
 * <HighlightedText> below the calling component. Call once.
 * @param {Parameters<typeof createFind>[0]} items
 * @param {Parameters<typeof createFind>[1]} [options]
 */
export function provideFind(items, options) {
  const find = createFind(items, { startAt: nearestVisibleMatch, ...options })
  provide(KEY, find)
  return find
}

/** The find state provided by the nearest provideFind() ancestor. */
export function useFind() {
  const find = inject(KEY, null)
  if (!find) throw new Error('useFind() called without provideFind() in an ancestor component')
  return find
}
