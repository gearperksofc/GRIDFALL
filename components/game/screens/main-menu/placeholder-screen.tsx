'use client'

import type { ReactNode } from 'react'
import { ChevronLeft, type LucideIcon } from 'lucide-react'
import { STRINGS } from '@/data/strings'
import { useGameDispatch } from '@/hooks/use-game-store'
import { RpgFrame } from '../../ui/rpg-frame'

interface PlaceholderScreenProps {
  title: string
  icon: LucideIcon
  children?: ReactNode
}

export function PlaceholderScreen({ title, icon: Icon, children }: PlaceholderScreenProps) {
  const dispatch = useGameDispatch()

  return (
    <div className="animate-rise-in relative z-10 flex flex-1 flex-col gap-4 px-4 pt-3 pb-4">
      <header className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_MENU_SCREEN', screen: 'main' })}
          aria-label={STRINGS.menu.back}
          className="flex size-11 shrink-0 items-center justify-center rounded-lg border-2 border-panel-edge bg-[linear-gradient(180deg,oklch(0.35_0.06_270),oklch(0.24_0.05_270))] text-parchment shadow-[inset_0_2px_0_oklch(1_0_0/0.08),0_3px_0_oklch(0_0_0/0.5)] transition-transform duration-100 active:translate-y-0.5 active:shadow-[inset_0_2px_0_oklch(1_0_0/0.08),0_1px_0_oklch(0_0_0/0.5)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-arcane"
        >
          <ChevronLeft className="size-6" aria-hidden="true" />
        </button>
        <h2 className="text-shadow-pixel flex-1 truncate rounded-lg border-2 border-gold-dim bg-night-deep/85 px-4 py-2.5 text-center font-display text-sm text-gold uppercase">
          {title}
        </h2>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <div className="relative">
          <div
            aria-hidden="true"
            className="animate-glow-pulse absolute inset-0 rounded-full bg-arcane/40 blur-2xl"
          />
          <div className="animate-float-slow relative flex size-24 items-center justify-center rounded-full border-[3px] border-gold bg-night text-gold shadow-[0_0_32px_-4px_var(--gold)]">
            <Icon className="size-11" strokeWidth={2} aria-hidden="true" />
          </div>
        </div>

        <RpgFrame className="w-full max-w-sm space-y-3 p-5 text-center">
          <p className="font-display text-[10px] leading-relaxed text-parchment">
            {STRINGS.menu.underConstruction}
          </p>
          <p className="font-body text-base text-parchment/70">{STRINGS.menu.underConstructionHint}</p>
          {children}
        </RpgFrame>
      </div>
    </div>
  )
}
