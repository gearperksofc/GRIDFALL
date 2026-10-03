'use client'

import type { RefObject } from 'react'
import { Flame, Star, Timer, X } from 'lucide-react'
import { STRINGS } from '@/data/strings'
import { cn } from '@/lib/utils'

interface FarmingHudProps {
  round: number
  secondsLeft: number
  stars: number
  combo: number
  progressRef: RefObject<HTMLDivElement | null>
  onExit: () => void
}

function Stat({
  icon: Icon,
  label,
  value,
  bumpKey,
  className,
}: {
  icon: typeof Star
  label: string
  value: string | number
  bumpKey?: string | number
  className?: string
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg border-[3px] border-panel-edge bg-night-deep/85 px-2 py-2 shadow-[inset_0_2px_0_oklch(1_0_0/0.05),0_4px_0_oklch(0_0_0/0.55)]">
      <span className="flex items-center gap-1 font-display text-[6px] tracking-wider text-parchment/55 uppercase">
        <Icon className="size-2.5" aria-hidden="true" />
        {label}
      </span>
      <span key={bumpKey} className={cn('animate-bump font-display text-base tabular-nums', className)}>
        {value}
      </span>
    </div>
  )
}

export function FarmingHud({ round, secondsLeft, stars, combo, progressRef, onExit }: FarmingHudProps) {
  const t = STRINGS.farming
  const urgent = secondsLeft <= 5

  return (
    <header className="relative z-10 flex flex-col gap-2 px-3 pt-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onExit}
          aria-label={t.exit}
          className="flex size-11 shrink-0 items-center justify-center rounded-lg border-2 border-panel-edge bg-panel text-parchment shadow-[0_3px_0_oklch(0_0_0/0.5)] transition-transform active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-arcane"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
        <h2 className="text-shadow-pixel flex flex-1 items-center justify-center rounded-lg border-2 border-gold-dim bg-night-deep/85 py-3 font-display text-sm text-gold uppercase shadow-[0_4px_0_oklch(0_0_0/0.6)]">
          {t.heading} {round}
        </h2>
        <span aria-hidden="true" className="size-11 shrink-0" />
      </div>

      <div className="flex gap-2">
        <Stat
          icon={Timer}
          label={t.timer}
          value={`${secondsLeft}s`}
          bumpKey={urgent ? secondsLeft : undefined}
          className={urgent ? 'text-destructive' : 'text-parchment'}
        />
        <Stat icon={Star} label={t.stars} value={stars} bumpKey={stars} className="text-gold" />
        <Stat
          icon={Flame}
          label={t.combo}
          value={`x${combo}`}
          bumpKey={combo}
          className={combo >= 5 ? 'text-arcane' : 'text-parchment'}
        />
      </div>

      <div
        role="progressbar"
        aria-label={t.timer}
        aria-valuemin={0}
        aria-valuemax={30}
        aria-valuenow={secondsLeft}
        className="h-2 w-full overflow-hidden rounded-full border-2 border-panel-edge bg-night-deep"
      >
        <div
          ref={progressRef}
          className={cn('h-full w-full origin-left', urgent ? 'bg-destructive' : 'bg-gold')}
        />
      </div>
    </header>
  )
}
