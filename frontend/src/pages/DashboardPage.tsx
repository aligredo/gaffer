import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTribes, createTribe } from '../api/tribes'
import { TribeCard } from '../components/TribeCard'
import { Modal } from '../components/Modal'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { motion } from 'framer-motion'

export function DashboardPage() {
  const qc = useQueryClient()
  const { data: tribes, isLoading } = useQuery({ queryKey: ['tribes'], queryFn: getTribes })
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', schedule: '' })

  const mutation = useMutation({
    mutationFn: () => createTribe(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tribes'] })
      setShowModal(false)
      setForm({ name: '', description: '', schedule: '' })
    },
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-bebas text-5xl text-chalk tracking-widest">YOUR TRIBES</h1>
        <Button onClick={() => setShowModal(true)}>CREATE TRIBE</Button>
      </div>

      {isLoading ? (
        <div className="text-chalk/40 font-barlow">Loading...</div>
      ) : tribes && tribes.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.07 } },
            hidden: {},
          }}
        >
          {tribes.map((tribe) => (
            <motion.div
              key={tribe.id}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            >
              <TribeCard tribe={tribe} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-24 text-chalk/30">
          <p className="font-bebas text-4xl mb-2">No tribes yet</p>
          <p className="font-barlow">Create your first tribe to get started</p>
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="CREATE TRIBE">
        <form
          onSubmit={(e) => { e.preventDefault(); mutation.mutate() }}
          className="space-y-4"
        >
          <Input label="Tribe Name" value={form.name} onChange={set('name')} required />
          <Input label="Description" value={form.description} onChange={set('description')} />
          <Input label="Schedule" placeholder="e.g. Every Sunday 5pm" value={form.schedule} onChange={set('schedule')} />
          <Button type="submit" variant="primary" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? 'Creating...' : 'CREATE'}
          </Button>
        </form>
      </Modal>
    </div>
  )
}
