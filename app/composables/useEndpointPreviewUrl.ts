const productionEnvironments = new Set(['prod', 'production'])

function normalizeAppBaseUrl(value: string | undefined) {
  const trimmedValue = value?.trim() || 'http://localhost:3000'
  const urlValue = /^https?:\/\//i.test(trimmedValue) ? trimmedValue : `https://${trimmedValue}`

  try {
    const url = new URL(urlValue)
    url.hash = ''
    url.search = ''
    return url.toString().replace(/\/+$/, '')
  } catch {
    return trimmedValue.replace(/\/+$/, '')
  }
}

function joinUrlPath(baseUrl: string, path: string) {
  return `${baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
}

export function buildEndpointPreviewUrl(endpointId: string, appBaseUrl: string | undefined, appEnv: string | undefined) {
  const normalizedBaseUrl = normalizeAppBaseUrl(appBaseUrl)
  const normalizedEnv = appEnv?.trim().toLowerCase() ?? ''

  if (!productionEnvironments.has(normalizedEnv)) {
    return joinUrlPath(normalizedBaseUrl, `/e/inspect/${encodeURIComponent(endpointId)}`)
  }

  try {
    const url = new URL(normalizedBaseUrl)
    url.hostname = `${endpointId}.${url.hostname}`
    url.pathname = ''
    url.hash = ''
    url.search = ''
    return url.toString().replace(/\/+$/, '')
  } catch {
    return normalizedBaseUrl.replace(/^(https?:\/\/)?/i, `$1${endpointId}.`)
  }
}

export function useEndpointPreviewUrl() {
  const config = useRuntimeConfig()
  const appBaseUrl = computed(() => config.public.appBaseUrl)
  const appEnv = computed(() => config.public.appEnv)

  function getEndpointPreviewUrl(endpointId: string) {
    return buildEndpointPreviewUrl(endpointId, appBaseUrl.value, appEnv.value)
  }

  return {
    appBaseUrl,
    appEnv,
    getEndpointPreviewUrl,
  }
}
