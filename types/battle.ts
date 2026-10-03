import type { MinigameGrade } from './farming'
import type { MatchOutcome } from './match'
import type { SkillDefinition } from './skill'
import type { Unit, UnitTeam } from './unit'

export type TurnActor = UnitTeam

export interface ArenaUnit {
  unit: Unit
  cell: number
  /** 1 = olhando para a direita, -1 = esquerda. */
  facing: 1 | -1
}

export type ArenaUnits = Record<UnitTeam, ArenaUnit>

export interface TurnState {
  number: number
  actor: TurnActor | null
  /** Quem venceu a roleta. */
  first: TurnActor | null
}

/** Decisão completa da IA para um turno. */
export interface EnemyDecision {
  moveTo: number | null
  skill: SkillDefinition
  /** Casas que serão atingidas (calculadas após o movimento). */
  targetCells: number[]
  /** Dano pré-calculado (a variação aleatória fica fora do reducer). */
  damage: number
}

export interface Telegraph {
  skill: SkillDefinition
  cells: number[]
  remainingMs: number
  totalMs: number
}

export interface Barrier {
  owner: UnitTeam
  cells: number[]
}

export type BattleEffectKind = 'damage' | 'heal' | 'grade' | 'dodge' | 'block' | 'mp'

/** Texto flutuante ancorado em uma unidade. */
export interface BattleEffect {
  id: string
  team: UnitTeam
  kind: BattleEffectKind
  text: string
  grade?: MinigameGrade
  /** Deslocamento horizontal aleatório para não sobrepor números. */
  offsetX: number
}

export type BattlePhase =
  | { kind: 'roulette' }
  | { kind: 'banner'; elapsedMs: number }
  | { kind: 'playerAction' }
  | { kind: 'skill'; skill: SkillDefinition }
  | { kind: 'skillRecover'; elapsedMs: number }
  | { kind: 'enemyThink'; elapsedMs: number }
  | { kind: 'enemyMove'; elapsedMs: number; decision: EnemyDecision }
  | { kind: 'telegraph'; decision: EnemyDecision }
  | { kind: 'enemyStrike'; elapsedMs: number }
  | { kind: 'ended'; outcome: MatchOutcome; elapsedMs: number }

export interface UnitFx {
  hit: boolean
  acting: boolean
  dead: boolean
}

export interface BattleState {
  units: ArenaUnits
  turn: TurnState
  phase: BattlePhase
  telegraph: Telegraph | null
  barrier: Barrier | null
  effects: BattleEffect[]
  /** Contador para ids de efeitos (mantém o reducer determinístico). */
  nextEffectId: number
  fx: Record<UnitTeam, UnitFx>
  /** Recarga de movimento por equipe (ms). */
  moveCooldown: Record<UnitTeam, number>
  outcome: MatchOutcome | null
  /** Sinaliza à tela que o combate terminou e a animação de morte já rodou. */
  finished: boolean
}

export interface HitInput {
  target: UnitTeam
  amount: number
  grade?: MinigameGrade
  label?: string
}

export type BattleAction =
  | { type: 'TICK'; dt: number }
  | { type: 'ROULETTE_DONE'; first: TurnActor }
  | { type: 'MOVE'; team: UnitTeam; cell: number }
  | { type: 'START_SKILL'; skill: SkillDefinition }
  | { type: 'HIT'; hit: HitInput }
  | { type: 'MISS'; team: UnitTeam; grade: MinigameGrade }
  | { type: 'SET_BARRIER'; cells: number[] }
  | { type: 'SKILL_DONE' }
  | { type: 'PASS_TURN' }
  | { type: 'HEAL'; team: UnitTeam; amount: number }
  | { type: 'ENEMY_DECIDED'; decision: EnemyDecision }
  | { type: 'EFFECT_EXPIRED'; id: string }
  | { type: 'FORCE_END'; outcome: MatchOutcome }
