'use client'

import { useEffect, useEffectEvent } from 'react'

/**
 * Chama `onTick(dtMs)` a cada frame enquanto `active` for verdadeiro.
 * Pausar = parar de acumular tempo, então timers baseados em dt congelam juntos.
 */
export function useTicker(onTick: (dtMs: number) => void, active: boolean) {
  const tick = useEffectEvent(onTick)

  useEffect(() => {
    if (!active) return
    let frame = 0
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(now - last, 100)
      last = now
      tick(dt)
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [active])
}
