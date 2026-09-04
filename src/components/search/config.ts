import type { FindConfig, FindConfigOverrides, FindOptions } from './types';

export const defaultConfig: FindConfig = {
  colors: {
    match: '#fde68a',
    matchText: '#1c1917',
    activeMatch: '#fbbf24',
    activeMatchText: '#1c1917',
    tick: '#f59e0b',
    activeTick: '#b45309',
  },
  motion: {
    shakeMs: 300,
    barEnterMs: 200,
    barLeaveMs: 150,
  },
  behavior: {
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

export const DEFAULT_FIELD = 'text';

const prop = (item: object, key: string): unknown => (item as Record<string, unknown>)[key];

export const defaultOptions: Required<Omit<FindOptions<object>, 'config'>> = {
  fields: { [DEFAULT_FIELD]: (item) => prop(item, DEFAULT_FIELD) },
  getId: (item) => prop(item, 'id') as PropertyKey,
  startAt: () => 0,
};

export const markStyles = ({ colors }: FindConfig) => ({
  match: { background: colors.match, color: colors.matchText },
  active: { background: colors.activeMatch, color: colors.activeMatchText },
});

export const mergeConfig = (overrides: FindConfigOverrides = {}): FindConfig => ({
  colors: { ...defaultConfig.colors, ...overrides.colors },
  motion: { ...defaultConfig.motion, ...overrides.motion },
  behavior: { ...defaultConfig.behavior, ...overrides.behavior },
  text: { ...defaultConfig.text, ...overrides.text },
  preview: { ...defaultConfig.preview, ...overrides.preview },
});
