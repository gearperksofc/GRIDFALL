'use client'

import { useEffect, useRef, useState } from 'react'
import { Sword } from 'lucide-react'
import type { MinigameGrade } from '@/types'
import { GRADE_LABEL } from '@/data/minigames'
import { STRINGS } from '@/data/strings'
import { getInputManager } from '@/hooks/use-input'
import { useTicker } from '@/hooks/use-ticker'
import { cn } from '@/lib/utils'
import { GRADE_BG, GRADE_TEXT } from '@/components/game/farming/grade-style'
import type { SkillOverlayProps } from './skill-shared'

const SPEED = 1.15
const DONE_DELAY_MS = 750
const ZONES = { perfect: 0.07, great: 0.17, good: 0.32 }

function gradeForOffset(offset: number): MinigameGrade {
  if (offset <= ZONES.perfect / 2) return 'perfect'
  if (offset <= ZONES.great / 2) return 'great'
  if (offset <= ZONES.good / 2) return 'good'
  return 'miss'
}

/** GOLPE DIRETO — barra de timing única: toque com o marcador no centro dourado. */
export function DirectStrikeOverlay({ skill, paused, onHit, onDone }: SkillOverlayProps) {
  const [center] = useState(() => 0.3 + Math.random() * 0.4)
  const [result, setResult] = useState<MinigameGrade | null>(null)
  const markerRef = useRef<HTMLSpanElement>(null)
  const motion = useRef({ pos: 0, dir: 1 })
  const t = STRINGS.arena

  useTicker((dt) => {
    const m = motion.current
    m.pos += m.dir * SPEED * (dt / 1000)
    if (m.pos >= 1) {
      m.pos = 1
      m.dir = -1
    } else if (m.pos <= 0) {
      m.pos = 0
      m.dir = 1
    }
    if (markerRef.current) markerRef.current.style.left = `${m.pos * 100}%`
  }, !paused && !result)

  const strike = () => {
    if (paused || result) return
    const grade = gradeForOffset(Math.abs(motion.current.pos - center))
    setResult(grade)
    onHit(grade)
    window.setTimeout(onDone, DONE_DELAY_MS)
  }

  const strikeRef = useRef(strike)
  useEffect(() => {
    strikeRef.current = strike
  })

  useEffect(
    () =>
      getInputManager().subscribe((key, pressed) => {
        if (pressed && key === 'confirm') strikeRef.current()
      }),
    [],
  )

  const zoneStyle = (width: number) => ({ left: `${(center - width / 2) * 100}%`, width: `${width * 100}%` })

  return (
    <div className="touch-none-select absolute inset-0 z-30 flex flex-col items-center justify-end gap-3 px-4 pb-4" onPointerDown={strike}>
      <div className="flex w-full max-w-xs flex-col gap-1.5 rounded-md border-2 border-gold-dim bg-night-deep/90 p-2.5">
        <div className="flex items-center justify-between font-display text-[7px] uppercase">
          <span className="text-gold">{skill.name}</span>
          <span className="text-parchment/60">{t.timingHint}</span>
        </div>
        <div className={cn('relative h-9 w-full overflow-hidden rounded-md border-[3px] border-panel-edge bg-night', result === 'miss' && 'animate-bump')}>
          <span aria-hidden="true" className="absolute inset-y-0 bg-parchment/15" style={zoneStyle(ZONES.good)} />
          <span aria-hidden="true" className="absolute inset-y-0 bg-arcane/45" style={zoneStyle(ZONES.great)} />
          <span aria-hidden="true" className={cn('absolute inset-y-0 bg-gold', result === 'perfect' && 'animate-pulse-ring')} style={zoneStyle(ZONES.perfect)} />
          <span
            ref={markerRef}
            aria-hidden="true"
            className={cn(
              'absolute -inset-y-1 w-1.5 -translate-x-1/2 rounded-sm border-2 border-night-deep shadow-[0_0_10px_var(--parchment)]',
              result ? GRADE_BG[result] : 'bg-parchment',
            )}
            style={{ left: `${motion.current.pos * 100}%` }}
          />
        </div>
        <p aria-live="polite" className={cn('h-4 text-center font-display text-[9px] uppercase', result ? GRADE_TEXT[result] : 'text-transparent')}>
          {result ? GRADE_LABEL[result] : '-'}
        </p>
      </div>

      <button
        type="button"
        onPointerDown={(e) => {
          e.stopPropagation()
          strike()
        }}
        disabled={!!result}
        className="flex min-h-11 items-center gap-2 rounded-full border-[3px] border-gold-dim bg-gold px-6 font-display text-[8px] text-primary-foreground uppercase shadow-[inset_0_-4px_0_var(--gold-dim),0_4px_0_oklch(0_0_0/0.5)] transition-transform active:translate-y-0.5 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-arcane"
      >
        <Sword className="size-4" aria-hidden="true" />
        {t.strike}
      </button>
    </div>
  )
}
