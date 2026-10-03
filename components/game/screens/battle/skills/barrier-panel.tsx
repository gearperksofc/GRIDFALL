'use client'

import { Shield } from 'lucide-react'
import type { SkillDefinition } from '@/types'
import { STRINGS } from '@/data/strings'
import { cn } from '@/lib/utils'

interface BarrierPanelProps {
  skill: SkillDefinition
  picked: number[]
  onConfirm: () => void
}

/** BARREIRA GAIA — painel inferior: progresso da escolha das casas e confirmação. */
export function BarrierPanel({ skill, picked, onConfirm }: BarrierPanelProps) {
  const t = STRINGS.arena
  const ready = picked.length === skill.hits
  return (
    <div className="flex items-center gap-3 rounded-md border-[3px] border-arcane/70 bg-night-deep/85 px-3 py-2">
      <Shield className="size-5 shrink-0 text-arcane" aria-hidden="true" />
      <div className="flex min-w-0 flex-1 flex-col gap-1 font-display uppercase">
        <span className="text-[7px] text-arcane">{skill.name}</span>
        <span className="text-[6px] text-parchment/70">
          {t.barrierHint} · {t.protectedCells} {picked.length}/{skill.hits}
        </span>
        <span className="flex gap-1" aria-hidden="true">
          {Array.from({ length: skill.hits }, (_, i) => (
            <span key={i} className={cn('h-1.5 flex-1 rounded-[1px] border border-night', i < picked.length ? 'bg-arcane' : 'bg-night')} />
          ))}
        </span>
      </div>
      <button
        type="button"
        disabled={!ready}
        onClick={onConfirm}
        className="min-h-11 shrink-0 rounded-md border-[3px] border-arcane bg-arcane px-3 font-display text-[7px] text-primary-foreground uppercase shadow-[inset_0_-4px_0_oklch(0.5_0.12_195)] transition-transform active:translate-y-0.5 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        {t.barrierConfirm}
      </button>
    </div>
  )
}
