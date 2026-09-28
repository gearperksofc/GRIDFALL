import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GameShellProps {
  children: ReactNode
  className?: string
}

/**
 * Contêiner raiz de tela cheia. Bloqueia scroll/zoom, respeita safe areas
 * e centraliza o jogo em telas largas (desktop) mantendo o foco mobile-first.
 */
export function GameShell({ children, className }: GameShellProps) {
  return (
    <main
      className={cn(
        'touch-none-select relative flex h-dvh w-full items-center justify-center overflow-hidden bg-night-deep',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,oklch(0_0_0/0.6)_100%)]"
      />
      <div className="safe-area-inset relative flex h-full w-full max-w-[560px] flex-col lg:max-w-[960px]">
        {children}
      </div>
    </main>
  )
}
