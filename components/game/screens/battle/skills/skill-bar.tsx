'use client'

import { Flame, Shield, Slice, Sword, type LucideIcon } from 'lucide-react'
import type { SkillDefinition, SkillEffect, Unit } from '@/types'
import { STRINGS } from '@/data/strings'
import { skillMaxHit } from '@/game/battle/damage'
import { cn } from '@/lib/utils'

export const SKILL_ICON: Record<SkillEffect, LucideIcon> = {
  meteor: Flame,
  laceration: Slice,
  barrier: Shield,
  timing: Sword,
}

interface SkillBarProps {
  unit: Unit
  canAct: boolean
  onUse: (skill: SkillDefinition) => void
}

/** HUD das 4 skills: nome, custo de MP e disponibilidade no turno. */
export function SkillBar({ unit, canAct, onUse }: SkillBarProps) {
  const t = STRINGS.arena
  return (
    <div role="toolbar" aria-label={t.skills} className="grid grid-cols-4 gap-1.5">
      {unit.skills.map((skill) => {
        const Icon = SKILL_ICON[skill.effect]
        const affordable = unit.mp >= skill.mpCost
        const enabled = canAct && affordable
        const reason = !canAct ? t.waitTurn : !affordable ? t.noMp : skill.description
        const maxHit = skillMaxHit(unit, skill)
        return (
          <button
            key={skill.id}
            type="button"
            disabled={!enabled}
            onClick={() => onUse(skill)}
            title={reason}
            aria-label={`${skill.name} — ${skill.mpCost} ${t.mp}. ${reason}`}
            className={cn(
              'relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-md border-[3px] px-1 py-1.5 font-display transition-transform',
              'border-panel-edge bg-panel shadow-[inset_0_-4px_0_var(--night-deep)]',
              enabled && 'cursor-pointer hover:border-gold-dim active:translate-y-0.5',
              !enabled && 'opacity-45',
              skill.type === 'defense' && enabled && 'hover:border-arcane',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-arcane',
            )}
          >
            <Icon className={cn('size-4', skill.type === 'defense' ? 'text-arcane' : 'text-gold')} aria-hidden="true" />
            <span className="line-clamp-2 text-center text-[5px] leading-tight text-parchment uppercase">{skill.name}</span>
            <span className="flex items-center gap-1 text-[5px]">
              <span className={cn('rounded-sm px-1 py-0.5', affordable ? 'bg-arcane/20 text-arcane' : 'bg-destructive/20 text-destructive')}>
                {skill.mpCost} {t.mp}
              </span>
              {maxHit > 0 && <span className="text-parchment/50">{maxHit}×{skill.hits}</span>}
            </span>
          </button>
        )
      })}
    </div>
  )
}
