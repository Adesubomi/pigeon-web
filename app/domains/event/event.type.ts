export interface Event {
    id?: string
    endpointId?: string
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'
    path: string
    endpoint: string
    time: string
    size: string
}
