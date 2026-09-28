import type {
  ConnectionStatus,
  NetworkClient,
  NetworkEvent,
  NetworkEventHandler,
  NetworkEventMap,
  NetworkEventType,
} from '@/types'
import { logger } from '@/lib/logger'

const log = logger.scope('network')

/**
 * Cliente de rede em modo single-player.
 * Implementa a mesma interface do futuro cliente WebSocket, então o restante
 * do jogo não precisa saber se está online ou offline.
 * Eventos enviados são ecoados localmente para simular o round-trip.
 */
export class LocalNetworkClient implements NetworkClient {
  private _status: ConnectionStatus = 'offline'
  private playerId = ''
  private handlers = new Map<NetworkEventType, Set<NetworkEventHandler>>()
  private statusHandlers = new Set<(status: ConnectionStatus) => void>()

  get status() {
    return this._status
  }

  async connect(playerId: string) {
    this.playerId = playerId
    this.setStatus('offline')
    log.debug('modo local ativo para', playerId)
  }

  disconnect() {
    this.setStatus('offline')
  }

  send<T extends NetworkEventType>(type: T, payload: NetworkEventMap[T]) {
    const event: NetworkEvent<T> = {
      type,
      payload,
      senderId: this.playerId,
      timestamp: Date.now(),
    }
    queueMicrotask(() => this.emit(event))
  }

  on<T extends NetworkEventType>(type: T, handler: NetworkEventHandler<T>) {
    const set = this.handlers.get(type) ?? new Set()
    set.add(handler as NetworkEventHandler)
    this.handlers.set(type, set)
    return () => {
      set.delete(handler as NetworkEventHandler)
    }
  }

  onStatusChange(handler: (status: ConnectionStatus) => void) {
    this.statusHandlers.add(handler)
    return () => {
      this.statusHandlers.delete(handler)
    }
  }

  private emit(event: NetworkEvent) {
    for (const handler of this.handlers.get(event.type) ?? []) handler(event)
  }

  private setStatus(status: ConnectionStatus) {
    if (this._status === status) return
    this._status = status
    for (const handler of this.statusHandlers) handler(status)
  }
}
