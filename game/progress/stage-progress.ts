import type {
  MatchStats,
  PlayerProgress,
  StageDefinition,
  StageId,
  StageStatus,
  StageView,
} from '@/types'

export function createDefaultProgress(): PlayerProgress {
  return {
    version: 1,
    highestUnlockedStage: 1,
    stages: {},
    wallet: { coins: 0, xp: 0 },
    items: {},
    updatedAt: 0,
  }
}

/** Valida dados vindos do storage. Retorna `null` se não forem confiáveis. */
export function parseProgress(raw: unknown): PlayerProgress | null {
  if (!raw || typeof raw !== 'object') return null
  const data = raw as Partial<PlayerProgress>
  if (data.version !== 1) return null
  if (typeof data.highestUnlockedStage !== 'number' || data.highestUnlockedStage < 1) return null
  const defaults = createDefaultProgress()
  return {
    version: 1,
    highestUnlockedStage: Math.floor(data.highestUnlockedStage),
    stages: data.stages && typeof data.stages === 'object' ? data.stages : defaults.stages,
    wallet: {
      coins: typeof data.wallet?.coins === 'number' ? data.wallet.coins : 0,
      xp: typeof data.wallet?.xp === 'number' ? data.wallet.xp : 0,
    },
    items: data.items && typeof data.items === 'object' ? data.items : defaults.items,
    updatedAt: typeof data.updatedAt === 'number' ? data.updatedAt : 0,
  }
}

export function getStageStatus(stage: StageDefinition, progress: PlayerProgress): StageStatus {
  if (progress.stages[stage.id]) return 'completed'
  return stage.number <= progress.highestUnlockedStage ? 'available' : 'locked'
}

export function buildStageViews(stages: StageDefinition[], progress: PlayerProgress): StageView[] {
  let currentAssigned = false
  return stages.map((stage) => {
    const status = getStageStatus(stage, progress)
    const record = progress.stages[stage.id]
    const isCurrent = !currentAssigned && status === 'available'
    if (isCurrent) currentAssigned = true
    return {
      ...stage,
      status,
      isUnlocked: status !== 'locked',
      isCompleted: status === 'completed',
      isCurrent,
      bestTimeMs: record?.bestTimeMs ?? null,
      clears: record?.clears ?? 0,
    }
  })
}

export interface StageClearResult {
  progress: PlayerProgress
  firstClear: boolean
  newBestTime: boolean
  unlockedStageId: StageId | null
}

/**
 * Aplica uma vitória: registra a fase, credita recompensas e libera a próxima.
 * Recompensas só são creditadas na primeira vitória para preservar o equilíbrio.
 */
export function applyStageClear(
  progress: PlayerProgress,
  stage: StageDefinition,
  stats: MatchStats,
  allStages: StageDefinition[],
  now = Date.now(),
): StageClearResult {
  const previous = progress.stages[stage.id]
  const firstClear = !previous
  const newBestTime = previous?.bestTimeMs == null || stats.durationMs < previous.bestTimeMs

  const record = {
    stageId: stage.id,
    clears: (previous?.clears ?? 0) + 1,
    bestTimeMs: newBestTime ? stats.durationMs : (previous?.bestTimeMs ?? stats.durationMs),
    firstClearedAt: previous?.firstClearedAt ?? now,
    lastClearedAt: now,
  }

  const nextStage = allStages.find((candidate) => candidate.number === stage.number + 1) ?? null
  const unlocks = nextStage !== null && nextStage.number > progress.highestUnlockedStage
  const multiplier = stage.rewardMultiplier ?? 1

  const wallet = firstClear
    ? {
        coins: progress.wallet.coins + Math.round(stage.reward.coins * multiplier),
        xp: progress.wallet.xp + Math.round(stage.reward.xp * multiplier),
      }
    : progress.wallet

  const items = { ...progress.items }
  if (firstClear) {
    for (const item of stage.reward.items ?? []) {
      items[item.id] = (items[item.id] ?? 0) + item.quantity
    }
  }

  return {
    progress: {
      ...progress,
      highestUnlockedStage: unlocks ? nextStage.number : progress.highestUnlockedStage,
      stages: { ...progress.stages, [stage.id]: record },
      wallet,
      items,
      updatedAt: now,
    },
    firstClear,
    newBestTime,
    unlockedStageId: unlocks ? nextStage.id : null,
  }
}
