'use client'

import { useSyncExternalStore } from 'react'
import type { GameState } from '@/types'
import { gameStore } from '@/game/state/game-store'

export function useGameStore<T>(selector: (state: GameState) => T): T {
  return useSyncExternalStore(
    gameStore.subscribe,
    () => selector(gameStore.getState()),
    () => selector(gameStore.getState()),
  )
}

export const useGameDispatch = () => gameStore.dispatch
