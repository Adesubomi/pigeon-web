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
    <DialogOverlay class="sheet-overlay fixed inset-0 z-50 bg-black/45" />
    <DialogContent
      :data-side="side"
      :class="cn('sheet-content fixed z-50 bg-background shadow-2xl outline-none', sideClasses[side], props.class)"
    >
      <slot />
    </DialogContent>
  </DialogPortal>
</template>

<style scoped>
.sheet-overlay {
  opacity: 0;
  transition: opacity 180ms ease;
}

.sheet-overlay[data-state="open"] {
  opacity: 1;
}

.sheet-overlay[data-state="closed"] {
  opacity: 0;
}

.sheet-content {
  opacity: 1;
  transition:
    transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 160ms ease;
  will-change: transform;
}

.sheet-content[data-state="open"] {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

.sheet-content[data-state="closed"] {
  opacity: 0.98;
}

.sheet-content[data-side="right"][data-state="closed"] {
  transform: translate3d(100%, 0, 0);
}

.sheet-content[data-side="left"][data-state="closed"] {
  transform: translate3d(-100%, 0, 0);
}

.sheet-content[data-side="top"][data-state="closed"] {
  transform: translate3d(0, -100%, 0);
}

.sheet-content[data-side="bottom"][data-state="closed"] {
  transform: translate3d(0, 100%, 0);
}

@media (prefers-reduced-motion: reduce) {
  .sheet-overlay,
  .sheet-content {
    transition-duration: 1ms;
  }
}
</style>
