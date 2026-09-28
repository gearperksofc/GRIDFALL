import type { Camera, InputAxis } from '@/types'
import { normalizeVec } from '@/lib/math'

/**
 * Move a câmera pelo mundo a partir do eixo de input.
 * Puro: recebe o estado atual e devolve o próximo.
 */
export function updateCamera(camera: Camera, axis: InputAxis, speed: number, dt: number): Camera {
  if (axis.x === 0 && axis.y === 0) return camera
  const dir = normalizeVec(axis)
  return {
    ...camera,
    position: {
      x: camera.position.x + dir.x * speed * dt,
      y: camera.position.y + dir.y * speed * dt,
    },
  }
}
