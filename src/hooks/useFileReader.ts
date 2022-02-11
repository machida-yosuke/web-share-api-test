import { useEffect, useState } from 'react'

export const useFileReader = () => {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [result, setResult] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!file) return
    const reader = new FileReader()

    reader.onloadstart = () => {
      setLoading(true)
    }
    reader.onloadend = () => {
      setLoading(false)
    }
    reader.onload = (e) => {
      if (!e.target) return
      setResult(e.target.result?.toString())
    }
    reader.onerror = (err) => {
      if (err instanceof Error) setError(err)
    }

    try {
      reader.readAsDataURL(file)
    } catch (err) {
      if (err instanceof Error) setError(err)
    }
  }, [file])

  return { result, error, file, loading, setFile }
}
