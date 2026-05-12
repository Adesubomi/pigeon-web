import { toast } from 'vue-sonner'
import { normalizeActionError, type ActionErrorDetails } from '@/lib/action-errors'
import { readStorageJson, writeStorageJson } from '@/lib/browser-storage'

export type ActionHistoryStatus = 'success' | 'error'

export interface ActionHistoryEntry {
  id: string
  key: string
  label: string
  status: ActionHistoryStatus
  message: string
  startedAt: string
  completedAt: string
  durationMs: number
}

type ActionToastType = 'loading' | 'success' | 'error'

type ActionToastOptions = Partial<Record<ActionToastType, boolean>>

interface RunActionOptions<T> {
  key: string
  label: string
  task: () => Promise<T>
  successMessage?: string
  successDescription?: string
  errorMessage?: string
  toasts?: ActionToastOptions
  showToast?: boolean
}

const ACTION_HISTORY_STORAGE_KEY = 'pigeon:action-history'
const MAX_ACTION_HISTORY_ENTRIES = 40

export function useActionRunner() {
  const pendingActions = useState<Record<string, number>>('action-runner:pending', () => ({}))
  const lastError = useState<ActionErrorDetails | null>('action-runner:last-error', () => null)
  const actionHistory = useState<ActionHistoryEntry[]>('action-runner:history', () => [])
  const storageHydrated = useState('action-runner:storage-hydrated', () => false)

  if (import.meta.client && !storageHydrated.value) {
    actionHistory.value = readStorageJson<ActionHistoryEntry[]>(ACTION_HISTORY_STORAGE_KEY, [])
    storageHydrated.value = true
  }

  const isActionPending = (key: string) => Boolean(pendingActions.value[key])

  async function runAction<T>(options: RunActionOptions<T>) {
    const shouldShowToast = createToastPolicy(options)
    const startedAt = new Date()
    const toastId = shouldShowToast('loading')
      ? toast.loading(options.label, { description: 'Working on it...' })
      : undefined

    markPending(options.key, 1)
    lastError.value = null

    try {
      const result = await options.task()
      const completedAt = new Date()
      const message = options.successMessage ?? `${options.label} complete`

      pushHistory({
        id: createActionHistoryId(options.key, completedAt),
        key: options.key,
        label: options.label,
        status: 'success',
        message,
        startedAt: startedAt.toISOString(),
        completedAt: completedAt.toISOString(),
        durationMs: completedAt.getTime() - startedAt.getTime(),
      })

      if (shouldShowToast('success')) {
        toast.success(message, {
          id: toastId,
          description: options.successDescription,
        })
      } else if (toastId) {
        toast.dismiss(toastId)
      }

      return result
    } catch (error) {
      const completedAt = new Date()
      const actionError = normalizeActionError(error, options.errorMessage)
      const message = options.errorMessage ?? actionError.message

      lastError.value = {
        code: actionError.code,
        message: actionError.message,
        recoverable: actionError.recoverable,
      }

      pushHistory({
        id: createActionHistoryId(options.key, completedAt),
        key: options.key,
        label: options.label,
        status: 'error',
        message,
        startedAt: startedAt.toISOString(),
        completedAt: completedAt.toISOString(),
        durationMs: completedAt.getTime() - startedAt.getTime(),
      })

      if (shouldShowToast('error')) {
        toast.error(message, {
          id: toastId,
          description: options.label,
        })
      } else if (toastId) {
        toast.dismiss(toastId)
      }

      throw actionError
    } finally {
      markPending(options.key, -1)
    }
  }

  function markPending(key: string, delta: 1 | -1) {
    const nextCount = (pendingActions.value[key] ?? 0) + delta

    if (nextCount <= 0) {
      const { [key]: _completedAction, ...remainingActions } = pendingActions.value
      pendingActions.value = remainingActions
      return
    }

    pendingActions.value = {
      ...pendingActions.value,
      [key]: nextCount,
    }
  }

  function pushHistory(entry: ActionHistoryEntry) {
    actionHistory.value = [entry, ...actionHistory.value].slice(0, MAX_ACTION_HISTORY_ENTRIES)
    writeStorageJson(ACTION_HISTORY_STORAGE_KEY, actionHistory.value)
  }

  return {
    pendingActions,
    lastError,
    actionHistory,
    isActionPending,
    runAction,
  }
}

function createActionHistoryId(key: string, completedAt: Date) {
  const safeKey = key.replace(/[^a-z0-9:_-]/gi, '-')
  return `${safeKey}:${completedAt.getTime()}`
}

function createToastPolicy<T>(options: RunActionOptions<T>) {
  return (toastType: ActionToastType) => {
    if (options.showToast === false) return false
    return options.toasts?.[toastType] ?? true
  }
}
