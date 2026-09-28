import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function RpgFrame({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('rpg-frame p-4', className)} {...props} />
}
