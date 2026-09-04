<template>
  <template v-for="(seg, i) in segments" :key="i">
    <mark
      v-if="seg.match"
      v-scroll-into-view="seg.match.index === current"
      :data-find-index="seg.match.index"
      :aria-current="seg.match.index === current ? 'true' : undefined"
      class="find-mark"
      :class="{ 'find-mark-active': seg.match.index === current }"
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

const { matchesFor, current } = useFind()
const segments = computed(() => segment(props.text, matchesFor(props.id)))
</script>

<style scoped>
.find-mark {
  border-radius: 3px;
  padding: 0 2px;
  color: inherit;
  background: var(--color-yellow-200);
  transition: background-color 150ms;
}

/* The ring is a box-shadow, not a transform, so a long match still wraps. */
.find-mark-active {
  color: white;
  background: var(--color-orange-500);
  animation: find-ring 450ms ease-out;
}

@keyframes find-ring {
  from {
    box-shadow: 0 0 0 6px --alpha(var(--color-orange-500) / 50%);
  }
  to {
    box-shadow: 0 0 0 0 transparent;
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
