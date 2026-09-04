<template>
  <div class="bg-zinc-500 w-screen h-screen p-5">
    <div
      class="relative bg-white border border-gray-300 rounded-md p-3 max-w-[1200px] m-auto h-full !font-sans flex flex-col gap-y-2 overflow-hidden"
    >
      <ChatHeader class="flex-shrink-0" />
      <FindBar />
      <div class="flex-grow overflow-y-auto bg-stone-100 rounded p-2 space-y-2">
        <ChatMessage v-for="item in items" :key="item.id" :item="item" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatHeader from './components/ChatHeader.vue'
import ChatMessage from './components/ChatMessage.vue'
import { FindBar, provideFind } from './search'
import raw from './assets/msgs.json'
import type { Message } from './types'

const items: Message[] = raw

provideFind(items, {
  fields: { from: (m) => m.from, text: (m) => m.text, created: (m) => m.created },
  config: { preview: { title: 'from', subtitle: 'created' } },
})
</script>
