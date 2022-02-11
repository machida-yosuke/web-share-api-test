import { RefObject, useCallback, useEffect } from 'react'
// import { toBlob } from '../ts/toBlob'

type arg = {
  canvas: RefObject<HTMLCanvasElement>
  title: string
  text: string
  url: string
}

const useCanvas = ({ canvas, title, text, url }: arg) => {
  useEffect(() => {
    if (!canvas.current) return

    const context = canvas.current.getContext('2d')

    if (!context) return

    context.fillStyle = 'rgba(0, 0, 0)'
    context.rect(0, 0, 1200, 630)
    context.fill()

    context.font = '48px Arial'
    context.fillStyle = 'rgba(255, 255, 255)'
    context.fillText(title, 50, 200)
    context.fillText(text, 50, 300)
    context.fillText(url, 50, 400)
  }, [canvas, title, text, url])

  const toFiles = useCallback(async () => {
    if (!canvas.current) return []
    const dataURL = canvas.current.toDataURL()
    const blob = await (await fetch(dataURL)).blob()

    if (!blob) return []

    const filesArray: File[] = [
      new File([blob], 'image.png', { type: blob.type, lastModified: new Date().getTime() }),
    ]

    return filesArray
  }, [canvas])

  return { toFiles }
}

export default useCanvas
