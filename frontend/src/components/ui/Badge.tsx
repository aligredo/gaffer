interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'accent' | 'gold' | 'danger'
  className?: string
}

import React from 'react'

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants: Record<string, string> = {
    default: 'bg-white/10 text-chalk/70 border-white/10',
    accent: 'bg-accent/10 text-accent border-accent/30',
    gold: 'bg-gold/10 text-gold border-gold/30',
    danger: 'bg-red-500/10 text-red-400 border-red-500/30',
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-barlow font-semibold border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
