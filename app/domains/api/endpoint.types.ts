export interface CreateEndpointRequest {
  name: string
}

export interface UpdateEndpointRequest {
  name?: string
  is_active?: boolean
}

export interface EndpointResponse {
  id: string
  name: string
  slug: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PairingCodeResponse {
  code: string
  expires_at: string
}

export interface DeviceSummary {
  id: string
  device_id: string
  device_name: string
  is_active: boolean
  last_seen_at: string | null
  created_at: string
}

export interface EndpointEventSummary {
  id: string
  method: string
  path: string
  content_type: string
  received_at: string
  created_at: string
}
