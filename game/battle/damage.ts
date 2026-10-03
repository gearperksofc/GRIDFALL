import type { MinigameGrade, SkillDefinition, Unit } from '@/types'

/** Variação aleatória do dano (±8%). */
const VARIANCE = 0.08

interface DamageInput {
  attacker: Pick<Unit, 'attack'>
  defender: Pick<Unit, 'defense'>
  /** Multiplicador do ATTACK (poder da skill por acerto). */
  power: number
  /** Multiplicador de precisão (PERFECT/GREAT/GOOD/MISS). */
  multiplier?: number
  random?: () => number
}

/**
 * Dano = ATTACK × poder × precisão, mitigado pela DEFESA em escala contínua
 * (defesa nunca zera o dano, apenas o reduz). Mínimo de 1 quando há acerto.
 */
export function computeDamage({ attacker, defender, power, multiplier = 1, random = Math.random }: DamageInput): number {
  if (multiplier <= 0 || power <= 0) return 0
  const raw = attacker.attack * power * multiplier
  const mitigation = 100 / (100 + Math.max(0, defender.defense) * 4)
  const variance = 1 - VARIANCE + random() * VARIANCE * 2
  return Math.max(1, Math.round(raw * mitigation * variance))
}

/** Dano de um acerto de skill do jogador, já com o multiplicador de precisão. */
export function skillHitDamage(attacker: Unit, defender: Unit, skill: SkillDefinition, grade: MinigameGrade): number {
  return computeDamage({ attacker, defender, power: skill.power, multiplier: skill.gradeMultiplier[grade] })
}

/** Dano máximo teórico por acerto (para exibir no HUD). */
export function skillMaxHit(attacker: Unit, skill: SkillDefinition): number {
  return Math.round(attacker.attack * skill.power * skill.gradeMultiplier.perfect)
}
