import { motion } from 'framer-motion'
import type { Player } from '../api/types'
import { PlayerCardMini } from './PlayerCardMini'

interface Props {
  teamA: Player[]
  teamB: Player[]
  subA?: Player | null
  subB?: Player | null
}

function distribute(players: Player[]): { x: number; y: number }[] {
  const n = players.length
  if (n === 0) return []
  // Evenly distribute along 20%-80% y range, x = 20% (left side)
  return players.map((_, i) => ({
    x: 20,
    y: 20 + (i * 60) / Math.max(n - 1, 1),
  }))
}

export function PitchView({ teamA, teamB, subA, subB }: Props) {
  const posA = distribute(teamA)
  const posB = distribute(teamB).map((p) => ({ x: 80, y: p.y }))

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-white/10" style={{ aspectRatio: '16/9' }}>
      {/* Pitch SVG background */}
      <svg
        viewBox="0 0 640 360"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Grass */}
        <rect width="640" height="360" fill="#1a4a28" />
        {/* Grass stripes */}
        {Array.from({ length: 8 }).map((_, i) => (
          <rect
            key={i}
            x={i * 80}
            y="0"
            width="80"
            height="360"
            fill={i % 2 === 0 ? '#1a4a28' : '#1d5230'}
          />
        ))}
        {/* Outer boundary */}
        <rect x="10" y="10" width="620" height="340" fill="none" stroke="white" strokeWidth="2" opacity="0.6" />
        {/* Half way line */}
        <line x1="320" y1="10" x2="320" y2="350" stroke="white" strokeWidth="2" opacity="0.6" />
        {/* Center circle */}
        <circle cx="320" cy="180" r="50" fill="none" stroke="white" strokeWidth="2" opacity="0.6" />
        <circle cx="320" cy="180" r="3" fill="white" opacity="0.6" />
        {/* Left penalty area */}
        <rect x="10" y="100" width="80" height="160" fill="none" stroke="white" strokeWidth="2" opacity="0.6" />
        {/* Left goal */}
        <rect x="10" y="145" width="20" height="70" fill="none" stroke="white" strokeWidth="2" opacity="0.6" />
        {/* Right penalty area */}
        <rect x="550" y="100" width="80" height="160" fill="none" stroke="white" strokeWidth="2" opacity="0.6" />
        {/* Right goal */}
        <rect x="610" y="145" width="20" height="70" fill="none" stroke="white" strokeWidth="2" opacity="0.6" />
      </svg>

      {/* Team A players */}
      {teamA.map((player, i) => {
        const pos = posA[i]
        if (!pos) return null
        return (
          <motion.div
            key={player.id}
            className="absolute"
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.05, type: 'spring', stiffness: 200 }}
          >
            <PlayerCardMini player={player} team="A" />
          </motion.div>
        )
      })}

      {/* Team B players */}
      {teamB.map((player, i) => {
        const pos = posB[i]
        if (!pos) return null
        return (
          <motion.div
            key={player.id}
            className="absolute"
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.05, type: 'spring', stiffness: 200 }}
          >
            <PlayerCardMini player={player} team="B" />
          </motion.div>
        )
      })}

      {/* Subs label */}
      {(subA || subB) && (
        <div className="absolute bottom-1 inset-x-0 flex justify-around px-4">
          {subA && (
            <div className="opacity-60">
              <PlayerCardMini player={subA} team="A" />
            </div>
          )}
          {subB && (
            <div className="opacity-60">
              <PlayerCardMini player={subB} team="B" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
