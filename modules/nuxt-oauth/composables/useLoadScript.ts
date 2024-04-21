export interface UseLoadScriptOptions {
  /**
   * Nonce applied to GSI script tag. Propagates to GSI's inline style tag
   */
  nonce?: string
  /**
   * Callback fires on load [gsi](https://accounts.google.com/gsi/client) script success
   */
  onScriptLoadSuccess?: () => void
  /**
   * Callback fires on load [gsi](https://accounts.google.com/gsi/client) script failure
   */
  onScriptLoadError?: () => void
}

export default function useLoadScript(options: UseLoadScriptOptions = {}) {
  const { nonce, onScriptLoadError, onScriptLoadSuccess } = options

  const isLoadedSuccessfully = ref(false)

  watch(
    () => nonce,
    (_nonce) => {
      if (isLoadedSuccessfully.value) return

      const scriptTag = document.createElement('script')
      scriptTag.src = 'https://accounts.google.com/gsi/client'
      scriptTag.async = true
      scriptTag.defer = true
      scriptTag.nonce = _nonce
      scriptTag.id = 'google-script'
      scriptTag.onload = () => {
        isLoadedSuccessfully.value = true
        onScriptLoadSuccess?.()
      }
      scriptTag.onerror = () => {
        isLoadedSuccessfully.value = false
        onScriptLoadError?.()
      }

      document.body.appendChild(scriptTag)

      return () => {
        document.body.removeChild(scriptTag)
      }
    },
    {
      immediate: true
    }
  )

  return isLoadedSuccessfully
}
