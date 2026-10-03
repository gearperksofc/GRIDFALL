'use client'

import { ArrowRight, Star } from 'lucide-react'
import type { GradeCounts } from '@/types'
import { GRADE_LABEL, GRADE_ORDER } from '@/data/minigames'
import { STRINGS } from '@/data/strings'
import { formatNumber } from '@/lib/format'
import { cn } from '@/lib/utils'
import { RpgButton } from '../../ui/rpg-button'
import { GRADE_TEXT } from '../../farming/grade-style'

interface FarmingSummaryProps {
  round: number
  stars: number
  score: number
  maxCombo: number
  grades: GradeCounts
  bonusPreview: number
  onContinue: () => void
}

export function FarmingSummary({ round, stars, score, maxCombo, grades, bonusPreview, onContinue }: FarmingSummaryProps) {
  const t = STRINGS.farming

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-night-deep/80 p-4 backdrop-blur-[2px]">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="farming-summary-heading"
        className="rpg-frame animate-pop-in flex w-full max-w-sm flex-col items-center gap-4 p-5 text-center"
      >
        <p className="font-display text-[8px] text-destructive uppercase">{t.timeUp}</p>
        <h2 id="farming-summary-heading" className="text-shadow-pixel font-display text-xs text-gold uppercase">
          {t.summaryHeading} {round}
        </h2>

        <div className="flex flex-col items-center gap-1">
          <span className="font-display text-[7px] text-parchment/60 uppercase">{t.starsEarned}</span>
          <span className="flex items-center gap-2 font-display text-3xl text-gold">
            <Star className="size-7 fill-gold" aria-hidden="true" />
            {stars + bonusPreview}
          </span>
          {bonusPreview > 0 && (
            <span className="font-body text-sm text-arcane">
              {t.farmingBonus} +{bonusPreview}
            </span>
          )}
        </div>

        <dl className="grid w-full grid-cols-2 gap-2">
          <div className="flex flex-col gap-1 rounded-md border-2 border-panel-edge bg-night-deep/70 p-2">
            <dt className="font-display text-[6px] text-parchment/55 uppercase">{t.score}</dt>
            <dd className="font-display text-[11px] text-parchment tabular-nums">{formatNumber(score)}</dd>
          </div>
          <div className="flex flex-col gap-1 rounded-md border-2 border-panel-edge bg-night-deep/70 p-2">
            <dt className="font-display text-[6px] text-parchment/55 uppercase">{t.maxCombo}</dt>
            <dd className="font-display text-[11px] text-arcane tabular-nums">x{maxCombo}</dd>
          </div>
        </dl>

        <ul className="grid w-full grid-cols-4 gap-1.5">
          {GRADE_ORDER.map((grade) => (
            <li key={grade} className="flex flex-col items-center gap-1 rounded-md border-2 border-panel-edge bg-night-deep/70 py-2">
              <span className={cn('font-display text-[6px] uppercase', GRADE_TEXT[grade])}>{GRADE_LABEL[grade]}</span>
              <span className="font-display text-[10px] text-parchment tabular-nums">{grades[grade]}</span>
            </li>
          ))}
        </ul>

        <RpgButton onClick={onContinue} autoFocus>
          {t.continue}
          <ArrowRight className="size-4" aria-hidden="true" />
        </RpgButton>
      </div>
    </div>
  )
}
