import type {
  ArenaUnits,
  BattleAction,
  BattleEffect,
  BattleEffectKind,
  BattleState,
  EnemyDecision,
  GameSession,
  MinigameGrade,
  TurnActor,
  Unit,
  UnitTeam,
} from '@/types'
import { BARRIER_DAMAGE_FACTOR, MP_REGEN_PER_TURN } from '@/data/skills'
import { GRADE_LABEL } from '@/data/minigames'
import { ENEMY_START_CELL, PLAYER_START_CELL, cellCol, moveCooldownMs, neighbors } from '@/game/arena/arena-grid'
import { createEnemyUnit, createPlayerUnit } from '@/game/units/unit-factory'

/** Durações das etapas automáticas do turno (ms). */
export const BATTLE_TIMING = {
  banner: 1300,
  enemyMove: 450,
  enemyStrike: 950,
  skillRecover: 800,
  ended: 1700,
  effect: 1100,
} as const

export interface BattleConfig {
  /** Tempo que a IA pensa antes de decidir. */
  thinkMs: number
  /** Janela de esquiva após o telegraph. */
  dodgeMs: number
}

const other = (team: UnitTeam): UnitTeam => (team === 'player' ? 'enemy' : 'player')

const NO_FX = { hit: false, acting: false, dead: false }

export function createBattleState(session: GameSession): BattleState {
  return {
    units: {
      player: { unit: createPlayerUnit(session), cell: PLAYER_START_CELL, facing: 1 },
      enemy: { unit: createEnemyUnit(session), cell: ENEMY_START_CELL, facing: -1 },
    },
    turn: { number: 0, actor: null, first: null },
    phase: { kind: 'roulette' },
    telegraph: null,
    barrier: null,
    effects: [],
    nextEffectId: 1,
    fx: { player: NO_FX, enemy: NO_FX },
    moveCooldown: { player: 0, enemy: 0 },
    outcome: null,
    finished: false,
  }
}

function faceTowards(from: number, to: number, current: 1 | -1): 1 | -1 {
  const diff = cellCol(to) - cellCol(from)
  return diff === 0 ? current : diff > 0 ? 1 : -1
}

function patchUnit(units: ArenaUnits, team: UnitTeam, patch: Partial<Unit>): ArenaUnits {
  return { ...units, [team]: { ...units[team], unit: { ...units[team].unit, ...patch } } }
}

function pushEffect(
  state: BattleState,
  team: UnitTeam,
  kind: BattleEffectKind,
  text: string,
  grade?: MinigameGrade,
): BattleState {
  const id = state.nextEffectId
  const effect: BattleEffect = { id: String(id), team, kind, text, grade, offsetX: ((id * 37) % 44) - 22 }
  return { ...state, effects: [...state.effects, effect], nextEffectId: id + 1 }
}

function setFx(state: BattleState, team: UnitTeam, patch: Partial<BattleState['fx'][UnitTeam]>): BattleState {
  return { ...state, fx: { ...state.fx, [team]: { ...state.fx[team], ...patch } } }
}

/** Aplica dano e resolve a morte. Não muda a fase — quem chama decide o que vem depois. */
function applyDamage(state: BattleState, target: UnitTeam, amount: number): BattleState {
  const unit = state.units[target].unit
  const hp = Math.max(0, unit.hp - amount)
  let next: BattleState = { ...state, units: patchUnit(state.units, target, { hp }) }
  next = setFx(next, target, { hit: true })
  if (hp > 0 || next.outcome) return next
  const outcome = target === 'enemy' ? 'victory' : 'defeat'
  return setFx({ ...next, outcome }, target, { dead: true })
}

/** Começa o turno de `actor`: regenera MP e exibe o banner. */
function startTurn(state: BattleState, actor: TurnActor): BattleState {
  if (state.outcome) return { ...state, phase: { kind: 'ended', outcome: state.outcome, elapsedMs: 0 } }
  const unit = state.units[actor].unit
  const regen = Math.min(MP_REGEN_PER_TURN, unit.maxMp - unit.mp)
  let next: BattleState = {
    ...state,
    units: patchUnit(state.units, actor, { mp: unit.mp + regen }),
    turn: {
      ...state.turn,
      actor,
      number: state.turn.number + (actor === state.turn.first || state.turn.number === 0 ? 1 : 0),
    },
    phase: { kind: 'banner', elapsedMs: 0 },
    fx: { player: NO_FX, enemy: NO_FX },
  }
  if (regen > 0) next = pushEffect(next, actor, 'mp', `+${regen} MP`)
  return next
}

function moveUnit(state: BattleState, team: UnitTeam, target: number): BattleState {
  const self = state.units[team]
  const opponent = state.units[other(team)]
  if (state.moveCooldown[team] > 0) return state
  if (!neighbors(self.cell).includes(target) || target === opponent.cell) return state
  const facing = faceTowards(target, opponent.cell, faceTowards(self.cell, target, self.facing))
  return {
    ...state,
    units: { ...state.units, [team]: { ...self, cell: target, facing } },
    moveCooldown: { ...state.moveCooldown, [team]: moveCooldownMs(self.unit.speed) },
  }
}

/** Resolve o golpe inimigo: acerto, esquiva ou bloqueio pela Barreira Gaia. */
function resolveEnemyStrike(state: BattleState, decision: EnemyDecision): BattleState {
  const player = state.units.player
  const inArea = decision.targetCells.includes(player.cell)
  const protectedCell = state.barrier?.owner === 'player' && state.barrier.cells.includes(player.cell)

  let next: BattleState = setFx(state, 'enemy', { acting: true })
  next = { ...next, telegraph: null, barrier: null, phase: { kind: 'enemyStrike', elapsedMs: 0 } }

  if (!inArea) return pushEffect(next, 'player', 'dodge', 'DODGE')

  const amount = protectedCell ? Math.max(1, Math.round(decision.damage * BARRIER_DAMAGE_FACTOR)) : decision.damage
  next = applyDamage(next, 'player', amount)
  next = pushEffect(next, 'player', 'damage', `-${amount}`)
  return protectedCell ? pushEffect(next, 'player', 'block', 'BLOCKED') : next
}

function tick(state: BattleState, dt: number, config: BattleConfig): BattleState {
  // Só cria um novo estado quando algo muda: fases sem relógio (roleta, ação do
  // jogador, skill) não devem re-renderizar a cada frame.
  const cooling = state.moveCooldown.player > 0 || state.moveCooldown.enemy > 0
  let next: BattleState = cooling
    ? {
        ...state,
        moveCooldown: {
          player: Math.max(0, state.moveCooldown.player - dt),
          enemy: Math.max(0, state.moveCooldown.enemy - dt),
        },
      }
    : state

  const phase = next.phase
  switch (phase.kind) {
    case 'banner': {
      const elapsedMs = phase.elapsedMs + dt
      if (elapsedMs < BATTLE_TIMING.banner) return { ...next, phase: { ...phase, elapsedMs } }
      return next.turn.actor === 'player'
        ? { ...next, phase: { kind: 'playerAction' } }
        : { ...next, phase: { kind: 'enemyThink', elapsedMs: 0 } }
    }
    case 'skillRecover': {
      const elapsedMs = phase.elapsedMs + dt
      if (elapsedMs < BATTLE_TIMING.skillRecover) return { ...next, phase: { ...phase, elapsedMs } }
      return startTurn(next, 'enemy')
    }
    case 'enemyThink':
      return { ...next, phase: { ...phase, elapsedMs: Math.min(config.thinkMs, phase.elapsedMs + dt) } }
    case 'enemyMove': {
      const elapsedMs = phase.elapsedMs + dt
      if (elapsedMs < BATTLE_TIMING.enemyMove) return { ...next, phase: { ...phase, elapsedMs } }
      return {
        ...next,
        phase: { kind: 'telegraph', decision: phase.decision },
        telegraph: {
          skill: phase.decision.skill,
          cells: phase.decision.targetCells,
          remainingMs: config.dodgeMs,
          totalMs: config.dodgeMs,
        },
      }
    }
    case 'telegraph': {
      if (!next.telegraph) return resolveEnemyStrike(next, phase.decision)
      const remainingMs = next.telegraph.remainingMs - dt
      if (remainingMs > 0) return { ...next, telegraph: { ...next.telegraph, remainingMs } }
      return resolveEnemyStrike(next, phase.decision)
    }
    case 'enemyStrike': {
      const elapsedMs = phase.elapsedMs + dt
      if (elapsedMs < BATTLE_TIMING.enemyStrike) return { ...next, phase: { ...phase, elapsedMs } }
      next = { ...next, fx: { player: { ...next.fx.player, hit: false }, enemy: { ...next.fx.enemy, acting: false } } }
      return next.outcome ? { ...next, phase: { kind: 'ended', outcome: next.outcome, elapsedMs: 0 } } : startTurn(next, 'player')
    }
    case 'ended': {
      const elapsedMs = phase.elapsedMs + dt
      if (elapsedMs < BATTLE_TIMING.ended) return { ...next, phase: { ...phase, elapsedMs } }
      return next.finished ? next : { ...next, finished: true }
    }
    default:
      return next
  }
}

/** Máquina de estados do combate. Pura: toda aleatoriedade entra pelas ações. */
export function battleReducer(state: BattleState, action: BattleAction, config: BattleConfig): BattleState {
  switch (action.type) {
    case 'TICK':
      return tick(state, action.dt, config)

    case 'ROULETTE_DONE':
      if (state.phase.kind !== 'roulette') return state
      return startTurn({ ...state, turn: { number: 0, actor: null, first: action.first } }, action.first)

    case 'MOVE': {
      const kind = state.phase.kind
      const allowed =
        action.team === 'player' ? kind === 'playerAction' || kind === 'telegraph' : kind === 'enemyMove'
      return allowed && !state.outcome ? moveUnit(state, action.team, action.cell) : state
    }

    case 'START_SKILL': {
      if (state.phase.kind !== 'playerAction') return state
      const unit = state.units.player.unit
      if (unit.mp < action.skill.mpCost) return state
      let next: BattleState = {
        ...state,
        units: patchUnit(state.units, 'player', { mp: unit.mp - action.skill.mpCost }),
        phase: { kind: 'skill', skill: action.skill },
      }
      next = setFx(next, 'player', { acting: true })
      return pushEffect(next, 'player', 'mp', `-${action.skill.mpCost} MP`)
    }

    case 'HIT': {
      if (state.phase.kind !== 'skill' || state.outcome) return state
      const { target, amount, grade, label } = action.hit
      let next = applyDamage(state, target, amount)
      next = pushEffect(next, target, 'damage', `-${amount}`)
      if (grade) next = pushEffect(next, target, 'grade', label ?? GRADE_LABEL[grade], grade)
      if (next.outcome) next = { ...next, phase: { kind: 'ended', outcome: next.outcome, elapsedMs: 0 } }
      return next
    }

    case 'MISS':
      if (state.phase.kind !== 'skill') return state
      return pushEffect(state, action.team, 'grade', GRADE_LABEL[action.grade], action.grade)

    case 'SET_BARRIER':
      if (state.phase.kind !== 'skill') return state
      return { ...state, barrier: { owner: 'player', cells: action.cells } }

    case 'SKILL_DONE':
      if (state.phase.kind !== 'skill') return state
      return setFx({ ...state, phase: { kind: 'skillRecover', elapsedMs: 0 } }, 'player', { acting: false, hit: false })

    case 'PASS_TURN':
      if (state.phase.kind !== 'playerAction') return state
      return { ...state, phase: { kind: 'skillRecover', elapsedMs: 0 } }

    case 'HEAL': {
      const unit = state.units[action.team].unit
      const amount = Math.min(action.amount, unit.maxHp - unit.hp)
      if (amount <= 0) return state
      const next: BattleState = { ...state, units: patchUnit(state.units, action.team, { hp: unit.hp + amount }) }
      return pushEffect(next, action.team, 'heal', `+${amount}`)
    }

    case 'ENEMY_DECIDED': {
      if (state.phase.kind !== 'enemyThink') return state
      const enemy = state.units.enemy.unit
      let next: BattleState = {
        ...state,
        units: patchUnit(state.units, 'enemy', { mp: Math.max(0, enemy.mp - action.decision.skill.mpCost) }),
        phase: { kind: 'enemyMove', elapsedMs: 0, decision: action.decision },
      }
      if (action.decision.moveTo !== null) {
        next = { ...next, moveCooldown: { ...next.moveCooldown, enemy: 0 } }
        next = moveUnit(next, 'enemy', action.decision.moveTo)
      }
      return next
    }

    case 'EFFECT_EXPIRED':
      return { ...state, effects: state.effects.filter((e) => e.id !== action.id) }

    case 'FORCE_END':
      if (state.outcome) return state
      return setFx(
        { ...state, outcome: action.outcome, telegraph: null, phase: { kind: 'ended', outcome: action.outcome, elapsedMs: 0 } },
        action.outcome === 'victory' ? 'enemy' : 'player',
        { dead: true },
      )

    default:
      return state
  }
}
