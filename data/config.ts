export const GAME_CONFIG = {
  name: 'Crônicas de Eldoria',
  version: '0.1.0',
  /** Atualizações de lógica por segundo (fixed timestep). */
  tickRate: 60,
  /** Tamanho de cada célula do mundo em pixels. */
  tileSize: 32,
  /** Velocidade base da câmera em tiles por segundo. */
  cameraSpeed: 6,
  /** Intervalo em ms para publicar FPS na store (evita re-render por frame). */
  fpsPublishInterval: 500,
  /** Duração simulada da tela de carregamento. */
  loadingDurationMs: 1800,
} as const

export const NETWORK_CONFIG = {
  /** Modo de rede atual. 'local' até o servidor multiplayer existir. */
  mode: 'local' as 'local' | 'online',
  serverUrl: process.env.NEXT_PUBLIC_GAME_SERVER_URL ?? '',
  pingIntervalMs: 5000,
} as const
