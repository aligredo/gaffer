import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getMatch } from '../api/matches'
import { TeamResult } from '../components/TeamResult'

export function MatchDetailPage() {
  const { id: tribeId, mid } = useParams<{ id: string; mid: string }>()
  const navigate = useNavigate()

  const { data: match, isLoading } = useQuery({
    queryKey: ['match', tribeId!, mid!],
    queryFn: () => getMatch(tribeId!, mid!),
  })

  if (isLoading) {
    return <div className="text-chalk/40 font-barlow p-8">Loading...</div>
  }

  if (!match) {
    return <div className="text-red-400 font-barlow p-8">Match not found</div>
  }

  return (
    <div>
      <button
        onClick={() => navigate(`/tribes/${tribeId}`)}
        className="text-chalk/40 hover:text-chalk text-sm font-barlow mb-4 flex items-center gap-1 transition"
      >
        ← Back to tribe
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-bebas text-4xl text-chalk tracking-widest">
          Match — {match.date}
        </h1>
        <span
          className={`text-xs font-barlow font-bold px-3 py-1 rounded-full border ${
            match.status === 'confirmed'
              ? 'bg-accent/10 text-accent border-accent/40'
              : 'bg-white/5 text-chalk/40 border-white/10'
          }`}
        >
          {match.status.toUpperCase()}
        </span>
      </div>

      {match.status === 'confirmed' ? (
        <TeamResult
          teamA={match.teamA}
          teamB={match.teamB}
          subA={match.subA}
          subB={match.subB}
          balanceDelta={match.balanceDelta}
          warnings={match.warnings}
          readOnly
        />
      ) : (
        <div className="text-chalk/40 font-barlow text-center py-12">
          <p>This match is a draft. Go back to continue generating teams.</p>
        </div>
      )}
    </div>
  )
}
