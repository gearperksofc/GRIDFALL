'use client'

import { STRINGS } from '@/data/strings'
import { cn } from '@/lib/utils'
import type { Unit } from '@/types'

/** Barra com "rastro": a camada clara demora a acompanhar, evidenciando o dano recebido. */
function StatBar({ label, value, max, fill }: { label: string; value: number; max: number; fill: string }) {
  const scale = `scaleX(${max > 0 ? value / max : 0})`
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
          aria-hidden="true"
          className="absolute inset-0 origin-left bg-parchment/55 transition-transform duration-700 ease-out delay-300"
          style={{ transform: scale }}
        />
        <div className={cn('absolute inset-0 origin-left transition-transform duration-200', fill)} style={{ transform: scale }} />
      </div>
      <span className="w-12 text-right font-display text-[6px] text-parchment tabular-nums">
        {Math.round(value)}/{max}
      </span>
    </div>
  )
}

interface UnitStatusCardProps {
  unit: Unit
  align?: 'left' | 'right'
  /** Destaca o card de quem está no turno. */
  active?: boolean
  hit?: boolean
}

/** HUD de uma unidade: nome, nível, HP e MP. */
export function UnitStatusCard({ unit, align = 'left', active = false, hit = false }: UnitStatusCardProps) {
  const isEnemy = unit.team === 'enemy'
  const t = STRINGS.arena

  return (
    <section
      aria-label={`${isEnemy ? t.enemy : t.player}: ${unit.name}`}
      className={cn(
        'flex min-w-0 flex-1 flex-col gap-1.5 rounded-lg border-[3px] bg-night-deep/85 px-2.5 py-2 shadow-[inset_0_2px_0_oklch(1_0_0/0.05),0_4px_0_oklch(0_0_0/0.55)] transition-[border-color,box-shadow] duration-300',
        isEnemy ? 'border-destructive/70' : 'border-gold-dim',
        active && (isEnemy ? 'border-destructive shadow-[0_0_16px_oklch(0.6_0.2_28/0.5)]' : 'border-gold shadow-[0_0_16px_oklch(0.83_0.14_85/0.5)]'),
        hit && 'animate-bump',
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
