import type { NetworkClient } from '@/types'
import { NETWORK_CONFIG } from '@/data/config'
import { LocalNetworkClient } from './local-client'

/**
 * Ponto único de criação do cliente de rede.
 * Quando o servidor multiplayer existir, basta adicionar aqui um
 * `WebSocketNetworkClient` e trocar `NETWORK_CONFIG.mode` para 'online'.
 */
export function createNetworkClient(): NetworkClient {
  switch (NETWORK_CONFIG.mode) {
    case 'online':
      throw new Error('Cliente online ainda não implementado.')
    case 'local':
    default:
      return new LocalNetworkClient()
  }
}

export { LocalNetworkClient }
