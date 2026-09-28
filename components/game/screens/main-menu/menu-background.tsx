import { MenuParticles } from './menu-particles'

/**
 * Fundo com camadas de profundidade: céu, losangos, brilho central,
 * "montanhas" desfocadas, partículas e vinheta.
 */
export function MenuBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.3_0.09_280)_0%,oklch(0.2_0.07_275)_45%,oklch(0.12_0.05_270)_100%)]" />

      <div className="bg-diamond-tiles absolute inset-0 opacity-90" />

      <div className="animate-glow-pulse absolute top-[38%] left-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.72_0.14_195/0.32)_0%,oklch(0.72_0.14_195/0.08)_35%,transparent_65%)] blur-2xl" />

      <div className="absolute -bottom-24 -left-16 h-64 w-[70%] rounded-[100%] bg-[oklch(0.16_0.06_285)] blur-2xl" />
      <div className="absolute -right-20 -bottom-28 h-72 w-[75%] rounded-[100%] bg-[oklch(0.14_0.05_265)] blur-2xl" />

      <MenuParticles />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,oklch(0_0_0/0.55)_100%)]" />
    </div>
  )
}
