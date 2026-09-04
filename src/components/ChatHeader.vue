<template>
  <header class="pb-3 border-b border-b-gray-300 w-full flex items-center">
    <div class="flex gap-x-2 flex-grow">
      <div
        class="w-10 h-10 bg-green-600 rounded flex items-center justify-center text-2xl text-white"
        v-text="info.initial"
      />
      <div class="flex flex-col justify-center gap-y-1">
        <div class="font-medium text-gray-900 leading-none text-xl" v-text="info.name" />
        <div class="text-gray-500 text-xs leading-none" v-text="info.hub" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const info = {
  name: 'John Doe',
  initial: 'J',
  hub: 'NYC',
}
</script>
