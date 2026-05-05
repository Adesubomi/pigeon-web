<template>
  <div class="flex flex-1 overflow-hidden">

    <!-- ── Main content area ── -->
    <div class="flex-1 flex flex-col overflow-hidden">

      <!-- Topbar -->
      <header class="px-7 pt-6 pb-0 flex items-center gap-3 flex-shrink-0">
        <h1 class="text-[15px] font-semibold text-navy tracking-tight flex-1">Endpoints</h1>

        <!-- Search -->
        <div class="flex items-center gap-1.5 bg-sand-50 border border-sand-200 rounded-lg px-3 py-1.5 w-48">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" class="flex-shrink-0 text-sand-400">
            <circle cx="5" cy="5" r="3.5" stroke="currentColor" stroke-width="1.2"/>
            <path d="M8 8l2.5 2.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
          <span class="text-xs text-sand-500">Search endpoints…</span>
        </div>

        <!-- New endpoint -->
        <button class="flex items-center gap-1.5 bg-navy text-brand-100 text-xs font-medium px-3.5 py-2 rounded-lg cursor-pointer border-none font-sans hover:opacity-85 transition-opacity">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 2v8M2 6h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          New endpoint
        </button>
      </header>

      <!-- Scrollable content -->
      <div class="flex-1 overflow-y-auto px-7 pt-4 pb-7 flex flex-col gap-5">

        <!-- Section header + filters -->
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-medium text-sand-500 uppercase tracking-[0.06em]">All endpoints</span>
          <div class="flex gap-1.5">
            <button
              v-for="f in filters"
              :key="f"
              class="filter-chip"
              :class="{ active: activeFilter === f }"
              @click="activeFilter = f"
            >{{ f }}</button>
          </div>
        </div>

        <!-- Endpoints list -->
        <div class="flex flex-col gap-1.5">
          <EndpointListItem
            v-for="ep in filteredEndpoints"
            :key="ep.id"
            :endpoint="ep"
            @click="selectedId = ep.id"
          >
            <DeviceBadge :count="ep.devices" :error="ep.status === 'error'" />

            <span
              class="text-xs font-mono"
              :class="ep.status === 'inactive' ? 'text-sand-400' : 'text-sand-800'"
            >{{ ep.eventsToday != null ? ep.eventsToday.toLocaleString() : '—' }}</span>

            <div class="ep-actions">
              <button class="icon-btn" :title="ep.status === 'inactive' ? 'Resume' : 'Pause'">
                <svg v-if="ep.status === 'inactive'" width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M3 2l5 3-5 3V2z" fill="currentColor"/>
                </svg>
                <svg v-else width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <rect x="2" y="1.5" width="2.5" height="7" rx="0.8" fill="currentColor"/>
                  <rect x="5.5" y="1.5" width="2.5" height="7" rx="0.8" fill="currentColor"/>
                </svg>
              </button>
              <button class="icon-btn" title="Delete">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 3h6M3.5 3V2h3v1M4 5v3M6 5v3M2.5 3l.5 5h4l.5-5" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </EndpointListItem>
        </div>

      </div>
    </div>

    <!-- ── Detail panel ── -->
    <aside class="w-[308px] min-w-[308px] bg-white border-l border-sand-200 flex flex-col overflow-hidden">

      <template v-if="selected">
        <!-- Panel header -->
        <div class="px-5 py-5 border-b border-sand-200 flex-shrink-0">
          <div class="flex items-center justify-between mb-1.5">
            <p class="text-[13px] font-semibold text-navy">{{ selected.name }}</p>
            <span class="status-badge" :class="selected.status">
              <span class="w-1.5 h-1.5 rounded-full mr-1 inline-block"
                :class="selected.status === 'active' ? 'bg-success-600' : selected.status === 'error' ? 'bg-danger-500' : 'bg-sand-400'">
              </span>
              {{ selected.status === 'active' ? 'Active' : selected.status === 'error' ? 'Error' : 'Paused' }}
            </span>
          </div>
          <p class="text-[11px] text-sand-500 font-mono break-all leading-relaxed">{{ selected.url }}</p>
          <button class="mt-1.5 flex items-center gap-1 text-[11px] text-brand-500 cursor-pointer bg-transparent border-none p-0 font-sans hover:underline">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <rect x="1" y="3" width="7" height="7" rx="1.5" stroke="#534ab7" stroke-width="1.1"/>
              <path d="M3 3V2a1 1 0 011-1h5a1 1 0 011 1v5a1 1 0 01-1 1H8" stroke="#534ab7" stroke-width="1.1"/>
            </svg>
            Copy URL
          </button>
        </div>

        <!-- Scrollable panel content -->
        <div class="flex-1 overflow-y-auto">

          <!-- Connected devices -->
          <div class="panel-section">
            <p class="panel-section-title">Connected devices</p>

            <div class="device-row">
              <div class="device-icon">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="2" width="12" height="8" rx="1.5" stroke="#534ab7" stroke-width="1.2"/>
                  <path d="M4 10v2M10 10v2M3 12h8" stroke="#534ab7" stroke-width="1.2" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-medium text-navy">MacBook Pro (Ade)</p>
                <p class="text-[10px] text-sand-500 font-mono">→ localhost:3000</p>
              </div>
              <div class="toggle on"></div>
            </div>

            <div class="device-row">
              <div class="device-icon">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="2" width="12" height="8" rx="1.5" stroke="#534ab7" stroke-width="1.2"/>
                  <path d="M4 10v2M10 10v2M3 12h8" stroke="#534ab7" stroke-width="1.2" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-medium text-navy">Mac mini (office)</p>
                <p class="text-[10px] text-sand-500 font-mono">→ localhost:8080</p>
              </div>
              <div class="toggle off"></div>
            </div>

            <button class="connect-btn">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M5 2v6M2 5h6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
              </svg>
              Connect device
            </button>
          </div>

          <!-- Local forwarding -->
          <div class="panel-section">
            <p class="panel-section-title">Local forwarding</p>
            <div class="flex items-center justify-between py-1.5">
              <span class="text-xs text-sand-700">MacBook Pro</span>
              <span class="text-[11px] font-mono text-brand-500">localhost:3000/webhooks</span>
            </div>
            <div class="flex items-center justify-between py-1.5">
              <span class="text-xs text-sand-700">Mac mini</span>
              <span class="text-[11px] font-mono text-sand-500">paused</span>
            </div>
          </div>

          <!-- Recent events -->
          <div class="panel-section border-b-0">
            <div class="flex items-center justify-between mb-2.5">
              <p class="panel-section-title" style="margin-bottom:0">Recent events</p>
              <span class="text-[10px] text-brand-500 cursor-pointer hover:underline">View all</span>
            </div>

            <div v-for="ev in recentEvents" :key="ev.path" class="event-row">
              <span class="method-badge" :class="ev.method.toLowerCase()">{{ ev.method }}</span>
              <span class="text-[11px] font-mono text-sand-800 flex-1 truncate">{{ ev.path }}</span>
              <span class="text-[10px]" :class="ev.status < 400 ? 'text-success-600' : 'text-danger-500'">{{ ev.status }}</span>
              <span class="text-[10px] text-sand-500 flex-shrink-0">{{ ev.time }}</span>
              <button class="replay-btn" title="Replay">
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path d="M1.5 4.5A3 3 0 107 3M7 1v2H5" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

        </div>
      </template>

      <!-- Empty state -->
      <div v-else class="flex-1 flex flex-col items-center justify-center gap-2 text-sand-500 p-10 text-center">
        <div class="w-10 h-10 bg-sand-50 rounded-[10px] flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="1" y="1" width="7" height="7" rx="2" stroke="currentColor" stroke-width="1.3"/>
            <rect x="10" y="1" width="7" height="7" rx="2" stroke="currentColor" stroke-width="1.3"/>
            <rect x="1" y="10" width="7" height="7" rx="2" stroke="currentColor" stroke-width="1.3"/>
            <rect x="10" y="10" width="7" height="7" rx="2" stroke="currentColor" stroke-width="1.3"/>
          </svg>
        </div>
        <p class="text-xs">Select an endpoint to view details</p>
      </div>

    </aside>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

interface Endpoint {
  id: string
  name: string
  url: string
  status: 'active' | 'inactive' | 'error'
  devices: number
  eventsToday: number | null
}

const endpoints = ref<Endpoint[]>([
  { id: 'str', name: 'Stripe webhooks',      url: 'https://relay.pigeon.sh/e/str_x9kq2mj4p', status: 'active',   devices: 2, eventsToday: 842 },
  { id: 'gh',  name: 'GitHub CI events',     url: 'https://relay.pigeon.sh/e/gh_8wn3rlv0c',  status: 'active',   devices: 1, eventsToday: 217 },
  { id: 'sh',  name: 'Shopify orders',       url: 'https://relay.pigeon.sh/e/sh_4cv7xmk1z',  status: 'active',   devices: 1, eventsToday: 189 },
  { id: 'rs',  name: 'Resend email events',  url: 'https://relay.pigeon.sh/e/rs_2bf9dkw5m',  status: 'error',    devices: 0, eventsToday: 36  },
  { id: 'ln',  name: 'Linear issues (paused)', url: 'https://relay.pigeon.sh/e/ln_7hq6tjy9r', status: 'inactive', devices: 1, eventsToday: null },
])

const recentEvents = [
  { method: 'POST', path: '/payment.succeeded',   status: 200, time: '2m ago'  },
  { method: 'POST', path: '/charge.failed',        status: 500, time: '5m ago'  },
  { method: 'POST', path: '/invoice.paid',         status: 200, time: '12m ago' },
  { method: 'POST', path: '/subscription.updated', status: 200, time: '18m ago' },
  { method: 'GET',  path: '/health',              status: 200, time: '24m ago' },
]

const filters = ['All', 'Active', 'Inactive'] as const
const activeFilter = ref<typeof filters[number]>('All')
const selectedId = ref<string>('str')

const filteredEndpoints = computed(() => {
  if (activeFilter.value === 'Active')   return endpoints.value.filter(e => e.status === 'active')
  if (activeFilter.value === 'Inactive') return endpoints.value.filter(e => e.status !== 'active')
  return endpoints.value
})

const selected = computed(() => endpoints.value.find(e => e.id === selectedId.value) ?? null)
</script>

<style scoped>
/* Filter chips */
.filter-chip {
  border: 0.5px solid #d3d1c7;
  background: white;
  border-radius: 20px;
  padding: 4px 11px;
  font-size: 11px;
  color: #5f5e5a;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.1s;
}
.filter-chip:hover { background: #f5f4f0; }
.filter-chip.active { background: #1a1a2e; color: #e8e4ff; border-color: transparent; }


.ep-actions { display: flex; gap: 3px; opacity: 0; transition: opacity 0.15s; }
:deep(.endpoint-item:hover) .ep-actions { opacity: 1; }

.icon-btn {
  width: 30px; height: 30px;
  border: 0.5px solid #d3d1c7;
  background: white;
  border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #888780;
  transition: background 0.1s, color 0.1s;
}
.icon-btn:hover { background: #f5f4f0; color: #1a1a2e; }

/* Panel */
.panel-section {
  padding: 16px 20px;
  border-bottom: 0.5px solid #e2e0d8;
}
.panel-section-title {
  font-size: 10px; font-weight: 500;
  color: #9e9c96;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.status-badge {
  display: inline-flex; align-items: center;
  border-radius: 20px;
  padding: 3px 9px;
  font-size: 11px;
  font-weight: 500;
}
.status-badge.active   { background: #eaf3de; color: #3b6d11; border: 0.5px solid rgba(61,109,17,0.2); }
.status-badge.error    { background: #fcebeb; color: #a32d2d; border: 0.5px solid rgba(226,75,74,0.25); }
.status-badge.inactive { background: #f5f4f0; color: #9e9c96; border: 0.5px solid #e2e0d8; }

.device-row {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 10px;
  background: #f5f4f0;
  border-radius: 8px;
  margin-bottom: 5px;
}
.device-icon {
  width: 26px; height: 26px;
  background: #ede9ff;
  border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.toggle {
  width: 28px; height: 16px;
  border-radius: 8px;
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s;
}
.toggle.on  { background: #1d9e75; }
.toggle.off { background: #d3d1c7; }
.toggle::after {
  content: '';
  position: absolute;
  width: 12px; height: 12px;
  background: white;
  border-radius: 50%;
  top: 2px;
  transition: left 0.15s, right 0.15s;
}
.toggle.on::after  { right: 2px; left: auto; }
.toggle.off::after { left: 2px; right: auto; }

.connect-btn {
  width: 100%;
  display: flex; align-items: center; justify-content: center; gap: 5px;
  margin-top: 8px;
  background: none;
  border: 0.5px dashed #d3d1c7;
  border-radius: 8px;
  padding: 7px;
  font-size: 11px;
  color: #9e9c96;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.1s;
}
.connect-btn:hover { background: #f5f4f0; }

.event-row {
  display: flex; align-items: center; gap: 9px;
  padding: 7px 0;
  border-bottom: 0.5px solid #f0eee8;
}
.event-row:last-child { border-bottom: none; }

.method-badge {
  font-size: 10px; font-weight: 500;
  font-family: 'IBM Plex Mono', monospace;
  padding: 2px 6px; border-radius: 4px;
  min-width: 36px; text-align: center; flex-shrink: 0;
}
.method-badge.post { background: #eaf3de; color: #3b6d11; }
.method-badge.get  { background: #e6f1fb; color: #185fa5; }
.method-badge.put  { background: #faeeda; color: #854f0b; }

.replay-btn {
  width: 22px; height: 22px;
  border: 0.5px solid #d3d1c7;
  background: none; border-radius: 5px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0; color: #9e9c96;
  transition: color 0.1s, background 0.1s;
}
.replay-btn:hover { color: #1a1a2e; background: #f5f4f0; }
</style>
