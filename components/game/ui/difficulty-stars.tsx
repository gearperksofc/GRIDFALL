import { Star } from 'lucide-react'
import type { DifficultyRating } from '@/types'
import { cn } from '@/lib/utils'

interface DifficultyStarsProps {
  value: DifficultyRating
  label: string
  size?: 'sm' | 'md'
  className?: string
}

const MAX = 5

export function DifficultyStars({ value, label, size = 'sm', className }: DifficultyStarsProps) {
  return (
    <span
      role="img"
      aria-label={`${label}: ${value} de ${MAX}`}
      className={cn('inline-flex items-center gap-0.5', className)}
    >
      {Array.from({ length: MAX }, (_, i) => {
        const filled = i < value
        return (
          <Star
            key={i}
            aria-hidden="true"
            className={cn(
              size === 'sm' ? 'size-3' : 'size-4',
              filled ? 'fill-gold text-gold drop-shadow-[0_0_4px_var(--gold)]' : 'text-parchment/25',
            )}
            strokeWidth={filled ? 1.5 : 2}
          />
        )
      })}
    </span>
  )
}
