<template>
  <template v-for="(seg, i) in segments" :key="i">
    <mark
      v-if="seg.match"
      v-scroll-into-view="seg.match.index === current"
      :data-find-index="seg.match.index"
      :aria-current="seg.match.index === current ? 'true' : undefined"
      class="find-mark"
      :class="{ 'find-mark-active': seg.match.index === current }"
      :style="vars"
      >{{ seg.text }}</mark
    >
    <template v-else>{{ seg.text }}</template>
  </template>
</template>

<script setup>
import { computed } from 'vue'
import { segment } from './match'
import { useFind } from './useFind'
import { vScrollIntoView } from './vScrollIntoView'

const props = defineProps({
  text: { type: String, required: true },
  /** The message id this text belongs to, as seen by provideFind(). */
  id: { required: true },
})

const { matchesFor, current, config } = useFind()
const segments = computed(() => segment(props.text, matchesFor(props.id)))

const vars = {
  '--find-match': config.colors.match,
  '--find-match-text': config.colors.matchText,
  '--find-active': config.colors.activeMatch,
  '--find-active-text': config.colors.activeMatchText,
  '--find-outline': config.colors.activeMatchOutline,
  '--find-ring-ms': `${config.motion.ringMs}ms`,
}
</script>

<style scoped>
.find-mark {
  border-radius: 3px;
  padding: 0 2px;
  background: var(--find-match);
  color: var(--find-match-text);
  transition:
    background-color 150ms,
    color 150ms;
}

/* The ring is a box-shadow, not a transform, so a long match still wraps. */
.find-mark-active {
  background: var(--find-active);
  color: var(--find-active-text);
  box-shadow: 0 0 0 1.5px var(--find-outline);
  animation: find-ring var(--find-ring-ms) ease-out;
}

@keyframes find-ring {
  from {
    box-shadow:
      0 0 0 1.5px var(--find-outline),
      0 0 0 7px color-mix(in srgb, var(--find-active) 60%, transparent);
  }
  to {
    box-shadow:
      0 0 0 1.5px var(--find-outline),
      0 0 0 0 transparent;
  }
}

@media (prefers-reduced-motion: reduce) {
  .find-mark,
  .find-mark-active {
    transition: none;
    animation: none;
  }
}
</style>
