import type { SkillDefinition } from '@/types'

/**
 * Catálogo de skills. Uma skill nova = uma entrada aqui + uma UI em
 * `components/game/screens/battle/skills` registrada pelo `effect`.
 */
export const SKILLS: Record<string, SkillDefinition> = {
  'chuva-de-meteoros': {
    id: 'chuva-de-meteoros',
    name: 'Chuva de Meteoros',
    description: 'Arraste os meteoros até o inimigo. Cada acerto causa dano.',
    mpCost: 5,
    power: 0.5,
    type: 'attack',
    effect: 'meteor',
    hits: 5,
    gradeMultiplier: { perfect: 1.4, great: 1, good: 0.65, miss: 0 },
  },
  'ordem-de-laceracao': {
    id: 'ordem-de-laceracao',
    name: 'Ordem de Laceração',
    description: 'Desenhe até 5 cortes sobre o inimigo.',
    mpCost: 4,
    power: 0.45,
    type: 'attack',
    effect: 'laceration',
    hits: 5,
    gradeMultiplier: { perfect: 1.4, great: 1, good: 0.6, miss: 0 },
  },
  'barreira-gaia': {
    id: 'barreira-gaia',
    name: 'Barreira Gaia',
    description: 'Protege 3 casas durante o próximo ataque inimigo.',
    mpCost: 6,
    power: 0,
    type: 'defense',
    effect: 'barrier',
    hits: 3,
    gradeMultiplier: { perfect: 1, great: 1, good: 1, miss: 1 },
  },
  'golpe-direto': {
    id: 'golpe-direto',
    name: 'Golpe Direto',
    description: 'Golpe único. Acerte o tempo para causar mais dano.',
    mpCost: 2,
    power: 1.2,
    type: 'attack',
    effect: 'timing',
    hits: 1,
    gradeMultiplier: { perfect: 1.5, great: 1.2, good: 1, miss: 0.5 },
  },
}

export function getSkill(id: string): SkillDefinition | null {
  return SKILLS[id] ?? null
}

export function getSkills(ids: string[]): SkillDefinition[] {
  return ids.flatMap((id) => (SKILLS[id] ? [SKILLS[id]] : []))
}

/** Fração do dano que atravessa uma casa protegida pela Barreira Gaia. */
export const BARRIER_DAMAGE_FACTOR = 0.25

/** MP recuperado no início de cada turno próprio. */
export const MP_REGEN_PER_TURN = 3
