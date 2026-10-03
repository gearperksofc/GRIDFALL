import type { ItemDefinition, ItemRarity } from '@/types'

export const ITEMS: Record<string, ItemDefinition> = {
  'iron-sword': {
    id: 'iron-sword',
    name: 'Iron Sword',
    description: '+2 Attack',
    rarity: 'common',
    kind: 'equipment',
    slot: 'weapon',
    image: '/images/items/iron-sword.png',
    modifiers: { attack: 2 },
  },
  'iron-armor': {
    id: 'iron-armor',
    name: 'Iron Armor',
    description: '+2 Defense',
    rarity: 'common',
    kind: 'equipment',
    slot: 'armor',
    image: '/images/items/iron-armor.png',
    modifiers: { defense: 2 },
  },
  'small-potion': {
    id: 'small-potion',
    name: 'Small Potion',
    description: 'Cura 40 de HP',
    rarity: 'common',
    kind: 'consumable',
    image: '/images/items/small-potion.png',
    effect: { type: 'heal', amount: 40 },
  },
}

export function getItem(id: string): ItemDefinition | null {
  return ITEMS[id] ?? null
}

/** Ordem e rótulo das raridades — prontos para os baús futuros. */
export const RARITY_ORDER: ItemRarity[] = ['common', 'rare', 'epic', 'legendary', 'mythic']

export const RARITY_LABEL: Record<ItemRarity, string> = {
  common: 'Common',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
  mythic: 'Mythic',
}

/** Classes de cor por raridade (tokens do tema + tons pontuais). */
export const RARITY_STYLE: Record<ItemRarity, string> = {
  common: 'border-parchment/50 text-parchment',
  rare: 'border-arcane text-arcane',
  epic: 'border-[oklch(0.65_0.2_305)] text-[oklch(0.75_0.17_305)]',
  legendary: 'border-gold text-gold',
  mythic: 'border-destructive text-destructive',
}
