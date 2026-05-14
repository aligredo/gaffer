import type { Player } from '../api/types'
import { PitchView } from './PitchView'
import { Button } from './ui/Button'

interface Props {
  teamA: Player[]
  teamB: Player[]
  subA?: Player | null
  subB?: Player | null
  balanceDelta?: number
  warnings?: string[]
  readOnly?: boolean
  onRegenerate?: () => void
  onConfirm?: () => void
  isConfirming?: boolean
  isRegenerating?: boolean
}

function avg(players: Player[]) {
  if (!players.length) return 0
  return (
    players.reduce((s, p) => {
      const ovr = p.overall ?? Math.round((p.pace + p.shoot + p.pass + p.skill + p.physical) / 5)
      return s + ovr
    }, 0) / players.length
  )
}

export function TeamResult({
  teamA,
  teamB,
  subA,
  subB,
  balanceDelta,
  warnings = [],
  readOnly,
  onRegenerate,
  onConfirm,
  isConfirming,
  isRegenerating,
}: Props) {
  const avgA = avg(teamA)
  const avgB = avg(teamB)
  const maxAvg = Math.max(avgA, avgB, 1)

  return (
    <div className="space-y-6">
      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-3 space-y-1">
          {warnings.map((w, i) => (
            <p key={i} className="text-amber-400 text-sm font-barlow">
              ⚠ {w}
            </p>
          ))}
        </div>
      )}

      {/* Balance bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-barlow text-chalk/60">
          <span>TEAM A — {avgA.toFixed(1)} OVR</span>
          <span>Balance: ±{(balanceDelta ?? Math.abs(avgA - avgB)).toFixed(1)} OVR</span>
          <span>TEAM B — {avgB.toFixed(1)} OVR</span>
        </div>
        <div className="flex h-2 rounded-full overflow-hidden bg-white/10">
          <div
            className="h-full bg-accent transition-all duration-500"
            style={{ width: `${(avgA / maxAvg) * 50}%` }}
          />
          <div
            className="h-full bg-gold transition-all duration-500 ml-auto"
            style={{ width: `${(avgB / maxAvg) * 50}%` }}
          />
        </div>
      </div>

      {/* Pitch */}
      <PitchView teamA={teamA} teamB={teamB} subA={subA} subB={subB} />

      {/* Side-by-side rosters */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <h3 className="font-bebas text-xl text-accent tracking-widest">Team A</h3>
          {teamA.map((p) => {
            const ovr = p.overall ?? Math.round((p.pace + p.shoot + p.pass + p.skill + p.physical) / 5)
            return (
              <div
                key={p.id}
                className="flex items-center justify-between px-2 py-1 rounded bg-accent/5 border border-accent/20 text-sm font-barlow"
              >
                <span className="text-chalk">{p.name}</span>
                <span className="text-accent font-semibold">{ovr}</span>
              </div>
            )
          })}
          {subA && (
            <div className="flex items-center justify-between px-2 py-1 rounded bg-accent/5 border border-accent/10 text-xs font-barlow opacity-60">
              <span className="text-chalk">↳ {subA.name} (sub)</span>
            </div>
          )}
        </div>
        <div className="space-y-1">
          <h3 className="font-bebas text-xl text-gold tracking-widest">Team B</h3>
          {teamB.map((p) => {
            const ovr = p.overall ?? Math.round((p.pace + p.shoot + p.pass + p.skill + p.physical) / 5)
            return (
              <div
                key={p.id}
                className="flex items-center justify-between px-2 py-1 rounded bg-gold/5 border border-gold/20 text-sm font-barlow"
              >
                <span className="text-chalk">{p.name}</span>
                <span className="text-gold font-semibold">{ovr}</span>
              </div>
            )
          })}
          {subB && (
            <div className="flex items-center justify-between px-2 py-1 rounded bg-gold/5 border border-gold/10 text-xs font-barlow opacity-60">
              <span className="text-chalk">↳ {subB.name} (sub)</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      {!readOnly && (
        <div className="flex gap-3 justify-end">
          {onRegenerate && (
            <Button
              variant="secondary"
              onClick={onRegenerate}
              disabled={isRegenerating}
            >
              {isRegenerating ? 'Generating...' : 'REGENERATE'}
            </Button>
          )}
          {onConfirm && (
            <Button
              variant="primary"
              onClick={onConfirm}
              disabled={isConfirming}
            >
              {isConfirming ? 'Saving...' : 'CONFIRM & SAVE'}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
