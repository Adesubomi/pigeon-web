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
          <Button
            variant="link"
            size="sm"
            class="h-auto px-0 py-0 text-[11px] text-brand-500"
            :aria-label="copyLabel"
            :title="copyLabel"
            @click="copyEndpointUrl"
          >
            <Transition name="copy-icon" mode="out-in">
              <PhCheck v-if="copiedUrl" key="copied" class="size-[11px] shrink-0 text-success-600" weight="bold" />
              <PhCopy v-else key="copy" class="size-[11px] shrink-0" />
            </Transition>
            Copy URL
          </Button>

          <div class="flex items-center gap-2">
            <span class="text-[11px] font-medium" :class="endpointActive ? 'text-success-800' : 'text-muted-foreground'">
              {{ endpointActive ? 'Active' : 'Paused' }}
            </span>
            <Switch
              :checked="endpointActive"
              size="md"
              :disabled="endpointActivationPending"
              class="endpoint-activation-switch"
              :class="{ 'jagged-switch': isSwitchAnimating }"
              :aria-label="endpointActive ? 'Deactivate endpoint' : 'Activate endpoint'"
              @update:checked="setEndpointActivation"
            />
            <Button
              variant="outline"
              size="icon"
              class="size-8 shrink-0 text-muted-foreground hover:text-danger-500"
              :disabled="endpointDeletePending"
              aria-label="Delete endpoint"
              title="Delete endpoint"
              @click="deleteCurrentEndpoint"
            >
              <Transition name="copy-icon" mode="out-in">
                <PhCircleNotch v-if="endpointDeletePending" key="delete-loading" class="size-3 animate-spin" />
                <PhTrash v-else key="delete" class="size-3" />
              </Transition>
            </Button>
          </div>
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

      <ScrollArea class="flex-1">
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

          <Item v-for="client in connectedClients" :key="client.id" class="mb-1.5 bg-background p-2.5">
            <ItemMedia class="size-7 rounded-md bg-accent text-accent-foreground">
              <PhDesktop class="size-3.5" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle class="text-xs">{{ client.name }}</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Switch
                :checked="client.enabled"
                :disabled="isClientActionPending(client.id)"
                :aria-label="`${client.name} connection enabled`"
                @update:checked="enabled => setClientEnabled(client, enabled)"
              />
              <Button
                variant="ghost"
                size="icon"
                class="size-7 text-muted-foreground hover:text-danger-500"
                :disabled="isClientActionPending(client.id)"
                :aria-label="`Delete ${client.name}`"
                :title="`Delete ${client.name}`"
                @click="deleteClient(client)"
              >
                <Transition name="copy-icon" mode="out-in">
                  <PhCircleNotch v-if="isClientDeletePending(client.id)" key="client-delete-loading" class="size-3 animate-spin" />
                  <PhTrash v-else key="client-delete" class="size-3" />
                </Transition>
              </Button>
            </ItemActions>
          </Item>

          <Transition name="pairing-card" mode="out-in">
            <Button
              v-if="!isPairingClient"
              key="connect-client"
              variant="outline"
              size="sm"
              class="mt-2 w-full border-dashed text-brand-500"
              :disabled="clientPairingPending"
              @click="connectClient"
            >
              <PhPlus class="size-3 shrink-0" />
              Connect client
            </Button>

            <div
              v-else-if="pairingStatus === 'waiting'"
              key="pairing-waiting"
              class="mt-2 rounded-lg border border-brand-200 bg-card p-3 shadow-xs"
            >
              <div class="mb-3 flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="mb-1 flex items-center gap-2">
                    <span class="pairing-live-dot" aria-hidden="true" />
                    <p class="text-xs font-medium text-foreground">Waiting for live connection</p>
                  </div>
                  <p class="text-[11px] leading-relaxed text-muted-foreground">Pairing code</p>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  class="size-7 shrink-0 text-muted-foreground hover:text-foreground"
                  aria-label="Dismiss pairing code"
                  title="Dismiss pairing code"
                  @click="dismissPairingClient"
                >
                  <PhX class="size-3.5" />
                </Button>
              </div>

              <div class="flex items-center gap-2 rounded-md border bg-background p-1.5">
                <code class="min-w-0 flex-1 text-center font-mono text-sm font-semibold tracking-[0.14em] text-foreground">
                  {{ pairingCode }}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  class="size-7 shrink-0 text-muted-foreground hover:text-foreground"
                  :aria-label="pairingCopyLabel"
                  :title="pairingCopyLabel"
                  @click="copyPairingCode"
                >
                  <Transition name="copy-icon" mode="out-in">
                    <PhCheck v-if="copiedPairingCode" key="pairing-copied" class="size-3.5 text-success-600" weight="bold" />
                    <PhCopy v-else key="pairing-copy" class="size-3.5" />
                  </Transition>
                </Button>
              </div>

              <div class="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground" role="status">
                <span class="pairing-spinner" aria-hidden="true" />
                <span>Expecting a client to connect</span>
              </div>
            </div>

            <div
              v-else
              key="pairing-success"
              class="mt-2 rounded-lg border border-success-600/25 bg-success-600/5 p-3 shadow-xs"
            >
              <div class="mb-3 flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="mb-1 flex items-center gap-2">
                    <span class="flex size-5 shrink-0 items-center justify-center rounded-full bg-success-600 text-white">
                      <PhCheck class="size-3" weight="bold" />
                    </span>
                    <p class="text-xs font-medium text-foreground">Client paired</p>
                  </div>
                  <p class="text-[11px] leading-relaxed text-muted-foreground">Live connection established</p>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  class="size-7 shrink-0 text-muted-foreground hover:text-foreground"
                  aria-label="Dismiss paired client"
                  title="Dismiss paired client"
                  @click="dismissPairingClient"
                >
                  <PhX class="size-3.5" />
                </Button>
              </div>

              <Item class="border-success-600/20 bg-background p-2.5">
                <ItemMedia class="size-7 rounded-md bg-success-600/10 text-success-800">
                  <PhDesktop class="size-3.5" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle class="text-xs">New client</ItemTitle>
                </ItemContent>
                <ItemActions>
                  <Switch checked aria-label="New client connection enabled" />
                </ItemActions>
              </Item>
            </div>
          </Transition>
        </div>
      </ScrollArea>
    </template>

    <Empty v-else class="flex-1">
      <EmptyTitle>Endpoint not found</EmptyTitle>
      <Button variant="link" size="sm" class="h-auto px-0 py-0 text-[11px] text-brand-500" @click="navigateTo(closePath)">
        Back to endpoints
      </Button>
    </Empty>
  </section>
</template>

<script setup lang="ts">
import {
  PhCheck,
  PhCircleNotch,
  PhCopy,
  PhDesktop,
  PhPlus,
  PhTrash,
  PhX,
} from '@phosphor-icons/vue'
import { endpointActionKey, endpointClientActionKey } from '@/composables/useEndpointActions'
import type { ConnectedClient } from '@/composables/useEndpoints'

type PairingStatus = 'idle' | 'waiting' | 'paired'

const route = useRoute()
const router = useRouter()
const { getConnectedClients, getEndpoint, getEvents } = useEndpoints()
const {
  createClientPairing,
  isEndpointActionPending,
  reloadConnectedClients,
  removeConnectedClient,
  removeEndpoint,
  setClientConnection,
  setEndpointActivation: runEndpointActivation,
} = useEndpointActions()
const isSwitchAnimating = ref(false)
const pairingCode = ref('')
const pairingStatus = ref<PairingStatus>('idle')
const {
  copied: copiedUrl,
  copyText: copyEndpointText,
} = useCopyAction({
  errorMessage: 'Could not copy endpoint URL',
})
const {
  copied: copiedPairingCode,
  copyText: copyPairingText,
  resetCopied: resetPairingCopy,
} = useCopyAction({
  errorMessage: 'Could not copy pairing code',
})
let switchAnimationTimer: number | undefined
let pairingSuccessTimer: number | undefined

const endpointId = computed(() => typeof route.params.endpoint_id === 'string' ? route.params.endpoint_id : '')
const endpoint = computed(() => getEndpoint(endpointId.value))
const events = computed(() => getEvents(endpointId.value))
const activeTab = computed(() => route.query.tab === 'clients' ? 'clients' : 'events')
const isDashboardRoute = computed(() => route.path.startsWith('/dashboard'))
const closePath = computed(() => isDashboardRoute.value ? '/dashboard' : '/endpoints')
const endpointActive = computed(() => endpoint.value?.status === 'active')
const endpointActivationPending = computed(() => isEndpointActionPending(endpointActionKey(endpointId.value, 'activation')))
const endpointDeletePending = computed(() => isEndpointActionPending(endpointActionKey(endpointId.value, 'delete')))
const clientPairingPending = computed(() => isEndpointActionPending(endpointActionKey(endpointId.value, 'pair-client')))
const connectedClients = computed(() => getConnectedClients(endpointId.value))
const copyLabel = computed(() => copiedUrl.value ? 'Copied' : 'Copy URL')
const isPairingClient = computed(() => pairingCode.value.length > 0)
const pairingCopyLabel = computed(() => copiedPairingCode.value ? 'Copied' : 'Copy pairing code')

async function copyEndpointUrl() {
  if (!endpoint.value) return

  await copyEndpointText(endpoint.value.url)
}

async function setEndpointActivation(active: boolean) {
  if (!endpoint.value) return

  try {
    await runEndpointActivation(endpoint.value, active)
  } catch {
    return
  }
  isSwitchAnimating.value = false
  window.clearTimeout(switchAnimationTimer)
  window.requestAnimationFrame(() => {
    isSwitchAnimating.value = true
    switchAnimationTimer = window.setTimeout(() => {
      isSwitchAnimating.value = false
    }, 520)
  })
}

async function deleteCurrentEndpoint() {
  if (!endpoint.value) return

  try {
    await removeEndpoint(endpoint.value)
  } catch {
    return
  }

  navigateTo(closePath.value)
}

function setTab(tab: 'events' | 'clients') {
  router.replace({
    path: route.path,
    query: tab === 'events' ? {} : { tab },
  })
}

async function connectClient() {
  if (!endpoint.value) return

  let result: Awaited<ReturnType<typeof createClientPairing>>

  try {
    result = await createClientPairing(endpoint.value)
  } catch {
    return
  }

  pairingCode.value = result.pairingCode
  pairingStatus.value = 'waiting'
  resetPairingCopy()
  schedulePairingSuccess()
}

async function dismissPairingClient() {
  const shouldReloadClients = pairingStatus.value === 'paired'
  resetPairingClient()

  if (!shouldReloadClients || !endpoint.value) return

  try {
    await reloadConnectedClients(endpoint.value)
  } catch {
    return
  }
}

async function copyPairingCode() {
  if (!pairingCode.value) return

  await copyPairingText(pairingCode.value)
}

function resetPairingClient() {
  clearPairingSuccessTimer()
  pairingCode.value = ''
  pairingStatus.value = 'idle'
  resetPairingCopy()
}

function eventDetailPath(eventId?: string) {
  if (!eventId) return route.path

  return isDashboardRoute.value
    ? `/dashboard/endpoints/${endpointId.value}/events/${eventId}`
    : `/endpoints/${endpointId.value}/events/${eventId}`
}

function isClientConnectionPending(clientId: string) {
  return isEndpointActionPending(endpointClientActionKey(endpointId.value, clientId, 'connection'))
}

function isClientDeletePending(clientId: string) {
  return isEndpointActionPending(endpointClientActionKey(endpointId.value, clientId, 'delete'))
}

function isClientActionPending(clientId: string) {
  return isClientConnectionPending(clientId) || isClientDeletePending(clientId)
}

async function setClientEnabled(client: ConnectedClient, enabled: boolean) {
  if (!endpoint.value) return

  try {
    await setClientConnection(endpoint.value, client, enabled)
  } catch {
    return
  }
}

async function deleteClient(client: ConnectedClient) {
  if (!endpoint.value) return

  try {
    await removeConnectedClient(endpoint.value, client)
  } catch {
    return
  }
}

watch(endpointId, () => {
  resetPairingClient()
})

onBeforeUnmount(() => {
  window.clearTimeout(switchAnimationTimer)
  clearPairingSuccessTimer()
})

function schedulePairingSuccess() {
  clearPairingSuccessTimer()

  pairingSuccessTimer = window.setTimeout(() => {
    pairingSuccessTimer = undefined

    if (!pairingCode.value || pairingStatus.value !== 'waiting') return

    pairingStatus.value = 'paired'
  }, 5000)
}

function clearPairingSuccessTimer() {
  window.clearTimeout(pairingSuccessTimer)
  pairingSuccessTimer = undefined
}
</script>

<style scoped>
:deep(.endpoint-activation-switch) {
  position: relative;
  overflow: visible;
  transition: background 0.14s ease, box-shadow 0.14s ease;
}

:deep(.endpoint-activation-switch[data-state="checked"]) {
  box-shadow: 0 0 0 3px rgba(29, 158, 117, 0.14);
}

:deep(.endpoint-activation-switch.jagged-switch) {
  animation: switch-jag 0.46s steps(2, end);
}

:deep(.endpoint-activation-switch.jagged-switch > span) {
  animation: switch-thumb-jag 0.46s steps(2, end);
}

.copy-icon-enter-active,
.copy-icon-leave-active {
  transition: opacity 0.12s ease, transform 0.12s ease;
}

.copy-icon-enter-from,
.copy-icon-leave-to {
  opacity: 0;
  transform: scale(0.78);
}

.pairing-card-enter-active,
.pairing-card-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.pairing-card-enter-from,
.pairing-card-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

.pairing-live-dot {
  position: relative;
  display: inline-flex;
  width: 0.5rem;
  height: 0.5rem;
  flex-shrink: 0;
  border-radius: 9999px;
  background: rgb(29 158 117);
  box-shadow: 0 0 0 3px rgba(29, 158, 117, 0.14);
}

.pairing-live-dot::after {
  position: absolute;
  inset: -0.25rem;
  content: '';
  border-radius: inherit;
  border: 1px solid rgba(29, 158, 117, 0.35);
  animation: pairing-pulse 1.25s ease-out infinite;
}

.pairing-spinner {
  display: inline-block;
  width: 0.75rem;
  height: 0.75rem;
  flex-shrink: 0;
  border: 1.5px solid rgba(136, 135, 128, 0.25);
  border-top-color: rgb(136, 135, 128);
  border-radius: 9999px;
  animation: pairing-spin 0.8s linear infinite;
}

@keyframes switch-jag {
  0% { transform: translateX(0) rotate(0deg); }
  18% { transform: translateX(-1px) rotate(-2deg); }
  36% { transform: translateX(2px) rotate(2deg); }
  54% { transform: translateX(-2px) rotate(-1deg); }
  72% { transform: translateX(1px) rotate(1deg); }
  100% { transform: translateX(0) rotate(0deg); }
}

@keyframes switch-thumb-jag {
  0% { transform: scale(1); }
  22% { transform: scale(0.92, 1.08); }
  44% { transform: scale(1.1, 0.9); }
  66% { transform: scale(0.96, 1.04); }
  100% { transform: scale(1); }
}

@keyframes pairing-pulse {
  0% {
    opacity: 0.85;
    transform: scale(0.7);
  }
  100% {
    opacity: 0;
    transform: scale(1.8);
  }
}

@keyframes pairing-spin {
  to { transform: rotate(360deg); }
}
</style>
