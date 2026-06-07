export interface ApiSuccessResponse<T> {
  message: string
  data: T
}

export interface ApiErrorPayload {
  message: string
  code: string
  errors?: Record<string, string>
}

export interface HealthResponse {
  status: string
}

interface ApiErrorOptions {
  status: number
  code: string
  message: string
  errors?: Record<string, string>
}

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly errors: Record<string, string>

  constructor(options: ApiErrorOptions) {
    super(options.message)
    this.name = 'ApiError'
    this.status = options.status
    this.code = options.code
    this.errors = options.errors ?? {}
  }
}
