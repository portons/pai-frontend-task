<template>
  <article class="flex gap-x-2" :class="{ 'flex-row-reverse': !item.incoming }">
    <div
      class="w-9 h-9 rounded-full flex items-center justify-center text-lg text-white flex-shrink-0"
      :class="item.incoming ? 'bg-green-600' : 'bg-blue-600'"
      aria-hidden="true"
      v-text="initialOf(item.from)"
    />
    <div
      class="flex flex-col gap-y-1 px-4 py-1 text-sm"
      :class="
        item.incoming
          ? 'rounded-e-xl rounded-es-xl bg-neutral-300'
          : 'rounded-s-xl rounded-ee-xl bg-indigo-100'
      "
    >
      <span class="font-bold" :class="item.incoming ? 'self-start' : 'self-end'">
        <HighlightedText :text="item.from" :id="item.id" field="from" />
      </span>
      <p class="whitespace-break-spaces break-words">
        <HighlightedText :text="item.text" :id="item.id" />
      </p>
      <time
        class="text-xs text-gray-500 pt-1"
        :class="item.incoming ? 'self-end' : 'self-start'"
        :datetime="item.created.toISOString()"
      >
        <HighlightedText :text="formatDateTime(item.created)" :id="item.id" field="created" />
      </time>
    </div>
  </article>
</template>

<script setup lang="ts">
import { formatDateTime } from '../../lib/dates'
import { initialOf } from '../../lib/initial'
import { HighlightedText } from '../search'
import type { Message } from '../../types'

defineProps<{ item: Message }>()
</script>
