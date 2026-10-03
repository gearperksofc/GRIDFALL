import type { StageId, StageReward } from './stage'

/** Etapas de uma partida vs Bot, na ordem em que acontecem. */
export type MatchStep = 'preparation' | 'farming' | 'build' | 'chest' | 'battle' | 'result'

export type MatchOutcome = 'victory' | 'defeat'

export interface MatchStats {
  durationMs: number
  attempt: number
}

export interface MatchResult {
  outcome: MatchOutcome
  stageId: StageId
  stats: MatchStats
  reward: StageReward | null
  firstClear: boolean
  newBestTime: boolean
  unlockedStageId: StageId | null
}
