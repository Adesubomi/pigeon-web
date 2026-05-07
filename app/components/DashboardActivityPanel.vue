<template>
  <div class="flex h-full flex-col overflow-hidden">
    <div class="px-5 py-5 border-b border-sand-200 shrink-0 flex items-center justify-between gap-3">
      <p class="text-[13px] font-semibold text-navy">Activity</p>

      <div class="flex items-center gap-2">
        <span class="text-[10px] text-brand-500 cursor-pointer hover:underline">View all</span>
        <button
          v-if="showClose"
          class="panel-icon-btn"
          aria-label="Close activity panel"
          @click="$emit('close')"
        >
          <PhX class="size-3.5" />
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto">
      <div class="activity-event-list">
        <EventListItem
          v-for="ev in events"
          :key="ev.id ?? ev.path + ev.time"
          :event="ev"
          @open="openEvent"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  PhX,
} from '@phosphor-icons/vue'
import type {Event} from "~/domains/event/event.type";


withDefaults(defineProps<{
  events: Event[]
  showClose?: boolean
}>(), {
  showClose: false,
})

defineEmits<{
  close: []
}>()

function openEvent(event: { id?: string }) {
  if (!event.id) return
  navigateTo(`/dashboard/activity/events/${event.id}`)
}
</script>

<style scoped>
.activity-event-list {
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 14px 20px;
}

.panel-icon-btn {
  width: 26px;
  height: 26px;
  border: 0.5px solid #d3d1c7;
  background: none;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  color: #9e9c96;
  transition: color 0.1s, background 0.1s;
}
.panel-icon-btn:hover {
  color: #1a1a2e;
  background: #f5f4f0;
}

.panel-icon-btn {
  width: 30px;
  height: 30px;
}
</style>
