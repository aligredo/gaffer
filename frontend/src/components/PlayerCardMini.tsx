import type { Player } from '../api/types'

const POSITION_COLORS: Record<string, string> = {
  GK: '#F59E0B',
  DEF: '#3B82F6',
  ATT: '#EF4444',
  JOKER: '#A855F7',
}

interface Props {
  player: Player
  team: 'A' | 'B'
}

export function PlayerCardMini({ player, team }: Props) {
  const ovr = player.overall ?? Math.round((player.pace + player.shoot + player.pass + player.skill + player.physical) / 5)
  const posColor = POSITION_COLORS[player.bestPosition] ?? '#6B7280'
  const borderColor = team === 'A' ? '#39FF14' : '#FFD700'
  const firstName = player.name.split(' ')[0]

  return (
    <div
      className="flex flex-col items-center gap-0.5 w-12"
      style={{ filter: `drop-shadow(0 0 6px ${borderColor}40)` }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-barlow font-bold text-white border-2"
        style={{ backgroundColor: posColor, borderColor }}
      >
        {player.bestPosition}
      </div>
      <span className="text-chalk text-xs font-barlow leading-tight text-center max-w-full truncate">
        {firstName}
      </span>
      <span className="text-xs font-bebas" style={{ color: borderColor }}>
        {ovr}
      </span>
    </div>
  )
}
