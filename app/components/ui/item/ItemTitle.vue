<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <p :class="cn('truncate text-[13px] font-medium text-foreground', props.class)">
    <slot />
  </p>
</template>
