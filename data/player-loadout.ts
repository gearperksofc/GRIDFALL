import type { EnemyStats } from '@/types'

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
      id: 'hero-default',
      name: 'Aventureiro',
      role: 'Guerreiro',
      level: 1,
      stats: { hp: 110, atk: 13, def: 7, spd: 6 },
    },
  },
  { id: 'support', available: false, unit: null },
  { id: 'assist', available: false, unit: null },
]

export const EQUIPMENT_SLOTS: EquipmentSlotId[] = ['weapon', 'armor', 'trinket']
