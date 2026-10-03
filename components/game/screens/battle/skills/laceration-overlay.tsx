'use client'

import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import type { MinigameGrade } from '@/types'
import { STRINGS } from '@/data/strings'
import { useTicker } from '@/hooks/use-ticker'
import { cn } from '@/lib/utils'
import { unitRect } from '../battle-effects-layer'
import {
  SkillHeader,
  capturePointer,
  gradeForDistance,
  pointerToPercent,
  type Point,
  type Rect,
  type SkillOverlayProps,
} from './skill-shared'

const TIME_LIMIT_MS = 8000
const DONE_DELAY_MS = 600
/** Comprimento mínimo (% da arena) para um traço contar como corte. */
const MIN_LENGTH = 14
const THRESHOLDS = { perfect: 0.3, great: 0.75, good: 1.3 }

interface Cut {
  id: number
  a: Point
  b: Point
  grade: MinigameGrade
}

const GRADE_STROKE: Record<MinigameGrade, string> = {
  perfect: 'stroke-gold',
  great: 'stroke-arcane',
  good: 'stroke-parchment',
  miss: 'stroke-destructive',
}

/** Menor distância normalizada entre o centro do alvo e o segmento a→b. */
function segmentDistance(a: Point, b: Point, rect: Rect): number {
  const abx = b.x - a.x
  const aby = b.y - a.y
  const len2 = abx * abx + aby * aby || 1
  const t = Math.max(0, Math.min(1, ((rect.x - a.x) * abx + (rect.y - a.y) * aby) / len2))
  const px = a.x + abx * t
  const py = a.y + aby * t
  return Math.hypot((px - rect.x) / Math.max(1, rect.w / 2), (py - rect.y) / Math.max(1, rect.h / 2))
}

/** ORDEM DE LACERAÇÃO — desenhe até 5 cortes sobre o inimigo. */
export function LacerationOverlay({ skill, boardRef, paused, onHit, onDone }: SkillOverlayProps) {
  const [cuts, setCuts] = useState<Cut[]>([])
  const [current, setCurrent] = useState<{ a: Point; b: Point } | null>(null)
  const [progress, setProgress] = useState(1)
  const layerRef = useRef<HTMLDivElement>(null)
  const timeLeft = useRef(TIME_LIMIT_MS)
  const finished = useRef(false)
  const t = STRINGS.arena

  const finish = () => {
    if (finished.current) return
    finished.current = true
    window.setTimeout(onDone, DONE_DELAY_MS)
  }

  useTicker((dt) => {
    if (finished.current) return
    timeLeft.current = Math.max(0, timeLeft.current - dt)
    setProgress(timeLeft.current / TIME_LIMIT_MS)
    if (timeLeft.current <= 0) finish()
  }, !paused && !finished.current)

  // O traço em andamento vive em ref: os eventos de ponteiro chegam mais rápido que o render.
  const stroke = useRef<Point | null>(null)
  const cutCount = useRef(0)

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (paused || finished.current || cutCount.current >= skill.hits) return
    capturePointer(e.currentTarget, e.pointerId, true)
    const p = pointerToPercent(e, layerRef.current)
    stroke.current = p
    setCurrent({ a: p, b: p })
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const a = stroke.current
    if (!a) return
    setCurrent({ a, b: pointerToPercent(e, layerRef.current) })
  }

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const a = stroke.current
    if (!a) return
    stroke.current = null
    capturePointer(e.currentTarget, e.pointerId, false)
    const b = pointerToPercent(e, layerRef.current)
    setCurrent(null)
    if (Math.hypot(b.x - a.x, b.y - a.y) < MIN_LENGTH) return
    const grade = gradeForDistance(segmentDistance(a, b, unitRect(boardRef.current, 'enemy')), THRESHOLDS)
    cutCount.current += 1
    setCuts((prev) => [...prev, { id: prev.length, a, b, grade }])
    onHit(grade)
    if (cutCount.current >= skill.hits) finish()
  }

  return (
    <div
      ref={layerRef}
      className="touch-none-select absolute inset-0 z-30 cursor-crosshair"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <SkillHeader
        name={skill.name}
        hint={t.lacerationHint}
        counterLabel={t.cuts}
        counter={`${cuts.length}/${skill.hits}`}
        progress={progress}
      />

      <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 size-full overflow-visible">
        {cuts.map((cut) => (
          <line
            key={cut.id}
            x1={cut.a.x}
            y1={cut.a.y}
            x2={cut.b.x}
            y2={cut.b.y}
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            className={cn('animate-cut-fade fill-none stroke-[3] drop-shadow-[0_0_6px_var(--parchment)]', GRADE_STROKE[cut.grade])}
          />
        ))}
        {current && (
          <line
            x1={current.a.x}
            y1={current.a.y}
            x2={current.b.x}
            y2={current.b.y}
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            className="fill-none stroke-parchment stroke-[4] drop-shadow-[0_0_8px_var(--parchment)]"
          />
        )}
      </svg>

      {cuts.length > 0 && !finished.current && (
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={finish}
          className="absolute top-2 right-2 z-10 rounded-md border-2 border-panel-edge bg-panel px-3 py-2 font-display text-[7px] text-parchment uppercase hover:border-gold-dim focus-visible:outline-2 focus-visible:outline-arcane"
        >
          {t.finishSkill}
        </button>
      )}
    </div>
  )
}
