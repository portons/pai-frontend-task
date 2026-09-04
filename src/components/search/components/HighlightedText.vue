<template>
  <template v-for="(piece, index) in pieces" :key="index">
    <mark
      v-if="piece.match"
      v-scroll-into-view="piece.match.index === current"
      :data-find-index="piece.match.index"
      :aria-current="piece.match.index === current ? 'true' : undefined"
      class="rounded-sm px-0.5"
      :style="piece.match.index === current ? style.active : style.match"
      >{{ piece.text }}</mark
    >
    <template v-else>{{ piece.text }}</template>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { DEFAULT_FIELD, markStyles } from '../config';
import { segment } from '../lib/match';
import { useFind } from '../composables/useFind';
import { vScrollIntoView } from '../directives/vScrollIntoView';
import type { HighlightedTextProps } from '../types';

const { text, id, field = DEFAULT_FIELD } = defineProps<HighlightedTextProps>();

const { matchesFor, current, config } = useFind();
const style = markStyles(config);
const pieces = computed(() => segment(text, matchesFor(id, field)));
</script>
