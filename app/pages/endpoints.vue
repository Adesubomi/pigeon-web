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
        <Button class="h-9 bg-primary text-primary-foreground hover:bg-primary/90" @click="openCreateEndpointDialog">
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
            :playback-pending="isEndpointActionPending(endpointActionKey(ep.id, 'activation'))"
            :delete-pending="isEndpointDeleteActionPending(ep.id)"
            :delete-loading="isEndpointActionPending(endpointActionKey(ep.id, 'delete-init'))"
            :open-url="getEndpointInspectUrl(ep.id)"
            :class="{ selected: selectedEndpointId === ep.id }"
            @open="navigateTo(`/endpoints/${ep.id}`)"
            @toggle-playback="toggleEndpointPlayback(ep)"
            @delete="openDeleteEndpointDialog"
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

    <DialogRoot :open="createDialogOpen" @update:open="handleCreateDialogOpenChange">
      <DialogPortal>
        <DialogOverlay class="fixed inset-0 z-50 bg-black/45 data-[state=open]:animate-in data-[state=closed]:animate-out" />
        <DialogContent class="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-background p-5 shadow-lg outline-none">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <DialogTitle class="text-sm font-semibold text-foreground">Add endpoint</DialogTitle>
              <DialogDescription class="mt-1 text-xs leading-relaxed text-muted-foreground">
                Create a relay URL for a new webhook destination.
              </DialogDescription>
            </div>
            <DialogClose as-child>
              <Button variant="ghost" size="icon" class="size-8 shrink-0" aria-label="Close">
                <PhX class="size-3.5" />
              </Button>
            </DialogClose>
          </div>

          <form class="mt-5 space-y-4" @submit.prevent="submitCreateEndpoint">
            <div class="space-y-1.5">
              <Label for="new-endpoint-name">Name</Label>
              <Input
                id="new-endpoint-name"
                :value="endpointName"
                autocomplete="off"
                placeholder="Stripe webhooks"
                :aria-invalid="showEndpointNameError"
                @input="updateEndpointName"
                @blur="endpointNameTouched = true"
              />
              <p v-if="showEndpointNameError" class="text-[11px] text-danger-800">Enter an endpoint name.</p>
            </div>

            <div class="space-y-1.5">
              <div class="flex items-center justify-between gap-3">
                <Label for="new-endpoint-subdomain">Subdomain</Label>
                <Badge class="rounded-full border-0 bg-brand-100 px-2 py-0.5 text-[10px] text-brand-600" variant="secondary">
                  {{ subdomainModeLabel }}
                </Badge>
              </div>
              <div class="flex min-w-0 overflow-hidden rounded-md border border-input bg-background shadow-xs focus-within:ring-2 focus-within:ring-ring">
                <Input
                  id="new-endpoint-subdomain"
                  :value="endpointSubdomain"
                  class="h-9 min-w-0 rounded-none border-0 font-mono shadow-none focus-visible:ring-0"
                  autocomplete="off"
                  placeholder="payments"
                  :disabled="!canConfigureSubdomain"
                  :aria-invalid="showEndpointSubdomainError"
                  @input="updateEndpointSubdomain"
                  @blur="endpointSubdomainTouched = true"
                />
                <div class="flex shrink-0 items-center border-l border-input bg-sand-50 px-3 font-mono text-[11px] text-muted-foreground">
                  .pigeon.sh
                </div>
              </div>
              <p v-if="showEndpointSubdomainError" class="text-[11px] text-danger-800">{{ endpointSubdomainError }}</p>
              <p v-else class="truncate font-mono text-[11px] text-muted-foreground">{{ endpointPreviewUrl }}</p>
            </div>

            <div class="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
              <DialogClose as-child>
                <Button variant="outline" size="sm">Cancel</Button>
              </DialogClose>
              <Button size="sm" type="submit" :disabled="!canCreateEndpoint || endpointCreatePending">
                <PhPlus class="size-3.5 shrink-0" />
                {{ endpointCreatePending ? 'Creating...' : 'Create endpoint' }}
              </Button>
            </div>
          </form>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>

    <AlertDialog :open="deleteDialogOpen" @update:open="handleDeleteDialogOpenChange">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete endpoint</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently deletes
            <span class="font-medium text-foreground">{{ endpointPendingDeletion?.name }}</span>
            and its event history.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div class="mt-4 space-y-3">
          <div class="rounded-md border border-danger-500/20 bg-danger-500/5 px-3 py-2">
            <p class="text-xs leading-relaxed text-muted-foreground">
              Type
              <span class="font-mono font-semibold text-foreground">{{ deleteConfirmationWord }}</span>
              to confirm this action.
            </p>
          </div>

          <div class="space-y-1.5">
            <Label for="delete-endpoint-confirmation">Confirmation word</Label>
            <Input
              id="delete-endpoint-confirmation"
              :value="deleteConfirmationValue"
              autocomplete="off"
              :placeholder="deleteConfirmationWord"
              @input="updateDeleteConfirmationValue"
              @keydown.enter.prevent="confirmDeleteEndpoint"
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            size="sm"
            :disabled="!canConfirmDeleteEndpoint || endpointDeletePending"
            @click="confirmDeleteEndpoint"
          >
            Delete endpoint
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

  </div>
</template>

<script setup lang="ts">
import {
  PhMagnifyingGlass,
  PhPlus,
  PhX,
} from '@phosphor-icons/vue'
import { useMediaQuery } from '@vueuse/core'
import { DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'reka-ui'
import type { Endpoint } from '@/composables/useEndpoints'
import { endpointActionKey, endpointCreateActionKey } from '@/composables/useEndpointActions'

definePageMeta({ layout: 'default' })

const route = useRoute()
const { endpoints } = useEndpoints()
const {
  createEndpoint,
  initEndpointDeletion,
  isEndpointActionPending,
  removeEndpoint,
  toggleEndpointActivation,
} = useEndpointActions()

const filters = ['All', 'Active', 'Inactive'] as const
const activeFilter = ref<typeof filters[number]>('All')
const endpointPendingDeletion = ref<Endpoint | null>(null)
const createDialogOpen = ref(false)
const endpointName = ref('')
const endpointSubdomain = ref('')
const generatedEndpointSubdomain = ref('')
const endpointNameTouched = ref(false)
const endpointSubdomainTouched = ref(false)
const endpointSubdomainEdited = ref(false)
const deleteDialogOpen = ref(false)
const deleteConfirmationWord = ref('')
const deleteConfirmationValue = ref('')
const { activePlan } = useWorkspacePlan()

const selectedEndpointId = computed(() => typeof route.params.endpoint_id === 'string' ? route.params.endpoint_id : null)
const hasPanelRoute = computed(() => Boolean(selectedEndpointId.value))
const isDesktopPanel = useMediaQuery('(min-width: 1024px)')
const canConfigureSubdomain = computed(() => activePlan.value !== 'Solo')
const subdomainModeLabel = computed(() => canConfigureSubdomain.value ? 'Configurable' : 'Auto-generated')
const endpointCreatePending = computed(() => isEndpointActionPending(endpointCreateActionKey()))
const canConfirmDeleteEndpoint = computed(() => deleteConfirmationValue.value.trim() === deleteConfirmationWord.value)
const endpointDeletePending = computed(() => {
  if (!endpointPendingDeletion.value) return false
  return isEndpointActionPending(endpointActionKey(endpointPendingDeletion.value.id, 'delete'))
})

const filteredEndpoints = computed(() => {
  if (activeFilter.value === 'Active') return endpoints.value.filter(e => e.status === 'active')
  if (activeFilter.value === 'Inactive') return endpoints.value.filter(e => e.status !== 'active')
  return endpoints.value
})
const normalizedEndpointName = computed(() => endpointName.value.trim())
const normalizedEndpointSubdomain = computed(() => normalizeSubdomain(endpointSubdomain.value))
const effectiveEndpointSubdomain = computed(() => canConfigureSubdomain.value ? normalizedEndpointSubdomain.value : generatedEndpointSubdomain.value)
const { getEndpointPreviewUrl } = useEndpointPreviewUrl()
const endpointSubdomainError = computed(() => {
  if (!effectiveEndpointSubdomain.value) return 'Subdomain is required.'
  if (!isValidSubdomain(effectiveEndpointSubdomain.value)) return 'Use a token like ln_7hq6tjy9r.'
  if (isSubdomainTaken(effectiveEndpointSubdomain.value)) return 'This subdomain is already in use.'
  return ''
})
const showEndpointNameError = computed(() => endpointNameTouched.value && !normalizedEndpointName.value)
const showEndpointSubdomainError = computed(() => endpointSubdomainTouched.value && Boolean(endpointSubdomainError.value))
const canCreateEndpoint = computed(() => Boolean(normalizedEndpointName.value && !endpointSubdomainError.value))
const endpointPreviewUrl = computed(() => {
  const endpointId = createEndpointIdPreview(effectiveEndpointSubdomain.value) || 'endpoint_id'
  return getEndpointPreviewUrl(endpointId)
})

watch([generatedEndpointSubdomain, canConfigureSubdomain], ([generatedSubdomain, canConfigure]) => {
  if (!canConfigure || !endpointSubdomainEdited.value) {
    endpointSubdomain.value = generatedSubdomain
  }
})

async function toggleEndpointPlayback(endpoint: Pick<Endpoint, 'id' | 'name' | 'status'>) {
  try {
    await toggleEndpointActivation(endpoint)
  } catch {
    // The action runner owns user-facing error handling.
  }
}

function isEndpointDeleteActionPending(endpointId: string) {
  return isEndpointActionPending(endpointActionKey(endpointId, 'delete-init'))
    || isEndpointActionPending(endpointActionKey(endpointId, 'delete'))
}

function getEndpointInspectUrl(endpointId: string) {
  return `/e/inspect/${endpointId}`
}

function openCreateEndpointDialog() {
  resetCreateEndpointForm()
  createDialogOpen.value = true
}

function handleCreateDialogOpenChange(open: boolean) {
  createDialogOpen.value = open

  if (!open) {
    resetCreateEndpointForm()
  }
}

function resetCreateEndpointForm() {
  endpointName.value = ''
  generatedEndpointSubdomain.value = createUniqueRandomSubdomain(endpoints.value)
  endpointSubdomain.value = generatedEndpointSubdomain.value
  endpointNameTouched.value = false
  endpointSubdomainTouched.value = false
  endpointSubdomainEdited.value = false
}

function updateEndpointName(event: Event) {
  endpointName.value = event.target instanceof HTMLInputElement ? event.target.value : ''
}

function updateEndpointSubdomain(event: Event) {
  endpointSubdomainEdited.value = true
  endpointSubdomain.value = event.target instanceof HTMLInputElement
    ? normalizeSubdomain(event.target.value)
    : ''
}

async function submitCreateEndpoint() {
  endpointNameTouched.value = true
  endpointSubdomainTouched.value = true

  if (!canCreateEndpoint.value || endpointCreatePending.value) return

  try {
    const endpoint = await createEndpoint({
      name: normalizedEndpointName.value,
      subdomain: effectiveEndpointSubdomain.value,
    })
    handleCreateDialogOpenChange(false)
    await navigateTo(`/endpoints/${endpoint.id}`)
  } catch {
    // The action runner owns user-facing error handling.
  }
}

async function openDeleteEndpointDialog(endpoint: Pick<Endpoint, 'id' | 'name' | 'status'>) {
  const matchingEndpoint = endpoints.value.find(item => item.id === endpoint.id)
  if (!matchingEndpoint) return

  let result: Awaited<ReturnType<typeof initEndpointDeletion>>

  try {
    result = await initEndpointDeletion(matchingEndpoint)
  } catch {
    return
  }

  endpointPendingDeletion.value = matchingEndpoint
  deleteConfirmationWord.value = result.confirmationWord
  deleteConfirmationValue.value = ''
  deleteDialogOpen.value = true
}

function updateDeleteConfirmationValue(event: Event) {
  deleteConfirmationValue.value = event.target instanceof HTMLInputElement ? event.target.value : ''
}

function handleDeleteDialogOpenChange(open: boolean) {
  deleteDialogOpen.value = open

  if (!open) {
    endpointPendingDeletion.value = null
    deleteConfirmationWord.value = ''
    deleteConfirmationValue.value = ''
  }
}

async function confirmDeleteEndpoint(event?: Event) {
  if (!canConfirmDeleteEndpoint.value || !endpointPendingDeletion.value) {
    event?.preventDefault()
    return
  }

  const endpoint = endpointPendingDeletion.value
  try {
    await removeEndpoint(endpoint)
  } catch {
    return
  }

  if (selectedEndpointId.value === endpoint.id) {
    navigateTo('/endpoints')
  }

  handleDeleteDialogOpenChange(false)
}

function normalizeSubdomain(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^[^a-z]+|[^a-z0-9]+$/g, '')
    .slice(0, 63)
}

function createUniqueRandomSubdomain(existingEndpoints: Endpoint[]) {
  const existingSubdomains = new Set(existingEndpoints.map(endpoint => getEndpointSubdomain(endpoint)).filter(Boolean))

  for (let attempt = 0; attempt < 1000; attempt += 1) {
    const subdomain = createRandomSubdomain()
    if (!existingSubdomains.has(subdomain)) return subdomain
  }

  return `ep_${Date.now().toString(36).slice(-9)}`
}

function createRandomSubdomain() {
  const prefixAlphabet = 'abcdefghijklmnopqrstuvwxyz'
  const tokenAlphabet = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const values = new Uint32Array(11)

  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(values)
  } else {
    for (let index = 0; index < values.length; index += 1) {
      values[index] = Math.floor(Math.random() * tokenAlphabet.length)
    }
  }

  const prefix = Array.from(values.slice(0, 2), value => prefixAlphabet[value % prefixAlphabet.length]).join('')
  const token = Array.from(values.slice(2), value => tokenAlphabet[value % tokenAlphabet.length]).join('')
  return `${prefix}_${token}`
}

function createEndpointIdPreview(subdomain: string) {
  return subdomain
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-/g, '')
    .slice(0, 10)
}

function getEndpointSubdomain(endpoint: Endpoint) {
  try {
    const host = new URL(endpoint.url).host
    return host.endsWith('.pigeon.sh') ? host.replace(/\.pigeon\.sh$/, '') : ''
  } catch {
    return ''
  }
}

function isSubdomainTaken(subdomain: string) {
  return endpoints.value.some(endpoint => getEndpointSubdomain(endpoint) === subdomain)
}

function isValidSubdomain(subdomain: string) {
  return /^[a-z]{2}_[a-z0-9]{9}$/.test(subdomain)
}
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
