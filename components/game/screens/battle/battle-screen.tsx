'use client'

import { useEffect } from 'react'
import { LogOut } from 'lucide-react'
import { STRINGS } from '@/data/strings'
import { useGameDispatch, useGameStore } from '@/hooks/use-game-store'
import { getInputManager } from '@/hooks/use-input'
import { WorldCanvas } from '../../world/world-canvas'
import { Hud } from '../../hud/hud'
import { VirtualControls } from '../../hud/virtual-controls'
import { ConfirmDialog } from '../../ui/confirm-dialog'
import { PauseMenu } from '../pause-menu'
import { BattleDevPanel } from './battle-dev-panel'

/** Arena da partida vs Bot. O combate real será conectado aqui. */
export function BattleScreen() {
  const dispatch = useGameDispatch()
  const phase = useGameStore((s) => s.phase)
  const exitPrompt = useGameStore((s) => s.exitPrompt)
  const showDebug = useGameStore((s) => s.settings.showDebug)
  const isPaused = phase === 'paused'

  useEffect(() => {
    const input = getInputManager()
    return input.subscribe((key, pressed) => {
      if (key === 'menu' && pressed && !exitPrompt) dispatch({ type: isPaused ? 'RESUME' : 'PAUSE' })
    })
  }, [dispatch, isPaused, exitPrompt])

  return (
    <section className="relative h-full w-full overflow-hidden">
      <WorldCanvas active={!isPaused && !exitPrompt} />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,oklch(0_0_0/0.55)_100%)]"
      />

      <Hud />

      {showDebug && <BattleDevPanel />}

      <VirtualControls />

      {isPaused && !exitPrompt && <PauseMenu />}

      {exitPrompt && (
        <ConfirmDialog
          icon={LogOut}
          title={STRINGS.battle.exitTitle}
          description={STRINGS.battle.exitHint}
          confirmLabel={STRINGS.battle.abandon}
          cancelLabel={STRINGS.battle.continue}
          onConfirm={() => dispatch({ type: 'ABANDON_MATCH' })}
          onCancel={() => dispatch({ type: 'CANCEL_EXIT' })}
          destructive
        />
      )}
    </section>
  )
}
