'use client'

import { Settings } from 'lucide-react'
import type { GameSettings } from '@/types'
import { STRINGS } from '@/data/strings'
import { useGameDispatch, useGameStore } from '@/hooks/use-game-store'
import { cn } from '@/lib/utils'
import { PlaceholderScreen } from './placeholder-screen'

const OPTIONS: { key: keyof GameSettings; label: string }[] = [
  { key: 'sound', label: STRINGS.menu.sound },
  { key: 'haptics', label: STRINGS.menu.haptics },
  { key: 'showDebug', label: STRINGS.menu.showDebug },
]

export function SettingsScreen() {
  const dispatch = useGameDispatch()
  const settings = useGameStore((s) => s.settings)

  return (
    <PlaceholderScreen title={STRINGS.menu.settings} icon={Settings}>
      <ul className="mt-2 space-y-2 border-t-2 border-panel-edge pt-4 text-left">
        {OPTIONS.map(({ key, label }) => {
          const on = settings[key]
          return (
            <li key={key}>
              <button
                type="button"
                role="switch"
                aria-checked={on}
                onClick={() => dispatch({ type: 'UPDATE_SETTINGS', settings: { [key]: !on } })}
                className="flex w-full items-center justify-between gap-3 rounded-md border-2 border-panel-edge bg-night-deep/70 px-3 py-2.5 transition-colors hover:border-gold-dim focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-arcane"
              >
                <span className="font-body text-base text-parchment">{label}</span>
                <span
                  className={cn(
                    'rounded-sm border px-2 py-1 font-display text-[8px] uppercase',
                    on
                      ? 'border-gold bg-gold/15 text-gold'
                      : 'border-panel-edge bg-night text-muted-foreground',
                  )}
                >
                  {on ? STRINGS.menu.on : STRINGS.menu.off}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </PlaceholderScreen>
  )
}
