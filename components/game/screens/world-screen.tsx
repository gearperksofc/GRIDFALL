'use client'

import { useEffect } from 'react'
import { STRINGS } from '@/data/strings'
import { useGameDispatch, useGameStore } from '@/hooks/use-game-store'
import { getInputManager } from '@/hooks/use-input'
import { WorldCanvas } from '../world/world-canvas'
import { Hud } from '../hud/hud'
import { VirtualControls } from '../hud/virtual-controls'
import { PauseMenu } from './pause-menu'

export function WorldScreen() {
  const dispatch = useGameDispatch()
  const phase = useGameStore((s) => s.phase)
  const isTraining = useGameStore((s) => s.session?.mode === 'training')
  const isPaused = phase === 'paused'

  useEffect(() => {
    const input = getInputManager()
    return input.subscribe((key, pressed) => {
      if (key === 'menu' && pressed) dispatch({ type: isPaused ? 'RESUME' : 'PAUSE' })
    })
  }, [dispatch, isPaused])

  return (
    <section className="relative h-full w-full overflow-hidden">
      <WorldCanvas active={!isPaused} />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,oklch(0_0_0/0.55)_100%)]"
      />

      <Hud />

      <div className="pointer-events-none absolute inset-x-0 top-[62%] px-8 text-center">
        <p className="text-shadow-pixel font-display text-[10px] leading-relaxed text-parchment/80">
          {isTraining ? STRINGS.world.trainingPlaceholder : STRINGS.world.placeholder}
        </p>
        <p className="mt-2 text-sm text-parchment/50">
          {isTraining ? STRINGS.world.trainingHint : STRINGS.world.hint}
        </p>
      </div>

      <VirtualControls />

      {isPaused && <PauseMenu />}
    </section>
  )
}
