import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/utils/cn'

type ButtonVariant = 'primary' | 'ghost'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  children: ReactNode
}

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        'ui-button',
        variant === 'primary' && 'ui-button--primary',
        variant === 'ghost' && 'ui-button--ghost',
        className,
      )}
    />
  )
}


