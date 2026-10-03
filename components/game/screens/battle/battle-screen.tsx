'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { LogOut, SkipForward } from 'lucide-react'
import type { GameSession, MinigameGrade, SkillDefinition } from '@/types'
import { getStage } from '@/data/stages'
import { STRINGS } from '@/data/strings'
import { MATCH_PHASES } from '@/data/match-flow'
import { ARENA_CELLS } from '@/game/arena/arena-grid'
import { resolveInventory } from '@/game/chest/chest-system'
import { useGameDispatch, useGameStore } from '@/hooks/use-game-store'
import { getInputManager } from '@/hooks/use-input'
import { Hud } from '../../hud/hud'
import { ConfirmDialog } from '../../ui/confirm-dialog'
import { PauseMenu } from '../pause-menu'
import { BattleDevPanel } from './battle-dev-panel'
import { BattleEffectsLayer } from './battle-effects-layer'
import { ArenaBoard, type CellMark } from './arena/arena-board'
import { UnitStatusCard } from './arena/unit-status-card'
import { BarrierPanel } from './skills/barrier-panel'
import { DirectStrikeOverlay } from './skills/direct-strike-overlay'
import { LacerationOverlay } from './skills/laceration-overlay'
import { MeteorOverlay } from './skills/meteor-overlay'
import { SkillBar } from './skills/skill-bar'
import { DodgeBar } from './turn/dodge-bar'
import { TurnBanner, TurnIndicator } from './turn/turn-banner'
import { TurnRoulette } from './turn/turn-roulette'
import { useBattle } from './use-battle'

/** Arena da partida vs Bot. */
export function BattleScreen() {
  const session = useGameStore((s) => s.session)
  if (!session) return null
  // A chave reinicia o combate a cada Battle N da mesma partida.
  return <BattleArena key={`${session.attempt}-${session.matchPhase}`} session={session} />
}

function BattleArena({ session }: { session: GameSession }) {
  const dispatch = useGameDispatch()
  const phase = useGameStore((s) => s.phase)
  const exitPrompt = useGameStore((s) => s.exitPrompt)
  const showDebug = useGameStore((s) => s.settings.showDebug)
  const isPaused = phase === 'paused'
  const frozen = isPaused || exitPrompt

  const stage = getStage(session.stageId)
  const battle = useBattle(session, stage, frozen)
  const { state, canAct } = battle
  const boardRef = useRef<HTMLDivElement>(null)
  const [picked, setPicked] = useState<number[]>([])
  const t = STRINGS.arena

  const activeSkill: SkillDefinition | null = state.phase.kind === 'skill' ? state.phase.skill : null
  const pickingBarrier = activeSkill?.effect === 'barrier'

  useEffect(() => {
    if (!pickingBarrier) setPicked([])
  }, [pickingBarrier])

  const potions = resolveInventory(session.inventory).filter(({ item }) => item.effect?.type === 'heal')
  const nextPotion = potions[0]
  const player = state.units.player.unit
  const enemy = state.units.enemy.unit
  const isFullHp = player.hp >= player.maxHp

  useEffect(() => {
    const input = getInputManager()
    return input.subscribe((key, pressed) => {
      if (key === 'menu' && pressed && !exitPrompt) dispatch({ type: isPaused ? 'RESUME' : 'PAUSE' })
    })
  }, [dispatch, isPaused, exitPrompt])

  const drinkPotion = () => {
    if (!nextPotion || isFullHp || !canAct || nextPotion.item.effect?.type !== 'heal') return
    battle.healPlayer(nextPotion.item.effect.amount)
    dispatch({ type: 'USE_ITEM', uid: nextPotion.uid })
  }

  const onCellPress = (cell: number) => {
    if (!pickingBarrier || !activeSkill) {
      battle.movePlayer(cell)
      return
    }
    setPicked((prev) =>
      prev.includes(cell) ? prev.filter((c) => c !== cell) : prev.length < activeSkill.hits ? [...prev, cell] : prev,
    )
  }

  const confirmBarrier = () => {
    battle.setBarrier(picked)
    battle.skillDone()
  }

  const marks: Partial<Record<number, CellMark>> = {}
  state.barrier?.cells.forEach((c) => (marks[c] = 'protected'))
  picked.forEach((c) => (marks[c] = 'picked'))
  state.telegraph?.cells.forEach((c) => (marks[c] = 'telegraph'))

  const onSkillHit = (grade: MinigameGrade) => {
    if (activeSkill) battle.hitEnemy(activeSkill, grade)
  }

  const overlayProps = { boardRef, paused: frozen, onHit: onSkillHit, onDone: battle.skillDone }

  return (
    <section className="relative h-full w-full overflow-hidden bg-night-deep">
      <div aria-hidden="true" className="bg-diamond-tiles pointer-events-none absolute inset-0 opacity-30" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,transparent_35%,oklch(0_0_0/0.65)_100%)]"
      />

      <div className="relative mx-auto flex h-full w-full max-w-lg flex-col gap-1.5 px-3 pt-24 pb-3">
        <div className="flex gap-2">
          <UnitStatusCard unit={player} active={state.turn.actor === 'player'} hit={state.fx.player.hit} />
          <UnitStatusCard unit={enemy} align="right" active={state.turn.actor === 'enemy'} hit={state.fx.enemy.hit} />
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="font-display text-[6px] text-parchment/45 uppercase">
            {t.battle} {session.matchPhase}/{MATCH_PHASES}
          </span>
          <TurnIndicator state={state} />
          <span className="w-16" aria-hidden="true" />
        </div>

        <DodgeBar state={state} />

        <div className="flex min-h-0 flex-1 items-center justify-center [container-type:size]">
          <ArenaBoard
            boardRef={boardRef}
            units={state.units}
            reachable={battle.reachable}
            pickable={pickingBarrier ? ARENA_CELLS : []}
            marks={marks}
            fx={state.fx}
            onCellPress={onCellPress}
          >
            {activeSkill?.effect === 'meteor' && <MeteorOverlay skill={activeSkill} {...overlayProps} />}
            {activeSkill?.effect === 'laceration' && <LacerationOverlay skill={activeSkill} {...overlayProps} />}
            {activeSkill?.effect === 'timing' && <DirectStrikeOverlay skill={activeSkill} {...overlayProps} />}
            <BattleEffectsLayer effects={state.effects} boardRef={boardRef} onExpire={battle.expireEffect} />
            <TurnBanner state={state} />
          </ArenaBoard>
        </div>

        <div className="flex flex-col gap-1.5">
          {pickingBarrier && activeSkill ? (
            <BarrierPanel skill={activeSkill} picked={picked} onConfirm={confirmBarrier} />
          ) : (
            <SkillBar unit={player} canAct={canAct} onUse={battle.castSkill} />
          )}

          <div className="flex items-center gap-2">
            <p className="flex-1 font-body text-sm leading-snug text-parchment/60">
              {state.telegraph ? t.dodge : canAct ? t.moveHint : state.turn.actor === 'enemy' ? t.waitTurn : ''}
            </p>
            <button
              type="button"
              onClick={battle.passTurn}
              disabled={!canAct}
              aria-label={t.pass}
              title={t.pass}
              className="flex size-12 shrink-0 items-center justify-center rounded-lg border-[3px] border-panel-edge bg-panel text-parchment shadow-[inset_0_-4px_0_var(--night-deep)] transition-transform active:translate-y-0.5 disabled:opacity-40 enabled:hover:border-gold-dim focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-arcane"
            >
              <SkipForward className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={drinkPotion}
              disabled={!nextPotion || isFullHp || !canAct}
              aria-label={t.usePotion}
              title={!nextPotion ? t.noPotion : isFullHp ? t.fullHp : t.usePotion}
              className="relative flex size-12 shrink-0 items-center justify-center rounded-lg border-[3px] border-panel-edge bg-panel shadow-[inset_0_-4px_0_var(--night-deep)] transition-transform active:translate-y-0.5 disabled:opacity-40 enabled:hover:border-gold-dim focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-arcane"
            >
              <Image src="/images/items/small-potion.png" alt="" width={28} height={28} className="[image-rendering:pixelated]" />
              <span className="absolute -right-1.5 -bottom-1.5 flex size-5 items-center justify-center rounded-full border-2 border-night-deep bg-gold font-display text-[7px] text-primary-foreground">
                {potions.length}
              </span>
            </button>
          </div>
          {showDebug && <BattleDevPanel onForceEnd={battle.forceEnd} />}
        </div>
      </div>

      <Hud />

      {state.phase.kind === 'roulette' && !frozen && (
        <TurnRoulette playerChance={battle.playerFirstChance} onDone={battle.rouletteDone} />
      )}

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
