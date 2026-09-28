import type { CSSProperties } from 'react'

const PARTICLE_COUNT = 26

/** Pseudo-aleatório determinístico para evitar divergência entre servidor e cliente. */
function noise(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const size = 2 + Math.round(noise(i + 1) * 4)
  const isArcane = noise(i + 50) > 0.45
  return {
    id: i,
    left: `${Math.round(noise(i + 10) * 100)}%`,
    bottom: `${Math.round(noise(i + 20) * 60) - 10}%`,
    size,
    color: isArcane ? 'var(--arcane)' : 'var(--gold)',
    style: {
      '--p-duration': `${10 + noise(i + 30) * 12}s`,
      '--p-delay': `${-noise(i + 40) * 20}s`,
      '--p-drift': `${(noise(i + 60) - 0.5) * 80}px`,
      '--p-opacity': `${0.35 + noise(i + 70) * 0.5}`,
    } as CSSProperties,
  }
})

export function MenuParticles() {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      {PARTICLES.map((p) => (
        <span
          key={p.id}
          className="animate-particle absolute rounded-full"
          style={{
            ...p.style,
            left: p.left,
            bottom: p.bottom,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
        />
      ))}
    </div>
  )
}
