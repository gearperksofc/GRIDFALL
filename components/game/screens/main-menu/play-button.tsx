'use client'

import { Swords } from 'lucide-react'
import { STRINGS } from '@/data/strings'
import { useGameDispatch } from '@/hooks/use-game-store'

export function PlayButton() {
  const dispatch = useGameDispatch()

  const startGame = () => dispatch({ type: 'OPEN_MODE_SELECT' })

  return (
    <div className="animate-rise-in relative z-10 flex justify-center px-6 py-3 [--rise-delay:0.16s]">
      <div
        aria-hidden="true"
        className="animate-glow-pulse absolute top-1/2 left-1/2 h-16 w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/35 blur-2xl"
      />
      <button
        type="button"
        onClick={startGame}
        className="group relative w-full max-w-xs overflow-hidden rounded-xl border-[3px] border-[oklch(0.5_0.12_70)] bg-[linear-gradient(180deg,oklch(0.9_0.16_90)_0%,oklch(0.82_0.16_80)_50%,oklch(0.72_0.16_65)_100%)] px-6 py-4 shadow-[inset_0_3px_0_oklch(1_0_0/0.45),inset_0_-5px_0_oklch(0.55_0.13_65),0_8px_0_oklch(0.42_0.1_60),0_14px_24px_-6px_oklch(0_0_0/0.7)] transition-[transform,box-shadow,filter] duration-100 select-none hover:brightness-105 active:translate-y-1.5 active:shadow-[inset_0_3px_0_oklch(1_0_0/0.45),inset_0_-3px_0_oklch(0.55_0.13_65),0_2px_0_oklch(0.42_0.1_60),0_6px_14px_-6px_oklch(0_0_0/0.7)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-arcane"
      >
        <span
          aria-hidden="true"
          className="animate-shine pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-[linear-gradient(90deg,transparent,oklch(1_0_0/0.55),transparent)]"
        />
        <span className="relative flex items-center justify-center gap-3 text-[oklch(0.22_0.06_60)]">
          <Swords className="size-7 drop-shadow-[0_1px_0_oklch(1_0_0/0.5)]" strokeWidth={2.5} aria-hidden="true" />
          <span className="font-display text-xl tracking-wider uppercase drop-shadow-[0_1px_0_oklch(1_0_0/0.5)]">
            {STRINGS.menu.play}
          </span>
        </span>
      </button>
    </div>
  )
}
