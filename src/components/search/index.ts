export { provideFind, useFind } from './composables/useFind';
export { createFind } from './lib/createFind';
export { defaultConfig } from './config';
export { findRanges, segment } from './lib/match';
export type {
  Find,
  FindConfig,
  FindConfigOverrides,
  FindOptions,
  FindProviderOptions,
  Match,
  Range,
  Segment,
} from './types';
export { default as FindBar } from './components/FindBar.vue';
export { default as HighlightedText } from './components/HighlightedText.vue';
