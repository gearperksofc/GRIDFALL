import type { BuildAllocation, FarmingResult, InventoryItem, MatchOutcome, MatchResult, StageId } from '@/types'
import { getFarmingBonus, getSpentStars, getTotalStars } from '@/game/build/build-system'
import { getStage } from '@/data/stages'
import { MATCH_PHASES } from '@/data/match-flow'
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

/** Consolida o Farming aplicando o bônus do atributo FARMING já investido. */
export function finishFarming(raw: Omit<FarmingResult, 'round' | 'bonusStars' | 'totalStars'>) {
  const { session } = gameStore.getState()
  if (!session) return
  const bonusStars = Math.floor(raw.baseStars * getFarmingBonus(session.build))
  gameStore.dispatch({
    type: 'FINISH_FARMING',
    result: { ...raw, round: session.farmingRound, bonusStars, totalStars: raw.baseStars + bonusStars },
  })
}

export function confirmBuild(allocation: BuildAllocation) {
  const { session } = gameStore.getState()
  if (!session) return
  const total = getTotalStars(session.farmingResults)
  if (getSpentStars(allocation) > total) return
  gameStore.dispatch({ type: 'CONFIRM_BUILD', allocation })
}

export function claimChest(items: InventoryItem[]) {
  gameStore.dispatch({ type: 'CLAIM_CHEST', items })
}

/**
 * Fim de uma batalha. Derrota encerra a partida; vitória avança para o
 * próximo Farming até completar todas as fases, quando a partida é vencida.
 */
export function finishBattle(outcome: MatchOutcome) {
  const { session } = gameStore.getState()
  if (!session) return
  if (outcome === 'victory' && session.matchPhase < MATCH_PHASES) {
    gameStore.dispatch({ type: 'NEXT_MATCH_PHASE' })
    return
  }
  finishMatch(outcome)
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
