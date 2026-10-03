import type { AiProfile, AiTier, StageDefinition, StageId } from '@/types'

/**
 * Perfis de IA por tier. A dificuldade cresce por reação, qualidade de decisão,
 * agressividade, movimentação e variedade — não por números absurdos.
 */
export const AI_PROFILES: Record<AiTier, AiProfile> = {
  basic: { tier: 'basic', reactionMs: 900, decisionQuality: 0.35, aggression: 0.3, movement: 0.3, skillVariety: 1 },
  cautious: { tier: 'cautious', reactionMs: 750, decisionQuality: 0.5, aggression: 0.4, movement: 0.5, skillVariety: 2 },
  tactical: { tier: 'tactical', reactionMs: 600, decisionQuality: 0.65, aggression: 0.55, movement: 0.65, skillVariety: 3 },
  aggressive: { tier: 'aggressive', reactionMs: 480, decisionQuality: 0.75, aggression: 0.8, movement: 0.7, skillVariety: 4 },
  elite: { tier: 'elite', reactionMs: 360, decisionQuality: 0.9, aggression: 0.85, movement: 0.85, skillVariety: 5 },
}

/**
 * Fases de demonstração do modo vs Bot. A lista é a fonte de verdade:
 * a UI e a progressão derivam tudo daqui, nunca de valores fixos nos componentes.
 */
export const STAGES: StageDefinition[] = [
  {
    id: 'stage-01',
    number: 1,
    name: 'Beginning',
    description: 'Um duelo introdutório contra um espadachim iniciante. Aprenda o ritmo da arena.',
    objective: 'Derrote o oponente.',
    difficulty: 1,
    recommendedPower: 100,
    enemy: {
      id: 'swordsman',
      name: 'Swordsman',
      role: 'Espadachim',
      level: 1,
      stats: { hp: 100, atk: 12, def: 6, spd: 5 },
      skills: ['Golpe Rápido'],
      ai: AI_PROFILES.basic,
    },
    reward: { coins: 100, xp: 50 },
    eventPressure: 1,
    minigameDemand: 1,
  },
  {
    id: 'stage-02',
    number: 2,
    name: 'First Challenge',
    description: 'Uma arqueira que mantém distância e pune aproximações descuidadas.',
    objective: 'Derrote o oponente.',
    difficulty: 2,
    recommendedPower: 140,
    enemy: {
      id: 'archer',
      name: 'Archer',
      role: 'Arqueira',
      level: 3,
      stats: { hp: 125, atk: 14, def: 6, spd: 7 },
      skills: ['Flecha Precisa', 'Recuo Ágil'],
      ai: AI_PROFILES.cautious,
    },
    reward: { coins: 150, xp: 80 },
    eventPressure: 1.1,
    minigameDemand: 1.1,
  },
  {
    id: 'stage-03',
    number: 3,
    name: 'Rising Power',
    description: 'Um mago de batalha veloz, com barreiras e skills de área. Exige leitura de padrões.',
    objective: 'Derrote o oponente antes que a barreira recarregue.',
    difficulty: 3,
    recommendedPower: 190,
    enemy: {
      id: 'battle-mage',
      name: 'Battle Mage',
      role: 'Mago de Batalha',
      level: 5,
      stats: { hp: 140, atk: 17, def: 7, spd: 8 },
      skills: ['Rajada Arcana', 'Barreira', 'Passo Sombrio'],
      ai: AI_PROFILES.tactical,
    },
    reward: {
      coins: 200,
      xp: 100,
      items: [{ id: 'potion-heal', name: 'Poção de Cura', quantity: 1 }],
    },
    eventPressure: 1.25,
    minigameDemand: 1.2,
  },
  {
    id: 'stage-04',
    number: 4,
    name: 'Boss Hunt',
    description: 'O capitão da guarda não recua. Ataques encadeados e pressão constante.',
    objective: 'Derrote o capitão.',
    difficulty: 4,
    recommendedPower: 240,
    enemy: {
      id: 'knight-captain',
      name: 'Knight Captain',
      role: 'Capitão',
      level: 7,
      stats: { hp: 165, atk: 19, def: 10, spd: 8 },
      skills: ['Investida', 'Quebra-Guarda', 'Provocação', 'Golpe Duplo'],
      ai: AI_PROFILES.aggressive,
    },
    reward: { coins: 260, xp: 130 },
    eventPressure: 1.4,
    minigameDemand: 1.35,
  },
  {
    id: 'stage-05',
    number: 5,
    name: 'Chaos',
    description: 'O primeiro desafio de verdade. Um cavaleiro sombrio que lê seus movimentos.',
    objective: 'Sobreviva e derrote o Dark Knight.',
    difficulty: 5,
    recommendedPower: 300,
    enemy: {
      id: 'dark-knight',
      name: 'Dark Knight',
      role: 'Cavaleiro Sombrio',
      level: 10,
      stats: { hp: 190, atk: 23, def: 11, spd: 10 },
      skills: ['Lâmina Umbral', 'Drenar', 'Passo Fantasma', 'Explosão Negra', 'Último Suspiro'],
      ai: AI_PROFILES.elite,
    },
    reward: {
      coins: 350,
      xp: 180,
      items: [{ id: 'rune-fragment', name: 'Fragmento Rúnico', quantity: 1 }],
    },
    eventPressure: 1.6,
    minigameDemand: 1.5,
  },
]

const STAGE_BY_ID = new Map(STAGES.map((stage) => [stage.id, stage]))

export function getStage(id: StageId | null | undefined): StageDefinition | null {
  return id ? (STAGE_BY_ID.get(id) ?? null) : null
}

export function getStageByNumber(number: number): StageDefinition | null {
  return STAGES.find((stage) => stage.number === number) ?? null
}

export function getNextStage(stage: StageDefinition): StageDefinition | null {
  return getStageByNumber(stage.number + 1)
}

export const FIRST_STAGE = STAGES[0]
