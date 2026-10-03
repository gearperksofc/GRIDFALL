import type { MinigameGrade } from '@/types'

/** Posição em % da área do minigame — usada para posicionar o feedback. */
export interface GradePoint {
  x: number
  y: number
}

/**
 * Contrato de todo minigame. O Farming não conhece detalhes internos:
 * só recebe notas (`onGrade`) e o aviso de fim de rodada (`onComplete`).
 */
export interface MinigameProps {
  /** Dificuldade progressiva (0 = primeira vez). */
  level: number
  /** Multiplicador de exigência da fase (1 = base). */
  demand: number
  paused: boolean
  onGrade: (grade: MinigameGrade, at?: GradePoint) => void
  onComplete: () => void
}
