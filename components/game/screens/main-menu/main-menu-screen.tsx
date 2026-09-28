'use client'

import { BookOpen, Layers, ShoppingBag } from 'lucide-react'
import type { MenuScreen } from '@/types'
import { STRINGS } from '@/data/strings'
import { cn } from '@/lib/utils'
import { MenuBackground } from './menu-background'
import { MenuTopBar } from './menu-top-bar'
import { MenuHero } from './menu-hero'
import { PlayButton } from './play-button'
import { MenuBottomNav } from './menu-bottom-nav'
import { PlaceholderScreen } from './placeholder-screen'
import { SettingsScreen } from './settings-screen'
import { useSwipeNavigation } from './use-swipe-navigation'

function MenuContent({ screen }: { screen: MenuScreen }) {
  switch (screen) {
    case 'collection':
      return <PlaceholderScreen title={STRINGS.menu.collection} icon={Layers} />
    case 'shop':
      return <PlaceholderScreen title={STRINGS.menu.shop} icon={ShoppingBag} />
    case 'howToPlay':
      return <PlaceholderScreen title={STRINGS.menu.howToPlay} icon={BookOpen} />
    case 'settings':
      return <SettingsScreen />
    default:
      return (
        <>
          <MenuTopBar />
          <MenuHero />
          <PlayButton />
        </>
      )
  }
}

export function MainMenuScreen() {
  const { current, dragX, dragging, enterDirection, handlers } = useSwipeNavigation()

  return (
    <section className="relative flex h-full flex-col overflow-hidden">
      <MenuBackground />
      <div
        {...handlers}
        className={cn(
          'relative flex min-h-0 flex-1 flex-col touch-pan-y select-none',
          dragging ? 'cursor-grabbing' : 'cursor-grab',
        )}
      >
        <div
          key={current}
          style={{
            transform: dragging ? `translate3d(${dragX}px, 0, 0)` : undefined,
            opacity: dragging ? Math.max(0.4, 1 - Math.abs(dragX) / 600) : undefined,
          }}
          className={cn(
            'flex min-h-0 flex-1 flex-col will-change-transform',
            !dragging && 'transition-[transform,opacity] duration-200 ease-out',
            !dragging && enterDirection === 1 && 'animate-slide-from-right',
            !dragging && enterDirection === -1 && 'animate-slide-from-left',
          )}
        >
          <MenuContent screen={current} />
        </div>
      </div>
      <MenuBottomNav />
    </section>
  )
}
