import type { UnitStats } from './unit'

/** Raridades em ordem crescente. Só `common` possui baú por enquanto. */
export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic'

export type ItemKind = 'equipment' | 'consumable'

export type EquipmentSlot = 'weapon' | 'armor' | 'trinket'

export type ConsumableEffect = { type: 'heal'; amount: number } | { type: 'restoreMp'; amount: number }

export interface ItemDefinition {
  id: string
  name: string
  description: string
  rarity: ItemRarity
  kind: ItemKind
  image: string
  slot?: EquipmentSlot
  /** Bônus permanentes enquanto equipado. */
  modifiers?: Partial<UnitStats>
  effect?: ConsumableEffect
}

/** Item no inventário temporário da partida. */
export interface InventoryItem {
  uid: string
  itemId: string
}

export interface LootEntry {
  itemId: string
  weight: number
}

export interface ChestDefinition {
  id: string
  rarity: ItemRarity
  name: string
  closedImage: string
  openImage: string
  /** Quantidade de itens sorteados ao abrir. */
  rolls: number
  lootTable: LootEntry[]
}
