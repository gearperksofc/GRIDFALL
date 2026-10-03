import type { UnitTemplate } from '@/types'

/**
 * Catálogo de personagens. Para adicionar um novo personagem basta
 * incluir um template aqui — fábrica, build e arena já o suportam.
 */
export const UNIT_TEMPLATES = {
  espadashim: {
    id: 'espadashim',
    name: 'Espadashim',
    title: 'Espadachim',
    sprite: '/images/units/espadashim.png',
    baseStats: { maxHp: 120, maxMp: 40, attack: 14, defense: 8, speed: 7 },
    growth: { maxHp: 12, maxMp: 3, attack: 1.5, defense: 1, speed: 0.5 },
    skillIds: ['chuva-de-meteoros', 'ordem-de-laceracao', 'barreira-gaia', 'golpe-direto'],
    passive: {
      id: 'fio-afiado',
      name: 'Fio Afiado',
      description: 'Após mudar de posição, o próximo golpe causa +10% de dano.',
    },
  },
} satisfies Record<string, UnitTemplate>

export type UnitTemplateId = keyof typeof UNIT_TEMPLATES

export const PLAYER_UNIT_TEMPLATE: UnitTemplateId = 'espadashim'

/** Enquanto não houver mais personagens, o bot também usa o Espadashim. */
export const ENEMY_UNIT_TEMPLATE: UnitTemplateId = 'espadashim'

export function getUnitTemplate(id: string): UnitTemplate | null {
  return (UNIT_TEMPLATES as Record<string, UnitTemplate>)[id] ?? null
}
