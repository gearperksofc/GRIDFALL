'use client'

import { Hammer } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DevNoticeProps {
  message: string | null
}

/** Aviso breve exibido ao tocar em um modo ainda bloqueado. */
export function DevNotice({ message }: DevNoticeProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'pointer-events-none absolute inset-x-0 bottom-24 z-20 flex justify-center px-4 transition-[opacity,transform] duration-200 ease-out',
        message ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
      )}
    >
      {message && (
        <div className="rpg-frame flex items-center gap-3 px-4 py-3 shadow-[0_12px_32px_-8px_oklch(0_0_0/0.9)]">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md border-2 border-gold-dim bg-night-deep text-gold">
            <Hammer className="size-4" aria-hidden="true" />
          </span>
          <p className="text-shadow-pixel font-display text-[9px] leading-relaxed text-parchment">{message}</p>
        </div>
      )}
    </div>
  )
}
