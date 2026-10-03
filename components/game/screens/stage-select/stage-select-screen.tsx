'use client'

import { useEffect, useRef } from 'react'
import { Coins, Lock, Map, Sparkles } from 'lucide-react'
import type { StageView } from '@/types'
import { STRINGS } from '@/data/strings'
import { formatNumber } from '@/lib/format'
import { startStageMatch } from '@/game/match/match-controller'
import { useGameDispatch, useGameStore } from '@/hooks/use-game-store'
import { useProgress, useStageViews } from '@/hooks/use-progress'
import { useTransientNotice } from '@/hooks/use-transient-notice'
import { MenuBackground } from '../main-menu/menu-background'
import { DevNotice } from '../mode-select/dev-notice'
import { ScreenHeader } from '../../ui/screen-header'
import { StageMap } from './stage-map'
import { StageDetailsPanel } from './stage-details-panel'

export function StageSelectScreen() {
  const dispatch = useGameDispatch()
  const selectedId = useGameStore((s) => s.selectedStageId)
  const stages = useStageViews()
  const progress = useProgress()
  const { notice, show } = useTransientNotice()
  const scrollRef = useRef<HTMLDivElement>(null)

  const selected = stages.find((stage) => stage.id === selectedId) ?? null
  const completedCount = stages.filter((stage) => stage.isCompleted).length

  useEffect(() => {
    const target = scrollRef.current?.querySelector<HTMLElement>('[data-current]')
    target?.scrollIntoView({ block: 'center', behavior: 'instant' })
  }, [])

  const handleSelect = (stage: StageView) => {
    if (!stage.isUnlocked) {
      show(STRINGS.stageSelect.lockedNotice)
      return
    }
    dispatch({ type: 'SELECT_STAGE', stageId: stage.id })
  }

  const closeDetails = () => dispatch({ type: 'SELECT_STAGE', stageId: null })
  const goBack = () => dispatch({ type: 'GO_BACK' })

  return (
    <section className="relative flex h-full flex-col overflow-hidden" aria-labelledby="stage-select-heading">
      <MenuBackground />

      <ScreenHeader
        headingId="stage-select-heading"
        title={STRINGS.stageSelect.heading}
        subtitle={STRINGS.stageSelect.subheading}
        icon={Map}
        backLabel={STRINGS.stageSelect.back}
        onBack={goBack}
      />

      <div className="animate-rise-in relative z-10 flex items-center justify-between gap-3 px-4 pt-3 [--rise-delay:0.1s]">
        <div className="flex items-center gap-2 rounded-md border-2 border-panel-edge bg-night-deep/80 px-3 py-1.5 font-display text-[8px] text-parchment/80 uppercase">
          <span>{STRINGS.stageSelect.progress}</span>
          <span className="text-gold tabular-nums">
            {completedCount}/{stages.length}
          </span>
        </div>
        <div className="flex items-center gap-3 rounded-md border-2 border-panel-edge bg-night-deep/80 px-3 py-1.5 font-display text-[8px] tabular-nums">
          <span className="inline-flex items-center gap-1 text-gold">
            <Coins className="size-3" aria-hidden="true" />
            {formatNumber(progress.wallet.coins)}
          </span>
          <span className="inline-flex items-center gap-1 text-arcane">
            <Sparkles className="size-3" aria-hidden="true" />
            {formatNumber(progress.wallet.xp)}
          </span>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pt-2 pb-6 [scrollbar-width:thin]"
      >
        <StageMap stages={stages} selectedId={selectedId} onSelect={handleSelect} />
      </div>

      <DevNotice message={notice} icon={Lock} />

      {selected && (
        <StageDetailsPanel
          stage={selected}
          onPlay={(stage) => startStageMatch(stage.id)}
          onClose={closeDetails}
        />
      )}
    </section>
  )
}
