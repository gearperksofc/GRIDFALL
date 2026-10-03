import type { AiProfile, ArenaUnit, EnemyDecision, SkillDefinition, SkillEffect } from '@/types'
import { ARENA_CELLS, cellCol, cellRow, distance, neighbors, toCell } from '@/game/arena/arena-grid'
import { computeDamage } from '@/game/battle/damage'

export interface AiContext {
  profile: AiProfile
  enemy: ArenaUnit
  player: ArenaUnit
  turn: number
  /** Multiplicador de pressão da fase (encurta a janela de esquiva). */
  eventPressure: number
}

/**
 * Personalidade de IA: recebe o contexto do turno e devolve uma decisão completa.
 * Novas personalidades (defensiva, berserker, trapaceira…) = novas entradas em AI_PERSONALITIES.
 */
export interface AiPersonality {
  id: string
  name: string
  decide(ctx: AiContext, random?: () => number): EnemyDecision
}

/** Área atingida por cada skill quando usada pela IA, mirando em `aim`. */
interface AttackPattern {
  cells: (aim: number, random: () => number) => number[]
  /** Fração do poder total da skill que efetivamente atinge uma casa. */
  powerFactor: number
}

const pickRandom = <T>(list: T[], random: () => number): T => list[Math.floor(random() * list.length)]

export const ATTACK_PATTERNS: Record<SkillEffect, AttackPattern | null> = {
  timing: { cells: (aim) => [aim], powerFactor: 1 },
  meteor: {
    cells: (aim, random) => {
      const pool = ARENA_CELLS.filter((c) => c !== aim)
      const extra: number[] = []
      while (extra.length < 3 && pool.length) extra.push(pool.splice(Math.floor(random() * pool.length), 1)[0])
      return [aim, ...extra]
    },
    powerFactor: 1.6,
  },
  laceration: {
    cells: (aim, random) => {
      const horizontal = random() < 0.5
      return [0, 1, 2].map((i) => (horizontal ? toCell(cellRow(aim), i) : toCell(i, cellCol(aim))))
    },
    powerFactor: 1.5,
  },
  barrier: null,
}

/** Janela de esquiva: IAs agressivas e fases com mais pressão dão menos tempo. */
export function dodgeWindowMs(profile: AiProfile, eventPressure: number): number {
  const base = 2600 - profile.aggression * 700
  return Math.round(Math.min(3200, Math.max(1300, base / eventPressure)))
}

/** Tempo que a IA "pensa" antes de agir. */
export function thinkTimeMs(profile: AiProfile): number {
  return profile.reactionMs + 500
}

function chooseMove(ctx: AiContext, random: () => number): number | null {
  const { profile, enemy, player } = ctx
  const options = neighbors(enemy.cell).filter((c) => c !== player.cell)
  if (options.length === 0 || random() > 0.25 + profile.movement * 0.55) return null
  if (random() < profile.aggression) {
    return options.reduce((best, c) => (distance(c, player.cell) < distance(best, player.cell) ? c : best))
  }
  return pickRandom(options, random)
}

function chooseSkill(ctx: AiContext, random: () => number): SkillDefinition {
  const { profile, enemy, player } = ctx
  const attacks = enemy.unit.skills.filter((s) => s.type === 'attack' && ATTACK_PATTERNS[s.effect])
  const known = attacks.slice(0, Math.max(1, profile.skillVariety))
  const affordable = known.filter((s) => s.mpCost <= enemy.unit.mp)
  const pool = affordable.length ? affordable : [known.reduce((a, b) => (a.mpCost < b.mpCost ? a : b))]

  const playerHpRatio = player.unit.hp / player.unit.maxHp
  const scored = pool.map((skill) => {
    const pattern = ATTACK_PATTERNS[skill.effect]!
    const coverage = pattern.cells(player.cell, random).length / 9
    const hitChance = Math.min(1, coverage + profile.decisionQuality * 0.4)
    const expected = skill.power * pattern.powerFactor * hitChance
    const finisher = playerHpRatio < 0.35 ? skill.power * 0.3 : 0
    const noise = random() * (1 - profile.decisionQuality) * 0.8
    return { skill, score: expected + finisher + noise }
  })
  return scored.reduce((a, b) => (b.score > a.score ? b : a)).skill
}

/** A mira erra de propósito com frequência inversa à qualidade de decisão. */
function chooseAim(ctx: AiContext, random: () => number): number {
  const { player, profile } = ctx
  if (random() < profile.decisionQuality * 0.85) return player.cell
  return pickRandom(neighbors(player.cell), random)
}

const balanced: AiPersonality = {
  id: 'balanced',
  name: 'Equilibrada',
  decide(ctx, random = Math.random) {
    const moveTo = chooseMove(ctx, random)
    const skill = chooseSkill(ctx, random)
    const pattern = ATTACK_PATTERNS[skill.effect]!
    const aim = chooseAim(ctx, random)
    const targetCells = Array.from(new Set(pattern.cells(aim, random)))
    const damage = computeDamage({
      attacker: ctx.enemy.unit,
      defender: ctx.player.unit,
      power: skill.power * pattern.powerFactor,
      random,
    })
    return { moveTo, skill, targetCells, damage }
  },
}

export const AI_PERSONALITIES: Record<string, AiPersonality> = {
  balanced,
}

export const DEFAULT_PERSONALITY = 'balanced'

export function getPersonality(id?: string): AiPersonality {
  return AI_PERSONALITIES[id ?? DEFAULT_PERSONALITY] ?? balanced
}
