import type { MinigameGrade, MinigameId } from '@/types'

export const FARMING_DURATION_MS = 30_000

export interface MinigameDefinition {
  id: MinigameId
  name: string
  instruction: string
}

/** Metadados dos minigames. O componente de cada um fica no registro da UI. */
export const MINIGAMES: Record<MinigameId, MinigameDefinition> = {
  reflex: { id: 'reflex', name: 'Reflexo', instruction: 'Toque no alvo o mais rápido possível!' },
  timing: { id: 'timing', name: 'Timing', instruction: 'Pare o marcador na zona PERFECT!' },
  memory: { id: 'memory', name: 'Memória', instruction: 'Memorize e repita a sequência!' },
}

/** Ordem de alternância durante o Farming. */
export const MINIGAME_ROTATION: MinigameId[] = ['reflex', 'timing', 'memory']

export const GRADE_STARS: Record<MinigameGrade, number> = {
  perfect: 5,
  great: 3,
  good: 2,
  miss: 0,
}

export const GRADE_SCORE: Record<MinigameGrade, number> = {
  perfect: 500,
  great: 300,
  good: 150,
  miss: 0,
}

export const GRADE_LABEL: Record<MinigameGrade, string> = {
  perfect: 'Perfect!',
  great: 'Great!',
  good: 'Good',
  miss: 'Miss',
}

export const GRADE_ORDER: MinigameGrade[] = ['perfect', 'great', 'good', 'miss']

/** Faixas de combo que concedem estrelas extras por acerto. */
export const COMBO_TIERS = [
  { minCombo: 10, bonusStars: 2 },
  { minCombo: 5, bonusStars: 1 },
]
