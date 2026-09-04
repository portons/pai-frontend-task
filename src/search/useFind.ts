import { inject, provide, type InjectionKey, type MaybeRefOrGetter } from 'vue'
import { createFind } from './createFind'
import { nearestVisibleMatch } from './nearestVisibleMatch'
import type { Find, FindOptions } from './types'

// A registered symbol survives module hot-reloads, so editing this file in
// dev does not orphan already-mounted consumers.
const KEY: InjectionKey<Find> = Symbol.for('find-in-conversation')

/**
 * Create the find state and make it available to every <FindBar> and
 * <HighlightedText> below the calling component. Call once.
 */
export function provideFind<T extends object>(
  items: MaybeRefOrGetter<T[]>,
  options?: FindOptions<T>,
): Find<T> {
  const find = createFind(items, { startAt: nearestVisibleMatch, ...options })
  provide(KEY, find)
  return find
}

/** The find state provided by the nearest provideFind() ancestor. */
export function useFind(): Find {
  const find = inject(KEY, null)
  if (!find) throw new Error('useFind() called without provideFind() in an ancestor component')
  return find
}
