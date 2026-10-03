'use client'

import { useEffect, useEffectEvent, useState, type RefObject } from 'react'
import type { BattleEffect, UnitTeam } from '@/types'
import { BATTLE_TIMING } from '@/game/battle/battle-reducer'
import { GRADE_TEXT } from '@/components/game/farming/grade-style'
import { cn } from '@/lib/utils'

interface Anchor {
  x: number
  y: number
}

/** O sprite (billboard) é a referência visual; o wrapper da casa fica deitado no piso. */
const spriteOf = (board: HTMLElement | null, team: UnitTeam) =>
  board?.querySelector<HTMLElement>(`[data-arena-sprite="${team}"]`) ?? null

/** Posição (%) do topo da unidade dentro do quadrado plano da arena. */
export function unitAnchor(board: HTMLElement | null, team: UnitTeam): Anchor {
  const fallback = team === 'enemy' ? { x: 50, y: 22 } : { x: 50, y: 70 }
  const el = spriteOf(board, team)
  if (!board || !el) return fallback
  const b = board.getBoundingClientRect()
  const r = el.getBoundingClientRect()
  if (b.width === 0 || b.height === 0) return fallback
  return { x: ((r.left + r.width / 2 - b.left) / b.width) * 100, y: ((r.top - b.top) / b.height) * 100 }
}

/** Retângulo (%) ocupado pela unidade — alvo das skills interativas. */
export function unitRect(board: HTMLElement | null, team: UnitTeam) {
  const el = spriteOf(board, team)
  if (!board || !el) return { x: 50, y: 30, w: 24, h: 30 }
  const b = board.getBoundingClientRect()
  const r = el.getBoundingClientRect()
  return {
    x: ((r.left + r.width / 2 - b.left) / b.width) * 100,
    y: ((r.top + r.height / 2 - b.top) / b.height) * 100,
    w: (r.width / b.width) * 100,
    h: (r.height / b.height) * 100,
  }
}

const KIND_CLASS: Record<BattleEffect['kind'], string> = {
  damage: 'text-[13px] text-parchment text-shadow-pixel',
  heal: 'text-[11px] text-arcane',
  grade: 'text-[9px]',
  dodge: 'text-[10px] text-arcane',
  block: 'text-[10px] text-gold',
  mp: 'text-[7px] text-arcane/80',
}

function FloatingEffect({ effect, board, onExpire }: { effect: BattleEffect; board: HTMLElement | null; onExpire: (id: string) => void }) {
  const [anchor] = useState(() => unitAnchor(board, effect.team))
  const expire = useEffectEvent(() => onExpire(effect.id))

  useEffect(() => {
    const timer = window.setTimeout(expire, BATTLE_TIMING.effect)
    return () => window.clearTimeout(timer)
  }, [])

  const isPlayerDamage = effect.kind === 'damage' && effect.team === 'player'
  return (
    <span
      aria-hidden="true"
      className={cn(
        'animate-float-up absolute font-display whitespace-nowrap uppercase',
        KIND_CLASS[effect.kind],
        effect.grade && GRADE_TEXT[effect.grade],
        isPlayerDamage && 'text-destructive',
      )}
      style={{
                left: `calc(${anchor.x}% + ${effect.offsetX}px)`,
                top: `calc(${anchor.y}% - ${Math.abs(effect.offsetX) % 3 * 14}px)`,
        transform: 'translate(-50%, -100%)',
      }}
    >
      {effect.text}
    </span>
  )
}

interface BattleEffectsLayerProps {
  effects: BattleEffect[]
  boardRef: RefObject<HTMLDivElement | null>
  onExpire: (id: string) => void
}

/** Números de dano, PERFECT/GREAT/GOOD, DODGE e BLOCKED flutuando sobre as unidades. */
export function BattleEffectsLayer({ effects, boardRef, onExpire }: BattleEffectsLayerProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20" aria-live="polite">
      {effects.map((effect) => (
        <FloatingEffect key={effect.id} effect={effect} board={boardRef.current} onExpire={onExpire} />
      ))}
    </div>
  )
}
