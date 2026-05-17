<template>
  <div class="flex h-screen min-h-0 overflow-hidden bg-sand-50 font-sans text-foreground">
    <main class="flex min-w-0 flex-1 flex-col overflow-hidden bg-background lg:flex-[0_1_680px]">
      <header class="shrink-0 border-b border-border bg-background px-5 pb-4 pt-6 sm:px-7 sm:pt-7">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h1 class="truncate text-[15px] font-semibold text-navy">{{ endpoint?.name ?? 'Preview unavailable' }}</h1>
            <p class="mt-1 break-all font-mono text-[11px] leading-relaxed text-muted-foreground">
              {{ endpoint ? endpointPreviewUrl : 'This preview link does not match an available endpoint.' }}
            </p>
          </div>

          <div v-if="endpoint" class="flex shrink-0 items-center gap-2 rounded-full border bg-card px-3 py-1.5">
            <span class="size-2 rounded-full" :class="connectionStateClass" />
            <span class="text-[11px] font-medium" :class="endpointConnected ? 'text-success-800' : 'text-muted-foreground'">
              {{ endpointConnected ? 'Connected' : 'Disconnected' }}
            </span>
          </div>
        </div>
      </header>

      <div v-if="!endpoint" class="flex flex-1 items-center justify-center overflow-hidden px-5 py-5 sm:px-7">
        <Empty class="min-h-[280px]">
          <EmptyTitle>Preview unavailable</EmptyTitle>
          <EmptyDescription>This endpoint preview link is no longer available.</EmptyDescription>
        </Empty>
      </div>

      <template v-else>
        <div class="shrink-0 bg-background px-5 pt-4 sm:px-7">
          <div class="flex items-center justify-between gap-3">
            <p class="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Incoming events</p>
            <span class="text-[10px] text-muted-foreground">{{ events.length }} total</span>
          </div>
        </div>

        <ScrollArea class="flex-1 bg-background px-5 py-3 sm:px-7">
          <div class="flex flex-col gap-2">
            <EventListItem
              v-for="ev in events"
              :key="ev.id"
              :event="ev"
              class="inspect-event-item"
              :class="{ selected: selectedEventId === ev.id }"
              @open="openEvent(ev)"
            />
          </div>

          <Empty v-if="events.length === 0" class="min-h-[280px]">
            <EmptyTitle>No events yet</EmptyTitle>
            <EmptyDescription>Incoming endpoint events will appear here.</EmptyDescription>
          </Empty>
        </ScrollArea>
      </template>
    </main>

    <aside v-if="endpoint" class="hidden min-w-[360px] flex-1 overflow-hidden border-l border-border bg-white lg:flex">
      <div class="h-full w-full max-w-[520px]">
        <InspectEventDetails :endpoint="endpoint" :event="selectedEvent" />
      </div>
    </aside>

    <Sheet :open="Boolean(selectedEventId && selectedEvent) && !isDesktopPanel" @update:open="open => { if (!open) closeEventDetails() }">
      <SheetContent class="flex flex-col overflow-hidden bg-white p-0">
        <SheetHeader class="sr-only">
          <SheetTitle>Event details</SheetTitle>
          <SheetDescription>Details for the selected endpoint event.</SheetDescription>
        </SheetHeader>
        <InspectEventDetails :endpoint="endpoint" :event="selectedEvent" show-close @close="closeEventDetails" />
      </SheetContent>
    </Sheet>
  </div>
</template>

<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import type { EndpointEvent } from '@/composables/useEndpoints'

const route = useRoute()
const { getEndpoint, getEvents } = useEndpoints()
const isDesktopPanel = useMediaQuery('(min-width: 1024px)')

const endpointId = computed(() => typeof route.params.endpoint_id === 'string' ? route.params.endpoint_id : '')
const selectedEventId = computed(() => typeof route.params.event_id === 'string' ? route.params.event_id : '')
const endpoint = computed(() => endpointId.value ? getEndpoint(endpointId.value) : null)
const { getEndpointPreviewUrl } = useEndpointPreviewUrl()
const endpointPreviewUrl = computed(() => endpointId.value ? getEndpointPreviewUrl(endpointId.value) : '')
const events = computed(() => endpointId.value ? getEvents(endpointId.value) : [])
const selectedEvent = computed(() => selectedEventId.value ? events.value.find(event => event.id === selectedEventId.value) ?? null : null)
const endpointConnected = computed(() => endpoint.value?.status === 'active' && (endpoint.value.devices ?? 0) > 0)
const connectionStateClass = computed(() => endpointConnected.value ? 'bg-success-600 shadow-[0_0_0_3px_rgba(29,158,117,0.14)]' : 'bg-sand-400')

function openEvent(event: EndpointEvent) {
  navigateTo(`/e/inspect/${endpointId.value}/events/${event.id}`)
}

function closeEventDetails() {
  navigateTo(`/e/inspect/${endpointId.value}`)
}
</script>

<style scoped>
:deep(.inspect-event-item.selected) {
  border-color: #534ab7;
  box-shadow: 0 0 0 1px rgba(83, 74, 183, 0.14);
}
</style>
