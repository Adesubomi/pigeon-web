import type { CreateEndpointInput, Endpoint, EndpointEvent } from '@/composables/useEndpoints'
import {
  createClientPairingMock,
  createEndpointMock,
  deleteClientMock,
  deleteEndpointInitMock,
  deleteEndpointMock,
  fetchConnectedClientsMock,
  publishEndpointEventMock,
  setClientConnectionMock,
  setEndpointActivationMock,
} from '@/services/endpoint-actions.mock'

type EndpointActionTarget = Pick<Endpoint, 'id' | 'name' | 'status'>
type ClientActionTarget = { id: string, name: string }

export function endpointActionKey(endpointId: string, action: 'activation' | 'delete-init' | 'delete' | 'pair-client' | 'reload-clients') {
  return `endpoint:${endpointId}:${action}`
}

export function endpointCreateActionKey() {
  return 'endpoint:create'
}

export function endpointClientActionKey(endpointId: string, clientId: string, action: 'connection' | 'delete') {
  return `endpoint:${endpointId}:client:${clientId}:${action}`
}

export function endpointEventActionKey(endpointId: string, eventId: string, action: 'publish') {
  return `endpoint:${endpointId}:event:${eventId}:${action}`
}

export function useEndpointActions() {
  const { addEndpoint, deleteConnectedClient, deleteEndpoint, endpoints, getConnectedClients, replaceConnectedClients, setConnectedClientEnabled, setEndpointActive } = useEndpoints()
  const { isActionPending, runAction } = useActionRunner()

  async function setEndpointActivation(endpoint: EndpointActionTarget, active: boolean) {
    const result = await runAction({
      key: endpointActionKey(endpoint.id, 'activation'),
      label: active ? 'Resuming endpoint' : 'Pausing endpoint',
      successMessage: active ? 'Endpoint resumed' : 'Endpoint paused',
      errorMessage: active ? 'Could not resume endpoint' : 'Could not pause endpoint',
      toasts: {
        loading: false,
      },
      task: () => setEndpointActivationMock(endpoint.id, active),
    })

    setEndpointActive(result.endpointId, active)
    return result
  }

  async function toggleEndpointActivation(endpoint: EndpointActionTarget) {
    return setEndpointActivation(endpoint, endpoint.status !== 'active')
  }

  async function createEndpoint(input: CreateEndpointInput) {
    const endpoint = await runAction({
      key: endpointCreateActionKey(),
      label: 'Creating endpoint',
      successMessage: 'Endpoint created',
      successDescription: input.name,
      errorMessage: 'Could not create endpoint',
      toasts: {
        loading: false,
      },
      task: () => createEndpointMock(input, endpoints.value),
    })

    addEndpoint(endpoint)
    return endpoint
  }

  async function initEndpointDeletion(endpoint: EndpointActionTarget) {
    return runAction({
      key: endpointActionKey(endpoint.id, 'delete-init'),
      label: 'Preparing delete confirmation',
      successMessage: 'Delete confirmation ready',
      successDescription: endpoint.name,
      errorMessage: 'Could not prepare delete confirmation',
      toasts: {
        loading: false,
        success: false,
      },
      task: () => deleteEndpointInitMock(endpoint.id),
    })
  }

  async function removeEndpoint(endpoint: EndpointActionTarget) {
    const result = await runAction({
      key: endpointActionKey(endpoint.id, 'delete'),
      label: 'Deleting endpoint',
      successMessage: 'Endpoint deleted',
      errorMessage: 'Could not delete endpoint',
      toasts: {
        loading: false,
      },
      task: () => deleteEndpointMock(endpoint.id),
    })

    deleteEndpoint(result.endpointId)
    return result
  }

  async function publishEndpointEvent(endpoint: Endpoint, event: EndpointEvent) {
    return runAction({
      key: endpointEventActionKey(endpoint.id, event.id, 'publish'),
      label: 'Publishing event',
      successMessage: 'Event published',
      successDescription: event.path,
      errorMessage: 'Could not publish event',
      task: () => publishEndpointEventMock(endpoint.id, event),
    })
  }

  async function createClientPairing(endpoint: Endpoint) {
    return runAction({
      key: endpointActionKey(endpoint.id, 'pair-client'),
      label: 'Preparing client pairing',
      successMessage: 'Pairing code ready',
      successDescription: endpoint.name,
      errorMessage: 'Could not prepare pairing code',
      toasts: {
        loading: false,
        success: false,
      },
      task: () => createClientPairingMock(endpoint.id),
    })
  }

  async function reloadConnectedClients(endpoint: EndpointActionTarget) {
    const result = await runAction({
      key: endpointActionKey(endpoint.id, 'reload-clients'),
      label: 'Reloading clients',
      successMessage: 'Clients reloaded',
      errorMessage: 'Could not reload clients',
      toasts: {
        loading: false,
        success: false,
      },
      task: () => fetchConnectedClientsMock(endpoint.id, getConnectedClients(endpoint.id)),
    })

    replaceConnectedClients(result.endpointId, result.clients)
    return result
  }

  async function setClientConnection(endpoint: EndpointActionTarget, client: ClientActionTarget, enabled: boolean) {
    const result = await runAction({
      key: endpointClientActionKey(endpoint.id, client.id, 'connection'),
      label: enabled ? 'Enabling client connection' : 'Disabling client connection',
      successMessage: enabled ? 'Client connection enabled' : 'Client connection disabled',
      errorMessage: enabled ? 'Could not enable client connection' : 'Could not disable client connection',
      toasts: {
        loading: false,
      },
      task: () => setClientConnectionMock(endpoint.id, client.id, enabled),
    })

    setConnectedClientEnabled(result.endpointId, result.clientId, result.enabled)
    return result
  }

  async function removeConnectedClient(endpoint: EndpointActionTarget, client: ClientActionTarget) {
    const result = await runAction({
      key: endpointClientActionKey(endpoint.id, client.id, 'delete'),
      label: 'Deleting client',
      successMessage: 'Client deleted',
      errorMessage: 'Could not delete client',
      toasts: {
        loading: false,
      },
      task: () => deleteClientMock(endpoint.id, client.id),
    })

    deleteConnectedClient(result.endpointId, result.clientId)
    return result
  }

  return {
    isEndpointActionPending: isActionPending,
    createEndpoint,
    setEndpointActivation,
    toggleEndpointActivation,
    initEndpointDeletion,
    removeEndpoint,
    publishEndpointEvent,
    createClientPairing,
    reloadConnectedClients,
    setClientConnection,
    removeConnectedClient,
  }
}
