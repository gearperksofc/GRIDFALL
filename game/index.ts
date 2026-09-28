/**
 * Camada de lógica do jogo — independente de React e da UI.
 *
 * engine/   loop de jogo, input
 * state/    máquina de estados (reducer + store)
 * systems/  regras puras (câmera, e futuramente movimento, batalha, etc.)
 * render/   desenho em canvas
 * network/  abstração de rede (local hoje, WebSocket amanhã)
 */
export { GameLoop } from './engine/game-loop'
export { InputManager, EMPTY_INPUT } from './engine/input-manager'
export { createGameStore, gameStore } from './state/game-store'
export { gameReducer, INITIAL_GAME_STATE } from './state/game-reducer'
export { updateCamera } from './systems/camera-system'
export { renderWorld } from './render/world-renderer'
export { createNetworkClient } from './network'
