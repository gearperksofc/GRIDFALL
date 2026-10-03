'use client'

import { Backpack, Check, Lock, Shield, Swords, User, Users } from 'lucide-react'
import type { MatchStep } from '@/types'
import { getStage } from '@/data/stages'
import { MATCH_FLOW } from '@/data/match-flow'
import { DEFAULT_LOADOUT, EQUIPMENT_SLOTS, type LoadoutSlotId } from '@/data/player-loadout'
import { STRINGS } from '@/data/strings'
import { cn } from '@/lib/utils'
import { useGameDispatch, useGameStore } from '@/hooks/use-game-store'
import { MenuBackground } from '../main-menu/menu-background'
import { DifficultyStars } from '../../ui/difficulty-stars'
import { RpgButton } from '../../ui/rpg-button'
import { ScreenHeader } from '../../ui/screen-header'

const SLOT_ICONS: Record<LoadoutSlotId, typeof User> = { main: User, support: Users, assist: Shield }

function Panel({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-xl border-[3px] border-panel-edge bg-[linear-gradient(180deg,oklch(0.28_0.055_270),oklch(0.18_0.045_272))] p-3 shadow-[inset_0_2px_0_oklch(1_0_0/0.08),0_5px_0_oklch(0.09_0.03_272)]',
        className,
      )}
    >
      <h3 className="mb-3 font-display text-[8px] tracking-wider text-gold uppercase">{title}</h3>
      {children}
    </section>
  )
}

function FlowStrip({ current }: { current: MatchStep }) {
  return (
    <ol className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none]" aria-label={STRINGS.preparation.flow}>
      {MATCH_FLOW.map((step, i) => {
        const isCurrent = step.id === current
        return (
          <li key={step.id} className="flex shrink-0 items-center gap-1">
            <span
              aria-current={isCurrent ? 'step' : undefined}
              className={cn(
                'inline-flex items-center gap-1 rounded-sm border-2 px-2 py-1 font-display text-[6px] tracking-wide uppercase',
                isCurrent
                  ? 'border-arcane bg-arcane text-night-deep'
                  : step.implemented
                    ? 'border-panel-edge bg-night-deep/80 text-parchment/75'
                    : 'border-panel-edge/60 bg-night-deep/50 text-parchment/40',
              )}
            >
              {!step.implemented && <Lock className="size-2" aria-hidden="true" />}
              {STRINGS.matchSteps[step.id]}
            </span>
            {i < MATCH_FLOW.length - 1 && <span aria-hidden="true" className="h-0.5 w-2 bg-panel-edge" />}
          </li>
        )
      })}
    </ol>
  )
}

export function PreparationScreen() {
  const dispatch = useGameDispatch()
  const session = useGameStore((s) => s.session)
  const stage = getStage(session?.stageId)
  const t = STRINGS.preparation

  if (!session || !stage) return null

  const hero = DEFAULT_LOADOUT[0].unit

  return (
    <section className="relative flex h-full flex-col overflow-hidden" aria-labelledby="preparation-heading">
      <MenuBackground />

      <ScreenHeader
        headingId="preparation-heading"
        title={t.heading}
        subtitle={t.subheading}
        icon={Swords}
        backLabel={t.back}
        onBack={() => dispatch({ type: 'GO_BACK' })}
      />

      <div className="relative z-10 min-h-0 flex-1 overflow-y-auto px-4 pt-4 pb-4 [scrollbar-width:thin]">
        <div className="mx-auto flex w-full max-w-lg flex-col gap-3">
          <div className="animate-rise-in flex items-center justify-between gap-3 rounded-xl border-[3px] border-gold-dim bg-night-deep/85 px-4 py-3 shadow-[inset_0_2px_0_oklch(1_0_0/0.06),0_5px_0_oklch(0_0_0/0.6)] [--rise-delay:0.05s]">
            <div className="flex min-w-0 flex-col gap-1">
              <span className="font-display text-[7px] tracking-wider text-gold uppercase">
                {STRINGS.stageSelect.stage} {stage.number}
                {session.attempt > 1 && ` · ${STRINGS.battle.attempt} ${session.attempt}`}
              </span>
              <span className="text-shadow-pixel truncate font-display text-xs text-parchment uppercase">{stage.name}</span>
              <DifficultyStars value={stage.difficulty} label={STRINGS.stageSelect.difficulty} />
            </div>
            <div className="flex shrink-0 flex-col items-end gap-0.5 text-right">
              <span className="font-display text-[6px] tracking-wider text-parchment/55 uppercase">
                {STRINGS.stageSelect.opponent}
              </span>
              <span className="font-display text-[9px] text-parchment">{stage.enemy.name}</span>
              <span className="font-body text-xs text-parchment/60">
                {STRINGS.stageSelect.level} {stage.enemy.level}
              </span>
            </div>
          </div>

          <div className="animate-rise-in grid grid-cols-3 gap-2 [--rise-delay:0.12s]">
            {DEFAULT_LOADOUT.map((slot) => {
              const Icon = SLOT_ICONS[slot.id]
              return (
                <div
                  key={slot.id}
                  className={cn(
                    'relative flex min-h-[132px] flex-col items-center justify-between gap-2 rounded-xl border-[3px] p-2 text-center',
                    slot.available
                      ? 'border-gold-dim bg-[linear-gradient(180deg,oklch(0.3_0.055_270),oklch(0.19_0.045_272))] shadow-[inset_0_2px_0_oklch(1_0_0/0.08),0_5px_0_oklch(0.09_0.03_272)]'
                      : 'border-panel-edge/70 border-dashed bg-night-deep/60',
                  )}
                >
                  <span className="font-display text-[6px] leading-tight tracking-wide text-parchment/60 uppercase">
                    {t.slots[slot.id]}
                  </span>
                  <span
                    className={cn(
                      'flex size-12 items-center justify-center rounded-full border-2',
                      slot.available
                        ? 'border-gold bg-night text-gold shadow-[0_0_18px_-4px_var(--gold)]'
                        : 'border-panel-edge bg-night-deep text-parchment/35',
                    )}
                  >
                    {slot.available ? (
                      <Icon className="size-6" aria-hidden="true" />
                    ) : (
                      <Lock className="size-5" aria-hidden="true" />
                    )}
                  </span>
                  {slot.unit ? (
                    <span className="flex flex-col gap-0.5">
                      <span className="font-display text-[7px] text-parchment">{slot.unit.name}</span>
                      <span className="font-body text-xs text-parchment/60">
                        {slot.unit.role} · {STRINGS.stageSelect.level} {slot.unit.level}
                      </span>
                    </span>
                  ) : (
                    <span className="font-display text-[6px] text-parchment/40 uppercase">{t.soon}</span>
                  )}
                </div>
              )
            })}
          </div>

          <div className="animate-rise-in grid grid-cols-1 gap-3 sm:grid-cols-2 [--rise-delay:0.18s]">
            <Panel title={t.attributes}>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                {hero &&
                  (Object.keys(t.stats) as (keyof typeof t.stats)[]).map((key) => (
                    <div
                      key={key}
                      className="flex items-center justify-between border-b-2 border-panel-edge/60 pb-1 font-display text-[8px]"
                    >
                      <dt className="text-parchment/60">{t.stats[key]}</dt>
                      <dd className="text-parchment tabular-nums">{hero.stats[key]}</dd>
                    </div>
                  ))}
              </dl>
            </Panel>

            <Panel title={t.equipment}>
              <ul className="flex flex-col gap-2">
                {EQUIPMENT_SLOTS.map((slot) => (
                  <li
                    key={slot}
                    className="flex items-center gap-2 rounded-md border-2 border-dashed border-panel-edge/70 bg-night-deep/60 px-2 py-1.5"
                  >
                    <Backpack className="size-3.5 text-parchment/40" aria-hidden="true" />
                    <span className="font-display text-[7px] text-parchment/70 uppercase">{t.equipmentSlots[slot]}</span>
                    <span className="ml-auto font-body text-xs text-parchment/40">{t.empty}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          <div className="animate-rise-in [--rise-delay:0.24s]">
            <Panel title={t.flow} className="p-3">
              <FlowStrip current={session.step} />
            </Panel>
          </div>
        </div>
      </div>

      <footer className="animate-rise-in relative z-10 border-t-[3px] border-panel-edge bg-[linear-gradient(180deg,oklch(0.26_0.05_270),oklch(0.16_0.045_270))] px-4 py-3 shadow-[0_-8px_24px_-8px_oklch(0_0_0/0.8)] [--rise-delay:0.3s]">
        <div className="mx-auto flex w-full max-w-lg gap-2">
          <RpgButton variant="ghost" className="w-auto flex-1" onClick={() => dispatch({ type: 'GO_BACK' })}>
            {t.back}
          </RpgButton>
          <RpgButton className="flex-[2]" onClick={() => dispatch({ type: 'ADVANCE_MATCH' })} autoFocus>
            <Check className="size-4" aria-hidden="true" />
            {t.start}
          </RpgButton>
        </div>
      </footer>
    </section>
  )
}
