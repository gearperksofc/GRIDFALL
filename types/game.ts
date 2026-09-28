import type { SceneId } from './scene'
import type { ConnectionStatus } from './network'

export type GamePhase = 'boot' | 'title' | 'loading' | 'world' | 'paused'

export interface GameSettings {
  sound: boolean
  haptics: boolean
  showDebug: boolean
}

export interface GameSession {
  playerId: string
  startedAt: number
}

export interface GameState {
  phase: GamePhase
  scene: SceneId
  session: GameSession | null
  settings: GameSettings
  connection: ConnectionStatus
  fps: number
}

export type GameAction =
  | { type: 'BOOT_COMPLETE' }
  | { type: 'START_GAME'; playerId: string }
  | { type: 'LOADING_COMPLETE'; scene: SceneId }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'RETURN_TO_TITLE' }
  | { type: 'SET_FPS'; fps: number }
  | { type: 'SET_CONNECTION'; status: ConnectionStatus }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<GameSettings> }
