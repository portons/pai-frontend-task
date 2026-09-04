<template>
  <Transition name="find-bar">
    <div
      v-if="isOpen"
      role="search"
      class="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-xl bg-white/85 px-2 py-1.5 shadow-lg ring-1 ring-black/10 backdrop-blur-md"
      :class="{ 'find-shake': shaking }"
      :style="vars"
      @animationend="shaking = false"
    >
      <svg class="size-4 shrink-0 text-gray-400" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="9" cy="9" r="5.5" stroke="currentColor" stroke-width="1.8" />
        <path
          d="m13.5 13.5 3.5 3.5"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
        />
      </svg>

      <input
        ref="input"
        v-model="query"
        type="text"
        :placeholder="config.text.placeholder"
        :aria-label="config.text.placeholder"
        class="w-48 bg-transparent px-1 text-sm text-gray-900 outline-none placeholder:text-gray-400"
        @keydown.enter.exact.prevent="jump(next)"
        @keydown.shift.enter.prevent="jump(prev)"
      />

      <span
        class="min-w-10 text-right text-xs tabular-nums transition-colors"
        :class="query && !total ? 'text-red-500' : 'text-gray-500'"
        v-text="query ? `${current + 1}/${total}` : ''"
      />
      <span class="sr-only" aria-live="polite" v-text="announcement" />

      <span class="mx-1 h-5 w-px bg-gray-200" />

      <button
        v-for="button in buttons"
        :key="button.label"
        type="button"
        :aria-label="button.label"
        :title="`${button.label} (${button.hint})`"
        :disabled="button.needsResults && !total"
        class="rounded-md p-1 text-gray-600 transition hover:bg-gray-100 active:scale-90 disabled:pointer-events-none disabled:opacity-30 motion-reduce:transition-none"
        @click="button.run"
      >
        <svg class="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            :d="button.icon"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </Transition>
  <FindTicks />
</template>

<script setup>
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'
import FindTicks from './FindTicks.vue'
import { useFind } from './useFind'
import { useFindHotkeys } from './useFindHotkeys'

const { query, isOpen, total, current, open, close, next, prev, config } = useFind()

const vars = {
  '--find-bar-enter-ms': `${config.motion.barEnterMs}ms`,
  '--find-bar-leave-ms': `${config.motion.barLeaveMs}ms`,
  '--find-shake-ms': `${config.motion.shakeMs}ms`,
}

const input = useTemplateRef('input')
const shaking = ref(false)

const announcement = computed(() =>
  !query.value
    ? ''
    : total.value
      ? `${current.value + 1} of ${total.value}`
      : config.text.noResults,
)

/** Step through matches, or shake when there is nothing to step to. */
function jump(step) {
  if (!isOpen.value) return
  if (total.value) step()
  else shaking.value = true
}

const buttons = [
  {
    label: 'Previous match',
    hint: 'Shift+Enter',
    icon: 'm5 12 5-5 5 5',
    run: () => jump(prev),
    needsResults: true,
  },
  {
    label: 'Next match',
    hint: 'Enter',
    icon: 'm5 8 5 5 5-5',
    run: () => jump(next),
    needsResults: true,
  },
  { label: 'Close', hint: 'Esc', icon: 'm6 6 8 8M14 6l-8 8', run: close },
]

async function focusInput() {
  await nextTick()
  input.value?.focus()
  input.value?.select()
}

// Focus moves into the bar on open and back to where it was on close.
let previouslyFocused = null
watch(isOpen, (opened) => {
  if (opened) {
    previouslyFocused = document.activeElement
    focusInput()
  } else if (previouslyFocused?.isConnected) {
    previouslyFocused.focus()
  }
})

useFindHotkeys({
  onFind: () => (isOpen.value ? focusInput() : open()),
  onClose: close,
  onNext: () => jump(next),
  onPrev: () => jump(prev),
})
</script>

<style scoped>
.find-bar-enter-active {
  transition:
    opacity var(--find-bar-enter-ms) cubic-bezier(0.34, 1.56, 0.64, 1),
    translate var(--find-bar-enter-ms) cubic-bezier(0.34, 1.56, 0.64, 1),
    scale var(--find-bar-enter-ms) cubic-bezier(0.34, 1.56, 0.64, 1);
}
.find-bar-leave-active {
  transition:
    opacity var(--find-bar-leave-ms) ease-in,
    translate var(--find-bar-leave-ms) ease-in,
    scale var(--find-bar-leave-ms) ease-in;
}
.find-bar-enter-from,
.find-bar-leave-to {
  opacity: 0;
  translate: 0 -8px;
  scale: 0.95;
}

.find-shake {
  animation: find-shake var(--find-shake-ms) ease-in-out;
}
@keyframes find-shake {
  25% {
    translate: -4px 0;
  }
  75% {
    translate: 4px 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .find-bar-enter-active,
  .find-bar-leave-active,
  .find-shake {
    transition: none;
    animation: none;
  }
}
</style>
