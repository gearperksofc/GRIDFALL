'use client'

import { useEffect, useRef, useState } from 'react'
import { Hand } from 'lucide-react'
import type { MinigameGrade } from '@/types'
import { GRADE_LABEL } from '@/data/minigames'
import { STRINGS } from '@/data/strings'
import { cn } from '@/lib/utils'
import { getInputManager } from '@/hooks/use-input'
import { useTicker } from '@/hooks/use-ticker'
import type { MinigameProps } from '../minigame-types'
import { GRADE_BG, GRADE_TEXT } from '../grade-style'

const STOPS_PER_ROUND = 2
const FREEZE_MS = 600

interface Zones {
  center: number
  perfect: number
  great: number
  good: number
}

function createZones(level: number, demand: number): Zones {
  const perfect = Math.max(0.035, 0.07 - level * 0.006) / demand
  const good = perfect * 4
  const margin = good / 2 + 0.03
  return { center: margin + Math.random() * (1 - margin * 2), perfect, great: perfect * 2.2, good }
}

function gradeForDistance(distance: number, z: Zones): MinigameGrade {
  if (distance <= z.perfect / 2) return 'perfect'
  if (distance <= z.great / 2) return 'great'
  if (distance <= z.good / 2) return 'good'
  return 'miss'
}

/** TIMING — um marcador vai e volta na barra; parar dentro da zona central rende PERFECT. */
export function TimingMinigame({ level, demand, paused, onGrade, onComplete }: MinigameProps) {
  const speed = 0.6 * demand * (1 + level * 0.15)
  const [zones, setZones] = useState(() => createZones(level, demand))
  const [frozen, setFrozen] = useState<MinigameGrade | null>(null)
  const markerRef = useRef<HTMLSpanElement>(null)
  const motion = useRef({ pos: 0, dir: 1, stops: 0, freezeT: 0, done: false })

  useTicker((dt) => {
    const m = motion.current
    if (m.done) return
    if (frozen) {
      m.freezeT += dt
      if (m.freezeT < FREEZE_MS) return
      if (m.stops >= STOPS_PER_ROUND) {
        m.done = true
        onComplete()
        return
      }
      m.freezeT = 0
      setFrozen(null)
      setZones(createZones(level, demand))
      return
    }
    m.pos += m.dir * speed * (dt / 1000)
    if (m.pos >= 1) {
      m.pos = 1
      m.dir = -1
    } else if (m.pos <= 0) {
      m.pos = 0
      m.dir = 1
    }
    if (markerRef.current) markerRef.current.style.left = `${m.pos * 100}%`
  }, !paused)

  const stop = () => {
    const m = motion.current
    if (paused || frozen || m.done) return
    const grade = gradeForDistance(Math.abs(m.pos - zones.center), zones)
    m.stops += 1
    m.freezeT = 0
    setFrozen(grade)
    onGrade(grade, { x: m.pos * 100, y: 36 })
  }

  const stopRef = useRef(stop)
  useEffect(() => {
    stopRef.current = stop
  })

  useEffect(
    () =>
      getInputManager().subscribe((key, pressed) => {
        if (pressed && key === 'confirm') stopRef.current()
      }),
    [],
  )

  const zoneStyle = (width: number) => ({ left: `${(zones.center - width / 2) * 100}%`, width: `${width * 100}%` })

  return (
    <div className="touch-none-select absolute inset-0 flex flex-col items-center justify-center gap-8 px-5" onPointerDown={stop}>
      <div className="flex w-full max-w-md flex-col gap-2">
        <div className="flex justify-between font-display text-[7px] text-parchment/50 uppercase">
          <span>
            {STRINGS.farming.stop} {motion.current.stops + (frozen ? 0 : 1)}/{STOPS_PER_ROUND}
          </span>
          <span>{STRINGS.farming.tapHint}</span>
        </div>

        <div
          className={cn(
            'relative h-14 w-full overflow-hidden rounded-md border-[3px] border-panel-edge bg-night-deep shadow-[inset_0_4px_0_oklch(0_0_0/0.5)]',
            frozen === 'miss' && 'animate-bump',
          )}
        >
          <span aria-hidden="true" className="absolute inset-y-0 bg-parchment/15" style={zoneStyle(zones.good)} />
          <span aria-hidden="true" className="absolute inset-y-0 bg-arcane/45" style={zoneStyle(zones.great)} />
          <span
            aria-hidden="true"
            className={cn('absolute inset-y-0 bg-gold', frozen === 'perfect' && 'animate-pulse-ring')}
            style={zoneStyle(zones.perfect)}
          />
          <span
            ref={markerRef}
            aria-hidden="true"
            className={cn(
              'absolute -inset-y-1 w-1.5 -translate-x-1/2 rounded-sm border-2 border-night-deep shadow-[0_0_10px_var(--parchment)]',
              frozen ? GRADE_BG[frozen] : 'bg-parchment',
            )}
            style={{ left: `${motion.current.pos * 100}%` }}
          />
        </div>

        <p
          aria-live="polite"
          className={cn(
            'h-4 text-center font-display text-[9px] uppercase',
            frozen ? GRADE_TEXT[frozen] : 'text-transparent',
          )}
        >
          {frozen ? GRADE_LABEL[frozen] : '-'}
        </p>
      </div>

      <button
        type="button"
        onPointerDown={(e) => {
          e.stopPropagation()
          stop()
        }}
        className="flex size-24 flex-col items-center justify-center gap-1 rounded-full border-[3px] border-gold-dim bg-gold font-display text-[9px] text-primary-foreground uppercase shadow-[inset_0_-6px_0_var(--gold-dim),0_6px_0_oklch(0_0_0/0.5)] transition-transform active:translate-y-1 active:shadow-[inset_0_-3px_0_var(--gold-dim),0_2px_0_oklch(0_0_0/0.5)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-arcane"
      >
        <Hand className="size-6" aria-hidden="true" />
        {STRINGS.farming.stop}
      </button>
    </div>
  )
}
