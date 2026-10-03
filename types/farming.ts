export type MinigameId = 'reflex' | 'timing' | 'memory'

export type MinigameGrade = 'perfect' | 'great' | 'good' | 'miss'

export type GradeCounts = Record<MinigameGrade, number>

/** Resultado consolidado de uma rodada de Farming. */
export interface FarmingResult {
  round: number
  /** Estrelas dos minigames (inclui bônus de combo). */
  baseStars: number
  /** Estrelas extras vindas do atributo FARMING da build. */
  bonusStars: number
  totalStars: number
  score: number
  maxCombo: number
  grades: GradeCounts
  minigamesPlayed: number
}
