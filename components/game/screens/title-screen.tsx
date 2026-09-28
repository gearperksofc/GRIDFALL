'use client'

import { Swords } from 'lucide-react'
import { GAME_CONFIG } from '@/data/config'
import { STRINGS } from '@/data/strings'
import { createId } from '@/lib/id'
import { useGameDispatch } from '@/hooks/use-game-store'
import { RpgButton } from '../ui/rpg-button'
import { RpgFrame } from '../ui/rpg-frame'

export function TitleScreen() {
  const dispatch = useGameDispatch()

  const startGame = () => dispatch({ type: 'START_GAME', playerId: createId('player') })

  return (
    <section className="flex h-full flex-col items-center justify-between px-6 py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,oklch(0.28_0.07_285)_0%,transparent_45%,transparent_70%,oklch(0.16_0.05_150)_100%)]"
      />

      <header className="relative flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <div className="animate-float-slow flex size-20 items-center justify-center rounded-full border-[3px] border-gold bg-night text-gold shadow-[0_0_32px_-4px_var(--gold)]">
          <Swords className="size-9" strokeWidth={2.25} aria-hidden="true" />
        </div>
        <h1 className="text-shadow-pixel font-display text-balance text-2xl leading-relaxed text-gold sm:text-3xl">
          {GAME_CONFIG.name}
        </h1>
        <p className="font-body text-lg text-parchment/80">{STRINGS.title.subtitle}</p>
      </header>

      <RpgFrame className="relative w-full max-w-xs space-y-3 p-5">
        <RpgButton onClick={startGame} autoFocus>
          {STRINGS.title.newGame}
        </RpgButton>
        <RpgButton variant="ghost" disabled aria-describedby="continue-hint">
          {STRINGS.title.continue}
        </RpgButton>
        <p id="continue-hint" className="text-center text-xs text-muted-foreground">
          {STRINGS.title.comingSoon}
        </p>
      </RpgFrame>

      <footer className="relative mt-6 flex w-full items-center justify-between font-display text-[9px] text-muted-foreground">
        <span>v{GAME_CONFIG.version}</span>
        <span className="animate-blink text-gold">{STRINGS.title.pressStart}</span>
      </footer>
    </section>
  )
}
