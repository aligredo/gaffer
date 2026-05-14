import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center font-barlow font-semibold tracking-wide rounded transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants: Record<string, string> = {
      primary:
        'bg-accent text-navy hover:brightness-110 active:scale-95',
      secondary:
        'border border-accent text-accent hover:bg-accent/10 active:scale-95',
      ghost:
        'text-chalk/70 hover:text-chalk hover:bg-white/5 active:scale-95',
      danger:
        'bg-red-600 text-white hover:bg-red-700 active:scale-95',
    }

    const sizes: Record<string, string> = {
      sm: 'px-3 py-1 text-sm',
      md: 'px-5 py-2 text-base',
      lg: 'px-8 py-3 text-lg',
    }

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
