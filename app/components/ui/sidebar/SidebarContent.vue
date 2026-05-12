<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <nav :class="cn('flex-1 overflow-y-auto px-3 py-3.5', props.class)">
    <slot />
  </nav>
</template>
