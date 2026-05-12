<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <p :class="cn('mb-1 px-2.5 text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground', props.class)">
    <slot />
  </p>
</template>
