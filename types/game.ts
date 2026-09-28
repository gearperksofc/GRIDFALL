import type { SceneId } from './scene'
import type { ConnectionStatus } from './network'

export type GamePhase = 'boot' | 'title' | 'menu' | 'loading' | 'world' | 'paused'

export type MenuScreen = 'main' | 'collection' | 'shop' | 'howToPlay' | 'settings'

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
  menuScreen: MenuScreen
  scene: SceneId
  session: GameSession | null
  settings: GameSettings
  connection: ConnectionStatus
  fps: number
}

export type GameAction =
  | { type: 'BOOT_COMPLETE' }
  | { type: 'OPEN_MENU' }
  | { type: 'SET_MENU_SCREEN'; screen: MenuScreen }
  | { type: 'START_GAME'; playerId: string }
  | { type: 'LOADING_COMPLETE'; scene: SceneId }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'RETURN_TO_TITLE' }
  | { type: 'SET_FPS'; fps: number }
  | { type: 'SET_CONNECTION'; status: ConnectionStatus }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<GameSettings> }
