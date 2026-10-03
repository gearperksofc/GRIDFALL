'use client'

import { useEffect, useRef } from 'react'

const MARKER_KEY = 'gridfallBack'

/**
 * Empilha uma entrada "sentinela" preservando o estado interno do Next.js
 * (App Router recarrega a página ao voltar para uma entrada sem esse estado).
 */
function pushSentinel() {
  window.history.pushState({ ...window.history.state, [MARKER_KEY]: true }, '')
}

/**
 * Intercepta o botão "voltar" do navegador/celular. Mantém sempre uma entrada
 * extra no histórico para que o gesto nunca saia do jogo, e delega a decisão
 * de navegação à máquina de estados.
 */
export function useHardwareBack(onBack: () => void) {
  const callback = useRef(onBack)
  callback.current = onBack

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Adiado para rodar depois que o App Router instala seu patch em `history`.
    const timer = window.setTimeout(pushSentinel, 0)

    const handlePopState = () => {
      pushSentinel()
      callback.current()
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])
}
