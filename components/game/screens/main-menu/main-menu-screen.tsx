'use client'

import { BookOpen, Layers, ShoppingBag } from 'lucide-react'
import { STRINGS } from '@/data/strings'
import { useGameStore } from '@/hooks/use-game-store'
import { MenuBackground } from './menu-background'
import { MenuTopBar } from './menu-top-bar'
import { MenuHero } from './menu-hero'
import { PlayButton } from './play-button'
import { MenuBottomNav } from './menu-bottom-nav'
import { PlaceholderScreen } from './placeholder-screen'
import { SettingsScreen } from './settings-screen'

function MenuContent() {
  const screen = useGameStore((s) => s.menuScreen)

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
  return (
    <section className="relative flex h-full flex-col overflow-hidden">
      <MenuBackground />
      <div className="relative flex min-h-0 flex-1 flex-col">
        <MenuContent />
      </div>
      <MenuBottomNav />
    </section>
  )
}
