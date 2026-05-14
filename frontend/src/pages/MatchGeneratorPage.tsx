import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPlayers } from '../api/players'
import { createMatch, generateTeams, confirmMatch } from '../api/matches'
import type { Match } from '../api/types'
import { PlayerCard } from '../components/PlayerCard'
import { TeamResult } from '../components/TeamResult'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

type Step = 1 | 2 | 3

export function MatchGeneratorPage() {
  const { id: tribeId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const [step, setStep] = useState<Step>(1)
  const [matchId, setMatchId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [preview, setPreview] = useState<Match | null>(null)
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = useState('')

  const { data: players } = useQuery({
    queryKey: ['players', tribeId!],
    queryFn: () => getPlayers(tribeId!),
  })

  const createMutation = useMutation({
    mutationFn: () => createMatch(tribeId!, { date, notes }),
    onSuccess: (m) => {
      setMatchId(m.id)
      setStep(2)
    },
  })

  const generateMutation = useMutation({
    mutationFn: (ids: string[]) => generateTeams(tribeId!, matchId!, ids),
    onSuccess: (result) => {
      setPreview(result)
      setStep(3)
    },
  })

  const confirmMutation = useMutation({
    mutationFn: () => confirmMatch(tribeId!, matchId!, Array.from(selectedIds)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['matches', tribeId!] })
      navigate(`/tribes/${tribeId}`)
    },
  })

  const togglePlayer = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const count = selectedIds.size
  const validCount = count === 10 || count === 12
  const showWarning = count >= 8 && !validCount

  const handleGenerate = () => {
    generateMutation.mutate(Array.from(selectedIds))
  }

  const handleRegenerate = () => {
    generateMutation.mutate(Array.from(selectedIds))
  }

  return (
    <div>
      <button
        onClick={() => navigate(`/tribes/${tribeId}`)}
        className="text-chalk/40 hover:text-chalk text-sm font-barlow mb-4 flex items-center gap-1 transition"
      >
        ← Back to tribe
      </button>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bebas transition-colors ${
                step >= s ? 'bg-accent text-navy' : 'bg-white/10 text-chalk/40'
              }`}
            >
              {s}
            </div>
            {s < 3 && <div className={`w-8 h-px ${step > s ? 'bg-accent' : 'bg-white/10'}`} />}
          </div>
        ))}
        <span className="ml-2 font-bebas text-xl text-chalk/60 tracking-widest">
          {step === 1 ? 'MATCH DETAILS' : step === 2 ? 'SELECT PLAYERS' : 'TEAMS'}
        </span>
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="max-w-sm">
          <form
            onSubmit={(e) => { e.preventDefault(); createMutation.mutate() }}
            className="space-y-4"
          >
            <Input
              label="Match Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm text-chalk/70 font-barlow tracking-wide uppercase">
                Notes (optional)
              </label>
              <textarea
                className="bg-surface border border-white/10 rounded px-3 py-2 text-chalk font-barlow focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any notes about the match..."
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Creating...' : 'NEXT →'}
            </Button>
          </form>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span
                className={`font-bebas text-2xl ${validCount ? 'text-accent' : 'text-chalk/60'}`}
              >
                {count}
              </span>
              <span className="font-barlow text-chalk/40 ml-1">/ 10–12 players selected</span>
            </div>
            <Button
              variant="primary"
              onClick={handleGenerate}
              disabled={!validCount || generateMutation.isPending}
            >
              {generateMutation.isPending ? 'Generating...' : 'GENERATE TEAMS'}
            </Button>
          </div>

          {showWarning && (
            <div className="mb-4 bg-amber-900/30 border border-amber-500/50 rounded-lg p-3 text-amber-400 text-sm font-barlow">
              ⚠ Select exactly 10 or 12 players to generate balanced teams
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {players?.map((p) => (
              <PlayerCard
                key={p.id}
                player={p}
                selected={selectedIds.has(p.id)}
                onSelect={() => togglePlayer(p.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && preview && (
        <TeamResult
          teamA={preview.teamA}
          teamB={preview.teamB}
          subA={preview.subA}
          subB={preview.subB}
          balanceDelta={preview.balanceDelta}
          warnings={preview.warnings}
          onRegenerate={handleRegenerate}
          onConfirm={() => confirmMutation.mutate()}
          isConfirming={confirmMutation.isPending}
          isRegenerating={generateMutation.isPending}
        />
      )}
    </div>
  )
}
