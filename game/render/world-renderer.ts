import type { Camera, Size } from '@/types'

export interface WorldRenderOptions {
  tileSize: number
  time: number
}

const COLORS = {
  ground: '#1b2a24',
  groundAlt: '#1f3029',
  gridLine: 'rgba(120, 170, 130, 0.12)',
  origin: '#e8c56d',
  originGlow: 'rgba(232, 197, 109, 0.35)',
}

/**
 * Renderer 2D em canvas para a camada de mundo.
 * Desenha um terreno em grade (placeholder) e o ponto de origem.
 * Tiles, sprites e entidades serão adicionados em camadas aqui.
 */
export function renderWorld(
  ctx: CanvasRenderingContext2D,
  viewport: Size,
  camera: Camera,
  { tileSize, time }: WorldRenderOptions,
) {
  const { width, height } = viewport
  const scale = tileSize * camera.zoom

  ctx.clearRect(0, 0, width, height)

  const camPx = camera.position.x * scale
  const camPy = camera.position.y * scale
  const originX = width / 2 - camPx
  const originY = height / 2 - camPy

  const startCol = Math.floor(-originX / scale) - 1
  const startRow = Math.floor(-originY / scale) - 1
  const cols = Math.ceil(width / scale) + 2
  const rows = Math.ceil(height / scale) + 2

  for (let r = startRow; r < startRow + rows; r++) {
    for (let c = startCol; c < startCol + cols; c++) {
      ctx.fillStyle = (r + c) % 2 === 0 ? COLORS.ground : COLORS.groundAlt
      ctx.fillRect(originX + c * scale, originY + r * scale, scale, scale)
    }
  }

  ctx.strokeStyle = COLORS.gridLine
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let c = startCol; c <= startCol + cols; c++) {
    const x = Math.round(originX + c * scale) + 0.5
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
  }
  for (let r = startRow; r <= startRow + rows; r++) {
    const y = Math.round(originY + r * scale) + 0.5
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
  }
  ctx.stroke()

  const pulse = 0.75 + Math.sin(time * 3) * 0.25
  ctx.fillStyle = COLORS.originGlow
  ctx.beginPath()
  ctx.arc(originX, originY, scale * 0.9 * pulse, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = COLORS.origin
  ctx.fillRect(originX - scale * 0.25, originY - scale * 0.25, scale * 0.5, scale * 0.5)
}
