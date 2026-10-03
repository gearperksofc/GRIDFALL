'use client'

import { MINIGAMES } from '@/data/minigames'
import { getStage } from '@/data/stages'
import { STRINGS } from '@/data/strings'
import { getFarmingBonus } from '@/game/build/build-system'
import { minigameForRound, minigameLevel } from '@/game/farming/farming-rules'
import { finishFarming } from '@/game/match/match-controller'
import { useGameDispatch, useGameStore } from '@/hooks/use-game-store'
import { MINIGAME_COMPONENTS } from '../../farming/minigame-registry'
import { MatchExitDialog } from '../../ui/match-exit-dialog'
import { FarmingHud } from './farming-hud'
import { FarmingSummary } from './farming-summary'
import { GradeFeedback } from './grade-feedback'
import { useFarmingRun } from './use-farming-run'

/** Tela de Farming: 30s alternando minigames para acumular estrelas. */
export function FarmingScreen() {
  const dispatch = useGameDispatch()
  const session = useGameStore((s) => s.session)
  const exitPrompt = useGameStore((s) => s.exitPrompt)
  const { state, progressRef, registerGrade, completeRound } = useFarmingRun(exitPrompt)

  if (!session) return null

  const demand = getStage(session.stageId)?.minigameDemand ?? 1
  const minigameId = minigameForRound(state.round)
  const minigame = MINIGAMES[minigameId]
  const Minigame = MINIGAME_COMPONENTS[minigameId]
  const bonusPreview = Math.floor(state.stars * getFarmingBonus(session.build))

  return (
    <section className="relative flex h-full flex-col overflow-hidden bg-night-deep" aria-label={`${STRINGS.farming.heading} ${session.farmingRound}`}>
      <div aria-hidden="true" className="bg-diamond-tiles pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative mx-auto flex h-full w-full max-w-lg flex-col">
        <FarmingHud
          round={session.farmingRound}
          secondsLeft={state.secondsLeft}
          stars={state.stars}
          combo={state.combo}
          progressRef={progressRef}
          onExit={() => dispatch({ type: 'GO_BACK' })}
        />

        <div className="relative m-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border-[3px] border-panel-edge bg-[linear-gradient(180deg,oklch(0.24_0.05_270),oklch(0.16_0.045_272))] shadow-[inset_0_2px_0_oklch(1_0_0/0.06),0_6px_0_oklch(0_0_0/0.55)]">
          {state.status === 'intro' && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3">
              <p className="animate-pop-in text-shadow-pixel font-display text-xl text-gold uppercase">
                {STRINGS.farming.ready}
              </p>
              <p className="font-body text-base text-parchment/70">{MINIGAMES.reflex.instruction}</p>
            </div>
          )}

          {state.status === 'playing' && (
            <>
              <div key={`label-${state.round}`} className="animate-slide-up relative z-10 flex flex-col items-center gap-1 px-4 pt-3 text-center">
                <span className="rounded-sm border-2 border-gold-dim bg-night-deep px-2 py-1 font-display text-[8px] text-gold uppercase">
                  {minigame.name}
                </span>
                <span className="font-body text-sm text-parchment/70">{minigame.instruction}</span>
              </div>
              <div className="relative flex-1">
                <Minigame
                  key={state.round}
                  level={minigameLevel(state.round, session.farmingRound)}
                  demand={demand}
                  paused={exitPrompt}
                  onGrade={registerGrade}
                  onComplete={completeRound}
                />
              </div>
            </>
          )}

          <GradeFeedback events={state.events} />
        </div>
      </div>

      {state.status === 'finished' && (
        <FarmingSummary
          round={session.farmingRound}
          stars={state.stars}
          score={state.score}
          maxCombo={state.maxCombo}
          grades={state.grades}
          bonusPreview={bonusPreview}
          onContinue={() =>
            finishFarming({
              baseStars: state.stars,
              score: state.score,
              maxCombo: state.maxCombo,
              grades: state.grades,
              minigamesPlayed: state.round + 1,
            })
          }
        />
      )}

      <MatchExitDialog />
    </section>
  )
}
