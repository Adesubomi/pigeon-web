<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { TooltipContent, TooltipPortal } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  class?: HTMLAttributes['class']
}>(), {
  side: 'top',
  align: 'center',
  sideOffset: 4,
})
</script>

<template>
  <TooltipPortal>
    <TooltipContent
      :side="side"
      :align="align"
      :side-offset="sideOffset"
      :class="cn('z-50 overflow-hidden rounded-md bg-primary px-2.5 py-1.5 text-[11px] text-primary-foreground shadow-md', props.class)"
    >
      <slot />
    </TooltipContent>
  </TooltipPortal>
</template>
