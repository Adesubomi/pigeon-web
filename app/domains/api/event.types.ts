export interface WebhookReceivedResponse {
  event_id: string
}

export interface EventResponse {
  id: string
  endpoint_id: string
  method: string
  path: string
  headers: unknown
  query: unknown
  body: string
  content_type: string
  received_at: string
  created_at: string
}

export interface ReplayEventResponse {
  event_id: string
  status: string
}

export interface PushPayload {
  event_id: string
  endpoint_id: string
  method: string
  path: string
  headers: unknown
  query: unknown
  body: string
  content_type: string
  received_at: string
}

export interface WebhookEventPushMessage {
  event: 'webhook.event'
  data: PushPayload
}
