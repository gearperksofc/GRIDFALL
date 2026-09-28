/**
 * Primitivas geométricas e a base de entidades do mundo.
 * Personagens, NPCs e itens futuros devem estender Entity.
 */
export interface Vector2 {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface Entity {
  id: string
  position: Vector2
}

export interface Camera {
  position: Vector2
  zoom: number
}
