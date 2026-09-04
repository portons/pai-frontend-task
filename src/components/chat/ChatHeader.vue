<template>
  <header class="flex items-center gap-x-3 border-b border-slate-200 px-5 py-3.5">
    <div
      class="flex size-10 items-center justify-center rounded-xl bg-emerald-600 text-lg font-semibold text-white shadow-sm"
      aria-hidden="true"
      v-text="initialOf(info.name)"
    />
    <div class="flex flex-col gap-y-0.5">
      <div class="text-base leading-tight font-semibold text-slate-900" v-text="info.name" />
      <div class="text-xs text-slate-500" v-text="info.hub" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { initialOf } from '../../lib/initial';

const info = {
  name: 'John Doe',
  hub: 'NYC',
};
</script>
