<template>
  <div class="flex flex-1 overflow-hidden">

    <!-- ── Main content area ── -->
    <div class="flex-1 flex flex-col overflow-hidden">

      <!-- Topbar -->
      <header class="px-7 pt-6 pb-0 flex items-center gap-3 flex-shrink-0">
        <h1 class="text-[15px] font-semibold text-navy tracking-tight flex-1">Dashboard</h1>

        <!-- Date range -->
        <div class="flex items-center gap-1.5 bg-sand-50 border border-sand-200 rounded-lg px-3 py-2">
          <PhCalendarBlank class="size-3.5 shrink-0 text-sand-400" />
          <span class="text-xs text-sand-500">Last 7 days</span>
        </div>

        <!-- Export -->
        <button class="flex items-center gap-1.5 bg-navy text-brand-100 text-xs font-medium px-4 py-2.5 rounded-lg cursor-pointer border-none font-sans hover:opacity-85 transition-opacity">
          <PhDownloadSimple class="size-3.5 shrink-0" />
          Export
        </button>
      </header>

      <!-- Scrollable content -->
      <div class="flex-1 overflow-y-auto px-7 pt-4 pb-7 flex flex-col gap-5">

        <!-- Stats row -->
        <div class="grid grid-cols-4 gap-3">
          <StatCard label="Total events"     value="9,840"  sub="+12% vs last week" subClass="text-success-600" />
          <StatCard label="Delivery rate"    value="98.2%"  sub="63 failed"         dotClass="bg-success-600" />
          <StatCard label="Active endpoints" value="4"      sub="1 error"           dotClass="bg-danger-500" />
          <StatCard label="Avg latency"      value="84ms"   sub="-6ms vs last week" subClass="text-success-600" />
        </div>

        <!-- Endpoints + Devices side by side -->
        <div class="grid grid-cols-2 gap-4">

          <!-- Endpoints column -->
          <div class="flex flex-col gap-2">
            <p class="section-label">Endpoints</p>
            <div class="flex flex-col gap-1.5">
              <EndpointListItem
                v-for="ep in displayedEndpoints"
                :key="ep.id"
                :endpoint="ep"
              />
            </div>
            <NuxtLink v-if="endpoints.length > 5" to="/endpoints" class="view-all-link">
              View all {{ endpoints.length }} endpoints →
            </NuxtLink>
          </div>

          <!-- Devices column -->
          <div class="flex flex-col gap-2">
            <p class="section-label">Devices</p>
            <div class="flex flex-col gap-1">
              <div
                v-for="dev in displayedDevices"
                :key="dev.id"
                class="device-card"
              >
                <!-- Device icon -->
                <div class="device-icon">
                  <component :is="deviceIcons[dev.icon]" class="size-3.5" />
                </div>

                <!-- Name + platform -->
                <div class="flex-1 min-w-0">
                  <p class="text-[12px] font-medium text-navy truncate">{{ dev.name }}</p>
                  <p class="text-[10px] text-sand-500 truncate">{{ dev.platform }}</p>
                </div>

                <!-- Connection state: rounded square -->
                <div class="conn-square" :class="dev.conn"></div>
              </div>
            </div>
            <NuxtLink v-if="devices.length > 5" to="/devices" class="view-all-link">
              View all {{ devices.length }} devices →
            </NuxtLink>
          </div>

        </div>

      </div>
    </div>

    <!-- ── Recent Events panel ── -->
    <aside class="w-100 min-w-100 bg-white border-l border-sand-200 flex flex-col overflow-hidden">

      <!-- Panel header -->
      <div class="px-5 py-5 border-b border-sand-200 shrink-0 flex items-center justify-between">
        <p class="text-[13px] font-semibold text-navy">Recent Events</p>
        <span class="text-[10px] text-brand-500 cursor-pointer hover:underline">View all</span>
      </div>

      <!-- Events list -->
      <div class="flex-1 overflow-y-auto">
        <div
          v-for="ev in recentEvents"
          :key="ev.path + ev.time"
          class="event-item"
        >
          <div class="flex items-center gap-2.5 mb-1.5">
            <span class="method-badge" :class="ev.method.toLowerCase()">{{ ev.method }}</span>
            <span class="text-[12px] font-mono text-sand-800 flex-1 truncate">{{ ev.path }}</span>
            <span class="text-[11px] font-mono font-medium" :class="ev.status < 400 ? 'text-success-600' : 'text-danger-500'">{{ ev.status }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-[10px] text-sand-500 truncate flex-1">{{ ev.endpoint }}</span>
            <span class="text-[10px] text-sand-400">{{ ev.time }}</span>
            <button class="replay-btn" title="Replay">
              <PhArrowsClockwise class="size-[11px]" />
            </button>
          </div>
        </div>
      </div>

    </aside>

  </div>
</template>

<script setup lang="ts">
import {
  PhArrowsClockwise,
  PhBrowser,
  PhCalendarBlank,
  PhDeviceMobile,
  PhDownloadSimple,
  PhHardDrives,
  PhTerminalWindow,
} from '@phosphor-icons/vue'

definePageMeta({ layout: 'default' })

interface Endpoint {
  id: string
  name: string
  url: string
  status: 'active' | 'inactive'
  events: number | null
}

interface Device {
  id: string
  name: string
  platform: string
  icon: 'phone-ios' | 'phone-android' | 'browser' | 'server' | 'terminal'
  conn: 'connected' | 'degraded' | 'disconnected'
}

const deviceIcons = {
  'phone-ios': PhDeviceMobile,
  'phone-android': PhDeviceMobile,
  browser: PhBrowser,
  server: PhHardDrives,
  terminal: PhTerminalWindow,
} as const

const endpoints = ref<Endpoint[]>([
  { id: 'str', name: 'Stripe webhooks',        url: 'https://relay.pigeon.sh/e/str_x9kq2mj4p', status: 'active',   events: 4210 },
  { id: 'gh',  name: 'GitHub CI events',       url: 'https://relay.pigeon.sh/e/gh_8wn3rlv0c',  status: 'active',   events: 1520 },
  { id: 'sh',  name: 'Shopify orders',         url: 'https://relay.pigeon.sh/e/sh_4cv7xmk1z',  status: 'active',   events: 2870 },
  { id: 'rs',  name: 'Resend email events',    url: 'https://relay.pigeon.sh/e/rs_2bf9dkw5m',  status: 'active',   events: 340  },
  { id: 'ln',  name: 'Linear issues (paused)', url: 'https://relay.pigeon.sh/e/ln_7hq6tjy9r',  status: 'inactive', events: null },
])

const devices = ref<Device[]>([
  { id: 'ios', name: 'iOS App',      platform: 'iPhone 15 · iOS 17.4',  icon: 'phone-ios',     conn: 'connected'    },
  { id: 'and', name: 'Android App', platform: 'Pixel 8 · Android 14',   icon: 'phone-android', conn: 'degraded'     },
  { id: 'web', name: 'Web Client',  platform: 'Chrome 122 · macOS',     icon: 'browser',       conn: 'connected'    },
  { id: 'srv', name: 'API Server',  platform: 'Node 20 · Linux (prod)', icon: 'server',        conn: 'disconnected' },
  { id: 'cli', name: 'CLI Tool',    platform: 'macOS 14 · arm64',       icon: 'terminal',      conn: 'degraded'     },
])

const recentEvents = [
  { method: 'POST', path: '/payment.succeeded',    status: 200, endpoint: 'Stripe webhooks',      time: '2m ago'  },
  { method: 'POST', path: '/charge.failed',         status: 500, endpoint: 'Stripe webhooks',      time: '5m ago'  },
  { method: 'POST', path: '/push_event',            status: 200, endpoint: 'GitHub CI events',     time: '8m ago'  },
  { method: 'POST', path: '/invoice.paid',          status: 200, endpoint: 'Stripe webhooks',      time: '12m ago' },
  { method: 'POST', path: '/orders/create',         status: 200, endpoint: 'Shopify orders',       time: '15m ago' },
  { method: 'POST', path: '/subscription.updated',  status: 200, endpoint: 'Stripe webhooks',      time: '18m ago' },
  { method: 'POST', path: '/email.delivered',       status: 502, endpoint: 'Resend email events',  time: '21m ago' },
  { method: 'POST', path: '/check_run.completed',   status: 200, endpoint: 'GitHub CI events',     time: '26m ago' },
  { method: 'GET',  path: '/health',                status: 200, endpoint: 'Stripe webhooks',      time: '30m ago' },
  { method: 'POST', path: '/orders/fulfilled',      status: 200, endpoint: 'Shopify orders',       time: '34m ago' },
]

const displayedEndpoints = computed(() => endpoints.value.slice(0, 5))
const displayedDevices = computed(() => devices.value.slice(0, 5))
</script>

<style scoped>
.section-label {
  font-size: 11px;
  font-weight: 500;
  color: #9e9c96;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.view-all-link {
  display: block;
  margin-top: 4px;
  font-size: 11px;
  color: #534ab7;
  text-decoration: none;
  padding: 8px 14px;
  border: 0.5px dashed #d3d1c7;
  border-radius: 8px;
  text-align: center;
  transition: background 0.1s, border-color 0.1s;
}
.view-all-link:hover { background: #f5f4f0; border-color: #b4b2a9; }

/* ── Device cards ── */
.device-card {
  background: white;
  border: 0.5px solid #e2e0d8;
  border-radius: 8px;
  padding: 9px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: border-color 0.15s;
}
.device-card:hover { border-color: #b4b2a9; }

.device-icon {
  width: 28px; height: 28px;
  background: #f5f4f0;
  border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  color: #888780;
}

.conn-square {
  width: 8px; height: 8px;
  border-radius: 2px;
  flex-shrink: 0;
}
.conn-square.connected    { background: #1d9e75; }
.conn-square.degraded     { background: #e08c2e; }
.conn-square.disconnected { background: #e24b4a; }

/* ── Recent events panel ── */
.event-item {
  padding: 14px 20px;
  border-bottom: 0.5px solid #f0eee8;
  transition: background 0.1s;
}
.event-item:hover { background: #fafaf8; }
.event-item:last-child { border-bottom: none; }

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
  width: 26px; height: 26px;
  border: 0.5px solid #d3d1c7;
  background: none; border-radius: 5px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0; color: #9e9c96;
  transition: color 0.1s, background 0.1s;
}
.replay-btn:hover { color: #1a1a2e; background: #f5f4f0; }
</style>
