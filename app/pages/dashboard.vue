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
        <Button
          variant="outline"
          size="icon"
          class="size-9 shrink-0 text-muted-foreground 2xl:hidden"
          :class="{ 'border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground': isDashboardPanelOpen }"
          aria-label="Toggle activity panel"
          @click="toggleActivityPanel"
        >
          <PhSidebarSimple class="sidebar-toggle-icon size-3.5 shrink-0" />
        </Button>
      </header>

      <!-- Scrollable content -->
      <div class="flex-1 overflow-y-auto px-7 pt-4 pb-7 flex flex-col gap-5">

        <!-- Stats row -->
        <div class="grid grid-cols-4 gap-3">
          <StatCard label="Total events"     value="9,840"  sub="+12% vs last week" subClass="text-success-600" />
          <StatCard label="Delivery rate"    value="98.2%"  sub="63 failed"         dotClass="bg-success-600" />
          <StatCard label="Active endpoints" value="3"      sub="2 inactive"        dotClass="bg-success-600" />
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
                class="group"
              >
                <Item class="px-3 py-2.5 transition-colors group-hover:border-sand-400">
                <ItemMedia class="size-7 rounded-md bg-background text-muted-foreground">
                  <component :is="deviceIcons[dev.icon]" class="size-3.5" />
                </ItemMedia>

                <ItemContent>
                  <ItemTitle class="text-[12px]">{{ dev.name }}</ItemTitle>
                  <ItemDescription class="text-[10px]">{{ dev.platform }}</ItemDescription>
                </ItemContent>

                <ItemActions>
                  <span class="size-2 rounded-sm" :class="connectionClasses[dev.conn]" />
                </ItemActions>
                </Item>
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
    <Sheet :open="isDashboardPanelOpen && !isDesktopPanel" @update:open="open => { if (!open) closeDashboardPanel() }">
      <SheetContent class="flex flex-col overflow-hidden p-0">
        <SheetHeader class="sr-only">
          <SheetTitle>Dashboard activity</SheetTitle>
          <SheetDescription>Dashboard activity and detail routes rendered in a mobile drawer.</SheetDescription>
        </SheetHeader>
        <NuxtPage v-if="hasDetailRoute" />
        <DashboardActivityPanel v-else :events="recentEvents" show-close @close="closeDashboardPanel" />
      </SheetContent>
    </Sheet>

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
import { useMediaQuery } from '@vueuse/core'

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
const isDesktopPanel = useMediaQuery('(min-width: 1536px)')
const connectionClasses = {
  connected: 'bg-success-600',
  degraded: 'bg-[#e08c2e]',
  disconnected: 'bg-danger-500',
} satisfies Record<Device['conn'], string>

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

.sidebar-toggle-icon {
  transform: scaleX(-1);
}

</style>
