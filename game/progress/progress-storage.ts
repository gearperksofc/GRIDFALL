import type { PlayerProgress } from '@/types'
import { parseProgress } from './stage-progress'

/**
 * Contrato de persistência. A implementação atual usa localStorage;
 * uma versão remota (conta online / banco) só precisa cumprir esta interface.
 */
export interface ProgressStorage {
  load(): PlayerProgress | null
  save(progress: PlayerProgress): void
  clear(): void
}

const STORAGE_KEY = 'gridfall.progress.v1'

export function createLocalProgressStorage(key = STORAGE_KEY): ProgressStorage {
  const available = () => typeof window !== 'undefined' && 'localStorage' in window

  return {
    load() {
      if (!available()) return null
      try {
        const raw = window.localStorage.getItem(key)
        return raw ? parseProgress(JSON.parse(raw)) : null
      } catch {
        return null
      }
    },
    save(progress) {
      if (!available()) return
      try {
        window.localStorage.setItem(key, JSON.stringify(progress))
      } catch {
        // Storage cheio ou bloqueado: o jogo segue em memória.
      }
    },
    clear() {
      if (!available()) return
      try {
        window.localStorage.removeItem(key)
      } catch {
        // Idem.
      }
    },
  }
}

export function createMemoryProgressStorage(): ProgressStorage {
  let stored: PlayerProgress | null = null
  return {
    load: () => stored,
    save: (progress) => {
      stored = progress
    },
    clear: () => {
      stored = null
    },
  }
}
