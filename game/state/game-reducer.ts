import type { GameAction, GamePhase, GameState, MatchStep } from '@/types'
import { getNextMatchStep } from '@/data/match-flow'

export const INITIAL_GAME_STATE: GameState = {
  phase: 'title',
  menuScreen: 'main',
  scene: 'title',
  session: null,
  selectedStageId: null,
  exitPrompt: false,
  lastResult: null,
  settings: {
    sound: true,
    haptics: true,
    showDebug: true,
  },
  connection: 'offline',
  fps: 0,
}

/** Fase de tela de cada etapa implementada da partida. */
const STEP_PHASE: Partial<Record<MatchStep, GamePhase>> = {
  preparation: 'preparation',
  battle: 'loading',
  result: 'result',
}

/** Sai da partida atual e volta para a tela que a originou. */
function leaveMatch(state: GameState): GameState {
  const phase: GamePhase = state.session?.mode === 'training' ? 'modeSelect' : 'stageSelect'
  return { ...state, phase, session: null, exitPrompt: false, selectedStageId: null }
}

/**
 * Regra de "voltar" hierárquica. Cada tela sabe para onde retorna,
 * e uma partida em andamento nunca é abandonada sem confirmação.
 */
function goBack(state: GameState): GameState {
  if (state.exitPrompt) return { ...state, exitPrompt: false }

  switch (state.phase) {
    case 'menu':
      return state.menuScreen === 'main' ? state : { ...state, menuScreen: 'main' }
    case 'modeSelect':
      return { ...state, phase: 'menu', menuScreen: 'main' }
    case 'stageSelect':
      return state.selectedStageId
        ? { ...state, selectedStageId: null }
        : { ...state, phase: 'modeSelect' }
    case 'preparation':
      return { ...state, phase: 'stageSelect', session: null }
    case 'world':
      return state.session?.mode === 'training' ? leaveMatch(state) : { ...state, exitPrompt: true }
    case 'paused':
      return { ...state, phase: 'world' }
    case 'result':
      return leaveMatch(state)
    default:
      return state
  }
}

/**
 * Máquina de estados do jogo. Pura e determinística — sem efeitos colaterais.
 */
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'BOOT_COMPLETE':
      return { ...state, phase: 'title', scene: 'title' }

    case 'OPEN_MENU':
      return { ...state, phase: 'menu', menuScreen: 'main', scene: 'title', session: null, exitPrompt: false }

    case 'SET_MENU_SCREEN':
      return state.menuScreen === action.screen ? state : { ...state, menuScreen: action.screen }

    case 'OPEN_MODE_SELECT':
      return state.phase === 'menu' ? { ...state, phase: 'modeSelect', menuScreen: 'main' } : state

    case 'OPEN_STAGE_SELECT':
      return {
        ...state,
        phase: 'stageSelect',
        menuScreen: 'main',
        session: null,
        exitPrompt: false,
        selectedStageId: null,
      }

    case 'SELECT_STAGE':
      return state.selectedStageId === action.stageId ? state : { ...state, selectedStageId: action.stageId }

    case 'START_MATCH':
      return {
        ...state,
        phase: 'preparation',
        menuScreen: 'main',
        selectedStageId: action.stageId,
        exitPrompt: false,
        lastResult: null,
        session: {
          playerId: action.playerId,
          mode: 'vsBot',
          stageId: action.stageId,
          step: 'preparation',
          attempt: 1,
          startedAt: Date.now(),
          battleStartedAt: null,
        },
      }

    case 'START_TRAINING':
      return {
        ...state,
        phase: 'loading',
        menuScreen: 'main',
        exitPrompt: false,
        lastResult: null,
        session: {
          playerId: action.playerId,
          mode: 'training',
          stageId: null,
          step: 'battle',
          attempt: 1,
          startedAt: Date.now(),
          battleStartedAt: null,
        },
      }

    case 'ADVANCE_MATCH': {
      if (!state.session || state.session.mode !== 'vsBot') return state
      const next = getNextMatchStep(state.session.step)
      const phase = next ? STEP_PHASE[next] : undefined
      if (!next || !phase) return state
      return { ...state, phase, session: { ...state.session, step: next } }
    }

    case 'LOADING_COMPLETE':
      return {
        ...state,
        phase: 'world',
        scene: action.scene,
        session: state.session ? { ...state.session, battleStartedAt: Date.now() } : null,
      }

    case 'END_MATCH':
      if (!state.session || state.session.mode !== 'vsBot') return state
      return {
        ...state,
        phase: 'result',
        exitPrompt: false,
        lastResult: action.result,
        session: { ...state.session, step: 'result' },
      }

    case 'RETRY_STAGE':
      if (!state.session?.stageId) return state
      return {
        ...state,
        phase: 'preparation',
        exitPrompt: false,
        lastResult: null,
        session: {
          ...state.session,
          step: 'preparation',
          attempt: state.session.attempt + 1,
          startedAt: Date.now(),
          battleStartedAt: null,
        },
      }

    case 'REQUEST_EXIT': {
      const inMatch = (state.phase === 'world' || state.phase === 'paused') && state.session?.mode === 'vsBot'
      return inMatch ? { ...state, exitPrompt: true } : state
    }

    case 'CANCEL_EXIT':
      return state.exitPrompt ? { ...state, exitPrompt: false } : state

    case 'ABANDON_MATCH':
    case 'EXIT_TRAINING':
      return leaveMatch(state)

    case 'GO_BACK':
      return goBack(state)

    case 'PAUSE':
      return state.phase === 'world' ? { ...state, phase: 'paused' } : state

    case 'RESUME':
      return state.phase === 'paused' ? { ...state, phase: 'world' } : state

    case 'RETURN_TO_TITLE':
      return {
        ...state,
        phase: 'menu',
        menuScreen: 'main',
        scene: 'title',
        session: null,
        exitPrompt: false,
        selectedStageId: null,
      }

    case 'SET_FPS':
      return state.fps === action.fps ? state : { ...state, fps: action.fps }

    case 'SET_CONNECTION':
      return { ...state, connection: action.status }

    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.settings } }

    default:
      return state
  }
}
