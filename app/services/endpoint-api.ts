import type {
  CreateEndpointRequest,
  DeviceSummary,
  EndpointEventSummary,
  EndpointResponse,
  PairingCodeResponse,
  UpdateEndpointRequest,
} from '@/domains/api/endpoint.types'
import { useApiClient, type ApiClient } from '@/lib/api-client'

export function createEndpointApi(client: ApiClient) {
  return {
    createEndpoint(accessToken: string, input: CreateEndpointRequest) {
      return client.request<EndpointResponse>('/endpoints', {
        method: 'POST',
        token: accessToken,
        json: input,
      })
    },

    listEndpoints(accessToken: string) {
      return client.request<EndpointResponse[]>('/endpoints', { token: accessToken })
    },

    getEndpoint(accessToken: string, endpointId: string) {
      return client.request<EndpointResponse>(`/endpoints/${encodeURIComponent(endpointId)}`, {
        token: accessToken,
      })
    },

    updateEndpoint(accessToken: string, endpointId: string, input: UpdateEndpointRequest) {
      return client.request<EndpointResponse>(`/endpoints/${encodeURIComponent(endpointId)}`, {
        method: 'PATCH',
        token: accessToken,
        json: input,
      })
    },

    deleteEndpoint(accessToken: string, endpointId: string) {
      return client.request<void>(`/endpoints/${encodeURIComponent(endpointId)}`, {
        method: 'DELETE',
        token: accessToken,
      })
    },

    createPairingCode(accessToken: string, endpointId: string) {
      return client.request<PairingCodeResponse>(`/endpoints/${encodeURIComponent(endpointId)}/pairing-codes`, {
        method: 'POST',
        token: accessToken,
      })
    },

    listDevices(accessToken: string, endpointId: string) {
      return client.request<DeviceSummary[]>(`/endpoints/${encodeURIComponent(endpointId)}/devices`, {
        token: accessToken,
      })
    },

    listEvents(accessToken: string, endpointId: string) {
      return client.request<EndpointEventSummary[]>(`/endpoints/${encodeURIComponent(endpointId)}/events`, {
        token: accessToken,
      })
    },
  }
}

export function useEndpointApi() {
  return createEndpointApi(useApiClient())
}
