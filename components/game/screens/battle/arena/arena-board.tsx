'use client'

import type { CSSProperties } from 'react'
import { STRINGS } from '@/data/strings'
import { ARENA_CELLS, cellCol, cellRow } from '@/game/arena/arena-grid'
import { cn } from '@/lib/utils'
import { ArenaUnitSprite } from './arena-unit'
import type { ArenaUnits } from './use-arena'

/** Inclinação do piso. A unidade usa o ângulo inverso para ficar "em pé" (billboard). */
const TILT_DEG = 55

interface ArenaBoardProps {
  units: ArenaUnits
  reachable: number[]
  onCellPress: (cell: number) => void
}

/** Arena 3x3 em 2.5D: piso inclinado em perspectiva, unidades em pé sobre as casas. */
export function ArenaBoard({ units, reachable, onCellPress }: ArenaBoardProps) {
  const occupant = (cell: number) =>
    units.player.cell === cell ? 'player' : units.enemy.cell === cell ? 'enemy' : null

  return (
    <div className="relative mx-auto aspect-square w-[min(100cqw,400px,100cqh)] [perspective:1100px]">
      <div
        className="absolute inset-0 [transform-style:preserve-3d]"
        style={{ transform: `translateY(14%) scale(0.92) rotateX(${TILT_DEG}deg)` }}
      >
        <div
          aria-hidden="true"
          className="absolute -inset-3 rounded-xl border-[3px] border-panel-edge bg-[oklch(0.17_0.04_272)] shadow-[0_18px_0_oklch(0.1_0.03_272),0_30px_40px_oklch(0_0_0/0.6)]"
        />

        <div role="grid" aria-label="Arena" className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1.5">
          {ARENA_CELLS.map((cell) => {
            const isReachable = reachable.includes(cell)
            const who = occupant(cell)
            const isDark = (cellRow(cell) + cellCol(cell)) % 2 === 1
            return (
              <button
                key={cell}
                type="button"
                role="gridcell"
                disabled={!isReachable}
                onClick={() => onCellPress(cell)}
                aria-label={`${STRINGS.arena.position} ${cell + 1}${who ? ` — ${STRINGS.arena[who]}` : ''}`}
                className={cn(
                  'relative rounded-md border-[3px] transition-[border-color,box-shadow,background-color] duration-150',
                  isDark ? 'bg-[oklch(0.3_0.045_268)]' : 'bg-[oklch(0.35_0.05_268)]',
                  'border-[oklch(0.22_0.04_270)] shadow-[inset_0_-6px_0_oklch(0_0_0/0.25)]',
                  isReachable &&
                    'cursor-pointer border-arcane shadow-[inset_0_0_18px_oklch(0.72_0.14_195/0.45)] hover:bg-[oklch(0.4_0.07_220)]',
                  who === 'player' && 'border-gold-dim',
                  who === 'enemy' && 'border-destructive/70',
                  'focus-visible:outline-2 focus-visible:outline-arcane',
                )}
              >
                <span className="absolute top-1 left-1.5 font-display text-[8px] text-parchment/35">{cell + 1}</span>
              </button>
            )
          })}
        </div>

        {(['enemy', 'player'] as const).map((team) => {
          const { cell } = units[team]
          return (
            <div
              key={team}
              className="pointer-events-none absolute top-0 left-0 size-1/3 transition-transform duration-300 ease-out [transform-style:preserve-3d]"
              style={{ transform: `translate(${cellCol(cell) * 100}%, ${cellRow(cell) * 100}%)` } as CSSProperties}
            >
              <ArenaUnitSprite arenaUnit={units[team]} tiltDeg={TILT_DEG} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
