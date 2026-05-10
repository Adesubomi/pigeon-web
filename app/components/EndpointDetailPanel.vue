<template>
  <section class="flex h-full flex-col overflow-hidden">
    <template v-if="endpoint">
      <header class="shrink-0 border-b border-border px-5 py-5">
        <div class="mb-1.5 flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="truncate text-[13px] font-semibold text-foreground">{{ endpoint.name }}</p>
            <p class="break-all font-mono text-[11px] leading-relaxed text-muted-foreground">{{ endpoint.url }}</p>
          </div>

          <Button
            variant="outline"
            size="icon"
            class="size-8 shrink-0 text-muted-foreground hover:text-foreground"
            aria-label="Close endpoint details"
            @click="navigateTo(closePath)"
          >
            <PhX class="size-3.5" />
          </Button>
        </div>

        <div class="flex items-center justify-between gap-3">
          <Button variant="link" size="sm" class="h-auto px-0 py-0 text-[11px] text-brand-500">
            <PhCopy class="size-[11px] shrink-0" />
            Copy URL
          </Button>

          <Badge variant="outline" class="rounded-full" :class="statusBadgeClasses[endpoint.status]">
            <span
              class="mr-1 inline-block size-1.5 rounded-full"
              :class="endpoint.status === 'active' ? 'bg-success-600' : endpoint.status === 'error' ? 'bg-danger-500' : 'bg-sand-400'"
            />
            {{ endpoint.status === 'active' ? 'Active' : endpoint.status === 'error' ? 'Error' : 'Paused' }}
          </Badge>
        </div>
      </header>

      <div class="shrink-0 px-5 pt-4">
        <Tabs :model-value="activeTab" class="items-start" @update:model-value="value => setTab(value as 'events' | 'clients')">
          <TabsList>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div class="flex-1 overflow-y-auto">
        <div v-if="activeTab === 'events'" class="px-5 py-4">
          <div class="mb-2.5 flex items-center justify-between">
            <p class="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Recent events</p>
            <span class="text-[10px] text-muted-foreground">{{ events.length }} total</span>
          </div>

          <div class="flex flex-col gap-2">
            <EventListItem
              v-for="ev in events"
              :key="ev.id"
              :event="ev"
              @open="navigateTo(eventDetailPath(ev.id))"
            />
          </div>
        </div>

        <div v-else class="px-5 py-4">
          <p class="mb-2.5 text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Connected clients</p>

          <Card class="mb-1.5 flex items-center gap-2.5 bg-background p-2.5">
            <div class="flex size-7 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <PhDesktop class="size-3.5" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-xs font-medium text-foreground">MacBook Pro (Ade)</p>
              <p class="font-mono text-[10px] text-muted-foreground">localhost:3000</p>
            </div>
            <div class="relative h-3.5 w-6 shrink-0 rounded-full bg-success-600 after:absolute after:right-0.5 after:top-0.5 after:size-2.5 after:rounded-full after:bg-white" />
          </Card>

          <Card class="mb-1.5 flex items-center gap-2.5 bg-background p-2.5">
            <div class="flex size-7 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <PhDesktop class="size-3.5" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-xs font-medium text-foreground">Mac mini (office)</p>
              <p class="font-mono text-[10px] text-muted-foreground">localhost:8080</p>
            </div>
            <div class="relative h-3.5 w-6 shrink-0 rounded-full bg-sand-300 after:absolute after:left-0.5 after:top-0.5 after:size-2.5 after:rounded-full after:bg-white" />
          </Card>

          <Button variant="outline" size="sm" class="mt-2 w-full border-dashed text-brand-500">
            <PhPlus class="size-3 shrink-0" />
            Connect client
          </Button>
        </div>
      </div>
    </template>

    <div v-else class="flex flex-1 flex-col items-center justify-center gap-2 p-10 text-center text-muted-foreground">
      <p class="text-xs">Endpoint not found</p>
      <Button variant="link" size="sm" class="h-auto px-0 py-0 text-[11px] text-brand-500" @click="navigateTo(closePath)">
        Back to endpoints
      </Button>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  PhCopy,
  PhDesktop,
  PhPlus,
  PhX,
} from '@phosphor-icons/vue'

const route = useRoute()
const router = useRouter()
const { getEndpoint, getEvents } = useEndpoints()

const endpointId = computed(() => typeof route.params.endpoint_id === 'string' ? route.params.endpoint_id : '')
const endpoint = computed(() => getEndpoint(endpointId.value))
const events = computed(() => getEvents(endpointId.value))
const activeTab = computed(() => route.query.tab === 'clients' ? 'clients' : 'events')
const isDashboardRoute = computed(() => route.path.startsWith('/dashboard'))
const closePath = computed(() => isDashboardRoute.value ? '/dashboard' : '/endpoints')
const statusBadgeClasses = {
  active: 'border-success-800/20 text-success-800',
  error: 'border-danger-500/25 text-danger-800',
  inactive: 'border-border text-muted-foreground',
} satisfies Record<'active' | 'inactive' | 'error', string>

function setTab(tab: 'events' | 'clients') {
  router.replace({
    path: route.path,
    query: tab === 'events' ? {} : { tab },
  })
}

function eventDetailPath(eventId?: string) {
  if (!eventId) return route.path

  return isDashboardRoute.value
    ? `/dashboard/endpoints/${endpointId.value}/events/${eventId}`
    : `/endpoints/${endpointId.value}/events/${eventId}`
}
</script>
