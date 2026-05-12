<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <div :class="cn('flex flex-col items-center justify-center gap-2 p-10 text-center text-muted-foreground', props.class)">
    <slot />
  </div>
</template>
