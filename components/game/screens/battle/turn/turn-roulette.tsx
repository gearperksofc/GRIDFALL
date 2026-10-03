'use client'

import { useEffect, useEffectEvent, useState } from 'react'
import type { TurnActor } from '@/types'
import { STRINGS } from '@/data/strings'
import { cn } from '@/lib/utils'

const SPIN_MS = 2600
const RESULT_HOLD_MS = 1000
const START_DELAY_MS = 450

interface TurnRouletteProps {
  /** Probabilidade (0..1) de o ponteiro cair no AZUL. */
  playerChance: number
  onDone: (first: TurnActor) => void
}

/**
 * Roleta AZUL/VERMELHO que define quem começa. O resultado é sorteado antes
 * do giro e o ângulo final é calculado para cair na metade correta.
 */
export function TurnRoulette({ playerChance, onDone }: TurnRouletteProps) {
  const [spin] = useState(() => {
    const first: TurnActor = Math.random() < playerChance ? 'player' : 'enemy'
    // Azul ocupa 0–180° (sentido horário a partir do topo). O ponteiro fixo no topo
    // aponta para o ângulo (360 - rotação) mod 360.
    const landing = (first === 'player' ? 0 : 180) + 14 + Math.random() * 152
    const rotation = 360 * 5 + (360 - landing)
    return { first, rotation }
  })
  const [stage, setStage] = useState<'idle' | 'spinning' | 'result'>('idle')
  const t = STRINGS.arena

  const done = useEffectEvent(() => onDone(spin.first))

  useEffect(() => {
    const start = window.setTimeout(() => setStage('spinning'), START_DELAY_MS)
    const land = window.setTimeout(() => setStage('result'), START_DELAY_MS + SPIN_MS)
    const finish = window.setTimeout(done, START_DELAY_MS + SPIN_MS + RESULT_HOLD_MS)
    return () => {
      window.clearTimeout(start)
      window.clearTimeout(land)
      window.clearTimeout(finish)
    }
  }, [])

  const resultLabel = spin.first === 'player' ? t.yourTurn : t.enemyTurn

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.rouletteTitle}
      className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-5 bg-night-deep/80 backdrop-blur-[2px]"
    >
      <h2 className="font-display text-[11px] text-parchment uppercase text-shadow-pixel">{t.rouletteTitle}</h2>

      <div className="relative size-44">
        <span
          aria-hidden="true"
          className="absolute -top-1 left-1/2 z-10 size-0 -translate-x-1/2 border-x-[10px] border-t-[16px] border-x-transparent border-t-parchment drop-shadow-[0_2px_0_var(--night-deep)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full border-[5px] border-panel-edge shadow-[0_8px_0_oklch(0_0_0/0.55),inset_0_0_0_3px_var(--night-deep)]"
          style={{
            background: 'conic-gradient(var(--azure) 0deg 180deg, var(--destructive) 180deg 360deg)',
            transform: `rotate(${stage === 'idle' ? 0 : spin.rotation}deg)`,
            transition: stage === 'idle' ? 'none' : `transform ${SPIN_MS}ms cubic-bezier(0.12, 0.8, 0.18, 1)`,
          }}
        >
          <span className="absolute inset-0 rounded-full shadow-[inset_0_0_28px_oklch(0_0_0/0.45)]" />
          <span className="absolute top-1/2 left-1/2 size-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-panel-edge bg-night-deep" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-1.5 font-display text-[7px] uppercase">
        <span className="flex items-center gap-2 text-parchment/80">
          <span aria-hidden="true" className="size-3 rounded-sm border border-night-deep bg-azure" />
          {t.rouletteBlue}
        </span>
        <span className="flex items-center gap-2 text-parchment/80">
          <span aria-hidden="true" className="size-3 rounded-sm border border-night-deep bg-destructive" />
          {t.rouletteRed}
        </span>
      </div>

      <p
        aria-live="assertive"
        className={cn(
          'min-h-6 font-display text-[12px] uppercase text-shadow-pixel',
          stage === 'result' ? (spin.first === 'player' ? 'animate-pop-in text-azure' : 'animate-pop-in text-destructive') : 'text-parchment/50',
        )}
      >
        {stage === 'result' ? resultLabel : stage === 'spinning' ? t.rouletteSpinning : '…'}
      </p>
    </div>
  )
}
