'use client'

import type { PointerEvent } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react'
import type { Direction, InputKey } from '@/types'
import { STRINGS } from '@/data/strings'
import { cn } from '@/lib/utils'
import { getInputManager, useInputState } from '@/hooks/use-input'

const DIRECTIONS: { key: Direction; icon: typeof ChevronUp; area: string }[] = [
  { key: 'up', icon: ChevronUp, area: 'col-start-2 row-start-1' },
  { key: 'left', icon: ChevronLeft, area: 'col-start-1 row-start-2' },
  { key: 'right', icon: ChevronRight, area: 'col-start-3 row-start-2' },
  { key: 'down', icon: ChevronDown, area: 'col-start-2 row-start-3' },
]

function usePressHandlers(key: InputKey) {
  const input = getInputManager()
  return {
    onPointerDown: (e: PointerEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.currentTarget.setPointerCapture(e.pointerId)
      input.press(key)
    },
    onPointerUp: () => input.release(key),
    onPointerCancel: () => input.release(key),
    onPointerLeave: () => input.release(key),
    onContextMenu: (e: PointerEvent<HTMLButtonElement>) => e.preventDefault(),
  }
}

function PadButton({
  pressKey,
  label,
  className,
  children,
}: {
  pressKey: InputKey
  label: string
  className?: string
  children: React.ReactNode
}) {
  const handlers = usePressHandlers(pressKey)
  const pressed = useInputState()[pressKey]

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      className={cn(
        'touch-none-select flex items-center justify-center border-[3px] border-panel-edge bg-panel/90 text-parchment',
        'shadow-[inset_0_-4px_0_0_var(--night-deep)] transition-[transform,box-shadow,border-color] duration-75',
        pressed &&
          'translate-y-0.5 border-gold-dim text-gold shadow-[inset_0_-1px_0_0_var(--night-deep)]',
        className,
      )}
      {...handlers}
    >
      {children}
    </button>
  )
}

/**
 * Controles touch. Escrevem direto no InputManager — a mesma fonte
 * de verdade do teclado — então o jogo não distingue os dois.
 */
export function VirtualControls() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-4 pb-6">
      <div
        className="pointer-events-auto grid size-40 grid-cols-3 grid-rows-3 gap-1"
        role="group"
        aria-label="Direcional"
      >
        {DIRECTIONS.map(({ key, icon: Icon, area }) => (
          <PadButton key={key} pressKey={key} label={STRINGS.controls[key]} className={area}>
            <Icon className="size-7" strokeWidth={2.5} aria-hidden="true" />
          </PadButton>
        ))}
        <div aria-hidden="true" className="col-start-2 row-start-2 bg-night-deep/60" />
      </div>

      <div className="pointer-events-auto flex items-end gap-3" role="group" aria-label="Ações">
        <PadButton
          pressKey="cancel"
          label={STRINGS.controls.cancel}
          className="size-14 rounded-full font-display text-xs"
        >
          B
        </PadButton>
        <PadButton
          pressKey="confirm"
          label={STRINGS.controls.confirm}
          className="mb-6 size-16 rounded-full font-display text-sm"
        >
          A
        </PadButton>
      </div>
    </div>
  )
}
