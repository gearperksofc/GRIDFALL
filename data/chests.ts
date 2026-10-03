import type { ChestDefinition, ItemRarity } from '@/types'

/**
 * Baús por raridade. RARE, EPIC, LEGENDARY e MYTHIC entram aqui
 * com suas próprias tabelas de loot quando os itens existirem.
 */
export const CHESTS: Partial<Record<ItemRarity, ChestDefinition>> = {
  common: {
    id: 'common-chest',
    rarity: 'common',
    name: 'Common Chest',
    closedImage: '/images/chest/common-closed.png',
    openImage: '/images/chest/common-open.png',
    rolls: 1,
    lootTable: [
      { itemId: 'iron-sword', weight: 35 },
      { itemId: 'iron-armor', weight: 35 },
      { itemId: 'small-potion', weight: 30 },
    ],
  },
}

/** Baú entregue após a distribuição de estrelas. */
export const MATCH_CHEST_RARITY: ItemRarity = 'common'
