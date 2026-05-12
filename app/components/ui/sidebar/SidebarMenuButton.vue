<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  to?: string
  class?: HTMLAttributes['class']
}>()

const classes = computed(() => cn(
  'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] text-sand-700 no-underline transition-colors hover:bg-muted [&.active]:bg-accent [&.active]:text-accent-foreground [&.active]:shadow-[inset_3px_0_0_var(--accent-foreground)]',
  props.class,
))
</script>

<template>
  <NuxtLink v-if="to" :to="to" :class="classes" active-class="active">
    <slot />
  </NuxtLink>
  <div v-else :class="classes">
    <slot />
  </div>
</template>
