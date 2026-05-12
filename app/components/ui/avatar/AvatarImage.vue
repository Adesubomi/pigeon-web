<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { AvatarImage } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<{
  src?: string
  alt?: string
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <AvatarImage :src="src" :alt="alt" :class="cn('aspect-square size-full', props.class)" />
</template>
