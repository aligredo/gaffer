import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm text-chalk/70 font-barlow tracking-wide uppercase">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`bg-surface border rounded px-3 py-2 text-chalk placeholder-chalk/30 font-barlow focus:outline-none focus:ring-2 focus:ring-accent transition ${
          error ? 'border-red-500' : 'border-white/10'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </div>
  ),
)

Input.displayName = 'Input'
