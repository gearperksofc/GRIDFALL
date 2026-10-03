import type { MatchStep } from '@/types'

export interface MatchStepDefinition {
  id: MatchStep
  /** Etapas ainda não implementadas são puladas pelo fluxo. */
  implemented: boolean
}

/**
 * Ordem oficial de uma partida vs Bot. Para ligar uma nova etapa
 * (Farming, Build, Baú) basta marcá-la como implementada e mapear sua fase no reducer.
 */
export const MATCH_FLOW: MatchStepDefinition[] = [
  { id: 'preparation', implemented: true },
  { id: 'farming', implemented: false },
  { id: 'build', implemented: false },
  { id: 'chest', implemented: false },
  { id: 'battle', implemented: true },
  { id: 'result', implemented: true },
]

export function getNextMatchStep(current: MatchStep): MatchStep | null {
  const index = MATCH_FLOW.findIndex((step) => step.id === current)
  if (index === -1) return null
  const next = MATCH_FLOW.slice(index + 1).find((step) => step.implemented)
  return next?.id ?? null
}
