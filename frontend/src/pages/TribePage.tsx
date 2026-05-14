import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTribe } from '../api/tribes'
import { getPlayers, createPlayer, updatePlayer, deletePlayer } from '../api/players'
import { getMatches } from '../api/matches'
import type { Player, CreatePlayerRequest, Position } from '../api/types'
import { PlayerCard } from '../components/PlayerCard'
import { MatchCard } from '../components/MatchCard'
import { Modal } from '../components/Modal'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { AttributeSlider } from '../components/AttributeSlider'

const POSITIONS: Position[] = ['GK', 'DEF', 'ATT', 'JOKER']

const defaultStats = (): CreatePlayerRequest => ({
  name: '',
  bestPosition: 'ATT',
  pace: 70,
  shoot: 70,
  pass: 70,
  skill: 70,
  physical: 70,
})

export function TribePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const tribeId = id!

  const [tab, setTab] = useState<'players' | 'matches'>('players')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Player | null>(null)
  const [form, setForm] = useState<CreatePlayerRequest>(defaultStats())

  const { data: tribe } = useQuery({
    queryKey: ['tribe', tribeId],
    queryFn: () => getTribe(tribeId),
  })
  const { data: players } = useQuery({
    queryKey: ['players', tribeId],
    queryFn: () => getPlayers(tribeId),
    enabled: tab === 'players',
  })
  const { data: matches } = useQuery({
    queryKey: ['matches', tribeId],
    queryFn: () => getMatches(tribeId),
    enabled: tab === 'matches',
  })

  const openCreate = () => {
    setEditing(null)
    setForm(defaultStats())
    setShowModal(true)
  }

  const openEdit = (p: Player) => {
    setEditing(p)
    setForm({
      name: p.name,
      bestPosition: p.bestPosition as Position,
      pace: p.pace,
      shoot: p.shoot,
      pass: p.pass,
      skill: p.skill,
      physical: p.physical,
    })
    setShowModal(true)
  }

  const saveMutation = useMutation({
    mutationFn: () =>
      editing
        ? updatePlayer(tribeId, editing.id, form)
        : createPlayer(tribeId, form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['players', tribeId] })
      setShowModal(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (pid: string) => deletePlayer(tribeId, pid),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['players', tribeId] }),
  })

  const setField = <K extends keyof CreatePlayerRequest>(k: K, v: CreatePlayerRequest[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  return (
    <div>
      {/* Back nav */}
      <button
        onClick={() => navigate('/')}
        className="text-chalk/40 hover:text-chalk text-sm font-barlow mb-4 flex items-center gap-1 transition"
      >
        ← Back to tribes
      </button>

      <h1 className="font-bebas text-5xl text-chalk tracking-widest mb-6">
        {tribe?.name ?? '...'}
      </h1>

      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-6 gap-1">
        {(['players', 'matches'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-2 font-bebas text-xl tracking-widest transition-colors ${
              tab === t ? 'text-accent border-b-2 border-accent' : 'text-chalk/40'
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {tab === 'players' && (
        <div>
          <div className="flex justify-end mb-4">
            <Button onClick={openCreate}>ADD PLAYER</Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {players?.map((p) => (
              <PlayerCard
                key={p.id}
                player={p}
                onEdit={() => openEdit(p)}
                onDelete={() => {
                  if (confirm(`Remove ${p.name}?`)) deleteMutation.mutate(p.id)
                }}
              />
            ))}
          </div>
          {players?.length === 0 && (
            <p className="text-chalk/30 font-barlow text-center py-12">No players yet</p>
          )}
        </div>
      )}

      {tab === 'matches' && (
        <div>
          <div className="flex justify-end mb-4">
            <Button onClick={() => navigate(`/tribes/${tribeId}/matches/new`)}>NEW MATCH</Button>
          </div>
          <div className="space-y-3">
            {matches?.map((m) => (
              <MatchCard key={m.id} match={m} tribeId={tribeId} />
            ))}
          </div>
          {matches?.length === 0 && (
            <p className="text-chalk/30 font-barlow text-center py-12">No matches yet</p>
          )}
        </div>
      )}

      {/* Player form modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? 'EDIT PLAYER' : 'ADD PLAYER'}
      >
        <form
          onSubmit={(e) => { e.preventDefault(); saveMutation.mutate() }}
          className="space-y-4"
        >
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setField('name', e.target.value)}
            required
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm text-chalk/70 font-barlow tracking-wide uppercase">Position</label>
            <div className="flex gap-2">
              {POSITIONS.map((pos) => (
                <button
                  key={pos}
                  type="button"
                  onClick={() => setField('bestPosition', pos)}
                  className={`flex-1 py-1.5 rounded text-sm font-barlow font-semibold transition border ${
                    form.bestPosition === pos
                      ? 'border-accent text-accent bg-accent/10'
                      : 'border-white/10 text-chalk/40'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>
          <AttributeSlider label="Pace" value={form.pace} onChange={(v) => setField('pace', v)} />
          <AttributeSlider label="Shoot" value={form.shoot} onChange={(v) => setField('shoot', v)} />
          <AttributeSlider label="Pass" value={form.pass} onChange={(v) => setField('pass', v)} />
          <AttributeSlider label="Skill" value={form.skill} onChange={(v) => setField('skill', v)} />
          <AttributeSlider label="Physical" value={form.physical} onChange={(v) => setField('physical', v)} />

          <Button type="submit" variant="primary" className="w-full" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? 'Saving...' : 'SAVE'}
          </Button>
        </form>
      </Modal>
    </div>
  )
}
