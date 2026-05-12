<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { ProgressIndicator, ProgressRoot } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  modelValue?: number | null
  class?: HTMLAttributes['class']
  indicatorClass?: HTMLAttributes['class']
}>(), {
  modelValue: 0,
})

const progress = computed(() => Math.min(Math.max(props.modelValue ?? 0, 0), 100))
</script>

<template>
  <ProgressRoot :model-value="modelValue ?? 0" :class="cn('relative h-1.5 w-full overflow-hidden rounded-full bg-secondary', props.class)">
    <ProgressIndicator
      :class="cn('h-full w-full flex-1 rounded-full bg-primary transition-all', props.indicatorClass)"
      :style="{ transform: `translateX(-${100 - progress}%)` }"
    />
  </ProgressRoot>
</template>
