<template>
  <div class="endpoint-item">
    <div class="status-pill" :class="endpoint.status"></div>

    <div class="flex-1 min-w-0">
      <p class="ep-name" :class="{ muted: endpoint.status === 'inactive' }">{{ endpoint.name }}</p>
      <p class="ep-url">{{ endpoint.url }}</p>
    </div>

    <div class="shrink-0 flex items-center gap-2.5">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  endpoint: {
    name: string
    url: string
    status: 'active' | 'inactive' | 'error'
  }
}>()
</script>

<style scoped>
.endpoint-item {
  background: white;
  border: 0.5px solid #e2e0d8;
  border-radius: 10px;
  padding: 13px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: border-color 0.15s;
}
.endpoint-item:hover { border-color: #b4b2a9; }

.status-pill {
  width: 8px; height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.status-pill.active   { background: #1d9e75; box-shadow: 0 0 0 3px rgba(29,158,117,0.15); }
.status-pill.inactive { background: #b4b2a9; }
.status-pill.error    { background: #e24b4a; box-shadow: 0 0 0 3px rgba(226,75,74,0.12); }

.ep-name {
  font-size: 13px;
  font-weight: 500;
  color: #1a1a2e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ep-name.muted { color: #9e9c96; }

.ep-url {
  font-size: 11px;
  color: #9e9c96;
  font-family: 'IBM Plex Mono', monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
