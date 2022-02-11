import { useCallback, useEffect, useState } from 'react'

export const useWebShareApi = () => {
  const [isNotSupportWebShareApi, setIsNotSupportWebShareApi] = useState<boolean | null>(null)

  const [isNotSupportNavigatorCanShare, setIsNotSupportNavigatorCanShare] = useState<
    boolean | null
  >(null)

  const [canShare, setCanShare] = useState<boolean>(true)
  const [canImageShare, setCanImageShare] = useState<boolean>(true)

  const [errorText, setErrorText] = useState<string>('')

  useEffect(() => {
    setIsNotSupportWebShareApi(!navigator.share)

    setIsNotSupportNavigatorCanShare(!navigator.canShare)
  }, [])

  const getCanShare = useCallback((opts: ShareData) => navigator.canShare(opts), [])

  const share = useCallback(
    async (shareData: ShareData) => {
      console.log(shareData.files)

      setCanShare(getCanShare({ title: shareData.title, text: shareData.text, url: shareData.url }))
      setCanImageShare(getCanShare({ files: shareData.files }))

      try {
        // await navigator.share(shareData)
        await navigator.share({ text: shareData.text, files: shareData.files })
      } catch (err) {
        if (err instanceof Error) {
          setErrorText(`Share failed: ${err.message || 'not supplied'}`)
        }
      }
    },
    [getCanShare]
  )

  return {
    share,
    isNotSupportWebShareApi,
    isNotSupportNavigatorCanShare,
    canShare,
    canImageShare,
    errorText,
  }
}
