<template>
  <div class="flex flex-1 overflow-hidden">

    <!-- ── Main content area ── -->
    <div class="flex-1 2xl:flex-[2] flex flex-col overflow-hidden">

      <!-- Topbar -->
      <header class="px-7 pt-6 pb-0 flex items-center gap-3 flex-shrink-0">
        <h1 class="text-[15px] font-semibold text-navy tracking-tight flex-1">Dashboard</h1>

        <!-- Date range -->
        <div class="flex items-center gap-1.5 bg-sand-50 border border-sand-200 rounded-lg px-3 py-2">
          <PhCalendarBlank class="size-3.5 shrink-0 text-sand-400" />
          <span class="text-xs text-sand-500">Last 7 days</span>
        </div>

        <!-- Activity panel toggle -->
        <button
          class="activity-toggle-btn 2xl:hidden"
          :class="{ active: isDashboardPanelOpen }"
          aria-label="Toggle activity panel"
          @click="toggleActivityPanel"
        >
          <PhSidebarSimple class="sidebar-toggle-icon size-3.5 shrink-0" />
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
                :class="{ selected: selectedEndpointId === ep.id }"
                :to="`/dashboard/endpoints/${ep.id}`"
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

    <!-- ── Largest-screen activity panel ── -->
    <aside class="hidden 2xl:flex 2xl:flex-[1] min-w-[320px] bg-white border-l border-sand-200 flex-col overflow-hidden">
      <NuxtPage v-if="hasDetailRoute" />
      <DashboardActivityPanel v-else :events="recentEvents" />
    </aside>

    <!-- ── Activity drawer below largest screens ── -->
    <Teleport to="body">
      <Transition name="drawer">
        <div v-if="isDashboardPanelOpen" class="2xl:hidden fixed inset-0 z-50">
          <button
            class="absolute inset-0 bg-black/45 border-0 cursor-default"
            aria-label="Close dashboard panel"
            @click="closeDashboardPanel"
          />

          <aside class="drawer-panel absolute right-0 top-0 h-full w-full max-w-[420px] bg-white shadow-2xl flex flex-col overflow-hidden">
            <NuxtPage v-if="hasDetailRoute" />
            <DashboardActivityPanel v-else :events="recentEvents" show-close @close="closeDashboardPanel" />
          </aside>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import {
  PhBrowser,
  PhCalendarBlank,
  PhDeviceMobile,
  PhHardDrives,
  PhSidebarSimple,
  PhTerminalWindow,
} from '@phosphor-icons/vue'

definePageMeta({ layout: 'default' })

const route = useRoute()

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

const { endpoints, getEventLog } = useEndpoints()

const devices = ref<Device[]>([
  { id: 'ios', name: 'iOS App',      platform: 'iPhone 15 · iOS 17.4',  icon: 'phone-ios',     conn: 'connected'    },
  { id: 'and', name: 'Android App', platform: 'Pixel 8 · Android 14',   icon: 'phone-android', conn: 'degraded'     },
  { id: 'web', name: 'Web Client',  platform: 'Chrome 122 · macOS',     icon: 'browser',       conn: 'connected'    },
  { id: 'srv', name: 'API Server',  platform: 'Node 20 · Linux (prod)', icon: 'server',        conn: 'disconnected' },
  { id: 'cli', name: 'CLI Tool',    platform: 'macOS 14 · arm64',       icon: 'terminal',      conn: 'degraded'     },
])

const displayedEndpoints = computed(() => endpoints.value.slice(0, 5))
const displayedDevices = computed(() => devices.value.slice(0, 5))
const recentEvents = computed(() => getEventLog(10))
const selectedEndpointId = computed(() => (
  route.path.startsWith('/dashboard/endpoints/') && typeof route.params.endpoint_id === 'string'
    ? route.params.endpoint_id
    : ''
))
const isActivityRoute = computed(() => route.path.startsWith('/dashboard/activity'))
const isEndpointRoute = computed(() => route.path.startsWith('/dashboard/endpoints/'))
const hasDetailRoute = computed(() => route.path.startsWith('/dashboard/activity/events/') || isEndpointRoute.value)
const isDashboardPanelOpen = computed(() => isActivityRoute.value || isEndpointRoute.value)

function toggleActivityPanel() {
  navigateTo(isDashboardPanelOpen.value ? '/dashboard' : '/dashboard/activity')
}

function closeDashboardPanel() {
  navigateTo('/dashboard')
}
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

:deep(.endpoint-item.selected) {
  border-color: #534ab7;
  box-shadow: 0 0 0 1px rgba(83, 74, 183, 0.14);
}

.activity-toggle-btn {
  width: 36px;
  height: 36px;
  border: 0.5px solid #d3d1c7;
  background: white;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #888780;
  flex-shrink: 0;
  transition: background 0.1s, color 0.1s, border-color 0.1s;
}
.activity-toggle-btn:hover {
  background: #f5f4f0;
  color: #1a1a2e;
}
.activity-toggle-btn.active {
  background: #1a1a2e;
  border-color: #1a1a2e;
  color: #e8e4ff;
}
.sidebar-toggle-icon {
  transform: scaleX(-1);
}

@media (min-width: 1536px) {
  .activity-toggle-btn {
    display: none;
  }
}

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

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.16s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.drawer-enter-active .drawer-panel,
.drawer-leave-active .drawer-panel {
  transition: transform 0.18s ease;
}
.drawer-enter-from .drawer-panel,
.drawer-leave-to .drawer-panel {
  transform: translateX(100%);
}
</style>
