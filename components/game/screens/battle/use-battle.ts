'use client'

import { useEffect, useMemo, useReducer, useRef } from 'react'
import type {
  BattleAction,
  BattleState,
  Direction,
  GameSession,
  MatchOutcome,
  MinigameGrade,
  SkillDefinition,
  StageDefinition,
  TurnActor,
} from '@/types'
import { AI_PROFILES } from '@/data/stages'
import { dodgeWindowMs, getPersonality, thinkTimeMs } from '@/game/ai/enemy-ai'
import { neighbors, stepCell } from '@/game/arena/arena-grid'
import { battleReducer, createBattleState, type BattleConfig } from '@/game/battle/battle-reducer'
import { skillHitDamage } from '@/game/battle/damage'
import { finishBattle } from '@/game/match/match-controller'
import { getInputManager } from '@/hooks/use-input'
import { useTicker } from '@/hooks/use-ticker'

/**
 * Liga a máquina de estados do combate ao relógio, à IA e ao input.
 * Toda a aleatoriedade (roleta, decisões da IA, variação de dano) nasce aqui
 * e entra no reducer como ação — o reducer permanece puro.
 */
export function useBattle(session: GameSession, stage: StageDefinition | null, paused: boolean) {
  const profile = stage?.enemy.ai ?? AI_PROFILES.basic
  const personality = getPersonality(stage?.enemy.aiPersonality)
  const eventPressure = stage?.eventPressure ?? 1

  const config = useMemo<BattleConfig>(
    () => ({ thinkMs: thinkTimeMs(profile), dodgeMs: dodgeWindowMs(profile, eventPressure) }),
    [profile, eventPressure],
  )

  const [state, dispatch] = useReducer(
    (s: BattleState, a: BattleAction) => battleReducer(s, a, config),
    session,
    createBattleState,
  )

  const decidedTurn = useRef(-1)
  const active = !paused && !state.finished

  useTicker((dt) => {
    dispatch({ type: 'TICK', dt })
    const { phase, turn } = state
    if (phase.kind === 'enemyThink' && phase.elapsedMs >= config.thinkMs && decidedTurn.current !== turn.number) {
      decidedTurn.current = turn.number
      const decision = personality.decide({
        profile,
        enemy: state.units.enemy,
        player: state.units.player,
        turn: turn.number,
        eventPressure,
      })
      dispatch({ type: 'ENEMY_DECIDED', decision })
    }
  }, active)

  useEffect(() => {
    if (state.finished && state.outcome) finishBattle(state.outcome)
  }, [state.finished, state.outcome])

  const movePlayer = (cell: number) => dispatch({ type: 'MOVE', team: 'player', cell })

  const moveDirection = (direction: Direction) => {
    const target = stepCell(state.units.player.cell, direction)
    if (target !== null) movePlayer(target)
  }
  const moveRef = useRef(moveDirection)
  useEffect(() => {
    moveRef.current = moveDirection
  })

  useEffect(
    () =>
      getInputManager().subscribe((key, pressed) => {
        if (!pressed || paused) return
        if (key === 'up' || key === 'down' || key === 'left' || key === 'right') moveRef.current(key)
      }),
    [paused],
  )

  const { phase, units, outcome } = state
  const canMove = !outcome && (phase.kind === 'playerAction' || phase.kind === 'telegraph')
  const canAct = !outcome && phase.kind === 'playerAction'

  /** Chance do jogador começar: SPEED pesa levemente a roleta. */
  const playerFirstChance = Math.min(
    0.7,
    Math.max(0.3, 0.5 + (units.player.unit.speed - units.enemy.unit.speed) * 0.03),
  )

  return {
    state,
    canMove,
    canAct,
    playerFirstChance,
    reachable: canMove ? neighbors(units.player.cell).filter((c) => c !== units.enemy.cell) : [],
    movePlayer,
    rouletteDone: (first: TurnActor) => dispatch({ type: 'ROULETTE_DONE', first }),
    castSkill: (skill: SkillDefinition) => dispatch({ type: 'START_SKILL', skill }),
    /** Um acerto do jogador na unidade inimiga, com dano calculado pela precisão. */
    hitEnemy: (skill: SkillDefinition, grade: MinigameGrade) => {
      if (grade === 'miss') {
        dispatch({ type: 'MISS', team: 'enemy', grade })
        return 0
      }
      const amount = skillHitDamage(units.player.unit, units.enemy.unit, skill, grade)
      dispatch({ type: 'HIT', hit: { target: 'enemy', amount, grade } })
      return amount
    },
    setBarrier: (cells: number[]) => dispatch({ type: 'SET_BARRIER', cells }),
    skillDone: () => dispatch({ type: 'SKILL_DONE' }),
    passTurn: () => dispatch({ type: 'PASS_TURN' }),
    healPlayer: (amount: number) => dispatch({ type: 'HEAL', team: 'player', amount }),
    expireEffect: (id: string) => dispatch({ type: 'EFFECT_EXPIRED', id }),
    forceEnd: (result: MatchOutcome) => dispatch({ type: 'FORCE_END', outcome: result }),
  }
}

export type BattleController = ReturnType<typeof useBattle>
