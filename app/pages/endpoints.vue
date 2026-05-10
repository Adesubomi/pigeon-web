<template>
  <div class="flex flex-1 overflow-hidden">

    <!-- Main content area -->
    <div class="flex-1 lg:flex-[2] flex flex-col overflow-hidden">

      <!-- Topbar -->
      <header class="px-5 sm:px-7 pt-6 pb-0 flex items-center gap-3 flex-shrink-0">
        <h1 class="text-[15px] font-semibold text-navy tracking-tight flex-1">Endpoints</h1>

        <!-- Search -->
        <div class="relative hidden w-48 sm:block">
          <PhMagnifyingGlass class="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input class="h-9 bg-background pl-8 text-xs" placeholder="Search endpoints..." />
        </div>

        <!-- New endpoint -->
        <Button class="h-9 bg-primary text-primary-foreground hover:bg-primary/90">
          <PhPlus class="size-3.5 shrink-0" />
          New endpoint
        </Button>
      </header>

      <!-- Scrollable content -->
      <div class="flex-1 overflow-y-auto px-5 sm:px-7 pt-4 pb-7 flex flex-col gap-5">

        <!-- Section header + filters -->
        <div class="flex items-center justify-between gap-3">
          <span class="text-[11px] font-medium text-sand-500 uppercase tracking-[0.06em]">All endpoints</span>
          <div class="flex gap-1.5">
            <Button
              v-for="f in filters"
              :key="f"
              class="h-7 rounded-full px-3 text-[11px]"
              :class="activeFilter === f ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''"
              :variant="activeFilter === f ? 'default' : 'outline'"
              @click="activeFilter = f"
            >{{ f }}</Button>
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
    <Sheet :open="hasPanelRoute && !isDesktopPanel" @update:open="open => { if (!open) navigateTo('/endpoints') }">
      <SheetContent class="flex flex-col overflow-hidden p-0">
        <SheetHeader class="sr-only">
          <SheetTitle>Endpoint details</SheetTitle>
          <SheetDescription>Endpoint route details rendered in a mobile drawer.</SheetDescription>
        </SheetHeader>
        <NuxtPage />
      </SheetContent>
    </Sheet>

  </div>
</template>

<script setup lang="ts">
import {
  PhMagnifyingGlass,
  PhPlus,
} from '@phosphor-icons/vue'
import { useMediaQuery } from '@vueuse/core'

definePageMeta({ layout: 'default' })

const route = useRoute()
const { endpoints } = useEndpoints()

const filters = ['All', 'Active', 'Inactive'] as const
const activeFilter = ref<typeof filters[number]>('All')

const selectedEndpointId = computed(() => typeof route.params.endpoint_id === 'string' ? route.params.endpoint_id : null)
const hasPanelRoute = computed(() => Boolean(selectedEndpointId.value))
const isDesktopPanel = useMediaQuery('(min-width: 1024px)')

const filteredEndpoints = computed(() => {
  if (activeFilter.value === 'Active') return endpoints.value.filter(e => e.status === 'active')
  if (activeFilter.value === 'Inactive') return endpoints.value.filter(e => e.status !== 'active')
  return endpoints.value
})
</script>

<style scoped>
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
</style>
