'use client'

import { useEffect, useMemo, useSyncExternalStore } from 'react'
import type { StageView } from '@/types'
import { STAGES } from '@/data/stages'
import { DEFAULT_PROGRESS, progressStore } from '@/game/progress/progress-store'
import { buildStageViews } from '@/game/progress/stage-progress'

/** Progresso completo (referência estável até a próxima mudança). */
export function useProgress() {
  return useSyncExternalStore(
    progressStore.subscribe,
    progressStore.getState,
    () => DEFAULT_PROGRESS,
  )
}

/** Fases combinadas com o progresso do jogador. */
export function useStageViews(): StageView[] {
  const progress = useProgress()
  return useMemo(() => buildStageViews(STAGES, progress), [progress])
}

/** Carrega o progresso salvo assim que o app monta no cliente. */
export function useHydrateProgress() {
  useEffect(() => {
    progressStore.hydrate()
  }, [])
}
