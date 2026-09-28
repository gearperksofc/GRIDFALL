'use client'

import { useEffect, useState, type RefObject } from 'react'
import type { Size } from '@/types'

/** Mede o tamanho de um elemento em CSS pixels e reage a redimensionamentos. */
export function useElementSize<T extends HTMLElement>(ref: RefObject<T | null>): Size {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width: Math.round(width), height: Math.round(height) })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])

  return size
}

export type Orientation = 'portrait' | 'landscape'

export function useOrientation(): Orientation {
  const [orientation, setOrientation] = useState<Orientation>('portrait')

  useEffect(() => {
    const mq = window.matchMedia('(orientation: landscape)')
    const update = () => setOrientation(mq.matches ? 'landscape' : 'portrait')
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return orientation
}
