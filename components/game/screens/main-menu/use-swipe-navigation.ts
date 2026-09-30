'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type TransitionEvent as ReactTransitionEvent,
} from 'react'
import type { MenuScreen } from '@/types'
import { useGameDispatch, useGameStore } from '@/hooks/use-game-store'
import { getAdjacentScreen, MENU_SCREEN_ORDER } from './menu-screens'

const START_THRESHOLD = 8
const COMMIT_RATIO = 0.28
const COMMIT_VELOCITY = 0.45
const RESISTANCE = 0.3
const MIN_DURATION = 220
const MAX_DURATION = 420
const SETTLE_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'

export type SwipeDirection = -1 | 1

interface DragState {
  pointerId: number
  startX: number
  startY: number
  lastX: number
  lastTime: number
  velocity: number
  axis: 'none' | 'horizontal' | 'vertical'
}

interface Transition {
  screen: MenuScreen
  direction: SwipeDirection
}

function directionBetween(from: MenuScreen, to: MenuScreen): SwipeDirection {
  return MENU_SCREEN_ORDER.indexOf(to) > MENU_SCREEN_ORDER.indexOf(from) ? 1 : -1
}

/**
 * Navegação entre telas do menu como um carrossel contínuo:
 * a tela atual e as vizinhas ficam lado a lado em uma trilha, que acompanha
 * o dedo e depois desliza suavemente até a posição final.
 */
export function useSwipeNavigation() {
  const dispatch = useGameDispatch()
  const current = useGameStore((s) => s.menuScreen)

  const containerRef = useRef<HTMLDivElement>(null)
  const drag = useRef<DragState | null>(null)
  const fallbackTimer = useRef<number | null>(null)

  const [displayed, setDisplayed] = useState<MenuScreen>(current)
  const [offset, setOffset] = useState(0)
  const [width, setWidth] = useState(1)
  const [dragging, setDragging] = useState(false)
  const [settling, setSettling] = useState(false)
  const [duration, setDuration] = useState(MAX_DURATION)
  const [transition, setTransition] = useState<Transition | null>(null)

  const measure = useCallback(() => {
    const w = containerRef.current?.clientWidth ?? 1
    setWidth(w)
    return w
  }, [])

  const clearFallback = () => {
    if (fallbackTimer.current !== null) {
      window.clearTimeout(fallbackTimer.current)
      fallbackTimer.current = null
    }
  }

  const pendingTransition = useRef<Transition | null>(null)

  const finishSettle = useCallback(() => {
    clearFallback()
    const pending = pendingTransition.current
    pendingTransition.current = null
    setSettling(false)
    if (pending) setDisplayed(pending.screen)
    setTransition(null)
    setOffset(0)
  }, [])

  const settleTo = useCallback(
    (targetOffset: number, ms: number) => {
      setDuration(ms)
      setSettling(true)
      setOffset(targetOffset)
      clearFallback()
      // Garante o encerramento mesmo sem `transitionend` (ex.: reduced motion).
      fallbackTimer.current = window.setTimeout(finishSettle, ms + 80)
    },
    [finishSettle],
  )

  const slideTo = useCallback(
    (screen: MenuScreen, direction: SwipeDirection, ms = MAX_DURATION) => {
      const w = measure()
      pendingTransition.current = { screen, direction }
      setTransition({ screen, direction })
      settleTo(-direction * w, ms)
    },
    [measure, settleTo],
  )

  // Mudanças vindas de fora (barra inferior) também deslizam em vez de trocar de imediato.
  useEffect(() => {
    if (current === displayed) return
    if (transition?.screen === current) return
    if (dragging) return
    slideTo(current, directionBetween(displayed, current))
  }, [current, displayed, transition, dragging, slideTo])

  useEffect(() => clearFallback, [])

  const cancelDrag = () => {
    drag.current = null
    setDragging(false)
  }

  const onPointerDown = (e: ReactPointerEvent<HTMLElement>) => {
    if (settling) return
    if (e.pointerType === 'mouse' && e.button !== 0) return
    drag.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastTime: performance.now(),
      velocity: 0,
      axis: 'none',
    }
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    const state = drag.current
    if (!state || state.pointerId !== e.pointerId) return

    const dx = e.clientX - state.startX
    const dy = e.clientY - state.startY

    if (state.axis === 'none') {
      if (Math.abs(dx) < START_THRESHOLD && Math.abs(dy) < START_THRESHOLD) return
      state.axis = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical'
      if (state.axis === 'horizontal') {
        measure()
        setDragging(true)
        e.currentTarget.setPointerCapture(e.pointerId)
      }
    }

    if (state.axis !== 'horizontal') return

    const now = performance.now()
    const dt = Math.max(now - state.lastTime, 1)
    // Média móvel simples para suavizar a velocidade medida.
    state.velocity = state.velocity * 0.6 + ((e.clientX - state.lastX) / dt) * 0.4
    state.lastX = e.clientX
    state.lastTime = now

    const hasNeighbor = getAdjacentScreen(displayed, dx < 0 ? 1 : -1) !== null
    setOffset(hasNeighbor ? dx : dx * RESISTANCE)
  }

  const onPointerUp = (e: ReactPointerEvent<HTMLElement>) => {
    const state = drag.current
    if (!state || state.pointerId !== e.pointerId) return

    if (state.axis !== 'horizontal') {
      cancelDrag()
      return
    }

    const dx = e.clientX - state.startX
    const speed = Math.abs(state.velocity)
    const flungForward = Math.sign(state.velocity) === Math.sign(dx) && speed > COMMIT_VELOCITY
    const shouldCommit = Math.abs(dx) > width * COMMIT_RATIO || flungForward
    const direction: SwipeDirection = dx < 0 ? 1 : -1
    const target = shouldCommit ? getAdjacentScreen(displayed, direction) : null

    cancelDrag()

    if (target) {
      const remaining = width - Math.abs(dx)
      const ms = Math.round(Math.min(MAX_DURATION, Math.max(MIN_DURATION, remaining / Math.max(speed, 0.9))))
      slideTo(target, direction, ms)
      dispatch({ type: 'SET_MENU_SCREEN', screen: target })
    } else {
      settleTo(0, Math.round(Math.min(MAX_DURATION, Math.max(MIN_DURATION, Math.abs(dx) * 1.2))))
    }
  }

  const onTransitionEnd = (e: ReactTransitionEvent<HTMLElement>) => {
    if (e.target !== e.currentTarget || e.propertyName !== 'transform') return
    if (settling) finishSettle()
  }

  const leftScreen = transition?.direction === -1 ? transition.screen : getAdjacentScreen(displayed, -1)
  const rightScreen = transition?.direction === 1 ? transition.screen : getAdjacentScreen(displayed, 1)
  const showNeighbors = dragging || settling
  const settleTiming = settling ? `${duration}ms ${SETTLE_EASING}` : null

  return {
    containerRef,
    displayed,
    leftScreen: showNeighbors ? leftScreen : null,
    rightScreen: showNeighbors ? rightScreen : null,
    offset,
    width,
    dragging,
    settling,
    /** Timing compartilhado para que painéis e trilha se movam em sincronia. */
    settleTiming,
    trackStyle: {
      transform: `translate3d(${offset}px, 0, 0)`,
      transition: settleTiming ? `transform ${settleTiming}` : 'none',
    },
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
    },
    trackHandlers: { onTransitionEnd },
  }
}
