import type { ComponentType } from 'react'
import type { MinigameId } from '@/types'
import type { MinigameProps } from './minigame-types'
import { ReflexMinigame } from './minigames/reflex-minigame'
import { TimingMinigame } from './minigames/timing-minigame'
import { MemoryMinigame } from './minigames/memory-minigame'

/** Para criar um novo minigame: adicione o id em `MinigameId`, os metadados em `data/minigames` e o componente aqui. */
export const MINIGAME_COMPONENTS: Record<MinigameId, ComponentType<MinigameProps>> = {
  reflex: ReflexMinigame,
  timing: TimingMinigame,
  memory: MemoryMinigame,
}
