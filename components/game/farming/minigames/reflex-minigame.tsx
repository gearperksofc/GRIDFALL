'use client'

import { useRef, useState, type PointerEvent } from 'react'
import { Crosshair } from 'lucide-react'
import type { MinigameGrade } from '@/types'
import { STRINGS } from '@/data/strings'
import { useTicker } from '@/hooks/use-ticker'
import type { MinigameProps } from '../minigame-types'

const TARGETS_PER_ROUND = 3
const END_DELAY_MS = 380

type Phase = 'wait' | 'show' | 'end'

interface Target {
  id: number
  x: number
  y: number
}

const randomDelay = () => 250 + Math.random() * 450
const randomSpot = () => ({ x: 14 + Math.random() * 72, y: 18 + Math.random() * 64 })

/** REFLEXO — alvos surgem em posições aleatórias; quanto mais rápido o toque, melhor a nota. */
export function ReflexMinigame({ level, demand, paused, onGrade, onComplete }: MinigameProps) {
  const pressure = demand * (1 + level * 0.08)
  const windows = {
    perfect: 380 / pressure,
    great: 600 / pressure,
    good: 850 / pressure,
    timeout: 1150 / pressure,
  }
  const size = Math.max(52, 80 - level * 6)

  const clock = useRef<{ phase: Phase; t: number; delay: number; resolved: number }>({
    phase: 'wait',
    t: 0,
    delay: randomDelay(),
    resolved: 0,
  })
  const [target, setTarget] = useState<Target | null>(null)

  const resolve = (grade: MinigameGrade, at: { x: number; y: number }) => {
    const c = clock.current
    if (c.phase !== 'show') return
    onGrade(grade, at)
    setTarget(null)
    c.resolved += 1
    c.t = 0
    if (c.resolved >= TARGETS_PER_ROUND) {
      c.phase = 'end'
    } else {
      c.phase = 'wait'
      c.delay = randomDelay()
    }
  }

  useTicker((dt) => {
    const c = clock.current
    c.t += dt
    if (c.phase === 'wait' && c.t >= c.delay) {
      c.phase = 'show'
      c.t = 0
      setTarget({ id: c.resolved, ...randomSpot() })
    } else if (c.phase === 'show' && c.t >= windows.timeout && target) {
      resolve('miss', target)
    } else if (c.phase === 'end' && c.t >= END_DELAY_MS) {
      c.phase = 'wait'
      c.t = -Infinity
      onComplete()
    }
  }, !paused)

  const gradeForReaction = (ms: number): MinigameGrade =>
    ms <= windows.perfect ? 'perfect' : ms <= windows.great ? 'great' : ms <= windows.good ? 'good' : 'miss'

  const handleBoard = (e: PointerEvent<HTMLDivElement>) => {
    if (paused || clock.current.phase !== 'show') return
    const rect = e.currentTarget.getBoundingClientRect()
    resolve('miss', {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  const handleTarget = (e: PointerEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (paused || !target) return
    resolve(gradeForReaction(clock.current.t), target)
  }

  return (
    <div className="touch-none-select absolute inset-0" onPointerDown={handleBoard}>
      {target && (
        <button
          key={target.id}
          type="button"
          aria-label={STRINGS.farming.target}
          onPointerDown={handleTarget}
          className="animate-pop-in absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-arcane"
          style={{ left: `${target.x}%`, top: `${target.y}%`, width: size, height: size }}
        >
          <span
            aria-hidden="true"
            className="animate-approach absolute inset-0 rounded-full border-[3px] border-gold"
            style={
              {
                '--approach-ms': `${windows.perfect}ms`,
                animationPlayState: paused ? 'paused' : 'running',
              } as React.CSSProperties
            }
          />
          <span
            aria-hidden="true"
            className="flex size-full items-center justify-center rounded-full border-[3px] border-night-deep bg-[radial-gradient(circle,var(--gold)_0_22%,var(--destructive)_23%_45%,var(--parchment)_46%_62%,var(--destructive)_63%)] shadow-[0_4px_0_oklch(0_0_0/0.5)]"
          >
            <Crosshair className="size-4 text-night-deep" strokeWidth={3} />
          </span>
        </button>
      )}
    </div>
  )
}
