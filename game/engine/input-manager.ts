import type { InputAxis, InputKey, InputListener, InputState } from '@/types'

const KEY_MAP: Record<string, InputKey> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right',
  W: 'up',
  S: 'down',
  A: 'left',
  D: 'right',
  Enter: 'confirm',
  ' ': 'confirm',
  z: 'confirm',
  Escape: 'menu',
  x: 'cancel',
  Backspace: 'cancel',
}

export const EMPTY_INPUT: InputState = {
  up: false,
  down: false,
  left: false,
  right: false,
  confirm: false,
  cancel: false,
  menu: false,
}

/**
 * Unifica teclado e controles virtuais (touch) em um único estado de input.
 * A UI chama `press`/`release`; o teclado é ligado via `attachKeyboard`.
 */
export class InputManager {
  private state: InputState = { ...EMPTY_INPUT }
  private listeners = new Set<InputListener>()

  getState(): Readonly<InputState> {
    return this.state
  }

  getAxis(): InputAxis {
    const x = (this.state.right ? 1 : 0) - (this.state.left ? 1 : 0)
    const y = (this.state.down ? 1 : 0) - (this.state.up ? 1 : 0)
    return { x, y }
  }

  press(key: InputKey) {
    this.set(key, true)
  }

  release(key: InputKey) {
    this.set(key, false)
  }

  releaseAll() {
    for (const key of Object.keys(this.state) as InputKey[]) this.set(key, false)
  }

  subscribe(listener: InputListener) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  attachKeyboard(target: Window = window) {
    const onDown = (e: KeyboardEvent) => {
      const key = KEY_MAP[e.key]
      if (!key) return
      e.preventDefault()
      this.press(key)
    }
    const onUp = (e: KeyboardEvent) => {
      const key = KEY_MAP[e.key]
      if (!key) return
      this.release(key)
    }
    const onBlur = () => this.releaseAll()

    target.addEventListener('keydown', onDown)
    target.addEventListener('keyup', onUp)
    target.addEventListener('blur', onBlur)

    return () => {
      target.removeEventListener('keydown', onDown)
      target.removeEventListener('keyup', onUp)
      target.removeEventListener('blur', onBlur)
    }
  }

  private set(key: InputKey, pressed: boolean) {
    if (this.state[key] === pressed) return
    this.state = { ...this.state, [key]: pressed }
    for (const listener of this.listeners) listener(key, pressed)
  }
}
