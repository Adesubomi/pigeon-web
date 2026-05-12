export function readStorageJson<T>(key: string, fallback: T): T {
  if (!import.meta.client) return fallback

  const rawValue = window.localStorage.getItem(key)
  if (!rawValue) return fallback

  try {
    return JSON.parse(rawValue) as T
  } catch {
    return fallback
  }
}

export function writeStorageJson<T>(key: string, value: T) {
  if (!import.meta.client) return

  window.localStorage.setItem(key, JSON.stringify(value))
}

export function removeStorageItem(key: string) {
  if (!import.meta.client) return

  window.localStorage.removeItem(key)
}
