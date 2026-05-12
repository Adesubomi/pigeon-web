<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <aside :class="cn('flex w-[240px] min-w-[240px] flex-col border-r bg-card text-card-foreground', props.class)">
    <slot />
  </aside>
</template>
