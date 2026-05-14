import { useNavigate } from 'react-router-dom'
import type { Tribe } from '../api/types'
import { motion } from 'framer-motion'

interface Props {
  tribe: Tribe
}

export function TribeCard({ tribe }: Props) {
  const navigate = useNavigate()
  return (
    <motion.div
      onClick={() => navigate(`/tribes/${tribe.id}`)}
      className="bg-card-bg border border-white/10 rounded-xl p-5 cursor-pointer hover:border-accent/50 transition-colors"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-bebas text-2xl text-chalk tracking-widest">{tribe.name}</h3>
        {tribe.playerCount !== undefined && (
          <span className="text-xs bg-accent/10 text-accent border border-accent/30 rounded-full px-2 py-0.5 font-barlow font-semibold">
            {tribe.playerCount} players
          </span>
        )}
      </div>
      {tribe.description && (
        <p className="text-chalk/50 text-sm font-barlow mb-3 line-clamp-2">{tribe.description}</p>
      )}
      <div className="flex gap-4 text-xs font-barlow text-chalk/40">
        {tribe.schedule && <span>📅 {tribe.schedule}</span>}
        {tribe.lastMatchDate && <span>⚽ Last: {tribe.lastMatchDate}</span>}
      </div>
    </motion.div>
  )
}
