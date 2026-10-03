'use client'

import { useEffect, useState } from 'react'
import { LogOut, Play, RotateCcw, Target } from 'lucide-react'
import { SCENES } from '@/data/scenes'
import { STRINGS } from '@/data/strings'
import { formatDuration } from '@/lib/format'
import { useGameDispatch } from '@/hooks/use-game-store'
import { WorldCanvas } from '../../world/world-canvas'
import { VirtualControls } from '../../hud/virtual-controls'
import { RpgButton } from '../../ui/rpg-button'
import { RpgFrame } from '../../ui/rpg-frame'

type TrainingStatus = 'idle' | 'running'

function useElapsed(running: boolean, resetKey: number) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    setElapsed(0)
    if (!running) return
    const startedAt = Date.now()
    const id = window.setInterval(() => setElapsed(Date.now() - startedAt), 500)
    return () => window.clearInterval(id)
  }, [running, resetKey])

  return elapsed
}

/**
 * Arena de treino: sem inimigos, sem recompensas e sem contar como fase.
 * `resetKey` remonta o canvas para zerar câmera e tempo.
 */
export function TrainingScreen() {
  const dispatch = useGameDispatch()
  const [status, setStatus] = useState<TrainingStatus>('idle')
  const [resetKey, setResetKey] = useState(0)
  const running = status === 'running'
  const elapsed = useElapsed(running, resetKey)
  const t = STRINGS.training

  const exit = () => dispatch({ type: 'EXIT_TRAINING' })
  const reset = () => setResetKey((key) => key + 1)

  return (
    <section className="relative h-full w-full overflow-hidden" aria-labelledby="training-heading">
      <WorldCanvas key={resetKey} active />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,oklch(0_0_0/0.55)_100%)]"
      />

      <header className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3">
        <div className="rpg-frame pointer-events-auto flex flex-col gap-1 px-3 py-2">
          <h2 id="training-heading" className="text-shadow-pixel flex items-center gap-2 font-display text-[9px] text-gold">
            <Target className="size-3.5" aria-hidden="true" />
            {SCENES.training.name}
          </h2>
          <p className="text-xs text-muted-foreground tabular-nums">
            {t.elapsed}: {formatDuration(elapsed)}
          </p>
        </div>

        {running && (
          <div className="pointer-events-auto flex gap-2">
            <button
              type="button"
              onClick={reset}
              aria-label={t.reset}
              className="rpg-frame flex size-11 items-center justify-center text-parchment transition-transform active:scale-95"
            >
              <RotateCcw className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={exit}
              aria-label={t.exit}
              className="rpg-frame flex size-11 items-center justify-center text-gold transition-transform active:scale-95"
            >
              <LogOut className="size-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </header>

      {running ? (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-[62%] px-8 text-center">
            <p className="text-shadow-pixel font-display text-[10px] leading-relaxed text-parchment/80">
              {STRINGS.world.trainingPlaceholder}
            </p>
            <p className="mt-2 text-sm text-parchment/50">{STRINGS.world.trainingHint}</p>
          </div>
          <VirtualControls />
        </>
      ) : (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-night-deep/70 p-6 backdrop-blur-[2px]">
          <RpgFrame className="animate-pop-in flex w-full max-w-xs flex-col gap-3 p-5 text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full border-[3px] border-gold bg-night text-gold shadow-[0_0_24px_-4px_var(--gold)]">
              <Target className="size-7" aria-hidden="true" />
            </span>
            <h3 className="text-shadow-pixel font-display text-sm text-gold uppercase">{t.heading}</h3>
            <p className="font-body text-base leading-relaxed text-parchment/70">{t.hint}</p>
            <div className="flex flex-col gap-2 pt-2">
              <RpgButton onClick={() => setStatus('running')} autoFocus>
                <Play className="size-4" aria-hidden="true" />
                {t.start}
              </RpgButton>
              <RpgButton variant="ghost" onClick={exit}>
                <LogOut className="size-4" aria-hidden="true" />
                {t.exit}
              </RpgButton>
            </div>
          </RpgFrame>
        </div>
      )}
    </section>
  )
}
