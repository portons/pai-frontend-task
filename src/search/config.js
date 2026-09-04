/**
 * Every tunable of the find module in one place. Override any subset per
 * use case; untouched keys keep their defaults:
 *
 *   provideFind(messages, { config: { colors: { activeMatch: '#f97316' } } })
 */
export const defaultConfig = {
  colors: {
    /** Every match. amber-200: warm enough to read on grey and on indigo bubbles. */
    match: '#fde68a',
    matchText: 'inherit',
    /** The current match: one step up the same ramp (amber-400), dark text for contrast. */
    activeMatch: '#fbbf24',
    activeMatchText: '#1c1917',
    /** Thin outline so the current match reads as an object, not just a warmer fill. */
    activeMatchOutline: '#b45309',
  },
  motion: {
    /** Contracting ring when a match becomes current. */
    ringMs: 450,
    /** Bar shake when Enter has nothing to step to. */
    shakeMs: 300,
    barEnterMs: 200,
    barLeaveMs: 150,
  },
  text: {
    placeholder: 'Find in conversation',
    noResults: 'No results',
  },
}

/** Merge one level of sections, so a partial override keeps its siblings. */
export function mergeConfig(overrides = {}) {
  const merged = {}
  for (const section of Object.keys(defaultConfig)) {
    merged[section] = { ...defaultConfig[section], ...overrides[section] }
  }
  return merged
}
