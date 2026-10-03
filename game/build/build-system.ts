import type { BuildAllocation, BuildAttributeDefinition, BuildAttributeId, FarmingResult, UnitStats } from '@/types'
import { BUILD_ATTRIBUTES } from '@/data/build-attributes'

export const EMPTY_BUILD: BuildAllocation = BUILD_ATTRIBUTES.reduce(
  (acc, attr) => ({ ...acc, [attr.id]: 0 }),
  {} as BuildAllocation,
)

export function getAttribute(id: BuildAttributeId): BuildAttributeDefinition {
  const attr = BUILD_ATTRIBUTES.find((a) => a.id === id)
  if (!attr) throw new Error(`Atributo desconhecido: ${id}`)
  return attr
}

export function getTotalStars(results: FarmingResult[]): number {
  return results.reduce((sum, r) => sum + r.totalStars, 0)
}

export function getSpentStars(allocation: BuildAllocation): number {
  return BUILD_ATTRIBUTES.reduce((sum, attr) => sum + (allocation[attr.id] ?? 0) * attr.cost, 0)
}

export function canIncrease(allocation: BuildAllocation, id: BuildAttributeId, totalStars: number): boolean {
  const attr = getAttribute(id)
  const remaining = totalStars - getSpentStars(allocation)
  return (allocation[id] ?? 0) < attr.maxPoints && remaining >= attr.cost
}

/** Nunca permite um pedido inválido: retorna a alocação original quando não cabe. */
export function adjustAllocation(
  allocation: BuildAllocation,
  id: BuildAttributeId,
  delta: 1 | -1,
  totalStars: number,
  /** Pontos já confirmados não podem ser removidos. */
  floor: BuildAllocation = EMPTY_BUILD,
): BuildAllocation {
  const current = allocation[id] ?? 0
  if (delta === 1 && !canIncrease(allocation, id, totalStars)) return allocation
  if (delta === -1 && current <= (floor[id] ?? 0)) return allocation
  return { ...allocation, [id]: current + delta }
}

export function applyBuildToStats(stats: UnitStats, allocation: BuildAllocation): UnitStats {
  const next = { ...stats }
  for (const attr of BUILD_ATTRIBUTES) {
    if (attr.effect.type !== 'stat') continue
    next[attr.effect.stat] += (allocation[attr.id] ?? 0) * attr.effect.perPoint
  }
  return next
}

export function getFarmingBonus(allocation: BuildAllocation): number {
  return BUILD_ATTRIBUTES.reduce(
    (sum, attr) => (attr.effect.type === 'farmingBonus' ? sum + (allocation[attr.id] ?? 0) * attr.effect.perPoint : sum),
    0,
  )
}
