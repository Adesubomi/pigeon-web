export interface PairDeviceRequest {
  code: string
  device_id: string
  device_name: string
}

export interface PairDeviceResponse {
  device_id: string
  token: string
}

export interface HeartbeatResponse {
  last_seen_at: string
}

export interface UpdateDeviceRequest {
  device_name?: string
  is_active?: boolean
}

export interface DeviceResponse {
  id: string
  endpoint_id: string
  device_id: string
  device_name: string
  is_active: boolean
  last_seen_at: string | null
  created_at: string
  updated_at: string
}
