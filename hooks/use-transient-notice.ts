'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/** Mensagem temporária (toast) que some sozinha após `durationMs`. */
export function useTransientNotice(durationMs = 2200) {
  const [notice, setNotice] = useState<string | null>(null)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [])

  const show = useCallback(
    (message: string) => {
      if (timer.current) window.clearTimeout(timer.current)
      setNotice(message)
      timer.current = window.setTimeout(() => setNotice(null), durationMs)
    },
    [durationMs],
  )

  return { notice, show }
}
