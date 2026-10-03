import type { MatchStats, PlayerProgress, StageDefinition } from '@/types'
import { STAGES } from '@/data/stages'
import { createLocalProgressStorage, type ProgressStorage } from './progress-storage'
import { applyStageClear, createDefaultProgress, type StageClearResult } from './stage-progress'

type Listener = () => void

export interface ProgressStore {
  getState: () => PlayerProgress
  subscribe: (listener: Listener) => () => void
  /** Carrega do storage uma única vez. Chamar no cliente após montar. */
  hydrate: () => void
  recordClear: (stage: StageDefinition, stats: MatchStats) => StageClearResult
  reset: () => void
}

/** Snapshot estável para renderização no servidor (antes da hidratação). */
export const DEFAULT_PROGRESS: PlayerProgress = createDefaultProgress()

export function createProgressStore(storage: ProgressStorage): ProgressStore {
  let state: PlayerProgress = DEFAULT_PROGRESS
  let hydrated = false
  const listeners = new Set<Listener>()

  const emit = () => {
    for (const listener of listeners) listener()
  }

  const setState = (next: PlayerProgress) => {
    if (next === state) return
    state = next
    storage.save(next)
    emit()
  }

  return {
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    hydrate() {
      if (hydrated) return
      hydrated = true
      const loaded = storage.load()
      if (loaded) {
        state = loaded
        emit()
      }
    },
    recordClear(stage, stats) {
      const result = applyStageClear(state, stage, stats, STAGES)
      setState(result.progress)
      return result
    },
    reset() {
      storage.clear()
      state = createDefaultProgress()
      emit()
    },
  }
}

export const progressStore = createProgressStore(createLocalProgressStorage())
