<template>
  <div
    ref="root"
    class="pointer-events-none absolute z-10 w-3"
    :style="[frame, vars]"
    aria-hidden="true"
  >
    <button
      v-for="tick in ticks"
      :key="tick.index"
      type="button"
      tabindex="-1"
      :title="`Match ${tick.index + 1} of ${total}`"
      class="find-tick pointer-events-auto absolute inset-x-0.5 -translate-y-1/2 rounded-full"
      :class="{ 'find-tick-active': tick.index === current }"
      :style="{ top: `${tick.pct}%` }"
      @click="goTo(tick.index)"
    />
  </div>
</template>

<script setup>
import { nextTick, onUnmounted, ref, useTemplateRef, watch } from 'vue'
import { findMarks, scrollParent } from './dom'
import { useFind } from './useFind'

/** px, must match the `w-3` track above. */
const TRACK_WIDTH = 12

const { matches, current, total, goTo, config } = useFind()
const root = useTemplateRef('root')
const ticks = ref([])
const frame = ref({})
const vars = {
  '--find-tick': config.colors.tick,
  '--find-tick-active': config.colors.activeTick,
}

// Chrome's scrollbar markers: the track covers the list's scroll area and
// each tick sits where its match lives in the full scroll height.
async function measure() {
  await nextTick()
  const marks = findMarks()
  if (marks.length === 0 || !root.value) {
    ticks.value = []
    return
  }
  const scroller = scrollParent(marks[0])
  const host = root.value.offsetParent ?? root.value.parentElement
  const area = scroller.getBoundingClientRect()
  const origin = host.getBoundingClientRect()
  frame.value = {
    top: `${area.top - origin.top - host.clientTop}px`,
    left: `${area.right - origin.left - host.clientLeft - TRACK_WIDTH}px`,
    height: `${area.height}px`,
  }
  ticks.value = Array.from(marks, (mark) => ({
    index: Number(mark.dataset.findIndex),
    pct:
      ((mark.getBoundingClientRect().top - area.top + scroller.scrollTop) / scroller.scrollHeight) *
      100,
  }))
  observe(scroller)
}
watch(matches, measure)

let observer = null
let observed = null
function observe(scroller) {
  if (observed === scroller) return
  observer?.disconnect()
  observed = scroller
  observer = new ResizeObserver(() => measure())
  observer.observe(scroller)
}
onUnmounted(() => observer?.disconnect())
</script>

<style scoped>
.find-tick {
  height: 2px;
  background: var(--find-tick);
  opacity: 0.7;
  transition:
    height 150ms,
    opacity 150ms,
    background-color 150ms;
}
.find-tick:hover {
  opacity: 1;
}
.find-tick-active {
  height: 4px;
  opacity: 1;
  background: var(--find-tick-active);
  box-shadow: 0 0 0 1px white;
}
@media (prefers-reduced-motion: reduce) {
  .find-tick {
    transition: none;
  }
}
</style>
