'use client'

import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import Image from 'next/image'
import type { MinigameGrade } from '@/types'
import { STRINGS } from '@/data/strings'
import { useTicker } from '@/hooks/use-ticker'
import { cn } from '@/lib/utils'
import { unitRect } from '../battle-effects-layer'
import {
  ImpactRing,
  SkillHeader,
  capturePointer,
  gradeForDistance,
  normalizedDistance,
  pointerToPercent,
  type Point,
  type SkillOverlayProps,
} from './skill-shared'

const TIME_LIMIT_MS = 9000
const DONE_DELAY_MS = 700
const THRESHOLDS = { perfect: 0.42, great: 0.95, good: 1.55 }

interface Meteor extends Point {
  id: number
  dragging: boolean
}

interface Impact extends Point {
  id: number
  grade: MinigameGrade
}

function spawnMeteors(count: number): Meteor[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 10 + (80 / Math.max(1, count - 1)) * i + (Math.random() * 6 - 3),
    y: 56 + (i % 2) * 11 + Math.random() * 4,
    dragging: false,
  }))
}

/** CHUVA DE METEOROS — arraste cada meteoro até a unidade inimiga. */
export function MeteorOverlay({ skill, boardRef, paused, onHit, onDone }: SkillOverlayProps) {
  const [meteors, setMeteors] = useState(() => spawnMeteors(skill.hits))
  const [impacts, setImpacts] = useState<Impact[]>([])
  const [progress, setProgress] = useState(1)
  const layerRef = useRef<HTMLDivElement>(null)
  const timeLeft = useRef(TIME_LIMIT_MS)
  const resolved = useRef(0)
  const finished = useRef(false)
  const dragging = useRef(new Set<number>())
  const t = STRINGS.arena

  const finish = () => {
    if (finished.current) return
    finished.current = true
    window.setTimeout(onDone, DONE_DELAY_MS)
  }

  const resolve = (id: number, point: Point) => {
    const grade = gradeForDistance(normalizedDistance(point, unitRect(boardRef.current, 'enemy')), THRESHOLDS)
    resolved.current += 1
    setMeteors((prev) => prev.filter((m) => m.id !== id))
    setImpacts((prev) => [...prev, { id, grade, ...point }])
    onHit(grade)
    if (resolved.current >= skill.hits) finish()
  }

  useTicker((dt) => {
    if (finished.current) return
    timeLeft.current = Math.max(0, timeLeft.current - dt)
    setProgress(timeLeft.current / TIME_LIMIT_MS)
    if (timeLeft.current > 0) return
    meteors.forEach((m) => {
      resolved.current += 1
      onHit('miss')
    })
    setMeteors([])
    finish()
  }, !paused && !finished.current)

  const onPointerDown = (e: ReactPointerEvent<HTMLButtonElement>, id: number) => {
    if (paused) return
    capturePointer(e.currentTarget, e.pointerId, true)
    dragging.current.add(id)
    setMeteors((prev) => prev.map((m) => (m.id === id ? { ...m, dragging: true } : m)))
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLButtonElement>, id: number) => {
    if (!dragging.current.has(id)) return
    const p = pointerToPercent(e, layerRef.current)
    setMeteors((prev) => prev.map((m) => (m.id === id ? { ...m, ...p } : m)))
  }

  const onPointerUp = (e: ReactPointerEvent<HTMLButtonElement>, id: number) => {
    if (!dragging.current.has(id)) return
    dragging.current.delete(id)
    capturePointer(e.currentTarget, e.pointerId, false)
    resolve(id, pointerToPercent(e, layerRef.current))
  }

  return (
    <div ref={layerRef} className="touch-none-select pointer-events-none absolute inset-0 z-30">
      <SkillHeader
        name={skill.name}
        hint={t.meteorHint}
        counterLabel={t.meteorsLeft}
        counter={`${meteors.length}/${skill.hits}`}
        progress={progress}
      />

      {impacts.map((impact) => (
        <ImpactRing key={impact.id} point={impact} grade={impact.grade} />
      ))}

      {meteors.map((meteor) => (
        <button
          key={meteor.id}
          type="button"
          aria-label={`${skill.name} ${meteor.id + 1}`}
          onPointerDown={(e) => onPointerDown(e, meteor.id)}
          onPointerMove={(e) => onPointerMove(e, meteor.id)}
          onPointerUp={(e) => onPointerUp(e, meteor.id)}
          onPointerCancel={(e) => onPointerUp(e, meteor.id)}
          className={cn(
            'pointer-events-auto absolute size-14 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none rounded-full border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-arcane',
            meteor.dragging ? 'z-10 scale-125 cursor-grabbing' : 'animate-meteor-pulse',
          )}
          style={{ left: `${meteor.x}%`, top: `${meteor.y}%` }}
        >
          <Image src="/images/skills/meteor.png" alt="" fill sizes="56px" draggable={false} className="object-contain [image-rendering:pixelated]" />
        </button>
      ))}
    </div>
  )
}
