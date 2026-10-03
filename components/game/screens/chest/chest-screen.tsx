'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, Gift, Package } from 'lucide-react'
import type { InventoryItem } from '@/types'
import { CHESTS, MATCH_CHEST_RARITY } from '@/data/chests'
import { RARITY_LABEL, RARITY_STYLE } from '@/data/items'
import { STRINGS } from '@/data/strings'
import { openChest, resolveInventory } from '@/game/chest/chest-system'
import { claimChest } from '@/game/match/match-controller'
import { cn } from '@/lib/utils'
import { useGameDispatch, useGameStore } from '@/hooks/use-game-store'
import { MenuBackground } from '../main-menu/menu-background'
import { RpgButton } from '../../ui/rpg-button'
import { ScreenHeader } from '../../ui/screen-header'
import { MatchExitDialog } from '../../ui/match-exit-dialog'

const OPENING_MS = 1100
const EMPTY_INVENTORY: InventoryItem[] = []

type ChestStage = 'closed' | 'opening' | 'open'

/** Abertura do baú pós-build. A recompensa vai para o inventário temporário da partida. */
export function ChestScreen() {
  const dispatch = useGameDispatch()
  const inventory = useGameStore((s) => s.session?.inventory ?? EMPTY_INVENTORY)
  const [stage, setStage] = useState<ChestStage>('closed')
  const [loot, setLoot] = useState<InventoryItem[]>([])
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const chest = CHESTS[MATCH_CHEST_RARITY]
  const t = STRINGS.chest

  useEffect(() => () => clearTimeout(timer.current), [])

  if (!chest) return null

  const open = () => {
    if (stage !== 'closed') return
    setStage('opening')
    timer.current = setTimeout(() => {
      setLoot(openChest(chest))
      setStage('open')
    }, OPENING_MS)
  }

  const rewards = resolveInventory(loot)
  const bag = resolveInventory([...inventory, ...loot])

  return (
    <section className="relative flex h-full flex-col overflow-hidden" aria-labelledby="chest-heading">
      <MenuBackground />

      <ScreenHeader
        headingId="chest-heading"
        title={t.heading}
        subtitle={t.subheading}
        icon={Gift}
        backLabel={STRINGS.battle.abandonMatch}
        onBack={() => dispatch({ type: 'GO_BACK' })}
      />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center gap-4 overflow-y-auto px-4 py-4">
        <span className={cn('rounded-sm border-2 bg-night-deep/80 px-2 py-1 font-display text-[8px] uppercase', RARITY_STYLE[chest.rarity])}>
          {chest.name}
        </span>

        <button
          type="button"
          onClick={open}
          disabled={stage !== 'closed'}
          aria-label={t.tapToOpen}
          className="relative flex size-52 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-arcane sm:size-60"
        >
          {stage === 'open' && (
            <span
              aria-hidden="true"
              className="animate-light-burst absolute inset-[-20%] rounded-full bg-[repeating-conic-gradient(from_0deg,oklch(0.83_0.14_85/0.45)_0deg_10deg,transparent_10deg_30deg)] [mask-image:radial-gradient(circle,black_30%,transparent_70%)]"
            />
          )}
          <span
            className={cn(
              'relative size-full',
              stage === 'closed' && 'animate-float-slow',
              stage === 'opening' && 'animate-chest-shake',
              stage === 'open' && 'animate-pop-in',
            )}
          >
            <Image
              src={stage === 'open' ? chest.openImage : chest.closedImage}
              alt={chest.name}
              fill
              sizes="240px"
              priority
              className="object-contain drop-shadow-[0_12px_0_oklch(0_0_0/0.45)] [image-rendering:pixelated]"
            />
          </span>
        </button>

        <div className="flex min-h-36 w-full max-w-sm flex-col items-center gap-3">
          {stage === 'closed' && (
            <RpgButton onClick={open} className="animate-glow-pulse" autoFocus>
              <Gift className="size-4" aria-hidden="true" />
              {t.tapToOpen}
            </RpgButton>
          )}
          {stage === 'opening' && (
            <p className="animate-blink font-display text-[9px] text-parchment/70 uppercase" aria-live="polite">
              {t.opening}
            </p>
          )}
          {stage === 'open' &&
            rewards.map(({ uid, item }) => (
              <div
                key={uid}
                aria-live="polite"
                className={cn('rpg-frame animate-pop-in flex w-full items-center gap-3 p-3', RARITY_STYLE[item.rarity])}
              >
                <div className="relative size-14 shrink-0 rounded-md border-2 border-panel-edge bg-night-deep">
                  <Image src={item.image} alt="" fill sizes="56px" className="object-contain p-1 [image-rendering:pixelated]" />
                </div>
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="font-display text-[6px] text-parchment/55 uppercase">
                    {t.youGot} · {RARITY_LABEL[item.rarity]}
                  </span>
                  <span className="font-display text-[11px] text-parchment uppercase">{item.name}</span>
                  <span className="font-body text-sm text-gold">{item.description}</span>
                </div>
              </div>
            ))}
        </div>

        <section aria-labelledby="inventory-heading" className="flex w-full max-w-sm flex-col gap-2">
          <h3 id="inventory-heading" className="flex items-center gap-1.5 font-display text-[7px] text-parchment/60 uppercase">
            <Package className="size-3" aria-hidden="true" />
            {t.inventory}
          </h3>
          <ul className="flex gap-2">
            {Array.from({ length: 4 }, (_, i) => {
              const entry = bag[i]
              return (
                <li
                  key={entry?.uid ?? `empty-${i}`}
                  className={cn(
                    'relative size-14 rounded-md border-2 bg-night-deep/80',
                    entry ? 'border-gold-dim' : 'border-dashed border-panel-edge/70',
                  )}
                >
                  {entry ? (
                    <Image src={entry.item.image} alt={entry.item.name} fill sizes="56px" className="object-contain p-1.5 [image-rendering:pixelated]" />
                  ) : (
                    <span className="sr-only">{t.empty}</span>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      </div>

      <footer className="relative z-10 border-t-[3px] border-panel-edge bg-[linear-gradient(180deg,oklch(0.26_0.05_270),oklch(0.16_0.045_270))] px-4 py-3 shadow-[0_-8px_24px_-8px_oklch(0_0_0/0.8)]">
        <div className="mx-auto w-full max-w-lg">
          <RpgButton disabled={stage !== 'open'} onClick={() => claimChest(loot)}>
            {t.toBattle}
            <ArrowRight className="size-4" aria-hidden="true" />
          </RpgButton>
        </div>
      </footer>

      <MatchExitDialog />
    </section>
  )
}
