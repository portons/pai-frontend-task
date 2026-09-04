<template>
  <div class="h-screen w-screen bg-slate-200 p-4 antialiased sm:p-6">
    <div
      class="relative mx-auto flex h-full max-w-[1200px] flex-col overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-900/10"
    >
      <ChatHeader />
      <FindBar />
      <div
        role="log"
        aria-label="Conversation"
        class="flex-grow space-y-4 overflow-y-auto bg-slate-50 px-4 py-3"
      >
        <!-- One section per day: a sticky header is scoped to its parent, so
             the next day's header pushes the previous one out instead of stacking. -->
        <section v-for="day in days" :key="day.key" :aria-label="day.label" class="space-y-3">
          <div class="sticky top-0 z-[5] flex justify-center py-1">
            <span
              class="rounded-full bg-white px-3 py-1 text-[11px] font-medium tracking-wide text-slate-500 uppercase shadow-sm ring-1 ring-slate-200"
              v-text="day.label"
            />
          </div>
          <ChatMessage v-for="item in day.items" :key="item.id" :item="item" />
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatHeader from './components/chat/ChatHeader.vue'
import ChatMessage from './components/chat/ChatMessage.vue'
import { FindBar, provideFind } from './components/search'
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
