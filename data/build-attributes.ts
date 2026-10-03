import type { BuildAttributeDefinition } from '@/types'

/**
 * Atributos compráveis com estrelas. Para adicionar um novo atributo,
 * inclua o id em `BuildAttributeId` e uma entrada aqui.
 */
export const BUILD_ATTRIBUTES: BuildAttributeDefinition[] = [
  {
    id: 'attack',
    label: 'Attack',
    description: '+1 de ataque por ponto',
    cost: 1,
    maxPoints: 10,
    effect: { type: 'stat', stat: 'attack', perPoint: 1 },
  },
  {
    id: 'defense',
    label: 'Defense',
    description: '+1 de defesa por ponto',
    cost: 1,
    maxPoints: 10,
    effect: { type: 'stat', stat: 'defense', perPoint: 1 },
  },
  {
    id: 'speed',
    label: 'Speed',
    description: '+1 de velocidade por ponto',
    cost: 1,
    maxPoints: 8,
    effect: { type: 'stat', stat: 'speed', perPoint: 1 },
  },
  {
    id: 'hp',
    label: 'HP',
    description: '+10 de HP máximo por ponto',
    cost: 1,
    maxPoints: 10,
    effect: { type: 'stat', stat: 'maxHp', perPoint: 10 },
  },
  {
    id: 'mp',
    label: 'MP',
    description: '+5 de MP máximo por ponto',
    cost: 1,
    maxPoints: 8,
    effect: { type: 'stat', stat: 'maxMp', perPoint: 5 },
  },
  {
    id: 'farming',
    label: 'Farming',
    description: '+10% de estrelas nos próximos Farmings',
    cost: 2,
    maxPoints: 5,
    effect: { type: 'farmingBonus', perPoint: 0.1 },
  },
]
