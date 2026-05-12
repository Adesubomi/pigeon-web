<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <div :class="cn('flex shrink-0 items-center gap-2.5 border-b px-5 py-5 pb-4', props.class)">
    <slot />
  </div>
</template>
