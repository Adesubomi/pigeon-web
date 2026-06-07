import type {
  DeviceResponse,
  HeartbeatResponse,
  PairDeviceRequest,
  PairDeviceResponse,
  UpdateDeviceRequest,
} from '@/domains/api/device.types'
import { useApiClient, type ApiClient, type ApiRequestOptions } from '@/lib/api-client'

type StreamRequestOptions = Omit<ApiRequestOptions, 'json' | 'method' | 'token'>

export function createDeviceApi(client: ApiClient) {
  return {
    pairDevice(input: PairDeviceRequest) {
      return client.request<PairDeviceResponse>('/devices/pair', {
        method: 'POST',
        json: input,
      })
    },

    heartbeat(deviceToken: string) {
      return client.request<HeartbeatResponse>('/devices/heartbeat', {
        method: 'POST',
        token: deviceToken,
      })
    },

    updateDevice(deviceToken: string, deviceId: string, input: UpdateDeviceRequest) {
      return client.request<DeviceResponse>(`/devices/${encodeURIComponent(deviceId)}`, {
        method: 'PATCH',
        token: deviceToken,
        json: input,
      })
    },

    deleteDevice(deviceToken: string, deviceId: string) {
      return client.request<void>(`/devices/${encodeURIComponent(deviceId)}`, {
        method: 'DELETE',
        token: deviceToken,
      })
    },

    openStream(deviceToken: string, options: StreamRequestOptions = {}) {
      const headers = new Headers(options.headers)
      if (!headers.has('Accept')) headers.set('Accept', 'text/event-stream')

      return client.raw('/stream', {
        ...options,
        method: 'GET',
        token: deviceToken,
        headers,
      })
    },
  }
}

export function useDeviceApi() {
  return createDeviceApi(useApiClient())
}
