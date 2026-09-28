'use client'

import Image from 'next/image'
import { CalendarDays, Medal, Scroll, Trophy, type LucideIcon } from 'lucide-react'
import { STRINGS } from '@/data/strings'

function SideButton({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <button
      type="button"
      disabled
      aria-label={`${label} — ${STRINGS.menu.soon}`}
      title={STRINGS.menu.soon}
      className="group relative flex size-14 items-center justify-center rounded-lg border-2 border-panel-edge bg-[linear-gradient(180deg,oklch(0.36_0.06_270),oklch(0.24_0.05_270))] text-parchment/85 shadow-[inset_0_2px_0_oklch(1_0_0/0.08),0_3px_0_oklch(0_0_0/0.5)] transition-transform duration-100 select-none disabled:cursor-default"
    >
      <Icon className="size-6" aria-hidden="true" />
      <span className="absolute -right-1.5 -bottom-1.5 rounded-sm border border-night-deep bg-arcane px-1 font-display text-[6px] leading-3 text-accent-foreground uppercase">
        {STRINGS.menu.soon}
      </span>
    </button>
  )
}

export function MenuHero() {
  return (
    <div className="animate-rise-in relative z-10 flex flex-1 items-center justify-between gap-2 px-3 [--rise-delay:0.08s]">
      <div className="flex flex-col gap-3">
        <SideButton icon={Trophy} label={STRINGS.menu.achievements} />
        <SideButton icon={Scroll} label={STRINGS.menu.quests} />
      </div>

      <div className="relative flex min-w-0 flex-1 flex-col items-center justify-center">
        <div
          aria-hidden="true"
          className="absolute bottom-[14%] left-1/2 h-16 w-[68%] -translate-x-1/2 rounded-[100%] bg-arcane/40 blur-2xl"
        />
        <div className="animate-float-hero relative aspect-[16/10] w-full max-w-[420px] [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_82%)]">
          <Image
            src="/menu/arena-island.png"
            alt={`${STRINGS.menu.arena}: ${STRINGS.menu.arenaName}`}
            fill
            priority
            sizes="(max-width: 560px) 100vw, 420px"
            className="scale-[1.35] object-contain mix-blend-screen"
          />
        </div>

        <div className="relative -mt-3 flex flex-col items-center">
          <div className="rounded-md border-2 border-gold-dim bg-night-deep/90 px-5 py-2 shadow-[inset_0_0_0_2px_oklch(1_0_0/0.05),0_4px_0_oklch(0_0_0/0.6)]">
            <p className="text-shadow-pixel text-center font-display text-xs text-gold">
              {STRINGS.menu.arena}
            </p>
            <p className="text-center font-body text-sm text-parchment/80">{STRINGS.menu.arenaName}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <SideButton icon={Medal} label={STRINGS.menu.ranking} />
        <SideButton icon={CalendarDays} label={STRINGS.menu.events} />
      </div>
    </div>
  )
}
