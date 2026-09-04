<template>
  <div class="flex gap-x-2" :class="{ 'flex-row-reverse': !item.incoming }">
    <div
      class="w-9 h-9 rounded-full flex items-center justify-center text-lg text-white flex-shrink-0"
      :class="{
        'bg-green-600': item.incoming,
        'bg-blue-600': !item.incoming,
      }"
      v-text="item.initials"
    />
    <div
      :class="[
        {
          'rounded-e-xl rounded-es-xl bg-neutral-300': item.incoming,
          'rounded-s-xl rounded-ee-xl bg-indigo-100': !item.incoming,
        },
      ]"
      class="!shadow-none relative flex flex-col leading-1.5 p-4 border-gray-200 space-y-1 shadow-sm shadow-gray-300"
    >
      <div
        class="flex items-center justify-between -mt-3"
        :class="{ 'flex-row-reverse': !item.incoming }"
      >
        <span
          :class="{ 'pr-4': item.incoming, 'pl-4': !item.incoming }"
          class="text-sm font-bold text-text"
        >
          <HighlightedText :text="item.from" :id="item.id" field="from" />
        </span>
      </div>
      <p
        class="BaseMessage-content text-sm font-normal whitespace-break-spaces text-text break-words !break-all"
      >
        <HighlightedText :text="item.text" :id="item.id" />
      </p>

      <div
        :class="{ 'justify-end': item.incoming }"
        class="flex items-center space-x-1 !-mb-3 pt-2"
      >
        <span class="text-xs font-normal text-gray-500" :class="{ 'text-end': item.incoming }">
          <HighlightedText :text="item.created" :id="item.id" field="created" />
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { HighlightedText } from '../search'

defineProps(['item'])
</script>
