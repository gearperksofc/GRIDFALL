'use client'

import { ChevronLeft, Swords } from 'lucide-react'
import { GAME_MODES, isPlayableMode, type GameModeDefinition } from '@/data/game-modes'
import { STRINGS } from '@/data/strings'
import { startTraining } from '@/game/match/match-controller'
import { useGameDispatch } from '@/hooks/use-game-store'
import { useTransientNotice } from '@/hooks/use-transient-notice'
import { MenuBackground } from '../main-menu/menu-background'
import { ScreenHeader } from '../../ui/screen-header'
import { ModeCard } from './mode-card'
import { DevNotice } from './dev-notice'

const [featuredMode, ...otherModes] = GAME_MODES

export function ModeSelectScreen() {
  const dispatch = useGameDispatch()
  const { notice, show } = useTransientNotice()

  const handleSelect = (mode: GameModeDefinition) => {
    if (mode.status !== 'available' || !isPlayableMode(mode.id)) {
      show(mode.devNotice ?? STRINGS.modeSelect.inDevelopment)
      return
    }
    if (mode.id === 'vsBot') {
      dispatch({ type: 'OPEN_STAGE_SELECT' })
      return
    }
    startTraining()
  }

  const goBack = () => dispatch({ type: 'GO_BACK' })

  return (
    <section className="relative flex h-full flex-col overflow-hidden" aria-labelledby="mode-select-heading">
      <MenuBackground />

      <ScreenHeader
        headingId="mode-select-heading"
        title={STRINGS.modeSelect.heading}
        subtitle={STRINGS.modeSelect.subheading}
        icon={Swords}
        backLabel={STRINGS.modeSelect.back}
        onBack={goBack}
      />

      <div className="relative z-10 min-h-0 flex-1 overflow-y-auto px-4 pt-4 pb-4 [scrollbar-width:thin]">
        <div className="mx-auto flex w-full max-w-lg flex-col gap-3">
          <ModeCard mode={featuredMode} index={0} featured onSelect={handleSelect} />
          <div className="grid grid-cols-2 gap-3">
            {otherModes.map((mode, i) => (
              <ModeCard key={mode.id} mode={mode} index={i + 1} onSelect={handleSelect} />
            ))}
          </div>
        </div>
      </div>

      <DevNotice message={notice} />

      <footer className="animate-rise-in relative z-10 border-t-[3px] border-panel-edge bg-[linear-gradient(180deg,oklch(0.26_0.05_270),oklch(0.16_0.045_270))] px-4 py-3 shadow-[0_-8px_24px_-8px_oklch(0_0_0/0.8)] [--rise-delay:0.3s]">
        <button
          type="button"
          onClick={goBack}
          className="mx-auto flex w-full max-w-xs items-center justify-center gap-2 rounded-lg border-[3px] border-panel-edge bg-[linear-gradient(180deg,oklch(0.38_0.06_270),oklch(0.26_0.05_270))] px-5 py-3 font-display text-[11px] tracking-wider text-parchment uppercase shadow-[inset_0_2px_0_oklch(1_0_0/0.1),0_5px_0_oklch(0.1_0.03_272),0_10px_18px_-8px_oklch(0_0_0/0.8)] transition-[transform,box-shadow,filter] duration-100 select-none hover:brightness-110 active:translate-y-1 active:shadow-[inset_0_2px_0_oklch(1_0_0/0.1),0_1px_0_oklch(0.1_0.03_272),0_4px_10px_-8px_oklch(0_0_0/0.8)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-arcane"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
          {STRINGS.modeSelect.back}
        </button>
      </footer>
    </section>
  )
}
