import { ApiError, type ApiErrorPayload, type ApiSuccessResponse } from '@/domains/api/api.types'

export interface ApiRequestOptions extends Omit<RequestInit, 'body' | 'headers'> {
  token?: string
  headers?: HeadersInit
  body?: BodyInit | null
  json?: unknown
}

export interface ApiClient {
  request<T>(path: string, options?: ApiRequestOptions): Promise<T>
  raw(path: string, options?: ApiRequestOptions): Promise<Response>
}

interface ApiClientOptions {
  baseUrl: string
  fetch?: typeof globalThis.fetch
}

interface PublicApiRuntimeConfig {
  apiBaseUrl?: unknown
}

const defaultApiBaseUrl = 'http://localhost:18080'

export function joinApiUrl(baseUrl: string, path: string) {
  return `${baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
}

export function createApiClient(options: ApiClientOptions): ApiClient {
  const baseUrl = normalizeApiBaseUrl(options.baseUrl)
  const fetch = options.fetch ?? globalThis.fetch

  async function raw(path: string, requestOptions: ApiRequestOptions = {}) {
    const response = await fetch(joinApiUrl(baseUrl, path), createRequestInit(requestOptions))

    if (!response.ok) {
      throw await createResponseError(response)
    }

    return response
  }

  async function request<T>(path: string, requestOptions: ApiRequestOptions = {}) {
    const response = await raw(path, requestOptions)

    if (response.status === 204) {
      return undefined as T
    }

    try {
      const payload = await response.json() as ApiSuccessResponse<T>
      return payload.data
    } catch {
      throw new ApiError({
        status: response.status,
        code: 'response.invalid_json',
        message: `API response was not valid JSON (${response.status} ${response.statusText})`,
      })
    }
  }

  return {
    request,
    raw,
  }
}

export function useApiClient() {
  const publicConfig = useRuntimeConfig().public as PublicApiRuntimeConfig
  const apiBaseUrl = typeof publicConfig.apiBaseUrl === 'string'
    ? publicConfig.apiBaseUrl
    : defaultApiBaseUrl

  return createApiClient({ baseUrl: apiBaseUrl })
}

function normalizeApiBaseUrl(value: string) {
  return value.trim().replace(/\/+$/, '') || defaultApiBaseUrl
}

function createRequestInit(options: ApiRequestOptions): RequestInit {
  const { token, headers: headerValues, json, body, ...requestInit } = options
  const headers = new Headers(headerValues)

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  if (json !== undefined) {
    if (body !== undefined) {
      throw new Error('API requests cannot provide both body and json')
    }

    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }

    return {
      ...requestInit,
      headers,
      body: JSON.stringify(json),
    }
  }

  return {
    ...requestInit,
    headers,
    body,
  }
}

async function createResponseError(response: Response) {
  const fallbackMessage = `API request failed (${response.status} ${response.statusText})`

  try {
    const payload = await response.json() as Partial<ApiErrorPayload>
    return new ApiError({
      status: response.status,
      code: typeof payload.code === 'string' ? payload.code : 'response.error',
      message: typeof payload.message === 'string' ? payload.message : fallbackMessage,
      errors: isFieldErrors(payload.errors) ? payload.errors : undefined,
    })
  } catch {
    return new ApiError({
      status: response.status,
      code: 'response.error',
      message: fallbackMessage,
    })
  }
}

function isFieldErrors(value: unknown): value is Record<string, string> {
  return typeof value === 'object'
    && value !== null
    && Object.values(value).every(error => typeof error === 'string')
}
