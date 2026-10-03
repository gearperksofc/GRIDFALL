'use client'

import { Droplet, Heart, Minus, Plus, Shield, Swords, Wheat, Zap, type LucideIcon } from 'lucide-react'
import type { BuildAttributeDefinition, BuildAttributeId } from '@/types'
import { STRINGS } from '@/data/strings'
import { cn } from '@/lib/utils'

const ICONS: Record<BuildAttributeId, LucideIcon> = {
  attack: Swords,
  defense: Shield,
  speed: Zap,
  hp: Heart,
  mp: Droplet,
  farming: Wheat,
}

interface AttributeRowProps {
  attribute: BuildAttributeDefinition
  points: number
  /** Pontos confirmados em builds anteriores (não podem ser removidos). */
  lockedPoints: number
  canIncrease: boolean
  onChange: (delta: 1 | -1) => void
}

const stepButton =
  'flex size-10 shrink-0 items-center justify-center rounded-md border-[3px] transition-transform active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-30 disabled:active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-arcane'

export function AttributeRow({ attribute, points, lockedPoints, canIncrease, onChange }: AttributeRowProps) {
  const t = STRINGS.build
  const Icon = ICONS[attribute.id]
  const isMaxed = points >= attribute.maxPoints

  return (
    <li className="flex items-center gap-3 rounded-xl border-[3px] border-panel-edge bg-[linear-gradient(180deg,oklch(0.28_0.055_270),oklch(0.19_0.045_272))] p-2.5 shadow-[inset_0_2px_0_oklch(1_0_0/0.07),0_4px_0_oklch(0.09_0.03_272)]">
      <span
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-full border-2 bg-night',
          points > 0 ? 'border-gold text-gold' : 'border-panel-edge text-parchment/60',
        )}
      >
        <Icon className="size-5" aria-hidden="true" />
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-display text-[9px] text-parchment uppercase">{attribute.label}</span>
          <span className="font-display text-[6px] text-parchment/50 uppercase">
            {t.cost} {attribute.cost} {attribute.cost === 1 ? t.star : t.stars}
          </span>
        </div>
        <span className="truncate font-body text-xs text-parchment/60">{attribute.description}</span>
        <div className="flex gap-0.5" aria-hidden="true">
          {Array.from({ length: attribute.maxPoints }, (_, i) => (
            <span
              key={i}
              className={cn(
                'h-1.5 flex-1 rounded-[1px]',
                i < lockedPoints ? 'bg-gold-dim' : i < points ? 'bg-gold' : 'bg-night-deep',
              )}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label={`${t.decrease} ${attribute.label}`}
          disabled={points <= lockedPoints}
          onClick={() => onChange(-1)}
          className={cn(stepButton, 'border-panel-edge bg-panel text-parchment')}
        >
          <Minus className="size-4" aria-hidden="true" />
        </button>
        <output
          aria-label={attribute.label}
          className={cn('w-9 text-center font-display text-[11px] tabular-nums', isMaxed ? 'text-gold' : 'text-parchment')}
        >
          {isMaxed ? t.max : points}
        </output>
        <button
          type="button"
          aria-label={`${t.increase} ${attribute.label}`}
          disabled={!canIncrease}
          onClick={() => onChange(1)}
          className={cn(stepButton, 'border-gold-dim bg-gold text-primary-foreground')}
        >
          <Plus className="size-4" aria-hidden="true" />
        </button>
      </div>
    </li>
  )
}
