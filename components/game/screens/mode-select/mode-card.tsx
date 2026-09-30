'use client'

import Image from 'next/image'
import { Bot, Crown, Globe, Lock, Puzzle, Target, type LucideIcon } from 'lucide-react'
import type { GameMode } from '@/types'
import type { GameModeDefinition, ModeAccent } from '@/data/game-modes'
import { STRINGS } from '@/data/strings'
import { cn } from '@/lib/utils'

const MODE_ICONS: Record<GameMode, LucideIcon> = {
  vsBot: Bot,
  pvp: Globe,
  bossRush: Crown,
  challenges: Puzzle,
  training: Target,
}

const ACCENT_STYLES: Record<
  ModeAccent,
  { border: string; glow: string; badge: string; icon: string; ring: string }
> = {
  gold: {
    border: 'border-gold-dim',
    glow: 'bg-[radial-gradient(ellipse_at_top,oklch(0.83_0.14_85/0.35),transparent_65%)]',
    badge: 'bg-gold text-[oklch(0.22_0.06_60)] border-gold-dim',
    icon: 'text-gold',
    ring: 'hover:shadow-[inset_0_2px_0_oklch(1_0_0/0.08),0_6px_0_oklch(0.09_0.03_272),0_0_28px_-4px_var(--gold)]',
  },
  arcane: {
    border: 'border-[oklch(0.5_0.1_195)]',
    glow: 'bg-[radial-gradient(ellipse_at_top,oklch(0.72_0.14_195/0.3),transparent_65%)]',
    badge: 'bg-arcane text-night-deep border-[oklch(0.5_0.1_195)]',
    icon: 'text-arcane',
    ring: 'hover:shadow-[inset_0_2px_0_oklch(1_0_0/0.08),0_6px_0_oklch(0.09_0.03_272),0_0_28px_-4px_var(--arcane)]',
  },
  crimson: {
    border: 'border-[oklch(0.5_0.16_25)]',
    glow: 'bg-[radial-gradient(ellipse_at_top,oklch(0.62_0.2_25/0.35),transparent_65%)]',
    badge: 'bg-[oklch(0.62_0.2_25)] text-parchment border-[oklch(0.45_0.16_25)]',
    icon: 'text-[oklch(0.72_0.19_25)]',
    ring: 'hover:shadow-[inset_0_2px_0_oklch(1_0_0/0.08),0_6px_0_oklch(0.09_0.03_272),0_0_28px_-4px_oklch(0.62_0.2_25)]',
  },
  violet: {
    border: 'border-[oklch(0.5_0.14_300)]',
    glow: 'bg-[radial-gradient(ellipse_at_top,oklch(0.65_0.18_300/0.35),transparent_65%)]',
    badge: 'bg-[oklch(0.65_0.18_300)] text-parchment border-[oklch(0.45_0.14_300)]',
    icon: 'text-[oklch(0.75_0.16_300)]',
    ring: 'hover:shadow-[inset_0_2px_0_oklch(1_0_0/0.08),0_6px_0_oklch(0.09_0.03_272),0_0_28px_-4px_oklch(0.65_0.18_300)]',
  },
  emerald: {
    border: 'border-[oklch(0.5_0.12_150)]',
    glow: 'bg-[radial-gradient(ellipse_at_top,oklch(0.72_0.16_150/0.3),transparent_65%)]',
    badge: 'bg-[oklch(0.72_0.16_150)] text-night-deep border-[oklch(0.5_0.12_150)]',
    icon: 'text-[oklch(0.78_0.16_150)]',
    ring: 'hover:shadow-[inset_0_2px_0_oklch(1_0_0/0.08),0_6px_0_oklch(0.09_0.03_272),0_0_28px_-4px_oklch(0.72_0.16_150)]',
  },
}

interface ModeCardProps {
  mode: GameModeDefinition
  index: number
  featured?: boolean
  onSelect: (mode: GameModeDefinition) => void
}

export function ModeCard({ mode, index, featured = false, onSelect }: ModeCardProps) {
  const Icon = MODE_ICONS[mode.id]
  const accent = ACCENT_STYLES[mode.accent]
  const available = mode.status === 'available'
  const statusLabel = available ? STRINGS.modeSelect.available : STRINGS.modeSelect.inDevelopment

  return (
    <button
      type="button"
      onClick={() => onSelect(mode)}
      aria-disabled={!available}
      aria-label={`${mode.title} — ${statusLabel}`}
      style={{ '--rise-delay': `${0.08 + index * 0.06}s` } as React.CSSProperties}
      className={cn(
        'animate-rise-in group relative flex w-full overflow-hidden rounded-xl border-[3px] text-left select-none',
        'bg-[linear-gradient(180deg,oklch(0.3_0.055_270),oklch(0.19_0.045_272))]',
        'shadow-[inset_0_2px_0_oklch(1_0_0/0.08),0_6px_0_oklch(0.09_0.03_272),0_12px_24px_-8px_oklch(0_0_0/0.8)]',
        'transition-[transform,box-shadow,filter,border-color] duration-150 ease-out',
        'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-arcane',
        featured ? 'min-h-40 flex-row' : 'min-h-[188px] flex-col',
        available
          ? cn(
              accent.border,
              'hover:-translate-y-1 hover:brightness-110',
              accent.ring,
              'active:translate-y-1 active:shadow-[inset_0_2px_0_oklch(1_0_0/0.08),0_2px_0_oklch(0.09_0.03_272),0_6px_14px_-8px_oklch(0_0_0/0.8)]',
            )
          : 'border-panel-edge cursor-not-allowed active:scale-[0.985]',
      )}
    >
      <span
        aria-hidden="true"
        className={cn('pointer-events-none absolute inset-0', accent.glow, !available && 'opacity-40')}
      />
      <span aria-hidden="true" className="bg-diamond-tiles pointer-events-none absolute inset-0 opacity-60" />

      {available && (
        <span
          aria-hidden="true"
          className="animate-shine pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-[linear-gradient(90deg,transparent,oklch(1_0_0/0.14),transparent)]"
        />
      )}

      <div
        className={cn(
          'relative shrink-0',
          featured ? 'w-[42%] min-w-[130px]' : 'h-24 w-full',
        )}
      >
        <Image
          src={mode.art}
          alt=""
          fill
          sizes={featured ? '(max-width: 560px) 45vw, 240px' : '(max-width: 560px) 50vw, 220px'}
          className={cn(
            'object-cover transition-transform duration-300 ease-out [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_95%)]',
            available ? 'group-hover:scale-110' : 'grayscale-[0.7] brightness-[0.55] saturate-[0.6]',
          )}
        />
        {!available && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-12 items-center justify-center rounded-full border-2 border-panel-edge bg-night-deep/85 text-parchment/70 shadow-[0_4px_12px_oklch(0_0_0/0.6)]">
              <Lock className="size-6" aria-hidden="true" />
            </span>
          </span>
        )}
      </div>

      <div className={cn('relative flex min-w-0 flex-1 flex-col gap-1.5 p-3', featured && 'justify-center py-4 pr-4')}>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'flex size-7 shrink-0 items-center justify-center rounded-md border-2 bg-night-deep/80',
              available ? cn(accent.border, accent.icon) : 'border-panel-edge text-parchment/45',
            )}
          >
            <Icon className="size-4" strokeWidth={2.5} aria-hidden="true" />
          </span>
          <h3
            className={cn(
              'text-shadow-pixel font-display leading-tight uppercase',
              featured ? 'text-sm' : 'text-[10px]',
              available ? 'text-parchment' : 'text-parchment/55',
            )}
          >
            {mode.title}
          </h3>
        </div>
        <p
          className={cn(
            'font-body leading-snug',
            featured ? 'text-base' : 'text-sm',
            available ? 'text-parchment/80' : 'text-parchment/45',
          )}
        >
          {mode.description}
        </p>

        <div className="mt-auto flex items-center justify-end pt-2">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-sm border-2 px-2 py-1 font-display text-[7px] tracking-wide uppercase',
              available
                ? cn(accent.badge, 'shadow-[0_2px_0_oklch(0_0_0/0.5)]')
                : 'border-panel-edge bg-night-deep/80 text-parchment/60',
            )}
          >
            {available ? (
              <span aria-hidden="true" className="size-1.5 animate-pulse rounded-full bg-current" />
            ) : (
              <Lock className="size-2.5" aria-hidden="true" />
            )}
            {statusLabel}
          </span>
        </div>
      </div>
    </button>
  )
}
