'use client'

import { Hammer, Skull, Trophy } from 'lucide-react'
import { STRINGS } from '@/data/strings'
import { finishMatch } from '@/game/match/match-controller'

/**
 * Atalhos de depuração enquanto o combate (habilidades/dano) não existe.
 * Visível apenas com a depuração ativada; permite testar Batalha → Resultado.
 */
export function BattleDevPanel() {
  return (
    <div className="flex items-center gap-2 rounded-lg border-2 border-dashed border-panel-edge bg-night-deep/70 p-1.5">
      <span className="flex items-center gap-1 pl-1 font-display text-[6px] text-parchment/50 uppercase">
        <Hammer className="size-3" aria-hidden="true" />
        {STRINGS.arena.devTools}
      </span>
      <button
        type="button"
        onClick={() => finishMatch('victory')}
        className="ml-auto inline-flex min-h-9 items-center gap-1 rounded-md border-2 border-gold-dim bg-gold px-2 font-display text-[6px] text-primary-foreground uppercase transition-transform active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-arcane"
      >
        <Trophy className="size-3" aria-hidden="true" />
        {STRINGS.battle.simulateVictory}
      </button>
      <button
        type="button"
        onClick={() => finishMatch('defeat')}
        className="inline-flex min-h-9 items-center gap-1 rounded-md border-2 border-destructive/70 bg-night-deep px-2 font-display text-[6px] text-destructive uppercase transition-transform active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-arcane"
      >
        <Skull className="size-3" aria-hidden="true" />
        {STRINGS.battle.simulateDefeat}
      </button>
    </div>
  )
}
