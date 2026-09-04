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
      class="find-tick pointer-events-auto absolute inset-x-0.5 -translate-y-1/2 rounded-full"
      :class="{ 'find-tick-active': tick.index === current }"
      :style="{ top: `${tick.pct}%` }"
      @mouseenter="hovered = tick"
      @mouseleave="hovered = null"
      @click="goTo(tick.index)"
    />

    <Transition name="find-pop">
      <div
        v-if="preview"
        class="find-pop absolute right-full mr-2 w-64 rounded-lg bg-white/95 p-3 text-xs shadow-xl ring-1 ring-black/10 backdrop-blur-md"
        :class="preview.anchor"
        :style="{ top: `${preview.pct}%` }"
      >
        <div
          v-if="preview.title.length || preview.subtitle.length"
          class="mb-1 flex items-baseline justify-between gap-3"
        >
          <span class="truncate font-semibold text-gray-900">
            <Marked :segments="preview.title" :active="preview.index" />
          </span>
          <span class="shrink-0 text-gray-400 tabular-nums">
            <Marked :segments="preview.subtitle" :active="preview.index" />
          </span>
        </div>
        <p class="line-clamp-3 leading-relaxed text-gray-700">
          <Marked :segments="preview.body" :active="preview.index" />
        </p>
        <div class="mt-1.5 text-[10px] font-medium tracking-wide text-gray-400 uppercase">
          Match {{ preview.index + 1 }} of {{ total }}
        </div>
        <span class="find-pop-arrow" />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, h, nextTick, onUnmounted, ref, useTemplateRef, watch } from 'vue'
import { findMarks, scrollParent } from './dom'
import { segment } from './match'
import { useFind } from './useFind'

/** px, must match the `w-3` track above. */
const TRACK_WIDTH = 12

const { matches, matchesFor, current, total, goTo, fieldText, config } = useFind()
const root = useTemplateRef('root')
const ticks = ref([])
const frame = ref({})
const vars = {
  '--find-tick': config.colors.tick,
  '--find-tick-active': config.colors.activeTick,
  '--find-match': config.colors.match,
  '--find-active': config.colors.activeMatch,
  '--find-active-text': config.colors.activeMatchText,
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

// Hovering a tick previews its message, anchored beside the tick and kept
// inside the track near the top and bottom edges.
const hovered = ref(null)
const preview = computed(() => {
  const match = hovered.value && matches.value[hovered.value.index]
  if (!match) return null
  const { index, pct } = hovered.value
  const marked = (field) =>
    field ? segment(fieldText(match.item, field), matchesFor(match.id, field)) : []
  return {
    index,
    pct,
    title: marked(config.preview.title),
    subtitle: marked(config.preview.subtitle),
    body: marked(config.preview.body),
    anchor: pct < 15 ? 'find-pop-top' : pct > 85 ? 'find-pop-bottom' : 'find-pop-center',
  }
})

/** Segments as text nodes and <mark>s, the active match emphasised. */
const Marked = ({ segments, active }) =>
  segments.map((seg) =>
    seg.match
      ? h(
          'mark',
          { class: ['find-pop-mark', { 'find-pop-mark-active': seg.match.index === active }] },
          seg.text,
        )
      : seg.text,
  )
Marked.props = ['segments', 'active']
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
/* Ticks are two pixels tall; give the pointer something to land on. */
.find-tick::before {
  content: '';
  position: absolute;
  inset: -4px 0;
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

.find-pop {
  transform-origin: right center;
}
.find-pop-center {
  translate: 0 -50%;
}
.find-pop-top {
  translate: 0 -12px;
}
.find-pop-bottom {
  translate: 0 calc(-100% + 12px);
}
.find-pop-arrow {
  position: absolute;
  right: -5px;
  width: 10px;
  height: 10px;
  background: white;
  border-top: 1px solid rgb(0 0 0 / 0.1);
  border-right: 1px solid rgb(0 0 0 / 0.1);
  rotate: 45deg;
  translate: 0 -50%;
}
.find-pop-center .find-pop-arrow {
  top: 50%;
}
.find-pop-top .find-pop-arrow {
  top: 12px;
}
.find-pop-bottom .find-pop-arrow {
  top: calc(100% - 12px);
}

.find-pop-mark {
  border-radius: 3px;
  padding: 0 2px;
  color: inherit;
  background: var(--find-match);
}
.find-pop-mark-active {
  background: var(--find-active);
  color: var(--find-active-text);
}

.find-pop-enter-active,
.find-pop-leave-active {
  transition:
    opacity 120ms ease-out,
    scale 120ms ease-out;
}
.find-pop-enter-from,
.find-pop-leave-to {
  opacity: 0;
  scale: 0.96;
}

@media (prefers-reduced-motion: reduce) {
  .find-tick,
  .find-pop-enter-active,
  .find-pop-leave-active {
    transition: none;
  }
}
</style>
