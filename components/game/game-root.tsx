'use client'

import { useGameStore } from '@/hooks/use-game-store'
import { useKeyboardInput } from '@/hooks/use-input'
import { GameShell } from './game-shell'
import { TitleScreen } from './screens/title-screen'
import { MainMenuScreen } from './screens/main-menu/main-menu-screen'
import { LoadingScreen } from './screens/loading-screen'
import { WorldScreen } from './screens/world-screen'

/**
 * Ponto de entrada da interface. Lê a fase do jogo na store
 * e monta a tela correspondente. Toda lógica vive em `game/`.
 */
export function GameRoot() {
  const phase = useGameStore((s) => s.phase)
  useKeyboardInput()

  return (
    <GameShell>
      {phase === 'title' && <TitleScreen />}
      {phase === 'menu' && <MainMenuScreen />}
      {phase === 'loading' && <LoadingScreen />}
      {(phase === 'world' || phase === 'paused') && <WorldScreen />}
    </GameShell>
  )
}
