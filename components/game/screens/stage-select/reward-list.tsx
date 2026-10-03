import { Coins, Package, Sparkles } from 'lucide-react'
import type { StageReward } from '@/types'
import { STRINGS } from '@/data/strings'
import { formatNumber } from '@/lib/format'
import { cn } from '@/lib/utils'

interface RewardListProps {
  reward: StageReward
  size?: 'sm' | 'md'
  className?: string
}

export function RewardList({ reward, size = 'sm', className }: RewardListProps) {
  const text = size === 'sm' ? 'text-[8px]' : 'text-[10px]'
  const icon = size === 'sm' ? 'size-3' : 'size-4'

  return (
    <ul className={cn('flex flex-wrap items-center gap-x-3 gap-y-1 font-display', text, className)}>
      <li className="inline-flex items-center gap-1 text-gold">
        <Coins className={icon} aria-hidden="true" />
        <span>
          +{formatNumber(reward.coins)} <span className="sr-only">{STRINGS.stageSelect.coins}</span>
        </span>
      </li>
      <li className="inline-flex items-center gap-1 text-arcane">
        <Sparkles className={icon} aria-hidden="true" />
        <span>
          +{formatNumber(reward.xp)} {STRINGS.stageSelect.xp}
        </span>
      </li>
      {reward.items?.map((item) => (
        <li key={item.id} className="inline-flex items-center gap-1 text-parchment">
          <Package className={icon} aria-hidden="true" />
          <span>
            {item.quantity}x {item.name}
          </span>
        </li>
      ))}
    </ul>
  )
}
