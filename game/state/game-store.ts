import type { GameAction, GameState } from '@/types'
import { gameReducer, INITIAL_GAME_STATE } from './game-reducer'

type Listener = () => void

export interface GameStore {
  getState: () => GameState
  dispatch: (action: GameAction) => void
  subscribe: (listener: Listener) => () => void
}

/**
 * Store minimalista sem dependências externas.
 * Compatível com `useSyncExternalStore` e fácil de espelhar em um servidor.
 */
export function createGameStore(initial: GameState = INITIAL_GAME_STATE): GameStore {
  let state = initial
  const listeners = new Set<Listener>()

  return {
    getState: () => state,
    dispatch(action) {
      const next = gameReducer(state, action)
      if (next === state) return
      state = next
      for (const listener of listeners) listener()
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}

export const gameStore = createGameStore()
