export type UnitTeam = 'player' | 'enemy'

/** Atributos numéricos de combate. Base para builds, itens e crescimento por nível. */
export interface UnitStats {
  maxHp: number
  maxMp: number
  attack: number
  defense: number
  speed: number
}

export type UnitStatKey = keyof UnitStats

/** Habilidade declarada. A execução será ligada no sistema de skills. */
export interface UnitSkill {
  id: string
  name: string
  description: string
  mpCost: number
  cooldownMs: number
}

export interface UnitPassive {
  id: string
  name: string
  description: string
}

/** Definição estática de um personagem. Novos personagens = novos templates. */
export interface UnitTemplate {
  id: string
  name: string
  title: string
  sprite: string
  baseStats: UnitStats
  /** Ganho de atributos por nível acima do 1. */
  growth: Partial<UnitStats>
  skills: UnitSkill[]
  passive: UnitPassive
}

/** Instância viva de uma unidade dentro de uma partida. */
export interface Unit {
  id: string
  templateId: string
  name: string
  team: UnitTeam
  level: number
  sprite: string
  hp: number
  maxHp: number
  mp: number
  maxMp: number
  attack: number
  defense: number
  speed: number
  skills: UnitSkill[]
  passive: UnitPassive
}
