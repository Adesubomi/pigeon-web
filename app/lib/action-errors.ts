export interface ActionErrorDetails {
  code: string
  message: string
  recoverable: boolean
}

export class ActionError extends Error {
  code: string
  recoverable: boolean
  override cause?: unknown

  constructor(details: ActionErrorDetails, options?: { cause?: unknown }) {
    super(details.message)
    this.name = 'ActionError'
    this.code = details.code
    this.recoverable = details.recoverable
    this.cause = options?.cause
  }
}

export function normalizeActionError(error: unknown, fallbackMessage = 'Something went wrong') {
  if (error instanceof ActionError) return error

  if (error instanceof Error) {
    return new ActionError({
      code: 'ACTION_FAILED',
      message: error.message || fallbackMessage,
      recoverable: true,
    }, { cause: error })
  }

  return new ActionError({
    code: 'ACTION_FAILED',
    message: fallbackMessage,
    recoverable: true,
  }, { cause: error })
}
