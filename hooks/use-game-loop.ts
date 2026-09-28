'use client'

import { useEffect, useRef } from 'react'
import { GameLoop, type GameLoopCallbacks } from '@/game/engine/game-loop'
import { GAME_CONFIG } from '@/data/config'
import { gameStore } from '@/game/state/game-store'

/**
 * Executa o GameLoop enquanto `active` for verdadeiro.
 * Os callbacks são lidos via ref para não reiniciar o loop a cada render.
 * Publica o FPS na store em intervalo controlado.
 */
export function useGameLoop(callbacks: GameLoopCallbacks, active: boolean) {
  const callbacksRef = useRef(callbacks)
  callbacksRef.current = callbacks

  useEffect(() => {
    if (!active) return

    const loop = new GameLoop(
      {
        update: (dt) => callbacksRef.current.update(dt),
        render: (alpha) => callbacksRef.current.render(alpha),
      },
      { tickRate: GAME_CONFIG.tickRate },
    )

    const fpsTimer = window.setInterval(() => {
      gameStore.dispatch({ type: 'SET_FPS', fps: loop.fps })
    }, GAME_CONFIG.fpsPublishInterval)

    loop.start()
    return () => {
      loop.stop()
      window.clearInterval(fpsTimer)
    }
  }, [active])
}
