<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { AlertDialogAction } from 'reka-ui'
import { cn } from '@/lib/utils'
import { buttonVariants, type ButtonVariants } from '@/components/ui/button'

const props = withDefaults(defineProps<{
  variant?: ButtonVariants['variant']
  class?: HTMLAttributes['class']
}>(), {
  variant: 'default',
})
</script>

<template>
  <AlertDialogAction :class="cn(buttonVariants({ variant, size: 'sm' }), props.class)">
    <slot />
  </AlertDialogAction>
</template>
