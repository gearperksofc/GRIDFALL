'use client'

import type { StageId, StageView } from '@/types'
import { cn } from '@/lib/utils'
import { MAP_PADDING_Y, NODE_SIZE, ROW_HEIGHT, StageNode, nodeX, nodeY } from './stage-node'

interface StageMapProps {
  stages: StageView[]
  selectedId: StageId | null
  onSelect: (stage: StageView) => void
}

/** Curva em "S" entre dois nós consecutivos. */
function segmentPath(from: number, to: number) {
  const x1 = nodeX(from)
  const y1 = nodeY(from)
  const x2 = nodeX(to)
  const y2 = nodeY(to)
  const bend = ROW_HEIGHT * 0.55
  return `M ${x1} ${y1} C ${x1} ${y1 + bend}, ${x2} ${y2 - bend}, ${x2} ${y2}`
}

/**
 * Caminho vertical com nós conectados. O SVG usa `preserveAspectRatio="none"`
 * com viewBox em % na horizontal e px na vertical, e `non-scaling-stroke`
 * para que as linhas mantenham espessura em qualquer largura de tela.
 */
export function StageMap({ stages, selectedId, onSelect }: StageMapProps) {
  const height = MAP_PADDING_Y * 2 + NODE_SIZE + (stages.length - 1) * ROW_HEIGHT

  return (
    <div className="relative mx-auto w-full max-w-lg" style={{ height }}>
      <svg
        aria-hidden="true"
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 size-full overflow-visible"
      >
        {stages.slice(1).map((stage, i) => {
          const previous = stages[i]
          const d = segmentPath(i, i + 1)
          const traveled = previous.isCompleted
          const active = stage.isCurrent

          return (
            <g key={stage.id}>
              {traveled && (
                <path
                  d={d}
                  fill="none"
                  stroke="var(--gold)"
                  strokeOpacity={0.35}
                  strokeWidth={10}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  className="blur-[3px]"
                />
              )}
              <path
                d={d}
                fill="none"
                strokeWidth={traveled ? 4 : 3}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                strokeDasharray={traveled ? undefined : '8 8'}
                className={cn(
                  traveled
                    ? 'stroke-gold'
                    : active
                      ? 'animate-dash-flow stroke-arcane'
                      : 'stroke-panel-edge',
                )}
              />
            </g>
          )
        })}
      </svg>

      {stages.map((stage, index) => (
        <StageNode
          key={stage.id}
          stage={stage}
          index={index}
          selected={stage.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
