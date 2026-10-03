import type { MinigameGrade } from './farming'

export type SkillType = 'attack' | 'defense'

/**
 * Forma de interação da skill. Cada efeito tem uma UI própria no combate
 * (`components/game/screens/battle/skills`) e um padrão de área para a IA.
 */
export type SkillEffect = 'meteor' | 'laceration' | 'barrier' | 'timing'

export interface SkillDefinition {
  id: string
  name: string
  description: string
  mpCost: number
  /** Multiplicador do ATTACK por acerto (skills de defesa usam 0). */
  power: number
  type: SkillType
  effect: SkillEffect
  /** Quantidade de acertos/interações (meteoros, cortes, casas protegidas). */
  hits: number
  /** Multiplicador de dano por precisão. */
  gradeMultiplier: Record<MinigameGrade, number>
}
