'use client'

import { Coins, Gem, Settings, Trophy, User } from 'lucide-react'
import { STRINGS } from '@/data/strings'
import { useGameDispatch } from '@/hooks/use-game-store'

const PLAYER = {
  level: 1,
  xp: 0,
  xpMax: 50,
  gold: 0,
  gems: 0,
  trophies: 0,
}

function CurrencyPill({
  icon,
  value,
  label,
  tone,
}: {
  icon: React.ReactNode
  value: number
  label: string
  tone: 'gold' | 'arcane'
}) {
  const toneClass = tone === 'gold' ? 'text-gold' : 'text-arcane'
  return (
    <div
      className="flex h-8 items-center gap-1.5 rounded-md border-2 border-panel-edge bg-night-deep/80 pr-2.5 pl-1.5 shadow-[inset_0_2px_0_oklch(1_0_0/0.06),0_2px_0_oklch(0_0_0/0.5)]"
      aria-label={`${label}: ${value}`}
    >
      <span className={toneClass}>{icon}</span>
      <span className="font-display text-[10px] text-parchment">{value}</span>
    </div>
  )
}

export function MenuTopBar() {
  const dispatch = useGameDispatch()
  const xpPercent = Math.round((PLAYER.xp / PLAYER.xpMax) * 100)

  return (
    <header className="animate-rise-in relative z-10 flex flex-col gap-2.5 px-3 pt-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 pl-1">
          <div className="relative flex size-9 shrink-0 items-center justify-center">
            <div className="absolute inset-0.5 rotate-45 rounded-sm border-2 border-gold bg-[linear-gradient(180deg,oklch(0.55_0.15_230),oklch(0.38_0.12_250))] shadow-[0_0_14px_-2px_var(--gold)]" />
            <span className="text-shadow-pixel relative font-display text-xs text-parchment">
              {PLAYER.level}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-display text-[8px] tracking-wide text-parchment/70 uppercase">
              {STRINGS.menu.level} {PLAYER.level}
            </span>
            <div
              role="progressbar"
              aria-label={`${STRINGS.menu.level} ${PLAYER.level}`}
              aria-valuemin={0}
              aria-valuemax={PLAYER.xpMax}
              aria-valuenow={PLAYER.xp}
              className="relative h-3 w-24 overflow-hidden rounded-sm border border-panel-edge bg-night-deep"
            >
              <div
                className="h-full bg-[linear-gradient(180deg,oklch(0.75_0.16_230),oklch(0.55_0.15_240))]"
                style={{ width: `${xpPercent}%` }}
              />
              <span className="absolute inset-0 grid place-items-center font-display text-[7px] text-parchment">
                {PLAYER.xp}/{PLAYER.xpMax}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CurrencyPill
            icon={<Coins className="size-4" aria-hidden="true" />}
            value={PLAYER.gold}
            label={STRINGS.menu.gold}
            tone="gold"
          />
          <CurrencyPill
            icon={<Gem className="size-4" aria-hidden="true" />}
            value={PLAYER.gems}
            label={STRINGS.menu.gems}
            tone="arcane"
          />
        </div>
      </div>

      <div className="flex items-stretch gap-2">
        <div className="flex flex-1 items-center gap-3 rounded-lg border-2 border-panel-edge bg-night-deep/75 p-2 shadow-[inset_0_2px_0_oklch(1_0_0/0.05),0_3px_0_oklch(0_0_0/0.5)] backdrop-blur-sm">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-md border-2 border-panel-edge bg-[linear-gradient(180deg,oklch(0.35_0.06_270),oklch(0.22_0.05_270))] text-parchment/80">
            <User className="size-6" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-shadow-pixel truncate font-display text-[11px] text-parchment">
              {STRINGS.menu.playerName}
            </span>
            <span className="truncate font-body text-sm text-parchment/60">{STRINGS.menu.noGuild}</span>
          </div>
          <div
            className="flex h-8 items-center gap-1.5 rounded-md border border-panel-edge bg-night-deep px-2.5"
            aria-label={`${STRINGS.menu.trophies}: ${PLAYER.trophies}`}
          >
            <Trophy className="size-4 text-gold" aria-hidden="true" />
            <span className="font-display text-[10px] text-gold">{PLAYER.trophies}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_MENU_SCREEN', screen: 'settings' })}
          aria-label={STRINGS.menu.settings}
          className="flex w-14 shrink-0 items-center justify-center rounded-lg border-2 border-panel-edge bg-[linear-gradient(180deg,oklch(0.35_0.06_270),oklch(0.24_0.05_270))] text-parchment shadow-[inset_0_2px_0_oklch(1_0_0/0.08),0_3px_0_oklch(0_0_0/0.5)] transition-transform duration-100 hover:brightness-110 active:translate-y-0.5 active:shadow-[inset_0_2px_0_oklch(1_0_0/0.08),0_1px_0_oklch(0_0_0/0.5)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-arcane"
        >
          <Settings className="size-6" aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
