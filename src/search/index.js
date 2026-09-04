/**
 * Find in conversation — browser-style "find in page" for a list of messages.
 *
 * In the component that owns the list:
 *   provideFind(messages)          // once, in <script setup>
 *   <FindBar />                     // inside a `relative` container
 *
 * Wherever a message's text is rendered:
 *   <HighlightedText :text="msg.text" :id="msg.id" />
 *
 * ⌘F / Ctrl+F opens, Enter / Shift+Enter (or ⌘G / ⌘⇧G) step, Esc closes.
 * Colours, motion and copy are tunable through provideFind's `config` option;
 * see config.js.
 */
export { provideFind, useFind } from './useFind'
export { createFind } from './createFind'
export { defaultConfig } from './config'
export { findRanges, segment } from './match'
export { default as FindBar } from './FindBar.vue'
export { default as HighlightedText } from './HighlightedText.vue'
