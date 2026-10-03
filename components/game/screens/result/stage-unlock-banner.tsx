import { Lock } from 'lucide-react'
import type { StageDefinition } from '@/types'
import { STRINGS } from '@/data/strings'
import { DifficultyStars } from '../../ui/difficulty-stars'

interface StageUnlockBannerProps {
  stage: StageDefinition
}

/** Anúncio animado de "FASE N DESBLOQUEADA" exibido na tela de vitória. */
export function StageUnlockBanner({ stage }: StageUnlockBannerProps) {
  return (
    <div role="status" className="relative flex justify-center">
      <div
        aria-hidden="true"
        className="animate-glow-pulse absolute top-1/2 left-1/2 h-20 w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-arcane/40 blur-2xl"
      />
      <div className="animate-unlock relative flex w-full items-center gap-4 rounded-xl border-[3px] border-arcane bg-[linear-gradient(180deg,oklch(0.34_0.07_215),oklch(0.2_0.06_230))] px-4 py-3 shadow-[inset_0_2px_0_oklch(1_0_0/0.15),0_6px_0_oklch(0.12_0.04_230),0_0_32px_-6px_var(--arcane)]">
        <span className="relative flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-arcane bg-night-deep font-display text-lg text-parchment">
          {stage.number}
          <span className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full border-2 border-[oklch(0.5_0.1_195)] bg-arcane text-night-deep">
            <Lock className="size-2.5 rotate-12" strokeWidth={3} aria-hidden="true" />
          </span>
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <span className="font-display text-[6px] tracking-wider text-arcane uppercase">{STRINGS.result.unlockedLabel}</span>
          <span className="text-shadow-pixel font-display text-[10px] leading-relaxed text-parchment uppercase">
            {STRINGS.stageSelect.stage} {stage.number} {STRINGS.result.unlockedSuffix}
          </span>
          <span className="flex items-center gap-2 font-body text-sm text-parchment/70">
            {stage.name}
            <DifficultyStars value={stage.difficulty} label={STRINGS.stageSelect.difficulty} />
          </span>
        </div>
      </div>
    </div>
  )
}
