import type { Direction } from '@/types'

/**
 * Arena 3x3. Células indexadas de 0 a 8 (exibidas como 1–9):
 *   [1] [2] [3]
 *   [4] [5] [6]
 *   [7] [8] [9]
 */
export const ARENA_SIZE = 3
export const ARENA_CELLS = Array.from({ length: ARENA_SIZE * ARENA_SIZE }, (_, i) => i)

export const PLAYER_START_CELL = 7
export const ENEMY_START_CELL = 1

export const cellRow = (cell: number) => Math.floor(cell / ARENA_SIZE)
export const cellCol = (cell: number) => cell % ARENA_SIZE
export const toCell = (row: number, col: number) => row * ARENA_SIZE + col

const isInside = (row: number, col: number) => row >= 0 && col >= 0 && row < ARENA_SIZE && col < ARENA_SIZE

const DIRECTION_DELTA: Record<Direction, [number, number]> = {
  up: [-1, 0],
  down: [1, 0],
  left: [0, -1],
  right: [0, 1],
}

export function stepCell(cell: number, direction: Direction): number | null {
  const [dr, dc] = DIRECTION_DELTA[direction]
  const row = cellRow(cell) + dr
  const col = cellCol(cell) + dc
  return isInside(row, col) ? toCell(row, col) : null
}

/** Vizinhos ortogonais — movimento é uma casa por vez. */
export function neighbors(cell: number): number[] {
  return (Object.keys(DIRECTION_DELTA) as Direction[])
    .map((d) => stepCell(cell, d))
    .filter((c): c is number => c !== null)
}

export function distance(a: number, b: number): number {
  return Math.abs(cellRow(a) - cellRow(b)) + Math.abs(cellCol(a) - cellCol(b))
}

/** Tempo de recarga entre movimentos: mais SPEED = movimentos mais frequentes. */
export function moveCooldownMs(speed: number): number {
  return Math.max(160, Math.min(520, 520 - speed * 12))
}
