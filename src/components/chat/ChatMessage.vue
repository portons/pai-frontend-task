<template>
  <article class="flex items-end gap-x-2" :class="{ 'flex-row-reverse': !item.incoming }">
    <div
      class="flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white shadow-sm ring-2 ring-white"
      :class="item.incoming ? 'bg-emerald-500' : 'bg-indigo-500'"
      aria-hidden="true"
      v-text="initialOf(item.from)"
    />
    <div
      class="flex max-w-[75%] flex-col gap-y-0.5 rounded-2xl px-4 py-2.5 text-sm shadow-sm"
      :class="
        item.incoming
          ? 'rounded-bl-md bg-white text-slate-800 ring-1 ring-slate-200'
          : 'rounded-br-md bg-indigo-600 text-white'
      "
    >
      <span
        class="text-[13px] font-semibold"
        :class="item.incoming ? 'self-start text-slate-600' : 'self-end text-indigo-100'"
      >
        <HighlightedText :text="item.from" :id="item.id" field="from" />
      </span>
      <p class="leading-relaxed break-words whitespace-break-spaces">
        <HighlightedText :text="item.text" :id="item.id" />
      </p>
      <time
        class="pt-1 text-[11px]"
        :class="item.incoming ? 'self-end text-slate-400' : 'self-start text-indigo-200'"
        :datetime="item.created.toISOString()"
      >
        <HighlightedText :text="formatDateTime(item.created)" :id="item.id" field="created" />
      </time>
    </div>
  </article>
</template>

<script setup lang="ts">
import { formatDateTime } from '../../lib/dates';
import { initialOf } from '../../lib/initial';
import { HighlightedText } from '../search';
import type { Message } from '../../types';

defineProps<{ item: Message }>();
</script>
