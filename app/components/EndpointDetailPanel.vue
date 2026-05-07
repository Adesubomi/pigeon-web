<template>
  <section class="flex h-full flex-col overflow-hidden">
    <template v-if="endpoint">
      <header class="px-5 py-5 border-b border-sand-200 flex-shrink-0">
        <div class="flex items-start justify-between gap-3 mb-1.5">
          <div class="min-w-0">
            <p class="text-[13px] font-semibold text-navy truncate">{{ endpoint.name }}</p>
            <p class="text-[11px] text-sand-500 font-mono break-all leading-relaxed">{{ endpoint.url }}</p>
          </div>

          <button class="panel-icon-btn" aria-label="Close endpoint details" @click="navigateTo(closePath)">
            <PhX class="size-3.5" />
          </button>
        </div>

        <div class="flex items-center justify-between gap-3">
          <button class="copy-link-btn">
            <PhCopy class="size-[11px] shrink-0" />
            Copy URL
          </button>

          <span class="status-badge" :class="endpoint.status">
            <span
              class="w-1.5 h-1.5 rounded-full mr-1 inline-block"
              :class="endpoint.status === 'active' ? 'bg-success-600' : endpoint.status === 'error' ? 'bg-danger-500' : 'bg-sand-400'"
            />
            {{ endpoint.status === 'active' ? 'Active' : endpoint.status === 'error' ? 'Error' : 'Paused' }}
          </span>
        </div>
      </header>

      <div class="px-5 pt-4 flex-shrink-0">
        <div class="tab-list">
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'events' }"
            @click="setTab('events')"
          >
            Events
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'clients' }"
            @click="setTab('clients')"
          >
            Clients
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto">
        <div v-if="activeTab === 'events'" class="panel-section border-b-0">
          <div class="flex items-center justify-between mb-2.5">
            <p class="panel-section-title" style="margin-bottom: 0">Recent events</p>
            <span class="text-[10px] text-sand-500">{{ events.length }} total</span>
          </div>

          <div class="event-list">
            <EventListItem
              v-for="ev in events"
              :key="ev.id"
              :event="ev"
              @open="navigateTo(eventDetailPath(ev.id))"
            />
          </div>
        </div>

        <div v-else class="panel-section border-b-0">
          <p class="panel-section-title">Connected clients</p>

          <div class="device-row">
            <div class="device-icon">
              <PhDesktop class="size-3.5" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-medium text-navy">MacBook Pro (Ade)</p>
              <p class="text-[10px] text-sand-500 font-mono">localhost:3000</p>
            </div>
            <div class="toggle on" />
          </div>

          <div class="device-row">
            <div class="device-icon">
              <PhDesktop class="size-3.5" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-medium text-navy">Mac mini (office)</p>
              <p class="text-[10px] text-sand-500 font-mono">localhost:8080</p>
            </div>
            <div class="toggle off" />
          </div>

          <button class="connect-btn">
            <PhPlus class="size-3 shrink-0" />
            Connect client
          </button>
        </div>
      </div>
    </template>

    <div v-else class="flex-1 flex flex-col items-center justify-center gap-2 text-sand-500 p-10 text-center">
      <p class="text-xs">Endpoint not found</p>
      <button class="copy-link-btn" @click="navigateTo(closePath)">Back to endpoints</button>
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

<style scoped>
.panel-icon-btn {
  width: 30px;
  height: 30px;
  border: 0.5px solid #d3d1c7;
  background: white;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #888780;
  flex-shrink: 0;
  transition: background 0.1s, color 0.1s;
}
.panel-icon-btn:hover { color: #1a1a2e; }

.copy-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #534ab7;
  cursor: pointer;
  background: transparent;
  border: 0;
  padding: 0;
  font-size: 11px;
  font-family: inherit;
}
.copy-link-btn:hover { text-decoration: underline; }

.status-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 20px;
  padding: 3px 9px;
  font-size: 11px;
  font-weight: 500;
  flex-shrink: 0;
}
.status-badge.active { color: #3b6d11; border: 0.5px solid rgba(61, 109, 17, 0.2); }
.status-badge.error { color: #a32d2d; border: 0.5px solid rgba(226, 75, 74, 0.25); }
.status-badge.inactive { color: #9e9c96; border: 0.5px solid #e2e0d8; }

.tab-list {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 3px;
  border: 0.5px solid #e2e0d8;
  background: #f5f4f0;
  border-radius: 10px;
}
.tab-btn {
  border: 0;
  background: transparent;
  border-radius: 7px;
  padding: 5px 13px;
  color: #5f5e5a;
  cursor: pointer;
  font-size: 11px;
  font-family: inherit;
  font-weight: 500;
  transition: background 0.1s, color 0.1s;
}
.tab-btn:hover { background: white; }
.tab-btn.active {
  background: white;
  color: #1a1a2e;
  box-shadow: 0 1px 2px rgba(26, 26, 46, 0.08);
}

.panel-section {
  padding: 16px 20px;
  border-bottom: 0.5px solid #e2e0d8;
}
.panel-section-title {
  font-size: 10px;
  font-weight: 500;
  color: #9e9c96;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.event-list {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.device-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: #f5f4f0;
  border-radius: 8px;
  margin-bottom: 5px;
}
.device-icon {
  width: 26px;
  height: 26px;
  background: #ede9ff;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #534ab7;
  flex-shrink: 0;
}
.toggle {
  width: 24px;
  height: 14px;
  border-radius: 20px;
  position: relative;
  flex-shrink: 0;
}
.toggle::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: white;
  top: 2px;
  transition: transform 0.15s;
}
.toggle.on { background: #1d9e75; }
.toggle.on::after { left: 12px; }
.toggle.off { background: #d3d1c7; }
.toggle.off::after { left: 2px; }

.connect-btn {
  width: 100%;
  margin-top: 6px;
  border: 0.5px dashed #d3d1c7;
  background: transparent;
  border-radius: 8px;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  color: #534ab7;
  cursor: pointer;
  font-size: 11px;
  font-family: inherit;
}
.connect-btn:hover { background: #f5f4f0; }
</style>
