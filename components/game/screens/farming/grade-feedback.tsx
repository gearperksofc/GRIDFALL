'use client'

import { Star } from 'lucide-react'
import { GRADE_LABEL } from '@/data/minigames'
import { STRINGS } from '@/data/strings'
import { cn } from '@/lib/utils'
import { GRADE_TEXT } from '../../farming/grade-style'
import type { FeedbackEvent } from './use-farming-run'

/** Pop-up de nota + estrelas flutuando no ponto do acerto. */
export function GradeFeedback({ events }: { events: FeedbackEvent[] }) {
  return (
    <div aria-live="polite" className="pointer-events-none absolute inset-0 z-20">
      {events.map((e) => (
        <div
          key={e.id}
          className="animate-grade-pop absolute flex flex-col items-center gap-1"
          style={{ left: `${e.at.x}%`, top: `${e.at.y}%` }}
        >
          <span
            className={cn(
              'text-shadow-pixel font-display whitespace-nowrap uppercase',
              e.grade === 'perfect' ? 'text-lg' : 'text-sm',
              GRADE_TEXT[e.grade],
            )}
          >
            {GRADE_LABEL[e.grade]}
          </span>
          {e.stars > 0 && (
            <span className="animate-star-float flex items-center gap-1 font-display text-[10px] text-gold">
              <Star className="size-3 fill-gold" aria-hidden="true" />+{e.stars}
              {e.bonus > 0 && (
                <span className="text-arcane">
                  {' '}
                  +{e.bonus} {STRINGS.farming.comboBonus}
                </span>
              )}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
