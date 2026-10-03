'use client'

import { useRef, useState } from 'react'
import { Circle, Diamond, Square, Star, Triangle, X, type LucideIcon } from 'lucide-react'
import type { MinigameGrade } from '@/types'
import { STRINGS } from '@/data/strings'
import { cn } from '@/lib/utils'
import { useTicker } from '@/hooks/use-ticker'
import type { MinigameProps } from '../minigame-types'

type SymbolId = keyof typeof STRINGS.farming.symbols

const SYMBOLS: { id: SymbolId; icon: LucideIcon }[] = [
  { id: 'triangle', icon: Triangle },
  { id: 'circle', icon: Circle },
  { id: 'star', icon: Star },
  { id: 'cross', icon: X },
  { id: 'diamond', icon: Diamond },
  { id: 'square', icon: Square },
]

const ICONS = Object.fromEntries(SYMBOLS.map((s) => [s.id, s.icon])) as Record<SymbolId, LucideIcon>

const HOLD_MS = 450
const REVIEW_MS = 950

type Phase = 'show' | 'input' | 'review'

function createSequence(length: number, poolSize: number): SymbolId[] {
  const pool = SYMBOLS.slice(0, poolSize)
  return Array.from({ length }, () => pool[Math.floor(Math.random() * pool.length)].id)
}

function gradeForAccuracy(correct: number, total: number): MinigameGrade {
  const ratio = correct / total
  if (ratio === 1) return 'perfect'
  if (ratio >= 0.75) return 'great'
  if (ratio >= 0.5) return 'good'
  return 'miss'
}

/** MEMÓRIA — memorize a sequência de símbolos e repita. Sequências crescem com o nível. */
export function MemoryMinigame({ level, demand, paused, onGrade, onComplete }: MinigameProps) {
  const length = Math.min(3 + level, 7)
  const poolSize = Math.min(4 + Math.floor(level / 2), SYMBOLS.length)
  const stepMs = 620 / demand

  const [sequence] = useState(() => createSequence(length, poolSize))
  const [phase, setPhase] = useState<Phase>('show')
  const [revealed, setRevealed] = useState(0)
  const [input, setInput] = useState<SymbolId[]>([])
  const clock = useRef({ t: 0, done: false })

  useTicker((dt) => {
    const c = clock.current
    if (c.done || phase === 'input') return
    c.t += dt
    if (phase === 'show') {
      const shown = Math.min(length, Math.floor(c.t / stepMs) + 1)
      if (shown !== revealed) setRevealed(shown)
      if (c.t >= stepMs * length + HOLD_MS) {
        c.t = 0
        setPhase('input')
      }
    } else if (phase === 'review' && c.t >= REVIEW_MS) {
      c.done = true
      onComplete()
    }
  }, !paused)

  const press = (id: SymbolId) => {
    if (paused || phase !== 'input') return
    const next = [...input, id]
    setInput(next)
    if (next.length < length) return
    const correct = next.filter((symbol, i) => symbol === sequence[i]).length
    onGrade(gradeForAccuracy(correct, length), { x: 50, y: 30 })
    clock.current.t = 0
    setPhase('review')
  }

  const palette = SYMBOLS.slice(0, poolSize)

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-4">
      <p className="font-display text-[8px] text-parchment/70 uppercase" aria-live="polite">
        {phase === 'show' ? STRINGS.farming.watch : STRINGS.farming.repeat}
      </p>

      <ol className="flex flex-wrap items-center justify-center gap-2" aria-label={STRINGS.farming.repeat}>
        {sequence.map((symbol, i) => {
          const showSymbol =
            (phase === 'show' && i < revealed) || phase === 'review' || (phase === 'input' && i < input.length)
          const shownId = phase === 'input' ? input[i] : symbol
          const Icon = showSymbol && shownId ? ICONS[shownId] : null
          const isWrong = phase === 'review' && input[i] !== symbol
          const isRight = phase === 'review' && input[i] === symbol
          return (
            <li
              key={i}
              className={cn(
                'flex size-11 items-center justify-center rounded-md border-[3px] bg-night-deep shadow-[inset_0_3px_0_oklch(0_0_0/0.5)] sm:size-12',
                phase === 'show' && i === revealed - 1 ? 'animate-pop-in border-gold text-gold' : 'border-panel-edge text-parchment',
                isRight && 'border-arcane text-arcane',
                isWrong && 'border-destructive text-destructive',
              )}
            >
              {Icon ? (
                <Icon className="size-5" strokeWidth={3} aria-label={STRINGS.farming.symbols[shownId!]} />
              ) : (
                <span aria-hidden="true" className="size-1.5 rounded-full bg-panel-edge" />
              )}
            </li>
          )
        })}
      </ol>

      <div
        className={cn('grid gap-2', palette.length === 4 ? 'grid-cols-4' : 'grid-cols-3')}
        role="group"
        aria-label={STRINGS.farming.repeat}
      >
        {palette.map(({ id, icon: Icon }) => (
          <button
            key={id}
            type="button"
            disabled={phase !== 'input'}
            onClick={() => press(id)}
            aria-label={STRINGS.farming.symbols[id]}
            className="flex size-16 items-center justify-center rounded-lg border-[3px] border-panel-edge bg-panel text-parchment shadow-[inset_0_-5px_0_var(--night-deep)] transition-transform active:translate-y-0.5 active:shadow-[inset_0_-2px_0_var(--night-deep)] enabled:hover:border-gold-dim disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-arcane"
          >
            <Icon className="size-7" strokeWidth={3} aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  )
}
