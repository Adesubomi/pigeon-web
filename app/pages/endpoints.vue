<template>
  <div class="flex flex-1 overflow-hidden">

    <!-- Main content area -->
    <div class="flex-1 lg:flex-[2] flex flex-col overflow-hidden">

      <!-- Topbar -->
      <header class="px-5 sm:px-7 pt-6 pb-0 flex items-center gap-3 flex-shrink-0">
        <h1 class="text-[15px] font-semibold text-navy tracking-tight flex-1">Endpoints</h1>

        <!-- Search -->
        <div class="hidden sm:flex items-center gap-1.5 bg-sand-50 border border-sand-200 rounded-lg px-3 py-2 w-48">
          <PhMagnifyingGlass class="size-3.5 shrink-0 text-sand-400" />
          <span class="text-xs text-sand-500">Search endpoints...</span>
        </div>

        <!-- New endpoint -->
        <button class="flex items-center gap-1.5 bg-navy text-brand-100 text-xs font-medium px-4 py-2.5 rounded-lg cursor-pointer border-none font-sans hover:opacity-85 transition-opacity">
          <PhPlus class="size-3.5 shrink-0" />
          New endpoint
        </button>
      </header>

      <!-- Scrollable content -->
      <div class="flex-1 overflow-y-auto px-5 sm:px-7 pt-4 pb-7 flex flex-col gap-5">

        <!-- Section header + filters -->
        <div class="flex items-center justify-between gap-3">
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
            show-device-count
            show-playback-control
            show-delete-control
            :class="{ selected: selectedEndpointId === ep.id }"
            @open="navigateTo(`/endpoints/${ep.id}`)"
          />
        </div>

      </div>
    </div>

    <!-- Desktop detail space -->
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

    <!-- Tablet/mobile drawer detail panel -->
    <Teleport to="body">
      <Transition name="drawer">
        <div v-if="hasPanelRoute" class="lg:hidden fixed inset-0 z-50">
          <button
            class="absolute inset-0 bg-black/45 border-0 cursor-default"
            aria-label="Close endpoint panel"
            @click="navigateTo('/endpoints')"
          />

          <aside class="drawer-panel absolute right-0 top-0 h-full w-full max-w-[420px] bg-white shadow-2xl flex flex-col overflow-hidden">
            <NuxtPage />
          </aside>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import {
  PhMagnifyingGlass,
  PhPlus,
} from '@phosphor-icons/vue'

definePageMeta({ layout: 'default' })

const route = useRoute()
const { endpoints } = useEndpoints()

const filters = ['All', 'Active', 'Inactive'] as const
const activeFilter = ref<typeof filters[number]>('All')

const selectedEndpointId = computed(() => typeof route.params.endpoint_id === 'string' ? route.params.endpoint_id : null)
const hasPanelRoute = computed(() => Boolean(selectedEndpointId.value))

const filteredEndpoints = computed(() => {
  if (activeFilter.value === 'Active') return endpoints.value.filter(e => e.status === 'active')
  if (activeFilter.value === 'Inactive') return endpoints.value.filter(e => e.status !== 'active')
  return endpoints.value
})
</script>

<style scoped>
.filter-chip {
  border: 0.5px solid #d3d1c7;
  background: white;
  border-radius: 20px;
  padding: 5px 13px;
  font-size: 11px;
  color: #5f5e5a;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.1s;
}
.filter-chip:hover { background: #f5f4f0; }
.filter-chip.active { background: #1a1a2e; color: #e8e4ff; border-color: transparent; }

:deep(.endpoint-item.selected) {
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
