interface Props {
  size?: number
}

export function GafferLogo({ size = 40 }: Props) {
  return (
    <div className="flex items-center gap-2" style={{ height: size }}>
      <svg
        width={size * 0.8}
        height={size}
        viewBox="0 0 40 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Crown */}
        <path
          d="M5 18 L10 8 L20 14 L30 8 L35 18 Z"
          fill="#FFD700"
          stroke="#FFD700"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        {/* Football */}
        <circle cx="20" cy="34" r="14" fill="#1a1a2e" stroke="#39FF14" strokeWidth="2" />
        <path
          d="M20 22 L24 27 L22 33 L18 33 L16 27 Z"
          fill="#39FF14"
          opacity="0.8"
        />
        <path
          d="M24 27 L30 29 L28 36 L22 33 Z"
          fill="#39FF14"
          opacity="0.5"
        />
        <path
          d="M16 27 L10 29 L12 36 L18 33 Z"
          fill="#39FF14"
          opacity="0.5"
        />
        <path
          d="M22 33 L28 36 L24 42 L16 42 L12 36 L18 33 Z"
          fill="#39FF14"
          opacity="0.3"
        />
      </svg>
      <span
        className="font-bebas text-chalk tracking-widest"
        style={{ fontSize: size * 0.7, lineHeight: 1 }}
      >
        GAFFER
      </span>
    </div>
  )
}
