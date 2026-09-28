'use client'

import { BookOpen, Layers, Settings, ShoppingBag, Swords, type LucideIcon } from 'lucide-react'
import type { MenuScreen } from '@/types'
import { STRINGS } from '@/data/strings'
import { useGameDispatch, useGameStore } from '@/hooks/use-game-store'
import { cn } from '@/lib/utils'

interface NavItem {
  screen: MenuScreen
  label: string
  ariaLabel?: string
  icon: LucideIcon
  primary?: boolean
}

const ITEMS: NavItem[] = [
  { screen: 'shop', label: STRINGS.menu.shop, icon: ShoppingBag },
  { screen: 'collection', label: STRINGS.menu.collection, icon: Layers },
  { screen: 'main', label: STRINGS.menu.play, icon: Swords, primary: true },
  { screen: 'howToPlay', label: STRINGS.menu.howToPlay, icon: BookOpen },
  {
    screen: 'settings',
    label: STRINGS.menu.settingsShort,
    ariaLabel: STRINGS.menu.settings,
    icon: Settings,
  },
]

export function MenuBottomNav() {
  const dispatch = useGameDispatch()
  const current = useGameStore((s) => s.menuScreen)

  return (
    <nav
      aria-label="Menu principal"
      className="relative z-10 border-t-[3px] border-panel-edge bg-[linear-gradient(180deg,oklch(0.26_0.05_270),oklch(0.16_0.045_270))] shadow-[0_-8px_24px_-8px_oklch(0_0_0/0.8)]"
    >
      <ul className="grid grid-cols-5">
        {ITEMS.map((item) => {
          const active = item.screen === current
          const Icon = item.icon
          return (
            <li key={item.screen} className="relative">
              <button
                type="button"
                onClick={() => dispatch({ type: 'SET_MENU_SCREEN', screen: item.screen })}
                aria-current={active ? 'page' : undefined}
                aria-label={item.ariaLabel}
                className={cn(
                  'flex h-[72px] w-full flex-col items-center justify-center gap-1 px-1 transition-[background-color,transform] duration-150 select-none',
                  'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-arcane',
                  active
                    ? 'bg-[linear-gradient(180deg,oklch(0.42_0.08_270),oklch(0.3_0.06_270))] shadow-[inset_0_3px_0_oklch(1_0_0/0.1)]'
                    : 'hover:bg-[oklch(1_0_0/0.04)] active:scale-95',
                  item.primary && 'relative -mt-4 h-[88px] rounded-t-xl border-x-2 border-t-[3px] border-panel-edge',
                  item.primary && active && 'border-gold-dim',
                )}
              >
                <Icon
                  className={cn(
                    'transition-transform duration-150',
                    item.primary ? 'size-8' : 'size-6',
                    active ? 'scale-110 text-gold drop-shadow-[0_0_8px_var(--gold)]' : 'text-parchment/70',
                  )}
                  strokeWidth={item.primary ? 2.5 : 2}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    'font-display text-[7px] leading-tight tracking-wide uppercase',
                    active ? 'text-gold' : 'text-parchment/60',
                  )}
                >
                  {item.label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
