<template>
  <Transition
    enter-active-class="transition duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none"
    enter-from-class="-translate-y-2 scale-95 opacity-0"
    leave-active-class="transition duration-150 ease-in motion-reduce:transition-none"
    leave-to-class="-translate-y-2 scale-95 opacity-0"
  >
    <div
      v-if="isOpen"
      role="search"
      class="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-xl bg-white/85 px-2 py-1.5 shadow-lg ring-1 ring-black/10 backdrop-blur-md"
      :class="{ 'find-shake': shaking }"
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
        placeholder="Find in conversation"
        aria-label="Find in conversation"
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
</template>

<script setup>
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'
import { useFind } from './useFind'
import { useFindHotkeys } from './useFindHotkeys'

const { query, isOpen, total, current, open, close, next, prev } = useFind()

const input = useTemplateRef('input')
const shaking = ref(false)

const announcement = computed(() =>
  !query.value ? '' : total.value ? `${current.value + 1} of ${total.value}` : 'No results',
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
.find-shake {
  animation: find-shake 300ms ease-in-out;
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
  .find-shake {
    animation: none;
  }
}
</style>
