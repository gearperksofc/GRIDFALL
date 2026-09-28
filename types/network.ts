export type ConnectionStatus = 'offline' | 'connecting' | 'online' | 'error'

/**
 * Envelope base de todo evento que trafega pela rede.
 * Novos eventos (movimento, chat, batalha...) devem estender NetworkEventMap.
 */
export interface NetworkEventMap {
  'player:join': { playerId: string; name: string }
  'player:leave': { playerId: string }
  'ping': { sentAt: number }
  'pong': { sentAt: number; receivedAt: number }
}

export type NetworkEventType = keyof NetworkEventMap

export interface NetworkEvent<T extends NetworkEventType = NetworkEventType> {
  type: T
  payload: NetworkEventMap[T]
  senderId: string
  timestamp: number
}

export type NetworkEventHandler<T extends NetworkEventType = NetworkEventType> = (
  event: NetworkEvent<T>,
) => void

export interface NetworkClient {
  readonly status: ConnectionStatus
  connect(playerId: string): Promise<void>
  disconnect(): void
  send<T extends NetworkEventType>(type: T, payload: NetworkEventMap[T]): void
  on<T extends NetworkEventType>(type: T, handler: NetworkEventHandler<T>): () => void
  onStatusChange(handler: (status: ConnectionStatus) => void): () => void
}
