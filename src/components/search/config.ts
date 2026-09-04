import type { FindConfig, FindConfigOverrides } from './types'

/**
 * Every tunable of the find module in one place. Override any subset per
 * use case; untouched keys keep their defaults:
 *
 *   provideFind(messages, { config: { colors: { activeMatch: '#f97316' } } })
 */
export const defaultConfig: FindConfig = {
  colors: {
    /** Every match. amber-200: warm enough to read on grey and on indigo bubbles. */
    match: '#fde68a',
    /** Dark on amber regardless of the surrounding text colour, so marks read on dark bubbles too. */
    matchText: '#1c1917',
    /** The current match: one step up the same ramp (amber-400), dark text for contrast. */
    activeMatch: '#fbbf24',
    activeMatchText: '#1c1917',
    /** Thin outline so the current match reads as an object, not just a warmer fill. */
    activeMatchOutline: '#b45309',
    /** Scrollbar tick marks, one per match. */
    tick: '#f59e0b',
    activeTick: '#b45309',
  },
  motion: {
    /** Contracting ring when a match becomes current. */
    ringMs: 450,
    /** Bar shake when Enter has nothing to step to. */
    shakeMs: 300,
    barEnterMs: 200,
    barLeaveMs: 150,
  },
  behavior: {
    /** Leave the current match selected when the bar closes, as Chrome does. */
    selectMatchOnClose: true,
  },
  text: {
    placeholder: 'Find in conversation',
    noResults: 'No results',
  },
  preview: {
    title: null,
    subtitle: null,
    body: 'text',
  },
}

/** Merge one level of sections, so a partial override keeps its siblings. */
export const mergeConfig = (o: FindConfigOverrides = {}): FindConfig => ({
  colors: { ...defaultConfig.colors, ...o.colors },
  motion: { ...defaultConfig.motion, ...o.motion },
  behavior: { ...defaultConfig.behavior, ...o.behavior },
  text: { ...defaultConfig.text, ...o.text },
  preview: { ...defaultConfig.preview, ...o.preview },
})
