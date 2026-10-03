'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Check, RotateCcw, Sparkles, Star } from 'lucide-react'
import type { BuildAllocation, BuildAttributeId } from '@/types'
import { BUILD_ATTRIBUTES } from '@/data/build-attributes'
import { PLAYER_UNIT_TEMPLATE, UNIT_TEMPLATES } from '@/data/units'
import { STRINGS } from '@/data/strings'
import { adjustAllocation, canIncrease, getSpentStars, getTotalStars } from '@/game/build/build-system'
import { getPlayerStats } from '@/game/units/unit-factory'
import { confirmBuild } from '@/game/match/match-controller'
import { cn } from '@/lib/utils'
import { useGameDispatch, useGameStore } from '@/hooks/use-game-store'
import { MenuBackground } from '../main-menu/menu-background'
import { RpgButton } from '../../ui/rpg-button'
import { ScreenHeader } from '../../ui/screen-header'
import { MatchExitDialog } from '../../ui/match-exit-dialog'
import { AttributeRow } from './attribute-row'

const STAT_ROWS = [
  { key: 'maxHp', label: 'HP' },
  { key: 'maxMp', label: 'MP' },
  { key: 'attack', label: 'ATK' },
  { key: 'defense', label: 'DEF' },
  { key: 'speed', label: 'SPD' },
] as const

function Counter({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1 rounded-lg border-[3px] border-panel-edge bg-night-deep/85 py-2 shadow-[0_4px_0_oklch(0_0_0/0.55)]">
      <span className="font-display text-[6px] tracking-wider text-parchment/55 uppercase">{label}</span>
      <span className={cn('flex items-center gap-1 font-display text-base tabular-nums', tone)}>
        <Star className="size-3.5 fill-current" aria-hidden="true" />
        {value}
      </span>
    </div>
  )
}

/** Distribuição de estrelas do Farming nos atributos da build. */
export function BuildScreen() {
  const dispatch = useGameDispatch()
  const session = useGameStore((s) => s.session)
  const [allocation, setAllocation] = useState<BuildAllocation | null>(null)
  const t = STRINGS.build

  if (!session) return null

  const confirmed = session.build
  const current = allocation ?? confirmed
  const total = getTotalStars(session.farmingResults)
  const spent = getSpentStars(current)
  const remaining = total - spent

  const before = getPlayerStats({ build: confirmed, inventory: session.inventory })
  const after = getPlayerStats({ build: current, inventory: session.inventory })
  const hero = UNIT_TEMPLATES[PLAYER_UNIT_TEMPLATE]

  const change = (id: BuildAttributeId, delta: 1 | -1) =>
    setAllocation(adjustAllocation(current, id, delta, total, confirmed))

  return (
    <section className="relative flex h-full flex-col overflow-hidden" aria-labelledby="build-heading">
      <MenuBackground />

      <ScreenHeader
        headingId="build-heading"
        title={t.heading}
        subtitle={t.subheading}
        icon={Sparkles}
        backLabel={STRINGS.battle.abandonMatch}
        onBack={() => dispatch({ type: 'GO_BACK' })}
      />

      <div className="relative z-10 min-h-0 flex-1 overflow-y-auto px-4 pt-4 pb-4 [scrollbar-width:thin]">
        <div className="mx-auto flex w-full max-w-lg flex-col gap-3">
          <div className="animate-rise-in flex gap-2 [--rise-delay:0.05s]" aria-live="polite">
            <Counter label={t.total} value={total} tone="text-parchment" />
            <Counter label={t.spent} value={spent} tone="text-arcane" />
            <Counter label={t.remaining} value={remaining} tone={remaining > 0 ? 'text-gold' : 'text-parchment/50'} />
          </div>

          <ul className="animate-rise-in flex flex-col gap-2 [--rise-delay:0.12s]">
            {BUILD_ATTRIBUTES.map((attr) => (
              <AttributeRow
                key={attr.id}
                attribute={attr}
                points={current[attr.id]}
                lockedPoints={confirmed[attr.id]}
                canIncrease={canIncrease(current, attr.id, total)}
                onChange={(delta) => change(attr.id, delta)}
              />
            ))}
          </ul>

          <section
            aria-labelledby="build-preview-heading"
            className="animate-rise-in flex items-center gap-3 rounded-xl border-[3px] border-gold-dim bg-night-deep/85 p-3 shadow-[0_5px_0_oklch(0_0_0/0.6)] [--rise-delay:0.18s]"
          >
            <div className="relative size-20 shrink-0">
              <Image src={hero.sprite} alt={hero.name} fill sizes="80px" className="object-contain [image-rendering:pixelated]" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <h3 id="build-preview-heading" className="font-display text-[8px] text-gold uppercase">
                {hero.name} · {t.preview}
              </h3>
              <dl className="grid grid-cols-5 gap-1">
                {STAT_ROWS.map(({ key, label }) => {
                  const diff = after[key] - before[key]
                  return (
                    <div key={key} className="flex flex-col items-center gap-0.5 rounded-sm bg-night/80 py-1">
                      <dt className="font-display text-[6px] text-parchment/55">{label}</dt>
                      <dd className="font-display text-[9px] text-parchment tabular-nums">{after[key]}</dd>
                      <dd className={cn('font-display text-[6px] tabular-nums', diff > 0 ? 'text-arcane' : 'text-transparent')}>
                        +{diff}
                      </dd>
                    </div>
                  )
                })}
              </dl>
            </div>
          </section>

          {remaining > 0 && <p className="text-center font-body text-sm text-parchment/55">{t.leftover}</p>}
        </div>
      </div>

      <footer className="relative z-10 border-t-[3px] border-panel-edge bg-[linear-gradient(180deg,oklch(0.26_0.05_270),oklch(0.16_0.045_270))] px-4 py-3 shadow-[0_-8px_24px_-8px_oklch(0_0_0/0.8)]">
        <div className="mx-auto flex w-full max-w-lg gap-2">
          <RpgButton
            variant="ghost"
            className="w-auto flex-1"
            disabled={spent === getSpentStars(confirmed)}
            onClick={() => setAllocation(null)}
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            {t.reset}
          </RpgButton>
          <RpgButton className="flex-[2]" onClick={() => confirmBuild(current)}>
            <Check className="size-4" aria-hidden="true" />
            {t.confirm}
          </RpgButton>
        </div>
      </footer>

      <MatchExitDialog />
    </section>
  )
}
