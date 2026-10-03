import type { MatchOutcome, MatchResult, StageId } from '@/types'
import { getStage } from '@/data/stages'
import { createId } from '@/lib/id'
import { gameStore } from '@/game/state/game-store'
import { progressStore } from '@/game/progress/progress-store'

/**
 * Orquestra o ciclo de vida de uma partida. Concentra os efeitos colaterais
 * (progresso, ids, relógio) para que o reducer permaneça puro.
 */
export function startStageMatch(stageId: StageId) {
  gameStore.dispatch({ type: 'START_MATCH', playerId: createId('player'), stageId })
}

export function startTraining() {
  gameStore.dispatch({ type: 'START_TRAINING', playerId: createId('player') })
}

export function finishMatch(outcome: MatchOutcome) {
  const { session } = gameStore.getState()
  const stage = getStage(session?.stageId)
  if (!session || !stage) return

  const stats = {
    durationMs: Date.now() - (session.battleStartedAt ?? session.startedAt),
    attempt: session.attempt,
  }

  const result: MatchResult =
    outcome === 'victory'
      ? (() => {
          const clear = progressStore.recordClear(stage, stats)
          return {
            outcome,
            stageId: stage.id,
            stats,
            reward: clear.firstClear ? stage.reward : null,
            firstClear: clear.firstClear,
            newBestTime: clear.newBestTime,
            unlockedStageId: clear.unlockedStageId,
          }
        })()
      : {
          outcome,
          stageId: stage.id,
          stats,
          reward: null,
          firstClear: false,
          newBestTime: false,
          unlockedStageId: null,
        }

  gameStore.dispatch({ type: 'END_MATCH', result })
}
