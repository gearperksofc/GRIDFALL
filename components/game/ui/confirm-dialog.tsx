'use client'

import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RpgButton } from './rpg-button'
import { RpgFrame } from './rpg-frame'

interface ConfirmDialogProps {
  title: string
  description?: string
  icon?: LucideIcon
  confirmLabel: string
  cancelLabel: string
  onConfirm: () => void
  onCancel: () => void
  /** Tom do botão de confirmação. */
  destructive?: boolean
  className?: string
}

export function ConfirmDialog({
  title,
  description,
  icon: Icon,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  destructive = false,
  className,
}: ConfirmDialogProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className={cn(
        'absolute inset-0 z-30 flex items-center justify-center bg-night-deep/85 p-6 backdrop-blur-[2px]',
        className,
      )}
    >
      <RpgFrame className="animate-pop-in flex w-full max-w-xs flex-col gap-4 p-5 text-center">
        {Icon && (
          <span
            className={cn(
              'mx-auto flex size-12 items-center justify-center rounded-full border-2 bg-night-deep',
              destructive ? 'border-destructive text-destructive' : 'border-gold-dim text-gold',
            )}
          >
            <Icon className="size-6" aria-hidden="true" />
          </span>
        )}
        <h2 id="confirm-dialog-title" className="text-shadow-pixel font-display text-xs leading-relaxed text-parchment">
          {title}
        </h2>
        {description && <p className="font-body text-base leading-relaxed text-parchment/70">{description}</p>}
        <div className="flex flex-col gap-2 pt-1">
          <RpgButton onClick={onCancel} autoFocus>
            {cancelLabel}
          </RpgButton>
          <RpgButton
            variant="ghost"
            onClick={onConfirm}
            className={cn(destructive && 'border-destructive/70 text-destructive hover:border-destructive')}
          >
            {confirmLabel}
          </RpgButton>
        </div>
      </RpgFrame>
    </div>
  )
}
