'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { ArenaUnit } from './use-arena'

interface ArenaUnitSpriteProps {
  arenaUnit: ArenaUnit
  tiltDeg: number
}

function MiniBar({ value, max, className }: { value: number; max: number; className: string }) {
  return (
    <span className="block h-1.5 w-full overflow-hidden rounded-[1px] border border-night-deep bg-night-deep">
      <span
        className={cn('block h-full origin-left transition-transform duration-300', className)}
        style={{ transform: `scaleX(${max > 0 ? value / max : 0})` }}
      />
    </span>
  )
}

/** Unidade em pé sobre a casa: sombra no piso + sprite contra-rotacionado. */
export function ArenaUnitSprite({ arenaUnit, tiltDeg }: ArenaUnitSpriteProps) {
  const { unit, facing } = arenaUnit
  const isEnemy = unit.team === 'enemy'

  return (
    <>
      <span
        aria-hidden="true"
        className={cn(
          'absolute top-1/2 left-1/2 h-[34%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] blur-[1px]',
          isEnemy ? 'bg-destructive/35' : 'bg-gold/30',
        )}
      />
      <div
        className="absolute top-1/2 left-1/2 flex w-[115%] flex-col items-center gap-1"
        style={{ transform: `translate(-50%, -100%) rotateX(${-tiltDeg}deg)`, transformOrigin: '50% 100%' }}
      >
        <div className="flex w-[58%] flex-col gap-0.5">
          <MiniBar value={unit.hp} max={unit.maxHp} className={isEnemy ? 'bg-destructive' : 'bg-gold'} />
          <MiniBar value={unit.mp} max={unit.maxMp} className="bg-arcane" />
        </div>
        <div className="animate-unit-idle relative aspect-square w-full">
          <Image
            src={unit.sprite}
            alt={unit.name}
            fill
            sizes="180px"
            className={cn(
              'object-contain object-bottom transition-transform duration-200 [image-rendering:pixelated]',
              isEnemy && '[filter:hue-rotate(150deg)_saturate(1.3)_brightness(0.9)]',
            )}
            style={{ transform: `scaleX(${facing})` }}
          />
        </div>
      </div>
    </>
  )
}
