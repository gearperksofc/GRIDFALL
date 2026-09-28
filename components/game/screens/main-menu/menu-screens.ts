import type { MenuScreen } from '@/types'

/** Ordem horizontal das telas: também define o que fica à esquerda/direita ao arrastar. */
export const MENU_SCREEN_ORDER: MenuScreen[] = ['shop', 'collection', 'main', 'howToPlay', 'settings']

export function getAdjacentScreen(current: MenuScreen, direction: -1 | 1): MenuScreen | null {
  const index = MENU_SCREEN_ORDER.indexOf(current)
  const next = MENU_SCREEN_ORDER[index + direction]
  return next ?? null
}
