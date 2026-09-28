import type { Vector2 } from '@/types'

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export const vec2 = (x = 0, y = 0): Vector2 => ({ x, y })

export const addVec = (a: Vector2, b: Vector2): Vector2 => ({ x: a.x + b.x, y: a.y + b.y })

export const scaleVec = (v: Vector2, s: number): Vector2 => ({ x: v.x * s, y: v.y * s })

export const lengthVec = (v: Vector2) => Math.hypot(v.x, v.y)

export const normalizeVec = (v: Vector2): Vector2 => {
  const len = lengthVec(v)
  return len === 0 ? vec2() : { x: v.x / len, y: v.y / len }
}
