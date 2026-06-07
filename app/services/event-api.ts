import type {
  EventResponse,
  ReplayEventResponse,
  WebhookReceivedResponse,
} from '@/domains/api/event.types'
import { useApiClient, type ApiClient } from '@/lib/api-client'

type WebhookQueryValue = string | number | boolean | readonly string[] | null | undefined

export interface ReceiveWebhookOptions {
  query?: URLSearchParams | Record<string, WebhookQueryValue>
  headers?: HeadersInit
  body?: BodyInit | null
}

export function createEventApi(client: ApiClient) {
  return {
    receiveWebhook(slug: string, options: ReceiveWebhookOptions = {}) {
      const query = createWebhookQuery(options.query)
      const search = query.size > 0 ? `?${query.toString()}` : ''

      return client.request<WebhookReceivedResponse>(`/hooks/${encodeURIComponent(slug)}${search}`, {
        method: 'POST',
        headers: options.headers,
        body: options.body,
      })
    },

    getEvent(accessToken: string, eventId: string) {
      return client.request<EventResponse>(`/events/${encodeURIComponent(eventId)}`, {
        token: accessToken,
      })
    },

    replayEvent(accessToken: string, eventId: string) {
      return client.request<ReplayEventResponse>(`/events/${encodeURIComponent(eventId)}/replay`, {
        method: 'POST',
        token: accessToken,
      })
    },
  }
}

export function useEventApi() {
  return createEventApi(useApiClient())
}

function createWebhookQuery(query: ReceiveWebhookOptions['query']) {
  if (query instanceof URLSearchParams) return query

  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === null || value === undefined) continue

    if (Array.isArray(value)) {
      value.forEach(entry => params.append(key, entry))
    } else {
      params.set(key, String(value))
    }
  }

  return params
}
