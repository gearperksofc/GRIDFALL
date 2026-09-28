'use client'

import { Pause, Wifi, WifiOff } from 'lucide-react'
import type { ConnectionStatus } from '@/types'
import { SCENES } from '@/data/scenes'
import { STRINGS } from '@/data/strings'
import { cn } from '@/lib/utils'
import { useGameDispatch, useGameStore } from '@/hooks/use-game-store'

const connectionLabel: Record<ConnectionStatus, string> = {
  offline: STRINGS.hud.offline,
  connecting: STRINGS.hud.connecting,
  online: STRINGS.hud.online,
  error: STRINGS.hud.error,
}

export function Hud() {
  const dispatch = useGameDispatch()
  const scene = useGameStore((s) => s.scene)
  const connection = useGameStore((s) => s.connection)
  const fps = useGameStore((s) => s.fps)
  const showDebug = useGameStore((s) => s.settings.showDebug)

  const isOnline = connection === 'online'

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3">
      <div className="rpg-frame pointer-events-auto flex flex-col gap-1 px-3 py-2">
        <h2 className="text-shadow-pixel font-display text-[9px] text-gold">{SCENES[scene].name}</h2>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className={cn('inline-flex items-center gap-1', isOnline && 'text-arcane')}>
            {isOnline ? (
              <Wifi className="size-3" aria-hidden="true" />
            ) : (
              <WifiOff className="size-3" aria-hidden="true" />
            )}
            {connectionLabel[connection]}
          </span>
          {showDebug && <span className="tabular-nums">{fps} FPS</span>}
        </div>
      </div>

      <button
        type="button"
        onClick={() => dispatch({ type: 'PAUSE' })}
        aria-label={STRINGS.hud.pause}
        className="rpg-frame pointer-events-auto flex size-11 items-center justify-center text-gold transition-transform active:scale-95"
      >
        <Pause className="size-5" aria-hidden="true" />
      </button>
    </header>
  )
}
