import type { ChestDefinition, InventoryItem, ItemDefinition, UnitStats } from '@/types'
import { getItem } from '@/data/items'
import { createId } from '@/lib/id'

function pickWeighted(chest: ChestDefinition, random: () => number): string {
  const total = chest.lootTable.reduce((sum, entry) => sum + entry.weight, 0)
  let roll = random() * total
  for (const entry of chest.lootTable) {
    roll -= entry.weight
    if (roll <= 0) return entry.itemId
  }
  return chest.lootTable[chest.lootTable.length - 1].itemId
}

/** Sorteia os itens de um baú. `random` é injetável para testes determinísticos. */
export function openChest(chest: ChestDefinition, random: () => number = Math.random): InventoryItem[] {
  return Array.from({ length: chest.rolls }, () => ({ uid: createId('item'), itemId: pickWeighted(chest, random) }))
}

export function resolveInventory(inventory: InventoryItem[]): (InventoryItem & { item: ItemDefinition })[] {
  return inventory.flatMap((entry) => {
    const item = getItem(entry.itemId)
    return item ? [{ ...entry, item }] : []
  })
}

/** Aplica os bônus de todos os equipamentos do inventário (um por slot). */
export function applyEquipmentToStats(stats: UnitStats, inventory: InventoryItem[]): UnitStats {
  const next = { ...stats }
  const usedSlots = new Set<string>()
  for (const { item } of resolveInventory(inventory)) {
    if (item.kind !== 'equipment' || !item.slot || usedSlots.has(item.slot)) continue
    usedSlots.add(item.slot)
    for (const [stat, value] of Object.entries(item.modifiers ?? {})) {
      next[stat as keyof UnitStats] += value ?? 0
    }
  }
  return next
}
