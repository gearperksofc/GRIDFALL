'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Coins, House, Map, Package, RotateCcw, Skull, Sparkles, Timer, Trophy } from 'lucide-react'
import { getNextStage, getStage } from '@/data/stages'
import { STRINGS } from '@/data/strings'
import { formatDuration, formatNumber } from '@/lib/format'
import { cn } from '@/lib/utils'
import { startStageMatch } from '@/game/match/match-controller'
import { useGameDispatch, useGameStore } from '@/hooks/use-game-store'
import { MenuBackground } from '../main-menu/menu-background'
import { DifficultyStars } from '../../ui/difficulty-stars'
import { RpgButton } from '../../ui/rpg-button'
import { RpgFrame } from '../../ui/rpg-frame'
import { StageUnlockBanner } from './stage-unlock-banner'

const UNLOCK_REVEAL_DELAY_MS = 1100

function StatCell({
  icon: Icon,
  label,
  value,
  accent,
  delay,
}: {
  icon: typeof Coins
  label: string
  value: React.ReactNode
  accent?: 'gold' | 'arcane'
  delay: number
}) {
  return (
    <div
      style={{ '--pop-delay': `${delay}s` } as React.CSSProperties}
      className="animate-pop-in flex flex-col items-center gap-1 rounded-lg border-2 border-panel-edge bg-night-deep/80 px-2 py-3 text-center"
    >
      <Icon
        className={cn('size-4', accent === 'gold' ? 'text-gold' : accent === 'arcane' ? 'text-arcane' : 'text-parchment/70')}
        aria-hidden="true"
      />
      <span className="font-display text-[6px] tracking-wider text-parchment/55 uppercase">{label}</span>
      <span
        className={cn(
          'font-display text-[11px] tabular-nums',
          accent === 'gold' ? 'text-gold' : accent === 'arcane' ? 'text-arcane' : 'text-parchment',
        )}
      >
        {value}
      </span>
    </div>
  )
}

export function ResultScreen() {
  const dispatch = useGameDispatch()
  const result = useGameStore((s) => s.lastResult)
  const [revealUnlock, setRevealUnlock] = useState(false)

  const stage = getStage(result?.stageId)
  const unlockedStage = getStage(result?.unlockedStageId)
  const nextStage = stage ? getNextStage(stage) : null

  useEffect(() => {
    if (!unlockedStage) return
    const id = window.setTimeout(() => setRevealUnlock(true), UNLOCK_REVEAL_DELAY_MS)
    return () => window.clearTimeout(id)
  }, [unlockedStage])

  if (!result || !stage) return null

  const victory = result.outcome === 'victory'
  const t = STRINGS.result

  return (
    <section
      className="relative flex h-full flex-col overflow-hidden"
      aria-labelledby="result-heading"
      aria-live="polite"
    >
      <MenuBackground />

      <div className="relative z-10 min-h-0 flex-1 overflow-y-auto px-5 pt-8 pb-4 [scrollbar-width:thin]">
        <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-5">
          <header className="flex flex-col items-center gap-2 text-center">
            <span
              className={cn(
                'animate-pop-in flex size-16 items-center justify-center rounded-full border-[3px] bg-night-deep',
                victory
                  ? 'border-gold text-gold shadow-[0_0_36px_-6px_var(--gold)]'
                  : 'border-destructive text-destructive shadow-[0_0_36px_-6px_var(--destructive)]',
              )}
            >
              {victory ? (
                <Trophy className="size-8" aria-hidden="true" />
              ) : (
                <Skull className="size-8" aria-hidden="true" />
              )}
            </span>
            <h2
              id="result-heading"
              style={{ '--pop-delay': '0.1s' } as React.CSSProperties}
              className={cn(
                'animate-pop-in animate-title-glow font-display text-3xl uppercase',
                victory ? 'text-gold' : 'text-destructive',
              )}
            >
              {victory ? t.victory : t.defeat}
            </h2>
            <p
              style={{ '--pop-delay': '0.2s' } as React.CSSProperties}
              className="animate-pop-in text-shadow-pixel font-display text-[9px] tracking-wider text-parchment uppercase"
            >
              {victory ? t.stageCleared : `${STRINGS.stageSelect.stage} ${stage.number} — ${stage.name}`}
            </p>
            {victory ? (
              <p
                style={{ '--pop-delay': '0.25s' } as React.CSSProperties}
                className="animate-pop-in font-body text-base text-parchment/70"
              >
                {STRINGS.stageSelect.stage} {stage.number} — {stage.name}
              </p>
            ) : (
              <p
                style={{ '--pop-delay': '0.25s' } as React.CSSProperties}
                className="animate-pop-in max-w-xs font-body text-base leading-relaxed text-parchment/70"
              >
                {t.defeatHint}
              </p>
            )}
          </header>

          {victory && (
            <div className="grid w-full grid-cols-3 gap-2">
              <StatCell icon={Sparkles} label={t.xpGained} value={`+${formatNumber(result.reward?.xp ?? 0)}`} accent="arcane" delay={0.35} />
              <StatCell icon={Coins} label={t.coinsGained} value={`+${formatNumber(result.reward?.coins ?? 0)}`} accent="gold" delay={0.42} />
              <StatCell icon={Timer} label={t.time} value={formatDuration(result.stats.durationMs)} delay={0.49} />
            </div>
          )}

          <RpgFrame
            style={{ '--pop-delay': victory ? '0.55s' : '0.35s' } as React.CSSProperties}
            className="animate-pop-in w-full space-y-3 p-4"
          >
            {victory && result.reward?.items && result.reward.items.length > 0 && (
              <div className="flex flex-col gap-1.5 border-b-2 border-panel-edge/60 pb-3">
                <span className="font-display text-[7px] tracking-wider text-gold uppercase">{t.rewards}</span>
                <ul className="flex flex-wrap gap-2">
                  {result.reward.items.map((item) => (
                    <li
                      key={item.id}
                      className="inline-flex items-center gap-1.5 rounded-md border-2 border-gold-dim bg-night-deep px-2 py-1 font-display text-[8px] text-parchment"
                    >
                      <Package className="size-3.5 text-gold" aria-hidden="true" />
                      {item.quantity}x {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <span className="block font-display text-[7px] tracking-wider text-gold uppercase">{t.stats}</span>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 font-body text-base">
              <dt className="text-parchment/60">{t.opponent}</dt>
              <dd className="text-right text-parchment">{stage.enemy.name}</dd>
              <dt className="text-parchment/60">{t.difficulty}</dt>
              <dd className="flex justify-end">
                <DifficultyStars value={stage.difficulty} label={t.difficulty} />
              </dd>
              <dt className="text-parchment/60">{t.attempt}</dt>
              <dd className="text-right text-parchment tabular-nums">{result.stats.attempt}</dd>
              {!victory && (
                <>
                  <dt className="text-parchment/60">{t.time}</dt>
                  <dd className="text-right text-parchment tabular-nums">{formatDuration(result.stats.durationMs)}</dd>
                </>
              )}
              {victory && (result.firstClear || result.newBestTime) && (
                <>
                  <dt className="text-parchment/60">{t.rewards}</dt>
                  <dd className="text-right">
                    <span className="inline-flex items-center gap-1 rounded-sm border-2 border-gold-dim bg-gold px-1.5 py-0.5 font-display text-[6px] text-[oklch(0.22_0.06_60)] uppercase">
                      <Sparkles className="size-2.5" aria-hidden="true" />
                      {result.firstClear ? t.firstClear : t.newRecord}
                    </span>
                  </dd>
                </>
              )}
            </dl>
          </RpgFrame>

          {victory && unlockedStage && (
            <div className="min-h-[108px] w-full">
              {revealUnlock && <StageUnlockBanner stage={unlockedStage} />}
            </div>
          )}

          {victory && !unlockedStage && !nextStage && (
            <p className="text-shadow-pixel text-center font-display text-[8px] leading-relaxed text-arcane">{t.allCleared}</p>
          )}
        </div>
      </div>

      <footer className="relative z-10 border-t-[3px] border-panel-edge bg-[linear-gradient(180deg,oklch(0.26_0.05_270),oklch(0.16_0.045_270))] px-4 py-3 shadow-[0_-8px_24px_-8px_oklch(0_0_0/0.8)]">
        <div className="mx-auto flex w-full max-w-sm flex-col gap-2">
          {victory ? (
            nextStage && (
              <RpgButton onClick={() => startStageMatch(nextStage.id)} autoFocus>
                {t.nextStage}
                <ArrowRight className="size-4" aria-hidden="true" />
              </RpgButton>
            )
          ) : (
            <RpgButton onClick={() => dispatch({ type: 'RETRY_STAGE' })} autoFocus>
              <RotateCcw className="size-4" aria-hidden="true" />
              {t.retry}
            </RpgButton>
          )}
          <div className="grid grid-cols-2 gap-2">
            <RpgButton variant="ghost" onClick={() => dispatch({ type: 'OPEN_STAGE_SELECT' })}>
              <Map className="size-4" aria-hidden="true" />
              {t.stageSelect}
            </RpgButton>
            <RpgButton variant="ghost" onClick={() => dispatch({ type: 'RETURN_TO_TITLE' })}>
              <House className="size-4" aria-hidden="true" />
              {t.mainMenu}
            </RpgButton>
          </div>
        </div>
      </footer>
    </section>
  )
}
