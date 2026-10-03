import type { MinigameGrade } from '@/types'

export const GRADE_TEXT: Record<MinigameGrade, string> = {
  perfect: 'text-gold',
  great: 'text-arcane',
  good: 'text-parchment',
  miss: 'text-destructive',
}

export const GRADE_BORDER: Record<MinigameGrade, string> = {
  perfect: 'border-gold',
  great: 'border-arcane',
  good: 'border-parchment/60',
  miss: 'border-destructive',
}

export const GRADE_BG: Record<MinigameGrade, string> = {
  perfect: 'bg-gold',
  great: 'bg-arcane',
  good: 'bg-parchment/70',
  miss: 'bg-destructive',
}
