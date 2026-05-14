import { useNavigate } from 'react-router-dom'
import type { Match } from '../api/types'
import { motion } from 'framer-motion'

interface Props {
  match: Match
  tribeId: string
}

export function MatchCard({ match, tribeId }: Props) {
  const navigate = useNavigate()
  const isConfirmed = match.status === 'confirmed'

  return (
    <motion.div
      onClick={() => navigate(`/tribes/${tribeId}/matches/${match.id}`)}
      className="bg-card-bg border border-white/10 rounded-xl p-4 cursor-pointer hover:border-white/30 transition-colors"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-bebas text-xl text-chalk">{match.date}</span>
        <span
          className={`text-xs font-barlow font-bold px-2 py-0.5 rounded-full border ${
            isConfirmed
              ? 'bg-accent/10 text-accent border-accent/40'
              : 'bg-white/5 text-chalk/40 border-white/10'
          }`}
        >
          {isConfirmed ? 'CONFIRMED' : 'DRAFT'}
        </span>
      </div>
      {isConfirmed && match.teamA.length > 0 && (
        <div className="grid grid-cols-2 gap-2 text-xs font-barlow text-chalk/60">
          <div>
            <p className="text-accent font-semibold mb-0.5">Team A</p>
            {match.teamA.slice(0, 3).map((p) => (
              <p key={p.id}>{p.name}</p>
            ))}
            {match.teamA.length > 3 && <p>+{match.teamA.length - 3} more</p>}
          </div>
          <div>
            <p className="text-gold font-semibold mb-0.5">Team B</p>
            {match.teamB.slice(0, 3).map((p) => (
              <p key={p.id}>{p.name}</p>
            ))}
            {match.teamB.length > 3 && <p>+{match.teamB.length - 3} more</p>}
          </div>
        </div>
      )}
      {match.notes && (
        <p className="text-chalk/30 text-xs font-barlow mt-2 truncate">{match.notes}</p>
      )}
    </motion.div>
  )
}
