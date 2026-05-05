<template>
  <div class="device-badge" :class="error ? 'text-danger-500 bg-danger-50 border-danger-500/25' : ''">
    <svg v-if="count > 0" width="10" height="10" viewBox="0 0 10 10" fill="none" class="shrink-0">
      <rect x="1" y="2" width="8" height="6" rx="1" stroke="currentColor" stroke-width="1"/>
      <path d="M3 8h4" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
    </svg>
    {{ count > 0 ? `${count} device${count > 1 ? 's' : ''}` : 'No device' }}
  </div>
</template>

<script setup lang="ts">
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
