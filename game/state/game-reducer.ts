import type { GameAction, GamePhase, GameSession, GameState, MatchStep, StageId } from '@/types'
import { getNextMatchStep } from '@/data/match-flow'
import { EMPTY_BUILD } from '@/game/build/build-system'

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
  farming: 'farming',
  build: 'build',
  chest: 'chest',
  battle: 'loading',
  result: 'result',
}

/** Fases da partida em que sair exige confirmação. */
const GUARDED_PHASES: GamePhase[] = ['farming', 'build', 'chest', 'world', 'paused']

function createSession(
  playerId: string,
  mode: GameSession['mode'],
  stageId: StageId | null,
  step: MatchStep,
  attempt = 1,
): GameSession {
  return {
    playerId,
    mode,
    stageId,
    step,
    attempt,
    startedAt: Date.now(),
    battleStartedAt: null,
    farmingRound: 1,
    farmingResults: [],
    build: EMPTY_BUILD,
    inventory: [],
  }
}

/** Avança para a próxima etapa implementada do fluxo vs Bot. */
function advance(state: GameState, session: GameSession): GameState {
  const next = getNextMatchStep(session.step)
  const phase = next ? STEP_PHASE[next] : undefined
  if (!next || !phase) return { ...state, session }
  return { ...state, phase, exitPrompt: false, session: { ...session, step: next } }
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
    case 'farming':
    case 'build':
    case 'chest':
      return { ...state, exitPrompt: true }
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
        session: createSession(action.playerId, 'vsBot', action.stageId, 'preparation'),
      }

    case 'START_TRAINING':
      return {
        ...state,
        phase: 'loading',
        menuScreen: 'main',
        exitPrompt: false,
        lastResult: null,
        session: createSession(action.playerId, 'training', null, 'battle'),
      }

    case 'ADVANCE_MATCH':
      if (!state.session || state.session.mode !== 'vsBot') return state
      return advance(state, state.session)

    case 'FINISH_FARMING':
      if (state.session?.step !== 'farming') return state
      return advance(state, {
        ...state.session,
        farmingResults: [...state.session.farmingResults, action.result],
        farmingRound: state.session.farmingRound + 1,
      })

    case 'CONFIRM_BUILD':
      if (state.session?.step !== 'build') return state
      return advance(state, { ...state.session, build: action.allocation })

    case 'CLAIM_CHEST':
      if (state.session?.step !== 'chest') return state
      return advance(state, { ...state.session, inventory: [...state.session.inventory, ...action.items] })

    case 'USE_ITEM':
      if (!state.session) return state
      return {
        ...state,
        session: { ...state.session, inventory: state.session.inventory.filter((i) => i.uid !== action.uid) },
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
        session: createSession(
          state.session.playerId,
          'vsBot',
          state.session.stageId,
          'preparation',
          state.session.attempt + 1,
        ),
      }

    case 'REQUEST_EXIT': {
      const inMatch = GUARDED_PHASES.includes(state.phase) && state.session?.mode === 'vsBot'
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
