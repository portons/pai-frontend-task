import type { FindConfig, FindConfigOverrides, FindOptions } from './types';

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
    /** Scrollbar tick marks, one per match. */
    tick: '#f59e0b',
    activeTick: '#b45309',
  },
  motion: {
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
};

/** The field searched and highlighted when none is named. */
export const DEFAULT_FIELD = 'text';

/** Read a property off an item whose shape the module does not know. */
const prop = (item: object, key: string): unknown => (item as Record<string, unknown>)[key];

/**
 * How the finder reads items unless told otherwise: search the `text`
 * field, identify items by `id`, start from the first match.
 */
export const defaultOptions: Required<Omit<FindOptions<object>, 'config'>> = {
  fields: { [DEFAULT_FIELD]: (item) => prop(item, DEFAULT_FIELD) },
  getId: (item) => prop(item, 'id') as PropertyKey,
  startAt: () => 0,
};

/** Inline styles for a <mark>: every match, and the current one. */
export const markStyles = ({ colors }: FindConfig) => ({
  match: { background: colors.match, color: colors.matchText },
  active: { background: colors.activeMatch, color: colors.activeMatchText },
});

/** Merge one level of sections, so a partial override keeps its siblings. */
export const mergeConfig = (overrides: FindConfigOverrides = {}): FindConfig => ({
  colors: { ...defaultConfig.colors, ...overrides.colors },
  motion: { ...defaultConfig.motion, ...overrides.motion },
  behavior: { ...defaultConfig.behavior, ...overrides.behavior },
  text: { ...defaultConfig.text, ...overrides.text },
  preview: { ...defaultConfig.preview, ...overrides.preview },
});
