import type { GameMode, GameModeStatus, PlayableGameMode } from '@/types'
import { STRINGS } from './strings'

export type ModeAccent = 'gold' | 'arcane' | 'crimson' | 'violet' | 'emerald'

export interface GameModeDefinition {
  id: GameMode
  title: string
  description: string
  status: GameModeStatus
  /** Ilustração exibida no card (em /public/modes). */
  art: string
  accent: ModeAccent
  /** Mensagem exibida ao tocar em um modo bloqueado. */
  devNotice?: string
}

export const GAME_MODES: GameModeDefinition[] = [
  {
    id: 'vsBot',
    ...STRINGS.modeSelect.modes.vsBot,
    status: 'available',
    art: '/modes/vs-bot.png',
    accent: 'gold',
  },
  {
    id: 'pvp',
    ...STRINGS.modeSelect.modes.pvp,
    status: 'inDevelopment',
    art: '/modes/pvp.png',
    accent: 'arcane',
    devNotice: STRINGS.modeSelect.devNotice.pvp,
  },
  {
    id: 'bossRush',
    ...STRINGS.modeSelect.modes.bossRush,
    status: 'inDevelopment',
    art: '/modes/boss-rush.png',
    accent: 'crimson',
    devNotice: STRINGS.modeSelect.devNotice.bossRush,
  },
  {
    id: 'challenges',
    ...STRINGS.modeSelect.modes.challenges,
    status: 'inDevelopment',
    art: '/modes/challenges.png',
    accent: 'violet',
    devNotice: STRINGS.modeSelect.devNotice.challenges,
  },
  {
    id: 'training',
    ...STRINGS.modeSelect.modes.training,
    status: 'available',
    art: '/modes/training.png',
    accent: 'emerald',
  },
]

export function isPlayableMode(mode: GameMode): mode is PlayableGameMode {
  return mode === 'vsBot' || mode === 'training'
}
