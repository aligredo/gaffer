interface Props {
  label: string
  value: number
  onChange: (v: number) => void
}

export function AttributeSlider({ label, value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs font-barlow">
        <span className="text-chalk/60 uppercase">{label}</span>
        <span className="text-accent font-semibold">{value}</span>
      </div>
      <input
        type="range"
        min={1}
        max={99}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent"
      />
    </div>
  )
}
