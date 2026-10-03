import type { GradeCounts, MinigameGrade, MinigameId } from '@/types'
import { COMBO_TIERS, GRADE_SCORE, GRADE_STARS, MINIGAME_ROTATION } from '@/data/minigames'

export const EMPTY_GRADES: GradeCounts = { perfect: 0, great: 0, good: 0, miss: 0 }

export function nextCombo(combo: number, grade: MinigameGrade): number {
  return grade === 'miss' ? 0 : combo + 1
}

export function comboBonus(combo: number): number {
  return COMBO_TIERS.find((tier) => combo >= tier.minCombo)?.bonusStars ?? 0
}

export interface GradeOutcome {
  combo: number
  stars: number
  bonus: number
  score: number
}

/** Calcula estrelas, bônus e pontos de um acerto, já com o combo atualizado. */
export function scoreGrade(combo: number, grade: MinigameGrade): GradeOutcome {
  const updated = nextCombo(combo, grade)
  const bonus = grade === 'miss' ? 0 : comboBonus(updated)
  const multiplier = 1 + Math.min(updated, 20) * 0.05
  return {
    combo: updated,
    stars: GRADE_STARS[grade],
    bonus,
    score: Math.round(GRADE_SCORE[grade] * multiplier),
  }
}

export function minigameForRound(round: number): MinigameId {
  return MINIGAME_ROTATION[round % MINIGAME_ROTATION.length]
}

/**
 * Nível de dificuldade de um minigame: cresce a cada vez que ele
 * reaparece no mesmo Farming e com o número da rodada de Farming.
 */
export function minigameLevel(round: number, farmingRound: number): number {
  return Math.floor(round / MINIGAME_ROTATION.length) + (farmingRound - 1)
}
