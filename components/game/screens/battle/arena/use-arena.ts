'use client'

import { useEffect, useRef, useState } from 'react'
import type { AiProfile, Direction, GameSession, Unit, UnitTeam } from '@/types'
import {
  ENEMY_START_CELL,
  PLAYER_START_CELL,
  cellCol,
  distance,
  moveCooldownMs,
  neighbors,
  stepCell,
} from '@/game/arena/arena-grid'
import { createEnemyUnit, createPlayerUnit } from '@/game/units/unit-factory'
import { getInputManager } from '@/hooks/use-input'
import { useTicker } from '@/hooks/use-ticker'

export interface ArenaUnit {
  unit: Unit
  cell: number
  /** 1 = olhando para a direita, -1 = esquerda. */
  facing: 1 | -1
}

export type ArenaUnits = Record<UnitTeam, ArenaUnit>

function faceTowards(from: number, to: number, current: 1 | -1): 1 | -1 {
  const diff = cellCol(to) - cellCol(from)
  return diff === 0 ? current : diff > 0 ? 1 : -1
}

function chooseEnemyCell(enemy: number, player: number, ai: AiProfile): number | null {
  const options = neighbors(enemy).filter((c) => c !== player)
  if (options.length === 0 || Math.random() > 0.35 + ai.movement * 0.6) return null
  if (Math.random() < ai.aggression) {
    return options.reduce((best, c) => (distance(c, player) < distance(best, player) ? c : best))
  }
  return options[Math.floor(Math.random() * options.length)]
}

/**
 * Estado local da arena: posições, HP/MP e movimentação.
 * O bot só se move por enquanto — sem habilidades nem dano.
 */
export function useArena(session: GameSession, ai: AiProfile | null, paused: boolean) {
  const [units, setUnits] = useState<ArenaUnits>(() => ({
    player: { unit: createPlayerUnit(session), cell: PLAYER_START_CELL, facing: 1 },
    enemy: { unit: createEnemyUnit(session), cell: ENEMY_START_CELL, facing: -1 },
  }))
  const timers = useRef({ player: 0, enemy: 0, ai: 0 })

  const move = (team: UnitTeam, target: number): boolean => {
    const self = units[team]
    const other = units[team === 'player' ? 'enemy' : 'player']
    if (timers.current[team] > 0) return false
    if (!neighbors(self.cell).includes(target) || target === other.cell) return false
    timers.current[team] = moveCooldownMs(self.unit.speed)
    setUnits((prev) => {
      const opponent = prev[team === 'player' ? 'enemy' : 'player']
      const facing = faceTowards(target, opponent.cell, faceTowards(prev[team].cell, target, prev[team].facing))
      return { ...prev, [team]: { ...prev[team], cell: target, facing } }
    })
    return true
  }

  useTicker((dt) => {
    const t = timers.current
    t.player = Math.max(0, t.player - dt)
    t.enemy = Math.max(0, t.enemy - dt)
    if (!ai) return
    t.ai += dt
    if (t.ai < ai.reactionMs * 2.5 + 350) return
    t.ai = 0
    const target = chooseEnemyCell(units.enemy.cell, units.player.cell, ai)
    if (target !== null) move('enemy', target)
  }, !paused)

  const moveDirection = (direction: Direction) => {
    const target = stepCell(units.player.cell, direction)
    if (target !== null) move('player', target)
  }

  const moveRef = useRef(moveDirection)
  useEffect(() => {
    moveRef.current = moveDirection
  })

  useEffect(
    () =>
      getInputManager().subscribe((key, pressed) => {
        if (!pressed || paused) return
        if (key === 'up' || key === 'down' || key === 'left' || key === 'right') moveRef.current(key)
      }),
    [paused],
  )

  const healPlayer = (amount: number) =>
    setUnits((prev) => {
      const unit = prev.player.unit
      return { ...prev, player: { ...prev.player, unit: { ...unit, hp: Math.min(unit.maxHp, unit.hp + amount) } } }
    })

  return {
    units,
    reachable: paused ? [] : neighbors(units.player.cell).filter((c) => c !== units.enemy.cell),
    movePlayer: (cell: number) => move('player', cell),
    healPlayer,
  }
}
