'use client'

import type { RefObject } from 'react'
import type { MinigameGrade, SkillDefinition } from '@/types'
import { cn } from '@/lib/utils'
import { GRADE_BORDER } from '@/components/game/farming/grade-style'

export interface SkillOverlayProps {
  skill: SkillDefinition
  boardRef: RefObject<HTMLDivElement | null>
  paused: boolean
  /** Um acerto (ou MISS) na unidade inimiga. */
  onHit: (grade: MinigameGrade) => void
  /** A interação terminou; o turno pode encerrar. */
  onDone: () => void
}

export interface Point {
  x: number
  y: number
}

export interface Rect extends Point {
  w: number
  h: number
}

/** Captura/libera o ponteiro sem lançar quando o id já não está ativo (toques cancelados). */
export function capturePointer(el: Element, pointerId: number, capture: boolean) {
  try {
    if (capture) el.setPointerCapture(pointerId)
    else if (el.hasPointerCapture(pointerId)) el.releasePointerCapture(pointerId)
  } catch {
    // Ponteiro já encerrado — nada a fazer.
  }
}

/** Converte um evento de ponteiro para coordenadas percentuais do elemento. */
export function pointerToPercent(e: { clientX: number; clientY: number }, el: HTMLElement | null): Point {
  if (!el) return { x: 50, y: 50 }
  const r = el.getBoundingClientRect()
  return { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }
}

/** Distância normalizada ao centro do alvo: 1 = na borda do retângulo. */
export function normalizedDistance(p: Point, rect: Rect): number {
  const dx = (p.x - rect.x) / Math.max(1, rect.w / 2)
  const dy = (p.y - rect.y) / Math.max(1, rect.h / 2)
  return Math.hypot(dx, dy)
}

/** Precisão a partir da distância normalizada. */
export function gradeForDistance(d: number, thresholds: { perfect: number; great: number; good: number }): MinigameGrade {
  if (d <= thresholds.perfect) return 'perfect'
  if (d <= thresholds.great) return 'great'
  if (d <= thresholds.good) return 'good'
  return 'miss'
}

/** Cabeçalho padrão das skills: nome, dica, contador e barra de tempo. */
export function SkillHeader({
  name,
  hint,
  counterLabel,
  counter,
  progress,
}: {
  name: string
  hint: string
  counterLabel: string
  counter: string
  progress: number
}) {
  return (
    <div className="pointer-events-none absolute inset-x-2 bottom-0 z-10 flex flex-col gap-1 rounded-md border-2 border-gold-dim bg-night-deep/85 px-2.5 py-1.5 font-display uppercase">
      <div className="flex items-center justify-between gap-2 text-[7px]">
        <span className="text-gold">{name}</span>
        <span className="text-parchment/70">
          {counterLabel} {counter}
        </span>
      </div>
      <p className="text-[6px] text-parchment/60">{hint}</p>
      <span className="block h-1.5 w-full overflow-hidden rounded-[1px] bg-night">
        <span className="block h-full origin-left bg-gold transition-transform duration-100" style={{ transform: `scaleX(${progress})` }} />
      </span>
    </div>
  )
}

/** Anel de impacto no ponto de acerto. */
export function ImpactRing({ point, grade }: { point: Point; grade: MinigameGrade }) {
  return (
    <span
      aria-hidden="true"
      className={cn('animate-impact pointer-events-none absolute size-14 rounded-full border-4', GRADE_BORDER[grade])}
      style={{ left: `${point.x}%`, top: `${point.y}%` }}
    />
  )
}
