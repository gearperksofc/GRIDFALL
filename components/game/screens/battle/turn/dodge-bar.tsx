'use client'

import { Flame, Hourglass } from 'lucide-react'
import type { BattleState } from '@/types'
import { STRINGS } from '@/data/strings'

/** Aviso de ataque inimigo: skill anunciada + janela de esquiva encolhendo. */
export function DodgeBar({ state }: { state: BattleState }) {
  const t = STRINGS.arena
  const { phase, telegraph } = state

  if (phase.kind === 'enemyThink') {
    return (
      <div className="flex h-9 items-center justify-center gap-2 rounded-md border-2 border-panel-edge bg-night-deep/80 px-3 font-display text-[7px] text-parchment/70 uppercase">
        <Hourglass className="size-3.5 animate-pulse" aria-hidden="true" />
        {t.thinking}
      </div>
    )
  }

  if (!telegraph) return <div className="h-9" aria-hidden="true" />

  const ratio = Math.max(0, telegraph.remainingMs / telegraph.totalMs)
  return (
    <div
      role="alert"
      className="relative flex h-9 items-center justify-between gap-2 overflow-hidden rounded-md border-2 border-destructive bg-night-deep/85 px-3 font-display text-[7px] uppercase"
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 origin-left bg-destructive/35"
        style={{ width: `${ratio * 100}%` }}
      />
      <span className="relative flex items-center gap-1.5 text-parchment/85">
        <Flame className="size-3.5 text-destructive" aria-hidden="true" />
        {t.enemyUses} {telegraph.skill.name}
      </span>
      <span className="relative animate-blink text-destructive">{t.dodge}</span>
    </div>
  )
}
