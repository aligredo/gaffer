import { motion } from 'framer-motion'
import type { Player } from '../api/types'
import { AttributeBar } from './AttributeBar'

const POSITION_COLORS: Record<string, string> = {
  GK: '#F59E0B',
  DEF: '#3B82F6',
  ATT: '#EF4444',
  JOKER: '#A855F7',
}

interface Props {
  player: Player
  selected?: boolean
  onSelect?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

function calcOvr(p: Player) {
  return p.overall ?? Math.round((p.pace + p.shoot + p.pass + p.skill + p.physical) / 5)
}

export function PlayerCard({ player, selected, onSelect, onEdit, onDelete }: Props) {
  const ovr = calcOvr(player)
  const posColor = POSITION_COLORS[player.bestPosition] ?? '#6B7280'
  const isSelectable = !!onSelect

  return (
    <motion.div
      onClick={onSelect}
      className={`relative bg-gradient-to-b from-card-bg to-navy border rounded-xl p-3 cursor-default select-none transition-shadow duration-200 ${
        isSelectable ? 'cursor-pointer' : ''
      } ${selected ? 'border-accent glow-accent' : 'border-white/10 hover:border-white/30'}`}
      whileHover={{ scale: 1.03 }}
      whileTap={isSelectable ? { scale: 0.97 } : {}}
    >
      {/* Selected checkmark */}
      {selected && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
          <span className="text-navy text-xs font-bold">✓</span>
        </div>
      )}

      {/* Header row */}
      <div className="flex items-start justify-between mb-2">
        <span
          className="text-xs font-barlow font-bold px-1.5 py-0.5 rounded text-white"
          style={{ backgroundColor: posColor }}
        >
          {player.bestPosition}
        </span>
        <span className="text-3xl font-bebas text-chalk leading-none">{ovr}</span>
      </div>

      {/* Name */}
      <div className="text-center mb-2">
        <p className="font-bebas text-lg text-chalk tracking-widest leading-tight">
          {player.name}
        </p>
      </div>

      {/* Attributes */}
      <div className="space-y-1">
        <AttributeBar label="PAC" value={player.pace} />
        <AttributeBar label="SHO" value={player.shoot} />
        <AttributeBar label="PAS" value={player.pass} />
        <AttributeBar label="SKI" value={player.skill} />
        <AttributeBar label="PHY" value={player.physical} />
      </div>

      {/* Action buttons (shown on hover) */}
      {(onEdit || onDelete) && (
        <div className="absolute inset-x-0 bottom-0 opacity-0 hover:opacity-100 flex gap-1 p-2 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl transition-opacity">
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit() }}
              className="flex-1 text-xs bg-surface border border-white/20 rounded py-1 text-chalk/70 hover:text-accent hover:border-accent transition"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete() }}
              className="flex-1 text-xs bg-surface border border-white/20 rounded py-1 text-chalk/70 hover:text-red-400 hover:border-red-400 transition"
            >
              Del
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}
