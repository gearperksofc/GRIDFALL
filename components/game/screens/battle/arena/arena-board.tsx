'use client'

import type { CSSProperties, ReactNode, Ref } from 'react'
import { Flame, Shield } from 'lucide-react'
import type { ArenaUnits, UnitFx, UnitTeam } from '@/types'
import { STRINGS } from '@/data/strings'
import { ARENA_CELLS, cellCol, cellRow } from '@/game/arena/arena-grid'
import { cn } from '@/lib/utils'
import { ArenaUnitSprite } from './arena-unit'

/** Inclinação do piso. A unidade usa o ângulo inverso para ficar "em pé" (billboard). */
const TILT_DEG = 55

/** Marcações visuais por casa: telegraph inimigo, aura da barreira ou casa escolhida. */
export type CellMark = 'telegraph' | 'protected' | 'picked'

interface ArenaBoardProps {
  units: ArenaUnits
  reachable: number[]
  onCellPress: (cell: number) => void
  marks?: Partial<Record<number, CellMark>>
  /** Casas clicáveis além das alcançáveis (ex.: escolha da Barreira Gaia). */
  pickable?: number[]
  fx?: Record<UnitTeam, UnitFx>
  /** Ref do quadrado plano que contém a arena — base de coordenadas das camadas de efeito. */
  boardRef?: Ref<HTMLDivElement>
  /** Camadas planas (meteoros, cortes, números) desenhadas sobre a arena. */
  children?: ReactNode
}

/** Arena 3x3 em 2.5D: piso inclinado em perspectiva, unidades em pé sobre as casas. */
export function ArenaBoard({ units, reachable, onCellPress, marks = {}, pickable = [], fx, boardRef, children }: ArenaBoardProps) {
  const occupant = (cell: number) =>
    units.player.cell === cell ? 'player' : units.enemy.cell === cell ? 'enemy' : null

  return (
    <div ref={boardRef} className="relative mx-auto aspect-square w-[min(100cqw,400px,100cqh)] [perspective:1100px]">
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
            const isPickable = pickable.includes(cell)
            const mark = marks[cell]
            const who = occupant(cell)
            const isDark = (cellRow(cell) + cellCol(cell)) % 2 === 1
            const markLabel =
              mark === 'telegraph' ? ` — ${STRINGS.arena.dangerCell}` : mark === 'protected' || mark === 'picked' ? ` — ${STRINGS.arena.protectedCell}` : ''
            return (
              <button
                key={cell}
                type="button"
                role="gridcell"
                disabled={!isReachable && !isPickable}
                aria-pressed={isPickable ? mark === 'picked' : undefined}
                onClick={() => onCellPress(cell)}
                aria-label={`${STRINGS.arena.position} ${cell + 1}${who ? ` — ${STRINGS.arena[who]}` : ''}${markLabel}`}
                className={cn(
                  'relative rounded-md border-[3px] transition-[border-color,box-shadow,background-color] duration-150',
                  isDark ? 'bg-[oklch(0.3_0.045_268)]' : 'bg-[oklch(0.35_0.05_268)]',
                  'border-[oklch(0.22_0.04_270)] shadow-[inset_0_-6px_0_oklch(0_0_0/0.25)]',
                  isReachable &&
                    'cursor-pointer border-arcane shadow-[inset_0_0_18px_oklch(0.72_0.14_195/0.45)] hover:bg-[oklch(0.4_0.07_220)]',
                  isPickable && 'cursor-pointer border-dashed border-gold-dim hover:bg-[oklch(0.4_0.06_90)]',
                  mark === 'picked' && 'border-solid border-gold bg-[oklch(0.45_0.08_90)] shadow-[inset_0_0_20px_oklch(0.83_0.14_85/0.5)]',
                  mark === 'protected' && 'animate-barrier-aura border-arcane bg-[oklch(0.38_0.08_170)]',
                  mark === 'telegraph' && 'animate-telegraph border-destructive bg-[oklch(0.42_0.14_28)]',
                  who === 'player' && !mark && 'border-gold-dim',
                  who === 'enemy' && !mark && 'border-destructive/70',
                  'focus-visible:outline-2 focus-visible:outline-arcane',
                )}
              >
                <span className="absolute top-1 left-1.5 font-display text-[8px] text-parchment/35">{cell + 1}</span>
                {mark === 'telegraph' && (
                  <Flame aria-hidden="true" className="absolute inset-0 m-auto size-[38%] text-destructive drop-shadow-[0_0_6px_oklch(0.6_0.2_28)]" />
                )}
                {(mark === 'protected' || mark === 'picked') && (
                  <Shield aria-hidden="true" className={cn('absolute inset-0 m-auto size-[34%]', mark === 'protected' ? 'text-arcane' : 'text-gold')} />
                )}
              </button>
            )
          })}
        </div>

        {(['enemy', 'player'] as const).map((team) => {
          const { cell } = units[team]
          return (
            <div
              key={team}
              data-arena-unit={team}
              className="pointer-events-none absolute top-0 left-0 size-1/3 transition-transform duration-300 ease-out [transform-style:preserve-3d]"
              style={{ transform: `translate(${cellCol(cell) * 100}%, ${cellRow(cell) * 100}%)` } as CSSProperties}
            >
              <ArenaUnitSprite arenaUnit={units[team]} tiltDeg={TILT_DEG} fx={fx?.[team]} />
            </div>
          )
        })}
      </div>

      {children}
    </div>
  )
}
