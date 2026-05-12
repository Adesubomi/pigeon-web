<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { AvatarFallback } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<{
  delayMs?: number
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <AvatarFallback
    :delay-ms="delayMs"
    :class="cn('flex size-full items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground', props.class)"
  >
    <slot />
  </AvatarFallback>
</template>
