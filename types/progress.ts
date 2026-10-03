import type { StageId } from './stage'

export interface StageRecord {
  stageId: StageId
  clears: number
  bestTimeMs: number | null
  firstClearedAt: number
  lastClearedAt: number
}

export interface Wallet {
  coins: number
  xp: number
}

/**
 * Progresso persistido do jogador. Hoje vive em localStorage;
 * a interface `ProgressStorage` permite trocar por um backend depois.
 */
export interface PlayerProgress {
  version: 1
  /** Número da fase mais alta liberada. */
  highestUnlockedStage: number
  stages: Record<StageId, StageRecord>
  wallet: Wallet
  /** Itens obtidos por id → quantidade. */
  items: Record<string, number>
  updatedAt: number
}
