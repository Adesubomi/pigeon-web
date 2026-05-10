<template>
  <div class="flex h-full flex-col overflow-hidden">
    <div class="px-5 py-5 border-b border-sand-200 shrink-0 flex items-center justify-between gap-3">
      <p class="text-[13px] font-semibold text-navy">Activity</p>

      <div class="flex items-center gap-2">
        <NuxtLink to="/events" class="text-[10px] text-brand-500 cursor-pointer hover:underline">View all</NuxtLink>
        <Button
          v-if="showClose"
          variant="outline"
          size="icon"
          class="size-7 text-muted-foreground hover:text-foreground"
          aria-label="Close activity panel"
          @click="$emit('close')"
        >
          <PhX class="size-3.5" />
        </Button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto">
      <div class="flex flex-col gap-2 p-4">
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
import type { Event } from '~/domains/event/event.type'


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
