'use client'

import { useGameDispatch, useGameStore } from '@/hooks/use-game-store'
import { useKeyboardInput } from '@/hooks/use-input'
import { useHydrateProgress } from '@/hooks/use-progress'
import { useHardwareBack } from '@/hooks/use-hardware-back'
import { GameShell } from './game-shell'
import { TitleScreen } from './screens/title-screen'
import { MainMenuScreen } from './screens/main-menu/main-menu-screen'
import { ModeSelectScreen } from './screens/mode-select/mode-select-screen'
import { StageSelectScreen } from './screens/stage-select/stage-select-screen'
import { PreparationScreen } from './screens/preparation/preparation-screen'
import { FarmingScreen } from './screens/farming/farming-screen'
import { BuildScreen } from './screens/build/build-screen'
import { ChestScreen } from './screens/chest/chest-screen'
import { LoadingScreen } from './screens/loading-screen'
import { BattleScreen } from './screens/battle/battle-screen'
import { TrainingScreen } from './screens/training/training-screen'
import { ResultScreen } from './screens/result/result-screen'

/**
 * Ponto de entrada da interface. Lê a fase do jogo na store
 * e monta a tela correspondente. Toda lógica vive em `game/`.
 */
export function GameRoot() {
  const dispatch = useGameDispatch()
  const phase = useGameStore((s) => s.phase)
  const isTraining = useGameStore((s) => s.session?.mode === 'training')

  useKeyboardInput()
  useHydrateProgress()
  useHardwareBack(() => dispatch({ type: 'GO_BACK' }))

  const inArena = phase === 'world' || phase === 'paused'

  return (
    <GameShell>
      {phase === 'title' && <TitleScreen />}
      {phase === 'menu' && <MainMenuScreen />}
      {phase === 'modeSelect' && <ModeSelectScreen />}
      {phase === 'stageSelect' && <StageSelectScreen />}
      {phase === 'preparation' && <PreparationScreen />}
      {phase === 'farming' && <FarmingScreen />}
      {phase === 'build' && <BuildScreen />}
      {phase === 'chest' && <ChestScreen />}
      {phase === 'loading' && <LoadingScreen />}
      {inArena && (isTraining ? <TrainingScreen /> : <BattleScreen />)}
      {phase === 'result' && <ResultScreen />}
    </GameShell>
  )
}
