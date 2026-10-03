'use client'

import { useRef, useState } from 'react'
import type { GradeCounts, MinigameGrade } from '@/types'
import { FARMING_DURATION_MS } from '@/data/minigames'
import { EMPTY_GRADES, scoreGrade } from '@/game/farming/farming-rules'
import { useTicker } from '@/hooks/use-ticker'
import type { GradePoint } from '../../farming/minigame-types'

const INTRO_MS = 1400

export type FarmingStatus = 'intro' | 'playing' | 'finished'

export interface FeedbackEvent {
  id: number
  grade: MinigameGrade
  stars: number
  bonus: number
  at: GradePoint
}

export interface FarmingRunState {
  status: FarmingStatus
  secondsLeft: number
  stars: number
  score: number
  combo: number
  maxCombo: number
  grades: GradeCounts
  round: number
  events: FeedbackEvent[]
}

const INITIAL: FarmingRunState = {
  status: 'intro',
  secondsLeft: Math.ceil(FARMING_DURATION_MS / 1000),
  stars: 0,
  score: 0,
  combo: 0,
  maxCombo: 0,
  grades: EMPTY_GRADES,
  round: 0,
  events: [],
}

/**
 * Sessão de Farming: timer de 30s, estrelas, combo, pontuação e rodízio de minigames.
 * Independente de qual minigame está ativo — eles só reportam notas.
 */
export function useFarmingRun(paused: boolean) {
  const [state, setState] = useState<FarmingRunState>(INITIAL)
  const clock = useRef({ intro: 0, elapsed: 0, eventId: 0 })
  const progressRef = useRef<HTMLDivElement>(null)

  useTicker(
    (dt) => {
      const c = clock.current
      if (state.status === 'intro') {
        c.intro += dt
        if (c.intro >= INTRO_MS) setState((s) => ({ ...s, status: 'playing' }))
        return
      }
      c.elapsed = Math.min(FARMING_DURATION_MS, c.elapsed + dt)
      const remaining = FARMING_DURATION_MS - c.elapsed
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${remaining / FARMING_DURATION_MS})`
      const secondsLeft = Math.ceil(remaining / 1000)
      if (remaining <= 0) setState((s) => ({ ...s, secondsLeft: 0, status: 'finished' }))
      else if (secondsLeft !== state.secondsLeft) setState((s) => ({ ...s, secondsLeft }))
    },
    !paused && state.status !== 'finished',
  )

  const registerGrade = (grade: MinigameGrade, at: GradePoint = { x: 50, y: 50 }) => {
    if (state.status !== 'playing') return
    const id = ++clock.current.eventId
    setState((s) => {
      const outcome = scoreGrade(s.combo, grade)
      return {
        ...s,
        combo: outcome.combo,
        maxCombo: Math.max(s.maxCombo, outcome.combo),
        stars: s.stars + outcome.stars + outcome.bonus,
        score: s.score + outcome.score,
        grades: { ...s.grades, [grade]: s.grades[grade] + 1 },
        events: [...s.events.slice(-3), { id, grade, stars: outcome.stars, bonus: outcome.bonus, at }],
      }
    })
  }

  const completeRound = () => {
    setState((s) => (s.status === 'playing' ? { ...s, round: s.round + 1 } : s))
  }

  return { state, progressRef, registerGrade, completeRound }
}
