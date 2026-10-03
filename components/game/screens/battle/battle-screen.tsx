'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { LogOut } from 'lucide-react'
import type { GameSession } from '@/types'
import { getStage } from '@/data/stages'
import { STRINGS } from '@/data/strings'
import { resolveInventory } from '@/game/chest/chest-system'
import { useGameDispatch, useGameStore } from '@/hooks/use-game-store'
import { getInputManager } from '@/hooks/use-input'
import { Hud } from '../../hud/hud'
import { ConfirmDialog } from '../../ui/confirm-dialog'
import { PauseMenu } from '../pause-menu'
import { BattleDevPanel } from './battle-dev-panel'
import { ArenaBoard } from './arena/arena-board'
import { UnitStatusCard } from './arena/unit-status-card'
import { useArena } from './arena/use-arena'

/** Arena da partida vs Bot. */
export function BattleScreen() {
  const session = useGameStore((s) => s.session)
  if (!session) return null
  return <BattleArena session={session} />
}

function BattleArena({ session }: { session: GameSession }) {
  const dispatch = useGameDispatch()
  const phase = useGameStore((s) => s.phase)
  const exitPrompt = useGameStore((s) => s.exitPrompt)
  const showDebug = useGameStore((s) => s.settings.showDebug)
  const isPaused = phase === 'paused'
  const frozen = isPaused || exitPrompt

  const ai = getStage(session.stageId)?.enemy.ai ?? null
  const { units, reachable, movePlayer, healPlayer } = useArena(session, ai, frozen)

  const potions = resolveInventory(session.inventory).filter(({ item }) => item.effect?.type === 'heal')
  const nextPotion = potions[0]
  const player = units.player.unit
  const isFullHp = player.hp >= player.maxHp

  useEffect(() => {
    const input = getInputManager()
    return input.subscribe((key, pressed) => {
      if (key === 'menu' && pressed && !exitPrompt) dispatch({ type: isPaused ? 'RESUME' : 'PAUSE' })
    })
  }, [dispatch, isPaused, exitPrompt])

  const drinkPotion = () => {
    if (!nextPotion || isFullHp || nextPotion.item.effect?.type !== 'heal') return
    healPlayer(nextPotion.item.effect.amount)
    dispatch({ type: 'USE_ITEM', uid: nextPotion.uid })
  }

  return (
    <section className="relative h-full w-full overflow-hidden bg-night-deep">
      <div aria-hidden="true" className="bg-diamond-tiles pointer-events-none absolute inset-0 opacity-30" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,transparent_35%,oklch(0_0_0/0.65)_100%)]"
      />

      <div className="relative mx-auto flex h-full w-full max-w-lg flex-col gap-2 px-3 pt-24 pb-3">
        <div className="flex gap-2">
          <UnitStatusCard unit={player} />
          <UnitStatusCard unit={units.enemy.unit} align="right" />
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center [container-type:size]">
          <ArenaBoard units={units} reachable={reachable} onCellPress={movePlayer} />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <p className="flex-1 font-body text-sm leading-snug text-parchment/60">{STRINGS.arena.moveHint}</p>
            <button
              type="button"
              onClick={drinkPotion}
              disabled={!nextPotion || isFullHp}
              aria-label={STRINGS.arena.usePotion}
              title={!nextPotion ? STRINGS.arena.noPotion : isFullHp ? STRINGS.arena.fullHp : STRINGS.arena.usePotion}
              className="relative flex size-12 shrink-0 items-center justify-center rounded-lg border-[3px] border-panel-edge bg-panel shadow-[inset_0_-4px_0_var(--night-deep)] transition-transform active:translate-y-0.5 disabled:opacity-40 enabled:hover:border-gold-dim focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-arcane"
            >
              <Image src="/images/items/small-potion.png" alt="" width={28} height={28} className="[image-rendering:pixelated]" />
              <span className="absolute -right-1.5 -bottom-1.5 flex size-5 items-center justify-center rounded-full border-2 border-night-deep bg-gold font-display text-[7px] text-primary-foreground">
                {potions.length}
              </span>
            </button>
          </div>
          {showDebug && <BattleDevPanel />}
        </div>
      </div>

      <Hud />

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
