<template>
  <div
    class="event-list-item"
    role="button"
    tabindex="0"
    @click="$emit('open', event)"
    @keydown.enter="$emit('open', event)"
    @keydown.space.prevent="$emit('open', event)"
  >
    <span class="method-badge" :class="event.method.toLowerCase()">{{ event.method }}</span>

    <span class="event-path">{{ event.path }}</span>

    <div class="event-meta">
      <span>{{ event.time }}</span>
      <span>{{ event.size }}</span>
    </div>

    <PhCaretRight class="size-3 text-sand-400 shrink-0" />
  </div>
</template>

<script setup lang="ts">
import { PhCaretRight } from '@phosphor-icons/vue'

interface EventListEvent {
  id?: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'
  path: string
  time: string
  size: string
}

defineProps<{
  event: EventListEvent
}>()

defineEmits<{
  open: [event: EventListEvent]
}>()
</script>

<style scoped>
.event-list-item {
  width: 100%;
  background: white;
  border: 0.5px solid #e2e0d8;
  border-radius: 10px;
  padding: 11px 13px;
  display: flex;
  align-items: center;
  gap: 9px;
  cursor: pointer;
  transition: border-color 0.15s;
}
.event-list-item:hover,
.event-list-item:focus-visible {
  border-color: #b4b2a9;
}
.event-list-item:focus-visible {
  outline: 2px solid rgba(83, 74, 183, 0.18);
  outline-offset: 2px;
}
.event-list-item:hover .event-path,
.event-list-item:focus-visible .event-path {
  color: #534ab7;
}

.method-badge {
  font-size: 9px;
  font-weight: 600;
  font-family: 'IBM Plex Mono', monospace;
  padding: 1px 4px;
  border-radius: 4px;
  min-width: 32px;
  text-align: center;
  flex-shrink: 0;
}
.method-badge.get { background: #163126; color: #9ae6b4; }
.method-badge.post { background: #3b3323; color: #ffe47a; }
.method-badge.put { background: #1c2c49; color: #9fbfff; }
.method-badge.patch { background: #2d2244; color: #d8b4fe; }
.method-badge.delete { background: #3a241f; color: #ffad9f; }
.method-badge.head { background: #163126; color: #9ae6b4; }
.method-badge.options { background: #3c2035; color: #ff8bd1; }

.event-path {
  flex: 1;
  min-width: 0;
  font-size: 11px;
  color: #5f5e5a;
  font-family: 'IBM Plex Mono', monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.1s;
}

.event-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #9e9c96;
  font-size: 10px;
  flex-shrink: 0;
}
.event-meta span:last-child { color: #b4b2a9; }
</style>
