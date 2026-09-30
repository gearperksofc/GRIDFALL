export type SceneId = 'title' | 'world' | 'training'

export interface SceneDefinition {
  id: SceneId
  name: string
  description: string
}
