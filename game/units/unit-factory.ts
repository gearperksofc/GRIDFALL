import type { GameSession, Unit, UnitStats, UnitTeam, UnitTemplate } from '@/types'
import { ENEMY_UNIT_TEMPLATE, PLAYER_UNIT_TEMPLATE, getUnitTemplate } from '@/data/units'
import { getStage } from '@/data/stages'
import { applyBuildToStats } from '@/game/build/build-system'
import { applyEquipmentToStats } from '@/game/chest/chest-system'

export function statsAtLevel(template: UnitTemplate, level: number): UnitStats {
  const extra = Math.max(0, level - 1)
  const base = template.baseStats
  const g = template.growth
  return {
    maxHp: Math.round(base.maxHp + (g.maxHp ?? 0) * extra),
    maxMp: Math.round(base.maxMp + (g.maxMp ?? 0) * extra),
    attack: Math.round(base.attack + (g.attack ?? 0) * extra),
    defense: Math.round(base.defense + (g.defense ?? 0) * extra),
    speed: Math.round(base.speed + (g.speed ?? 0) * extra),
  }
}

interface CreateUnitOptions {
  team: UnitTeam
  level?: number
  /** Atributos finais já calculados (build, itens…). Substitui o cálculo por nível. */
  stats?: UnitStats
  name?: string
}

export function createUnit(templateId: string, { team, level = 1, stats, name }: CreateUnitOptions): Unit {
  const template = getUnitTemplate(templateId)
  if (!template) throw new Error(`Template de unidade desconhecido: ${templateId}`)
  const final = stats ?? statsAtLevel(template, level)
  return {
    id: `${team}-${template.id}`,
    templateId: template.id,
    name: name ?? template.name,
    team,
    level,
    sprite: template.sprite,
    hp: final.maxHp,
    maxHp: final.maxHp,
    mp: final.maxMp,
    maxMp: final.maxMp,
    attack: final.attack,
    defense: final.defense,
    speed: final.speed,
    skills: template.skills,
    passive: template.passive,
  }
}

/** Atributos do jogador = base do personagem + build de estrelas + equipamentos do baú. */
export function getPlayerStats(session: Pick<GameSession, 'build' | 'inventory'>): UnitStats {
  const template = getUnitTemplate(PLAYER_UNIT_TEMPLATE)!
  const withBuild = applyBuildToStats(statsAtLevel(template, 1), session.build)
  return applyEquipmentToStats(withBuild, session.inventory)
}

export function createPlayerUnit(session: GameSession): Unit {
  return createUnit(PLAYER_UNIT_TEMPLATE, { team: 'player', stats: getPlayerStats(session) })
}

export function createEnemyUnit(session: GameSession): Unit {
  const stage = getStage(session.stageId)
  return createUnit(ENEMY_UNIT_TEMPLATE, { team: 'enemy', level: stage?.enemy.level ?? 1 })
}
