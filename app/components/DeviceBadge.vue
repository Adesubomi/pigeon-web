<template>
  <div class="device-badge" :class="error ? 'text-danger-500 bg-danger-50 border-danger-500/25' : ''">
    <PhDesktop v-if="count > 0" class="size-2.5 shrink-0" />
    {{ count > 0 ? `${count} device${count > 1 ? 's' : ''}` : 'No device' }}
  </div>
</template>

<script setup lang="ts">
import { PhDesktop } from '@phosphor-icons/vue'

defineProps<{
  count: number
  error?: boolean
}>()
</script>

<style scoped>
.device-badge {
  display: flex; align-items: center; gap: 5px;
  background: #f5f4f0;
  border: 0.5px solid #e2e0d8;
  border-radius: 20px;
  padding: 3px 9px;
  font-size: 11px;
  color: #5f5e5a;
}
</style>
