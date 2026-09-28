export type SceneId = 'title' | 'world'

export interface SceneDefinition {
  id: SceneId
  name: string
  description: string
}
