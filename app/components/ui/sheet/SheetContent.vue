<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { DialogContent, DialogOverlay, DialogPortal } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  side?: 'top' | 'right' | 'bottom' | 'left'
  class?: HTMLAttributes['class']
}>(), {
  side: 'right',
})

const sideClasses = {
  top: 'inset-x-0 top-0 border-b',
  right: 'inset-y-0 right-0 h-full w-full max-w-[420px] border-l',
  bottom: 'inset-x-0 bottom-0 border-t',
  left: 'inset-y-0 left-0 h-full w-full max-w-[420px] border-r',
}
</script>

<template>
  <DialogPortal>
    <DialogOverlay class="fixed inset-0 z-50 bg-black/45 data-[state=open]:animate-in data-[state=closed]:animate-out" />
    <DialogContent
      :class="cn('fixed z-50 bg-background shadow-2xl outline-none transition ease-in-out data-[state=open]:duration-200 data-[state=closed]:duration-150', sideClasses[side], props.class)"
    >
      <slot />
    </DialogContent>
  </DialogPortal>
</template>
