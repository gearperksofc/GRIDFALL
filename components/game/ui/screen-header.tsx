'use client'

import type { ReactNode } from 'react'
import { ChevronLeft, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ScreenHeaderProps {
  title: string
  subtitle?: string
  icon?: LucideIcon
  headingId?: string
  backLabel: string
  onBack: () => void
  /** Elemento opcional no canto direito (mesma largura do botão de voltar). */
  trailing?: ReactNode
  className?: string
}

/** Cabeçalho padrão das telas secundárias: ← VOLTAR + título centralizado. */
export function ScreenHeader({
  title,
  subtitle,
  icon: Icon,
  headingId,
  backLabel,
  onBack,
  trailing,
  className,
}: ScreenHeaderProps) {
  return (
    <header className={cn('animate-rise-in relative z-10 flex items-center gap-2 px-4 pt-3', className)}>
      <button
        type="button"
        onClick={onBack}
        aria-label={backLabel}
        className="flex size-11 shrink-0 items-center justify-center rounded-lg border-2 border-panel-edge bg-[linear-gradient(180deg,oklch(0.35_0.06_270),oklch(0.24_0.05_270))] text-parchment shadow-[inset_0_2px_0_oklch(1_0_0/0.08),0_3px_0_oklch(0_0_0/0.5)] transition-transform duration-100 active:translate-y-0.5 active:shadow-[inset_0_2px_0_oklch(1_0_0/0.08),0_1px_0_oklch(0_0_0/0.5)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-arcane"
      >
        <ChevronLeft className="size-6" aria-hidden="true" />
      </button>
      <div className="flex min-w-0 flex-1 flex-col items-center rounded-lg border-2 border-gold-dim bg-night-deep/85 px-4 py-2 shadow-[inset_0_0_0_2px_oklch(1_0_0/0.05),0_4px_0_oklch(0_0_0/0.6)]">
        <h2
          id={headingId}
          className="text-shadow-pixel flex items-center gap-2 truncate font-display text-sm text-gold uppercase"
        >
          {Icon && <Icon className="size-4 shrink-0" aria-hidden="true" />}
          {title}
        </h2>
        {subtitle && <p className="truncate font-body text-sm text-parchment/65">{subtitle}</p>}
      </div>
      {trailing ?? <span aria-hidden="true" className="size-11 shrink-0" />}
    </header>
  )
}
