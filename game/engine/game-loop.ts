export interface GameLoopCallbacks {
  /** Chamado em passo fixo (tickRate). Ideal para lógica determinística. */
  update: (dt: number) => void
  /** Chamado uma vez por frame. `alpha` é a interpolação entre ticks. */
  render: (alpha: number) => void
}

export interface GameLoopOptions {
  tickRate: number
  /** Limite de ticks por frame para evitar "espiral da morte" em abas ociosas. */
  maxTicksPerFrame?: number
}

/**
 * Loop de jogo com timestep fixo para a lógica e render por frame.
 * Independente de React — pode ser reutilizado no servidor (sem render).
 */
export class GameLoop {
  private rafId: number | null = null
  private lastTime = 0
  private accumulator = 0
  private readonly step: number
  private readonly maxTicks: number
  private frames = 0
  private fpsTimer = 0
  private currentFps = 0

  constructor(
    private readonly callbacks: GameLoopCallbacks,
    options: GameLoopOptions,
  ) {
    this.step = 1 / options.tickRate
    this.maxTicks = options.maxTicksPerFrame ?? 5
  }

  get running() {
    return this.rafId !== null
  }

  get fps() {
    return this.currentFps
  }

  start() {
    if (this.running) return
    this.lastTime = performance.now()
    this.accumulator = 0
    this.rafId = requestAnimationFrame(this.frame)
  }

  stop() {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId)
    this.rafId = null
  }

  private frame = (now: number) => {
    const delta = Math.min((now - this.lastTime) / 1000, this.step * this.maxTicks)
    this.lastTime = now
    this.accumulator += delta

    let ticks = 0
    while (this.accumulator >= this.step && ticks < this.maxTicks) {
      this.callbacks.update(this.step)
      this.accumulator -= this.step
      ticks++
    }

    this.callbacks.render(this.accumulator / this.step)

    this.frames++
    this.fpsTimer += delta
    if (this.fpsTimer >= 1) {
      this.currentFps = Math.round(this.frames / this.fpsTimer)
      this.frames = 0
      this.fpsTimer = 0
    }

    this.rafId = requestAnimationFrame(this.frame)
  }
}
