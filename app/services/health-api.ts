import type { HealthResponse } from '@/domains/api/api.types'
import { useApiClient, type ApiClient } from '@/lib/api-client'

export function createHealthApi(client: ApiClient) {
  return {
    getHealth() {
      return client.request<HealthResponse>('/healthz')
    },
  }
}

export function useHealthApi() {
  return createHealthApi(useApiClient())
}
