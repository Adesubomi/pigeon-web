<template>
  <div class="flex flex-1 overflow-hidden">
    <div class="flex-1 lg:flex-[2] flex flex-col overflow-hidden">
      <header class="px-5 sm:px-7 pt-6 pb-0 flex items-center gap-3 flex-shrink-0">
        <h1 class="text-[15px] font-semibold text-navy tracking-tight flex-1">Event Log</h1>

        <div class="flex items-center gap-1.5 bg-sand-50 border border-sand-200 rounded-lg px-3 py-2">
          <PhCalendarBlank class="size-3.5 shrink-0 text-sand-400" />
          <span class="text-xs text-sand-500">Last 7 days</span>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto px-5 sm:px-7 pt-4 pb-7 flex flex-col gap-5">
        <div class="flex items-center justify-between gap-3">
          <span class="text-[11px] font-medium text-sand-500 uppercase tracking-[0.06em]">Recent events</span>
          <span class="text-[11px] text-sand-500">{{ events.length }} total</span>
        </div>

        <div class="event-log-list">
          <EventListItem
            v-for="ev in events"
            :key="ev.id"
            :event="ev"
            :class="{ selected: selectedEventId === ev.id }"
            @open="navigateTo(`/events/${ev.id}`)"
          />
        </div>
      </div>
    </div>

    <aside class="hidden lg:flex lg:flex-[1] min-w-[320px] overflow-hidden">
      <Transition name="panel">
        <div
          v-if="hasPanelRoute"
          class="panel-shell bg-white border-l border-sand-200 flex flex-1 flex-col overflow-hidden"
        >
          <NuxtPage />
        </div>
      </Transition>
    </aside>

    <Sheet :open="hasPanelRoute && !isDesktopPanel" @update:open="open => { if (!open) navigateTo('/events') }">
      <SheetContent class="flex flex-col overflow-hidden p-0">
        <SheetHeader class="sr-only">
          <SheetTitle>Event details</SheetTitle>
          <SheetDescription>Event route details rendered in a mobile drawer.</SheetDescription>
        </SheetHeader>
        <NuxtPage />
      </SheetContent>
    </Sheet>
  </div>
</template>

<script setup lang="ts">
import {
  PhCalendarBlank,
} from '@phosphor-icons/vue'
import { useMediaQuery } from '@vueuse/core'

definePageMeta({ layout: 'default' })

const route = useRoute()
const { getEventLog } = useEndpoints()

const events = computed(() => getEventLog())
const selectedEventId = computed(() => typeof route.params.event_id === 'string' ? route.params.event_id : '')
const hasPanelRoute = computed(() => route.path.startsWith('/events/') && Boolean(selectedEventId.value))
const isDesktopPanel = useMediaQuery('(min-width: 1024px)')
</script>

<style scoped>
.event-log-list {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

:deep(.event-list-item.selected) {
  border-color: #534ab7;
  box-shadow: 0 0 0 1px rgba(83, 74, 183, 0.14);
}

.panel-enter-active,
.panel-leave-active {
  transition: opacity 0.16s ease, transform 0.18s ease;
}
.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.panel-shell {
  min-width: 0;
}
</style>
