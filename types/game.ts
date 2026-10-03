import type { SceneId } from './scene'
import type { ConnectionStatus } from './network'
import type { StageId } from './stage'
import type { MatchResult, MatchStep } from './match'
import type { FarmingResult } from './farming'
import type { BuildAllocation } from './build'
import type { InventoryItem } from './item'

export type GamePhase =
  | 'boot'
  | 'title'
  | 'menu'
  | 'modeSelect'
  | 'stageSelect'
  | 'preparation'
  | 'farming'
  | 'build'
  | 'chest'
  | 'loading'
  | 'world'
  | 'paused'
  | 'result'

export type MenuScreen = 'main' | 'collection' | 'shop' | 'howToPlay' | 'settings'

export type GameMode = 'vsBot' | 'pvp' | 'bossRush' | 'challenges' | 'training'

export type GameModeStatus = 'available' | 'inDevelopment'

/** Modos que já possuem um fluxo jogável. */
export type PlayableGameMode = Extract<GameMode, 'vsBot' | 'training'>

export interface GameSettings {
  sound: boolean
  haptics: boolean
  showDebug: boolean
}

export interface GameSession {
  playerId: string
  mode: PlayableGameMode
  /** Fase em disputa. `null` no treinamento. */
  stageId: StageId | null
  step: MatchStep
  attempt: number
  startedAt: number
  battleStartedAt: number | null
  /** Rodada de Farming atual (1 = primeira). */
  farmingRound: number
  farmingResults: FarmingResult[]
  /** Pontos de estrela distribuídos nos atributos. */
  build: BuildAllocation
  /** Inventário temporário — descartado ao fim da partida. */
  inventory: InventoryItem[]
}

export interface GameState {
  phase: GamePhase
  menuScreen: MenuScreen
  scene: SceneId
  session: GameSession | null
  /** Fase destacada na seleção (abre o painel de detalhes). */
  selectedStageId: StageId | null
  /** Diálogo "Abandonar partida?" aberto. */
  exitPrompt: boolean
  lastResult: MatchResult | null
  settings: GameSettings
  connection: ConnectionStatus
  fps: number
}

export type GameAction =
  | { type: 'BOOT_COMPLETE' }
  | { type: 'OPEN_MENU' }
  | { type: 'SET_MENU_SCREEN'; screen: MenuScreen }
  | { type: 'OPEN_MODE_SELECT' }
  | { type: 'OPEN_STAGE_SELECT' }
  | { type: 'SELECT_STAGE'; stageId: StageId | null }
  | { type: 'START_MATCH'; playerId: string; stageId: StageId }
  | { type: 'START_TRAINING'; playerId: string }
  | { type: 'ADVANCE_MATCH' }
  | { type: 'FINISH_FARMING'; result: FarmingResult }
  | { type: 'CONFIRM_BUILD'; allocation: BuildAllocation }
  | { type: 'CLAIM_CHEST'; items: InventoryItem[] }
  | { type: 'USE_ITEM'; uid: string }
  | { type: 'LOADING_COMPLETE'; scene: SceneId }
  | { type: 'END_MATCH'; result: MatchResult }
  | { type: 'RETRY_STAGE' }
  | { type: 'REQUEST_EXIT' }
  | { type: 'CANCEL_EXIT' }
  | { type: 'ABANDON_MATCH' }
  | { type: 'EXIT_TRAINING' }
  | { type: 'GO_BACK' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'RETURN_TO_TITLE' }
  | { type: 'SET_FPS'; fps: number }
  | { type: 'SET_CONNECTION'; status: ConnectionStatus }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<GameSettings> }
