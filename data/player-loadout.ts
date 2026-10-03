import type { EnemyStats } from '@/types'
import { PLAYER_UNIT_TEMPLATE, UNIT_TEMPLATES } from './units'

const hero = UNIT_TEMPLATES[PLAYER_UNIT_TEMPLATE]

export type LoadoutSlotId = 'main' | 'support' | 'assist'

export interface LoadoutUnit {
  id: string
  name: string
  role: string
  level: number
  stats: EnemyStats
}

export interface LoadoutSlot {
  id: LoadoutSlotId
  unit: LoadoutUnit | null
  /** Slots cujo sistema ainda não existe ficam bloqueados na UI. */
  available: boolean
}

export type EquipmentSlotId = 'weapon' | 'armor' | 'trinket'

/**
 * Loadout padrão da tela de Preparação. Quando o sistema de personagens
 * e equipamentos existir, esta estrutura passa a ser lida do progresso do jogador.
 */
export const DEFAULT_LOADOUT: LoadoutSlot[] = [
  {
    id: 'main',
    available: true,
    unit: {
      id: hero.id,
      name: hero.name,
      role: hero.title,
      level: 1,
      stats: {
        hp: hero.baseStats.maxHp,
        atk: hero.baseStats.attack,
        def: hero.baseStats.defense,
        spd: hero.baseStats.speed,
      },
    },
  },
  { id: 'support', available: false, unit: null },
  { id: 'assist', available: false, unit: null },
]

export const EQUIPMENT_SLOTS: EquipmentSlotId[] = ['weapon', 'armor', 'trinket']
