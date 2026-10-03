'use client'

import { Hammer, Skull, Trophy } from 'lucide-react'
import { STRINGS } from '@/data/strings'
import { finishMatch } from '@/game/match/match-controller'

/**
 * Painel temporário enquanto o sistema de combate não existe.
 * Visível apenas com a depuração ativada; permite testar o fluxo
 * Batalha → Resultado → Desbloqueio sem combate real.
 */
export function BattleDevPanel() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-[22%] flex justify-center px-6">
      <div className="rpg-frame pointer-events-auto flex w-full max-w-xs flex-col gap-3 p-4 text-center">
        <div className="flex items-center justify-center gap-2 text-gold">
          <Hammer className="size-4" aria-hidden="true" />
          <p className="font-display text-[8px] leading-relaxed uppercase">{STRINGS.battle.devHeading}</p>
        </div>
        <p className="font-body text-sm text-parchment/65">{STRINGS.battle.devHint}</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => finishMatch('victory')}
            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md border-2 border-gold-dim bg-gold px-2 font-display text-[7px] text-[oklch(0.22_0.06_60)] uppercase shadow-[0_3px_0_oklch(0.42_0.1_60)] transition-transform active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-arcane"
          >
            <Trophy className="size-3.5" aria-hidden="true" />
            {STRINGS.battle.simulateVictory}
          </button>
          <button
            type="button"
            onClick={() => finishMatch('defeat')}
            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md border-2 border-destructive/70 bg-night-deep px-2 font-display text-[7px] text-destructive uppercase shadow-[0_3px_0_oklch(0_0_0/0.6)] transition-transform active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-arcane"
          >
            <Skull className="size-3.5" aria-hidden="true" />
            {STRINGS.battle.simulateDefeat}
          </button>
        </div>
      </div>
    </div>
  )
}
