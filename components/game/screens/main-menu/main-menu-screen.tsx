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

/** Distância normalizada (0..1) de um painel até o centro da viewport. */
function panelProgress(position: -1 | 0 | 1, offset: number, width: number) {
  return Math.min(1, Math.abs(position * width + offset) / width)
}

interface PanelProps {
  screen: MenuScreen
  position: -1 | 0 | 1
  offset: number
  width: number
  active: boolean
  settleTiming: string | null
}

function MenuPanel({ screen, position, offset, width, active, settleTiming }: PanelProps) {
  const progress = panelProgress(position, offset, width)
  const scale = 1 - progress * 0.04
  const opacity = 1 - progress * 0.45

  return (
    <div
      aria-hidden={!active}
      style={{
        left: `${position * 100}%`,
        transform: `scale(${scale})`,
        opacity,
        transition: settleTiming ? `transform ${settleTiming}, opacity ${settleTiming}` : 'none',
      }}
      className="absolute inset-y-0 flex w-full flex-col will-change-transform"
    >
      <MenuContent screen={screen} />
    </div>
  )
}

export function MainMenuScreen() {
  const {
    containerRef,
    displayed,
    leftScreen,
    rightScreen,
    offset,
    width,
    dragging,
    settleTiming,
    trackStyle,
    handlers,
    trackHandlers,
  } = useSwipeNavigation()
  const panelProps = { offset, width, settleTiming }

  return (
    <section className="relative flex h-full flex-col overflow-hidden">
      <MenuBackground />
      <div
        ref={containerRef}
        {...handlers}
        className={cn(
          'relative min-h-0 flex-1 touch-pan-y select-none overflow-hidden',
          dragging ? 'cursor-grabbing' : 'cursor-grab',
        )}
      >
        <div {...trackHandlers} style={trackStyle} className="relative h-full w-full will-change-transform">
          {leftScreen && <MenuPanel screen={leftScreen} position={-1} active={false} {...panelProps} />}
          <MenuPanel screen={displayed} position={0} active {...panelProps} />
          {rightScreen && <MenuPanel screen={rightScreen} position={1} active={false} {...panelProps} />}
        </div>
      </div>
      <MenuBottomNav />
    </section>
  )
}
