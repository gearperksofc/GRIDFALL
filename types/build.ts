import type { UnitStatKey } from './unit'

export type BuildAttributeId = 'attack' | 'defense' | 'speed' | 'hp' | 'mp' | 'farming'

/** Pontos investidos por atributo. */
export type BuildAllocation = Record<BuildAttributeId, number>

export type BuildEffect =
  | { type: 'stat'; stat: UnitStatKey; perPoint: number }
  /** Percentual extra de estrelas nos próximos Farmings (0.1 = +10%). */
  | { type: 'farmingBonus'; perPoint: number }

export interface BuildAttributeDefinition {
  id: BuildAttributeId
  label: string
  description: string
  /** Custo em estrelas de cada ponto. */
  cost: number
  maxPoints: number
  effect: BuildEffect
}
