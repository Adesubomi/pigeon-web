import { toast } from 'vue-sonner'
import { copyTextToClipboard } from '@/lib/clipboard'

interface CopyActionOptions {
  copiedKey?: string
  errorMessage?: string
  resetAfterMs?: number
}

interface CopyActionDefaults {
  errorMessage?: string
  resetAfterMs?: number
}

const DEFAULT_COPY_KEY = 'default'
const DEFAULT_RESET_AFTER_MS = 1800

export function useCopyAction(defaults: CopyActionDefaults = {}) {
  const copiedKey = ref('')
  const copied = computed(() => copiedKey.value.length > 0)
  let resetTimer: number | undefined

  const isCopied = (key = DEFAULT_COPY_KEY) => copiedKey.value === key

  async function copyText(text: string, options: CopyActionOptions = {}) {
    const didCopy = await copyTextToClipboard(text)

    if (!didCopy) {
      toast.error(options.errorMessage ?? defaults.errorMessage ?? 'Could not copy')
      return false
    }

    copiedKey.value = options.copiedKey ?? DEFAULT_COPY_KEY
    toast.info('Copied')

    window.clearTimeout(resetTimer)
    resetTimer = window.setTimeout(() => {
      copiedKey.value = ''
    }, options.resetAfterMs ?? defaults.resetAfterMs ?? DEFAULT_RESET_AFTER_MS)

    return true
  }

  function resetCopied() {
    copiedKey.value = ''
    window.clearTimeout(resetTimer)
  }

  onBeforeUnmount(resetCopied)

  return {
    copied,
    copiedKey,
    copyText,
    isCopied,
    resetCopied,
  }
}
