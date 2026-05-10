<template>
  <Badge
    variant="outline"
    class="gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-normal"
    :class="error ? 'border-danger-500/25 bg-danger-50 text-danger-500' : 'bg-background text-sand-700'"
  >
    <PhDesktop v-if="count > 0" class="size-2.5 shrink-0" />
    {{ count > 0 ? `${count} device${count > 1 ? 's' : ''}` : 'No device' }}
  </Badge>
</template>

<script setup lang="ts">
import { PhDesktop } from '@phosphor-icons/vue'

defineProps<{
  count: number
  error?: boolean
}>()
</script>
