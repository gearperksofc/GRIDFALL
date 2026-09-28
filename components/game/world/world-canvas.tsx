'use client'

import { useEffect, useRef } from 'react'
import type { Camera } from '@/types'
import { GAME_CONFIG } from '@/data/config'
import { updateCamera } from '@/game/systems/camera-system'
import { renderWorld } from '@/game/render/world-renderer'
import { useGameLoop } from '@/hooks/use-game-loop'
import { getInputManager } from '@/hooks/use-input'
import { useElementSize } from '@/hooks/use-viewport'

interface WorldCanvasProps {
  active: boolean
}

/**
 * Ponte entre o loop de jogo e o <canvas>.
 * Estado mutável do mundo (câmera, tempo) fica em refs — nunca em useState —
 * para não re-renderizar React a cada frame.
 */
export function WorldCanvas({ active }: WorldCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const size = useElementSize(containerRef)

  const cameraRef = useRef<Camera>({ position: { x: 0, y: 0 }, zoom: 1 })
  const timeRef = useRef(0)
  const input = getInputManager()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || size.width === 0) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = size.width * dpr
    canvas.height = size.height * dpr
    canvas.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0)
  }, [size])

  useGameLoop(
    {
      update: (dt) => {
        timeRef.current += dt
        cameraRef.current = updateCamera(
          cameraRef.current,
          input.getAxis(),
          GAME_CONFIG.cameraSpeed,
          dt,
        )
      },
      render: () => {
        const ctx = canvasRef.current?.getContext('2d')
        if (!ctx || size.width === 0) return
        renderWorld(ctx, size, cameraRef.current, {
          tileSize: GAME_CONFIG.tileSize,
          time: timeRef.current,
        })
      },
    },
    active,
  )

  return (
    <div ref={containerRef} className="absolute inset-0">
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        style={{ width: size.width, height: size.height }}
        role="img"
        aria-label="Mapa do mundo"
      />
    </div>
  )
}
