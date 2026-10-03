export type StageId = string

export type DifficultyRating = 1 | 2 | 3 | 4 | 5

/** Perfis de IA em ordem crescente de exigência. */
export type AiTier = 'basic' | 'cautious' | 'tactical' | 'aggressive' | 'elite'

export interface AiProfile {
  tier: AiTier
  /** Tempo de reação em ms. Menor = mais difícil. */
  reactionMs: number
  /** 0..1 — chance de escolher a melhor ação disponível. */
  decisionQuality: number
  /** 0..1 — frequência com que pressiona o jogador. */
  aggression: number
  /** 0..1 — qualidade de esquiva e posicionamento. */
  movement: number
  /** Quantidade de skills distintas que a IA utiliza. */
  skillVariety: number
}

export interface EnemyStats {
  hp: number
  atk: number
  def: number
  spd: number
}

export interface EnemyDefinition {
  id: string
  name: string
  role: string
  level: number
  stats: EnemyStats
  skills: string[]
  ai: AiProfile
}

export interface RewardItem {
  id: string
  name: string
  quantity: number
}

export interface StageReward {
  coins: number
  xp: number
  items?: RewardItem[]
}

/** Regras especiais previstas para fases futuras. Ainda não aplicadas. */
export type StageRuleId =
  | 'speedBoost'
  | 'reducedFarming'
  | 'bossEvent'
  | 'limitedMp'
  | 'alteredField'
  | 'specialMinigames'

export interface StageRule {
  id: StageRuleId
  label: string
  value?: number
}

export interface StageDefinition {
  id: StageId
  number: number
  name: string
  description: string
  objective: string
  difficulty: DifficultyRating
  recommendedPower: number
  enemy: EnemyDefinition
  reward: StageReward
  /** Multiplicador de exigência dos eventos de batalha (1 = base). */
  eventPressure: number
  /** Multiplicador de exigência dos minigames (1 = base). */
  minigameDemand: number

  // Campos reservados para expansões futuras.
  bosses?: EnemyDefinition[]
  specialRules?: StageRule[]
  environment?: string
  minigameModifiers?: Record<string, number>
  enemyTeam?: EnemyDefinition[]
  rewardMultiplier?: number
}

export type StageStatus = 'locked' | 'available' | 'completed'

/** Fase combinada com o progresso do jogador — o que a UI consome. */
export interface StageView extends StageDefinition {
  status: StageStatus
  isUnlocked: boolean
  isCompleted: boolean
  /** Primeira fase disponível ainda não concluída. */
  isCurrent: boolean
  bestTimeMs: number | null
  clears: number
}
