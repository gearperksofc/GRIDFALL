export type Direction = 'up' | 'down' | 'left' | 'right'

export type ActionButton = 'confirm' | 'cancel' | 'menu'

export type InputKey = Direction | ActionButton

export interface InputState {
  up: boolean
  down: boolean
  left: boolean
  right: boolean
  confirm: boolean
  cancel: boolean
  menu: boolean
}

export interface InputAxis {
  x: number
  y: number
}

export type InputListener = (key: InputKey, pressed: boolean) => void
