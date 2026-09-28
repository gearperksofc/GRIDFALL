'use client'

import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import type { MenuScreen } from '@/types'
import { useGameDispatch, useGameStore } from '@/hooks/use-game-store'
import { getAdjacentScreen } from './menu-screens'

const START_THRESHOLD = 10
const COMMIT_DISTANCE = 70
const COMMIT_VELOCITY = 0.5
const RESISTANCE = 0.35

interface DragState {
  pointerId: number
  startX: number
  startY: number
  startTime: number
  axis: 'none' | 'horizontal' | 'vertical'
}

export function useSwipeNavigation() {
  const dispatch = useGameDispatch()
  const current = useGameStore((s) => s.menuScreen)
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [enterDirection, setEnterDirection] = useState<-1 | 1 | 0>(0)
  const drag = useRef<DragState | null>(null)

  const go = (screen: MenuScreen, direction: -1 | 1) => {
    setEnterDirection(direction)
    dispatch({ type: 'SET_MENU_SCREEN', screen })
  }

  const reset = () => {
    drag.current = null
    setDragX(0)
    setDragging(false)
  }

  const onPointerDown = (e: ReactPointerEvent<HTMLElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    drag.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startTime: performance.now(),
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
        setDragging(true)
        e.currentTarget.setPointerCapture(e.pointerId)
      }
    }

    if (state.axis !== 'horizontal') return

    // Sem tela vizinha nesse sentido: aplica resistência para sinalizar o fim.
    const hasNeighbor = getAdjacentScreen(current, dx < 0 ? 1 : -1) !== null
    setDragX(hasNeighbor ? dx : dx * RESISTANCE)
  }

  const onPointerUp = (e: ReactPointerEvent<HTMLElement>) => {
    const state = drag.current
    if (!state || state.pointerId !== e.pointerId) return

    if (state.axis === 'horizontal') {
      const dx = e.clientX - state.startX
      const elapsed = Math.max(performance.now() - state.startTime, 1)
      const velocity = Math.abs(dx) / elapsed
      const shouldCommit = Math.abs(dx) > COMMIT_DISTANCE || velocity > COMMIT_VELOCITY

      if (shouldCommit) {
        const direction: -1 | 1 = dx < 0 ? 1 : -1
        const target = getAdjacentScreen(current, direction)
        if (target) go(target, direction)
      }
    }

    reset()
  }

  return {
    current,
    dragX,
    dragging,
    enterDirection,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: reset,
    },
  }
}
