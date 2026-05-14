interface Props {
  label: string
  value: number
  color?: string
}

export function AttributeBar({ label, value, color = '#39FF14' }: Props) {
  return (
    <div className="flex items-center gap-2 text-xs font-barlow">
      <span className="w-7 text-chalk/60 uppercase">{label}</span>
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-5 text-right text-chalk/90">{value}</span>
    </div>
  )
}
