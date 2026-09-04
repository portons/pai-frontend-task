<template>
  <div class="bg-zinc-500 w-screen h-screen p-5">
    <div
      class="relative bg-white border border-gray-300 rounded-md p-3 max-w-[1200px] m-auto h-full !font-sans flex flex-col gap-y-2 overflow-hidden"
    >
      <ChatHeader class="flex-shrink-0" />
      <FindBar />
      <div
        role="log"
        aria-label="Conversation"
        class="flex-grow overflow-y-auto bg-stone-100 rounded p-2 space-y-2"
      >
        <template v-for="day in days" :key="day.key">
          <div class="sticky top-0 z-[5] flex justify-center py-1">
            <span
              class="rounded-full bg-white/90 px-3 py-0.5 text-xs text-gray-500 shadow-sm ring-1 ring-black/5 backdrop-blur"
              v-text="day.label"
            />
          </div>
          <ChatMessage v-for="item in day.items" :key="item.id" :item="item" />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatHeader from './components/ChatHeader.vue'
import ChatMessage from './components/ChatMessage.vue'
import { FindBar, provideFind } from './search'
import raw from './assets/msgs.json'
import { formatDateTime, formatDay, parseCreated } from './lib/dates'
import type { Message } from './types'

const items = raw.map(
  (m): Message => ({
    id: m.id,
    incoming: m.incoming,
    from: m.from,
    text: m.text,
    created: parseCreated(m.created),
  }),
)

/** Consecutive messages from the same calendar day, in order. */
const days = items.reduce<{ key: string; label: string; items: Message[] }[]>((groups, item) => {
  const key = item.created.toDateString()
  const last = groups.at(-1)
  if (last?.key === key) last.items.push(item)
  else groups.push({ key, label: formatDay(item.created), items: [item] })
  return groups
}, [])

provideFind(items, {
  fields: { from: (m) => m.from, text: (m) => m.text, created: (m) => formatDateTime(m.created) },
  config: { preview: { title: 'from', subtitle: 'created' } },
})
</script>
