import type { ConnectedClient, CreateEndpointInput, Endpoint, EndpointEvent } from '@/composables/useEndpoints'

const mockActionWaits = {
  setEndpointActivation: 650,
  deleteInit: 520,
  deleteEndpoint: 900,
  createEndpoint: 720,
  publishEvent: 1400,
  createClientPairing: 700,
  fetchConnectedClients: 420,
  setClientConnection: 520,
  deleteClient: 620,
} satisfies Record<string, number>

interface MockWaitOptions {
  waitMs?: number
}

function waitForMockAction(waitMs: number) {
  return new Promise(resolve => window.setTimeout(resolve, waitMs))
}

export async function setEndpointActivationMock(endpointId: string, active: boolean, options: MockWaitOptions = {}) {
  await waitForMockAction(options.waitMs ?? mockActionWaits.setEndpointActivation)

  return {
    endpointId,
    status: active ? 'active' : 'inactive',
  } satisfies { endpointId: string, status: Endpoint['status'] }
}

export async function createEndpointMock(input: CreateEndpointInput, existingEndpoints: Endpoint[], options: MockWaitOptions = {}) {
  await waitForMockAction(options.waitMs ?? mockActionWaits.createEndpoint)

  const id = createEndpointId(input.subdomain, existingEndpoints)

  return {
    id,
    name: input.name,
    url: `https://${input.subdomain}.pigeon.sh/e/${id}`,
    status: 'active',
    devices: 0,
    eventsToday: 0,
  } satisfies Endpoint
}

export async function deleteEndpointInitMock(endpointId: string, options: MockWaitOptions = {}) {
  await waitForMockAction(options.waitMs ?? mockActionWaits.deleteInit)

  return {
    endpointId,
    confirmationWord: createDeleteConfirmationWord(),
  }
}

export async function deleteEndpointMock(endpointId: string, options: MockWaitOptions = {}) {
  await waitForMockAction(options.waitMs ?? mockActionWaits.deleteEndpoint)

  return { endpointId }
}

export async function publishEndpointEventMock(endpointId: string, event: EndpointEvent, options: MockWaitOptions = {}) {
  await waitForMockAction(options.waitMs ?? mockActionWaits.publishEvent)

  return {
    endpointId,
    eventId: event.id,
    path: event.path,
    publishedAt: new Date().toISOString(),
  }
}

export async function createClientPairingMock(endpointId: string, options: MockWaitOptions = {}) {
  await waitForMockAction(options.waitMs ?? mockActionWaits.createClientPairing)

  return {
    endpointId,
    pairingCode: createPairingCode(),
  }
}

export async function fetchConnectedClientsMock(endpointId: string, currentClients: ConnectedClient[], options: MockWaitOptions = {}) {
  await waitForMockAction(options.waitMs ?? mockActionWaits.fetchConnectedClients)

  const hasNewClient = currentClients.some(client => client.id === 'client-new-paired')
  const nextClients = hasNewClient
    ? currentClients
    : [
        ...currentClients,
        {
          id: 'client-new-paired',
          endpointId,
          name: 'New client',
          localUrl: 'localhost:3000',
          enabled: true,
        },
      ]

  return {
    endpointId,
    clients: nextClients,
  }
}

export async function setClientConnectionMock(endpointId: string, clientId: string, enabled: boolean, options: MockWaitOptions = {}) {
  await waitForMockAction(options.waitMs ?? mockActionWaits.setClientConnection)

  return {
    endpointId,
    clientId,
    enabled,
  }
}

export async function deleteClientMock(endpointId: string, clientId: string, options: MockWaitOptions = {}) {
  await waitForMockAction(options.waitMs ?? mockActionWaits.deleteClient)

  return {
    endpointId,
    clientId,
  }
}

const deleteConfirmationWords = [
  'atlas',
  'brisk',
  'cobalt',
  'drift',
  'ember',
  'fable',
  'garden',
  'harbor',
  'island',
  'jacket',
  'kindle',
  'lantern',
  'meadow',
  'nectar',
  'orbit',
  'pencil',
  'quartz',
  'rocket',
  'silver',
  'timber',
  'velvet',
  'window',
  'zephyr',
]

function createDeleteConfirmationWord() {
  return deleteConfirmationWords[Math.floor(Math.random() * deleteConfirmationWords.length)] ?? 'atlas'
}

function createEndpointId(subdomain: string, existingEndpoints: Endpoint[]) {
  const baseId = subdomain
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-/g, '')
    .slice(0, 10) || 'endpoint'

  const existingIds = new Set(existingEndpoints.map(endpoint => endpoint.id))

  if (!existingIds.has(baseId)) return baseId

  for (let suffix = 2; suffix < 1000; suffix += 1) {
    const nextId = `${baseId}${suffix}`
    if (!existingIds.has(nextId)) return nextId
  }

  return `${baseId}${Date.now().toString(36)}`
}

function createPairingCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const values = new Uint32Array(12)

  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(values)
  } else {
    for (let index = 0; index < values.length; index += 1) {
      values[index] = Math.floor(Math.random() * alphabet.length)
    }
  }

  const code = Array.from(values, value => alphabet[value % alphabet.length]).join('')
  return `${code.slice(0, 4)}-${code.slice(4, 8)}-${code.slice(8)}`
}
