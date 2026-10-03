'use client'

import { LogOut } from 'lucide-react'
import { STRINGS } from '@/data/strings'
import { useGameDispatch, useGameStore } from '@/hooks/use-game-store'
import { ConfirmDialog } from './confirm-dialog'

/** Diálogo "Abandonar partida?" compartilhado pelas etapas da partida. */
export function MatchExitDialog() {
  const dispatch = useGameDispatch()
  const exitPrompt = useGameStore((s) => s.exitPrompt)
  if (!exitPrompt) return null

  return (
    <ConfirmDialog
      icon={LogOut}
      title={STRINGS.battle.exitTitle}
      description={STRINGS.battle.exitHint}
      confirmLabel={STRINGS.battle.abandon}
      cancelLabel={STRINGS.battle.continue}
      onConfirm={() => dispatch({ type: 'ABANDON_MATCH' })}
      onCancel={() => dispatch({ type: 'CANCEL_EXIT' })}
      destructive
    />
  )
}
