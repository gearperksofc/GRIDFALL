'use client'

import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'ghost'

interface RpgButtonProps extends ComponentProps<'button'> {
  variant?: Variant
}

const variants: Record<Variant, string> = {
  primary:
    'bg-gold text-primary-foreground border-gold-dim shadow-[inset_0_-4px_0_0_var(--gold-dim)] hover:brightness-110 active:translate-y-0.5 active:shadow-[inset_0_-2px_0_0_var(--gold-dim)]',
  ghost:
    'bg-panel text-parchment border-panel-edge shadow-[inset_0_-4px_0_0_var(--night-deep)] hover:border-gold-dim active:translate-y-0.5 active:shadow-[inset_0_-2px_0_0_var(--night-deep)]',
}

export function RpgButton({ className, variant = 'primary', ...props }: RpgButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'font-display text-[11px] uppercase tracking-wide',
        'inline-flex min-h-12 w-full items-center justify-center gap-2 border-[3px] px-5 py-3',
        'transition-[filter,transform,box-shadow] duration-100 select-none',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-arcane',
        'disabled:cursor-not-allowed disabled:opacity-40 disabled:active:translate-y-0',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
