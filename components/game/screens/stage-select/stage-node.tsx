'use client'

import { Check, Lock, Play } from 'lucide-react'
import type { StageStatus, StageView } from '@/types'
import { STRINGS } from '@/data/strings'
import { cn } from '@/lib/utils'
import { DifficultyStars } from '../../ui/difficulty-stars'
import { RewardList } from './reward-list'

export const NODE_SIZE = 72
export const ROW_HEIGHT = 136
export const MAP_PADDING_Y = 28
/** Posição horizontal (%) dos nós, alternando esquerda/direita. */
export const NODE_X = [26, 74] as const

export function nodeX(index: number) {
  return NODE_X[index % 2]
}

export function nodeY(index: number) {
  return MAP_PADDING_Y + NODE_SIZE / 2 + index * ROW_HEIGHT
}

const STATUS_STYLES: Record<
  StageStatus,
  { circle: string; number: string; badge: string; label: string }
> = {
  completed: {
    circle:
      'border-gold bg-[linear-gradient(180deg,oklch(0.9_0.16_90),oklch(0.72_0.16_65))] shadow-[inset_0_3px_0_oklch(1_0_0/0.45),0_6px_0_oklch(0.42_0.1_60),0_0_24px_-4px_var(--gold)]',
    number: 'text-[oklch(0.22_0.06_60)] drop-shadow-[0_1px_0_oklch(1_0_0/0.5)]',
    badge: 'border-gold-dim bg-gold text-[oklch(0.22_0.06_60)]',
    label: 'text-gold',
  },
  available: {
    circle:
      'border-arcane bg-[linear-gradient(180deg,oklch(0.34_0.07_215),oklch(0.2_0.06_230))] shadow-[inset_0_2px_0_oklch(1_0_0/0.12),0_6px_0_oklch(0.12_0.04_230),0_0_28px_-4px_var(--arcane)]',
    number: 'text-parchment text-shadow-pixel',
    badge: 'border-[oklch(0.5_0.1_195)] bg-arcane text-night-deep',
    label: 'text-arcane',
  },
  locked: {
    circle:
      'border-panel-edge bg-[linear-gradient(180deg,oklch(0.26_0.04_270),oklch(0.17_0.035_272))] shadow-[inset_0_2px_0_oklch(1_0_0/0.05),0_6px_0_oklch(0.09_0.03_272)]',
    number: 'text-parchment/35',
    badge: 'border-panel-edge bg-night-deep text-parchment/55',
    label: 'text-parchment/40',
  },
}

const STATUS_ICONS = { completed: Check, available: Play, locked: Lock } as const

interface StageNodeProps {
  stage: StageView
  index: number
  selected: boolean
  onSelect: (stage: StageView) => void
}

/** Um nó do mapa: círculo numerado + cartão lateral com nome, dificuldade e recompensa. */
export function StageNode({ stage, index, selected, onSelect }: StageNodeProps) {
  const style = STATUS_STYLES[stage.status]
  const StatusIcon = STATUS_ICONS[stage.status]
  const statusLabel = STRINGS.stageSelect.status[stage.status]
  const onLeft = index % 2 === 0
  const x = nodeX(index)
  const y = nodeY(index)
  const cardGap = NODE_SIZE / 2 + 14
  /** Distância da borda do mapa até o início do cartão, do lado oposto ao nó. */
  const cardOffset = onLeft ? `calc(${x}% + ${cardGap}px)` : `calc(${100 - x}% + ${cardGap}px)`

  return (
    <>
      <button
        type="button"
        onClick={() => onSelect(stage)}
        aria-pressed={selected}
        aria-label={`${STRINGS.stageSelect.stage} ${stage.number} — ${stage.name} — ${statusLabel}`}
        data-stage-id={stage.id}
        data-current={stage.isCurrent || undefined}
        style={{ left: `${x}%`, top: y, '--pop-delay': `${0.1 + index * 0.07}s` } as React.CSSProperties}
        className={cn(
          'animate-pop-in group absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 select-none',
          'focus-visible:outline-none',
        )}
      >
        <span className="relative" style={{ width: NODE_SIZE, height: NODE_SIZE }}>
          {stage.isCurrent && (
            <span
              aria-hidden="true"
              className="animate-pulse-ring absolute inset-0 rounded-full border-[3px] border-arcane"
            />
          )}
          <span
            className={cn(
              'relative flex size-full items-center justify-center rounded-full border-[3px] font-display text-2xl',
              'transition-[transform,box-shadow,filter] duration-200 ease-out',
              style.circle,
              stage.isUnlocked && 'group-hover:-translate-y-1 group-hover:brightness-110 group-active:translate-y-0.5',
              selected && 'scale-110 brightness-110',
              'group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-arcane',
            )}
          >
            <span className={style.number}>{stage.number}</span>
            <span
              className={cn(
                'absolute -right-1 -bottom-1 flex size-7 items-center justify-center rounded-full border-2 shadow-[0_2px_0_oklch(0_0_0/0.5)]',
                style.badge,
              )}
            >
              <StatusIcon className="size-3.5" strokeWidth={3} aria-hidden="true" />
            </span>
          </span>
        </span>
        <span className={cn('text-shadow-pixel font-display text-[7px] tracking-wider uppercase', style.label)}>
          {stage.isCurrent ? STRINGS.stageSelect.current : statusLabel}
        </span>
      </button>

      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={() => onSelect(stage)}
        style={{
          top: y,
          left: onLeft ? cardOffset : 8,
          right: onLeft ? 8 : cardOffset,
          ['--pop-delay' as string]: `${0.18 + index * 0.07}s`,
        }}
        className={cn(
          'animate-pop-in absolute z-10 flex -translate-y-1/2 flex-col gap-1.5 rounded-lg border-2 px-3 py-2.5 text-left select-none',
          'bg-night-deep/85 shadow-[0_4px_0_oklch(0_0_0/0.55)] transition-[transform,border-color,filter] duration-200',
          onLeft ? 'items-start' : 'items-end text-right',
          stage.isUnlocked
            ? 'border-gold-dim/70 hover:-translate-y-[calc(50%+2px)] hover:brightness-110'
            : 'border-panel-edge/70 opacity-70',
          selected && 'border-arcane',
        )}
      >
        <span
          className={cn(
            'font-display text-[8px] leading-tight uppercase',
            stage.isUnlocked ? 'text-parchment' : 'text-parchment/50',
          )}
        >
          <span className={cn('block text-[6px] tracking-wider', style.label)}>
            {STRINGS.stageSelect.stage} {stage.number}
          </span>
          {stage.name}
        </span>
        <DifficultyStars value={stage.difficulty} label={STRINGS.stageSelect.difficulty} />
        {stage.isUnlocked ? (
          <RewardList reward={stage.reward} className={cn(!onLeft && 'justify-end')} />
        ) : (
          <span className="font-body text-xs text-parchment/45">{stage.enemy.name}</span>
        )}
      </button>
    </>
  )
}
