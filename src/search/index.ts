/**
 * Find in conversation — browser-style "find in page" for a list of messages.
 *
 * In the component that owns the list:
 *   provideFind(messages, { fields })   // once, in <script setup>
 *   <FindBar />                          // inside a `relative` container
 *
 * Wherever a searchable field is rendered (fields are declared through
 * provideFind's `fields` option; `text` is the default):
 *   <HighlightedText :text="msg.text" :id="msg.id" />
 *   <HighlightedText :text="msg.from" :id="msg.id" field="from" />
 *
 * ⌘F / Ctrl+F opens, Enter / Shift+Enter (or ⌘G / ⌘⇧G) step, Esc closes.
 * Colours, motion and copy are tunable through provideFind's `config` option;
 * see config.ts.
 */
export { provideFind, useFind } from './useFind'
export { createFind } from './createFind'
export { defaultConfig } from './config'
export { findRanges, segment } from './match'
export type {
  Find,
  FindConfig,
  FindConfigOverrides,
  FindOptions,
  Match,
  Range,
  Segment,
} from './types'
export { default as FindBar } from './FindBar.vue'
export { default as HighlightedText } from './HighlightedText.vue'
