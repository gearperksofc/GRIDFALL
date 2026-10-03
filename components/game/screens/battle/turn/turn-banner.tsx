'use client'

import type { BattleState } from '@/types'
import { STRINGS } from '@/data/strings'
import { cn } from '@/lib/utils'

/** Faixa central: YOUR TURN / ENEMY TURN no início de cada turno e VICTORY / DEFEAT no fim. */
export function TurnBanner({ state }: { state: BattleState }) {
  const { phase, turn } = state
  const t = STRINGS.arena

  if (phase.kind === 'ended') {
    const victory = phase.outcome === 'victory'
    return (
      <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
        <p
          role="status"
          className={cn(
            'animate-pop-in rounded-md border-[4px] bg-night-deep/90 px-6 py-3 font-display text-[18px] uppercase text-shadow-pixel',
            victory ? 'border-gold text-gold' : 'border-destructive text-destructive',
          )}
        >
          {victory ? t.victory : t.defeat}
        </p>
      </div>
    )
  }

  if (phase.kind !== 'banner' || !turn.actor) return null
  const mine = turn.actor === 'player'
  return (
    <p
      key={`${turn.number}-${turn.actor}`}
      role="status"
      className={cn(
        'animate-turn-banner pointer-events-none absolute top-1/2 left-1/2 z-30 w-[120%] origin-center py-2.5 text-center font-display text-[15px] uppercase text-shadow-pixel',
        mine ? 'bg-gold/90 text-primary-foreground' : 'bg-destructive/90 text-parchment',
      )}
    >
      {mine ? t.yourTurn : t.enemyTurn}
    </p>
  )
}

/** Indicador persistente do turno atual. */
export function TurnIndicator({ state }: { state: BattleState }) {
  const { turn, phase } = state
  const t = STRINGS.arena
  if (!turn.actor || phase.kind === 'roulette') return <div className="h-5" aria-hidden="true" />
  const mine = turn.actor === 'player'
  return (
    <div className="flex h-5 items-center justify-center gap-2 font-display text-[7px] uppercase">
      <span className="text-parchment/50">
        {t.turn} {turn.number}
      </span>
      <span
        className={cn(
          'rounded-sm border-2 px-2 py-0.5',
          mine ? 'border-gold bg-gold/15 text-gold' : 'border-destructive bg-destructive/15 text-destructive',
        )}
      >
        {mine ? t.yourTurn : t.enemyTurn}
      </span>
    </div>
  )
}
