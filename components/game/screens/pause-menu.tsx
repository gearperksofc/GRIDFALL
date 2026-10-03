'use client'

import { STRINGS } from '@/data/strings'
import { useGameDispatch } from '@/hooks/use-game-store'
import { RpgButton } from '../ui/rpg-button'
import { RpgFrame } from '../ui/rpg-frame'

export function PauseMenu() {
  const dispatch = useGameDispatch()

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pause-heading"
      className="absolute inset-0 z-20 flex items-center justify-center bg-night-deep/80 p-6 backdrop-blur-[2px]"
    >
      <RpgFrame className="w-full max-w-xs space-y-3 p-5">
        <h2
          id="pause-heading"
          className="text-shadow-pixel mb-5 text-center font-display text-sm text-gold"
        >
          {STRINGS.pause.heading}
        </h2>
        <RpgButton onClick={() => dispatch({ type: 'RESUME' })} autoFocus>
          {STRINGS.pause.resume}
        </RpgButton>
        <RpgButton variant="ghost" disabled>
          {STRINGS.pause.settings}
        </RpgButton>
        <RpgButton variant="ghost" onClick={() => dispatch({ type: 'REQUEST_EXIT' })}>
          {STRINGS.pause.quit}
        </RpgButton>
      </RpgFrame>
    </div>
  )
}
