'use client'

import { STRINGS } from '@/data/strings'
import { cn } from '@/lib/utils'
import type { Unit } from '@/types'

function StatBar({ label, value, max, fill }: { label: string; value: number; max: number; fill: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-5 font-display text-[6px] text-parchment/60">{label}</span>
      <div
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        className="relative h-3 flex-1 overflow-hidden rounded-sm border-2 border-night-deep bg-night-deep"
      >
        <div
          className={cn('h-full origin-left transition-transform duration-300', fill)}
          style={{ transform: `scaleX(${max > 0 ? value / max : 0})` }}
        />
      </div>
      <span className="w-12 text-right font-display text-[6px] text-parchment tabular-nums">
        {Math.round(value)}/{max}
      </span>
    </div>
  )
}

/** HUD de uma unidade: nome, nível, HP e MP. */
export function UnitStatusCard({ unit, align = 'left' }: { unit: Unit; align?: 'left' | 'right' }) {
  const isEnemy = unit.team === 'enemy'
  const t = STRINGS.arena

  return (
    <section
      aria-label={`${isEnemy ? t.enemy : t.player}: ${unit.name}`}
      className={cn(
        'flex min-w-0 flex-1 flex-col gap-1.5 rounded-lg border-[3px] bg-night-deep/85 px-2.5 py-2 shadow-[inset_0_2px_0_oklch(1_0_0/0.05),0_4px_0_oklch(0_0_0/0.55)]',
        isEnemy ? 'border-destructive/70' : 'border-gold-dim',
      )}
    >
      <div className={cn('flex items-baseline justify-between gap-2', align === 'right' && 'flex-row-reverse')}>
        <span className={cn('truncate font-display text-[8px] uppercase', isEnemy ? 'text-destructive' : 'text-gold')}>
          {unit.name}
        </span>
        <span className="shrink-0 font-display text-[6px] text-parchment/55 uppercase">
          {isEnemy ? t.enemy : t.player} · {t.level} {unit.level}
        </span>
      </div>
      <StatBar label={t.hp} value={unit.hp} max={unit.maxHp} fill={isEnemy ? 'bg-destructive' : 'bg-gold'} />
      <StatBar label={t.mp} value={unit.mp} max={unit.maxMp} fill="bg-arcane" />
    </section>
  )
}
