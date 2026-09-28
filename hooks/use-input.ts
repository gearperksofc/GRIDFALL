'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'
import type { InputState } from '@/types'
import { InputManager } from '@/game/engine/input-manager'

let sharedInput: InputManager | null = null

/** Instância única do InputManager compartilhada por toda a UI. */
export function getInputManager() {
  if (!sharedInput) sharedInput = new InputManager()
  return sharedInput
}

/** Liga o teclado enquanto o componente estiver montado. */
export function useKeyboardInput(enabled = true) {
  const manager = useRef(getInputManager()).current
  useEffect(() => {
    if (!enabled) return
    return manager.attachKeyboard()
  }, [manager, enabled])
  return manager
}

/** Estado reativo do input (para HUD/debug). Não use dentro do loop. */
export function useInputState(): InputState {
  const manager = getInputManager()
  return useSyncExternalStore(
    (cb) => manager.subscribe(cb),
    () => manager.getState(),
    () => manager.getState(),
  )
}
