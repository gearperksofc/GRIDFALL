'use client'

import { Brain, Check, Crosshair, Flag, Gauge, Swords, Timer, Trophy } from 'lucide-react'
import type { StageView } from '@/types'
import { STRINGS } from '@/data/strings'
import { formatDuration } from '@/lib/format'
import { cn } from '@/lib/utils'
import { DifficultyStars } from '../../ui/difficulty-stars'
import { RpgButton } from '../../ui/rpg-button'
import { RewardList } from './reward-list'

interface StageDetailsPanelProps {
  stage: StageView
  onPlay: (stage: StageView) => void
  onClose: () => void
}

function DetailRow({
  icon: Icon,
  label,
  children,
  className,
}: {
  icon: typeof Swords
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex items-start gap-3', className)}>
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border-2 border-panel-edge bg-night-deep text-gold">
        <Icon className="size-3.5" aria-hidden="true" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="font-display text-[7px] tracking-wider text-parchment/55 uppercase">{label}</span>
        <div className="font-body text-base leading-snug text-parchment">{children}</div>
      </div>
    </div>
  )
}

/** Painel inferior com os detalhes da fase selecionada. */
export function StageDetailsPanel({ stage, onPlay, onClose }: StageDetailsPanelProps) {
  const t = STRINGS.stageSelect
  const showAdvanced = stage.number > 1

  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-end">
      <button
        type="button"
        aria-label={t.back}
        onClick={onClose}
        className="absolute inset-0 bg-night-deep/70 backdrop-blur-[2px]"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="stage-details-title"
        className="animate-slide-up relative max-h-[88%] overflow-y-auto rounded-t-2xl border-x-[3px] border-t-[3px] border-gold-dim bg-[linear-gradient(180deg,oklch(0.28_0.055_270),oklch(0.17_0.045_272))] shadow-[inset_0_2px_0_oklch(1_0_0/0.08),0_-12px_40px_-12px_oklch(0_0_0/0.9)] [scrollbar-width:thin]"
      >
        <span aria-hidden="true" className="bg-diamond-tiles pointer-events-none absolute inset-0 opacity-50" />

        <div className="relative flex flex-col gap-4 px-5 pt-3 pb-5">
          <span aria-hidden="true" className="mx-auto h-1.5 w-12 rounded-full bg-parchment/25" />

          <header className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <span className="font-display text-[8px] tracking-wider text-gold uppercase">
                {t.stage} {stage.number}
              </span>
              <h3 id="stage-details-title" className="text-shadow-pixel font-display text-base text-parchment uppercase">
                {stage.name}
              </h3>
            </div>
            {stage.isCompleted && (
              <span className="inline-flex items-center gap-1.5 rounded-sm border-2 border-gold-dim bg-gold px-2 py-1 font-display text-[7px] text-[oklch(0.22_0.06_60)] uppercase shadow-[0_2px_0_oklch(0_0_0/0.5)]">
                <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                {t.status.completed}
              </span>
            )}
          </header>

          <p className="font-body text-base leading-relaxed text-parchment/75">{stage.description}</p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailRow icon={Gauge} label={t.difficulty}>
              <DifficultyStars value={stage.difficulty} label={t.difficulty} size="md" />
            </DetailRow>

            <DetailRow icon={Swords} label={t.opponent}>
              <span className="font-display text-[10px] text-parchment">{stage.enemy.name}</span>
              <span className="block text-sm text-parchment/60">
                {stage.enemy.role} · {t.level} {stage.enemy.level}
              </span>
            </DetailRow>

            <DetailRow icon={Trophy} label={t.reward}>
              <RewardList reward={stage.reward} size="md" />
            </DetailRow>

            <DetailRow icon={Flag} label={t.objective}>
              {stage.objective}
            </DetailRow>

            {showAdvanced && (
              <>
                <DetailRow icon={Crosshair} label={t.recommendedPower}>
                  <span className="font-display text-[10px] text-arcane">{stage.recommendedPower}</span>
                </DetailRow>
                <DetailRow icon={Brain} label={t.aiProfile}>
                  <span>{t.aiTiers[stage.enemy.ai.tier]}</span>
                  <span className="block text-sm text-parchment/60">
                    {t.skills}: {stage.enemy.skills.join(', ')}
                  </span>
                </DetailRow>
              </>
            )}

            {stage.isCompleted && stage.bestTimeMs !== null && (
              <DetailRow icon={Timer} label={t.bestTime}>
                <span className="font-display text-[10px] tabular-nums">{formatDuration(stage.bestTimeMs)}</span>
                <span className="block text-sm text-parchment/60">
                  {t.clears}: {stage.clears}
                </span>
              </DetailRow>
            )}
          </div>

          <div className="flex flex-col gap-2 pt-1 sm:flex-row-reverse">
            <RpgButton onClick={() => onPlay(stage)} autoFocus>
              <Swords className="size-4" aria-hidden="true" />
              {t.play}
            </RpgButton>
            <RpgButton variant="ghost" onClick={onClose}>
              {t.back}
            </RpgButton>
          </div>
        </div>
      </section>
    </div>
  )
}
