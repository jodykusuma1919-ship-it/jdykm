'use client'

import { useState } from 'react'
import { allMembers } from '@/lib/data'

function WidgetCard({ icon, value, label, glowColor }: { 
  icon: string
  value: string | number
  label: string
  glowColor: string
}) {
  return (
    <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-5 relative overflow-hidden cursor-pointer transition-all duration-200 hover:border-primary/50 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]">
      <div className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-[30px] opacity-30 pointer-events-none ${glowColor}`} />
      <div className="relative z-10">
        <div className="text-[28px] mb-3">{icon}</div>
        <div className="font-mono text-[28px] font-bold text-foreground leading-none">{value}</div>
        <div className="text-xs text-muted-foreground/70 font-semibold tracking-wide mt-1.5">{label}</div>
      </div>
    </div>
  )
}

function LeaderboardItem({ rank, member, value, maxValue, type }: {
  rank: number
  member: typeof allMembers[0]
  value: number
  maxValue: number
  type: 'dkp' | 'attendance'
}) {
  const rankClass = rank === 1 ? 'text-gold drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' : rank === 2 ? 'text-slate-200' : rank === 3 ? 'text-amber-700' : 'text-muted-foreground/70'

  return (
    <div className="flex items-center gap-3.5 p-3 px-5 border-b border-primary/7 transition-colors hover:bg-primary/6 last:border-b-0">
      <div className={`font-mono text-sm font-bold w-6 text-center ${rankClass}`}>{rank}</div>
      <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-[15px] shrink-0">
        {member.class.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-bold text-foreground">{member.name}</div>
        <div className="text-[11px] text-muted-foreground">{member.role}</div>
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <div className={`font-mono text-sm font-bold ${type === 'dkp' ? 'text-gold' : 'text-foreground'}`}>
          {type === 'dkp' ? value.toLocaleString() : `${value}%`}
        </div>
        <div className="w-[70px] h-[3px] bg-white/7 rounded">
          <div 
            className={`h-full rounded ${type === 'dkp' ? 'bg-gradient-to-r from-gold to-amber-400' : 'bg-gradient-to-r from-accent to-green-300'}`} 
            style={{ width: `${(value / maxValue * 100).toFixed(0)}%` }} 
          />
        </div>
      </div>
    </div>
  )
}

function AddDkpModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [actionType, setActionType] = useState<'award' | 'deduct'>('award')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would add the DKP logic
    onClose()
    setSelectedMembers([])
    setAmount('')
    setReason('')
    setActionType('award')
  }

  const toggleMember = (id: string) => {
    setSelectedMembers(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    )
  }

  const selectAll = () => {
    setSelectedMembers(allMembers.map(m => m.id))
  }

  const clearAll = () => {
    setSelectedMembers([])
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-card border border-border rounded-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b border-primary/15">
          <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
            💎 Add / Deduct DKP
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {/* Action Type Toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActionType('award')}
              className={`flex-1 py-2 px-4 rounded-xl font-sans text-sm font-bold tracking-wide transition-all duration-200 ${actionType === 'award' ? 'bg-accent text-white shadow-[0_4px_15px_rgba(34,197,94,0.35)]' : 'bg-white/5 text-muted-foreground border border-white/15 hover:bg-white/10'}`}
            >
              + Award DKP
            </button>
            <button
              type="button"
              onClick={() => setActionType('deduct')}
              className={`flex-1 py-2 px-4 rounded-xl font-sans text-sm font-bold tracking-wide transition-all duration-200 ${actionType === 'deduct' ? 'bg-destructive text-white shadow-[0_4px_15px_rgba(239,68,68,0.35)]' : 'bg-white/5 text-muted-foreground border border-white/15 hover:bg-white/10'}`}
            >
              − Deduct DKP
            </button>
          </div>

          {/* Member Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-muted-foreground">Select Members</label>
              <div className="flex gap-2">
                <button type="button" onClick={selectAll} className="text-[11px] text-primary-light hover:underline">Select All</button>
                <button type="button" onClick={clearAll} className="text-[11px] text-muted-foreground hover:underline">Clear</button>
              </div>
            </div>
            <div className="max-h-[150px] overflow-y-auto bg-white/3 border border-primary/15 rounded-xl p-2 flex flex-wrap gap-1.5">
              {allMembers.map(member => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => toggleMember(member.id)}
                  className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${selectedMembers.includes(member.id) ? 'bg-primary text-white' : 'bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10'}`}
                >
                  <span>{member.class.icon}</span>
                  {member.name}
                </button>
              ))}
            </div>
            <div className="text-[11px] text-muted-foreground/70 mt-1">{selectedMembers.length} member(s) selected</div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Enter DKP amount..."
              min="1"
              className="w-full bg-white/4 border border-primary/20 rounded-xl py-2.5 px-4 text-foreground text-sm font-sans outline-none transition-all duration-200 focus:border-primary focus:shadow-[0_0_10px_rgba(124,58,237,0.3)] placeholder:text-muted-foreground/50"
              required
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">Reason</label>
            <input
              type="text"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="e.g., Raid attendance, Boss kill bonus..."
              className="w-full bg-white/4 border border-primary/20 rounded-xl py-2.5 px-4 text-foreground text-sm font-sans outline-none transition-all duration-200 focus:border-primary focus:shadow-[0_0_10px_rgba(124,58,237,0.3)] placeholder:text-muted-foreground/50"
              required
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl cursor-pointer font-sans text-sm font-bold tracking-wide transition-all duration-200 bg-transparent text-muted-foreground border border-white/15 hover:bg-white/5 hover:border-white/25"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={selectedMembers.length === 0}
              className={`flex-1 py-2.5 px-4 rounded-xl border-none cursor-pointer font-sans text-sm font-bold tracking-wide transition-all duration-200 text-white disabled:opacity-50 disabled:cursor-not-allowed ${actionType === 'award' ? 'bg-gradient-to-br from-accent to-green-600 shadow-[0_4px_15px_rgba(34,197,94,0.35)] hover:shadow-[0_6px_20px_rgba(34,197,94,0.5)]' : 'bg-gradient-to-br from-destructive to-red-600 shadow-[0_4px_15px_rgba(239,68,68,0.35)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.5)]'} hover:-translate-y-0.5`}
            >
              {actionType === 'award' ? 'Award DKP' : 'Deduct DKP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function DkpPage() {
  const [showAddDkp, setShowAddDkp] = useState(false)
  
  const dkpLeaders = [...allMembers].sort((a, b) => b.dkp - a.dkp).slice(0, 8)
  const maxDkp = dkpLeaders[0]?.dkp || 1

  const dkpLogs = [
    { icon: '⚔', type: 'AWARD', text: '<b>Valdris</b> +<span class="gold">150 DKP</span> — Dragon Lair Completion', time: '2 min ago' },
    { icon: '🧝', type: 'SPEND', text: '<b>Selara</b> -<span class="red">420 DKP</span> — Loot: Fragment Card ×3', time: '8 min ago' },
    { icon: '🛡', type: 'AWARD', text: '<b>Thorgur</b> +<span class="gold">200 DKP</span> — Raid Leader Bonus', time: '1hr ago' },
    { icon: '🧙', type: 'DEDUCT', text: '<b>Miravel</b> -<span class="red">80 DKP</span> — Missed Raid Penalty', time: '3hr ago' },
    { icon: '🏹', type: 'AWARD', text: '<b>Daerith</b> +<span class="gold">100 DKP</span> — Weekly Attendance Bonus', time: 'Yesterday' },
  ]

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="font-serif text-[26px] font-bold text-foreground flex items-center gap-3">
          <span className="text-2xl">💎</span> DKP System
        </h1>
        <div className="flex gap-2.5">
          <button className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl cursor-pointer font-sans text-sm font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-transparent text-primary-light border border-primary/40 hover:bg-primary/15 hover:border-primary">
            📊 Export Logs
          </button>
          <button 
            onClick={() => setShowAddDkp(true)}
            className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl border-none cursor-pointer font-sans text-sm font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-gradient-to-br from-primary to-indigo-600 text-white shadow-[0_4px_15px_rgba(124,58,237,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(124,58,237,0.5)]"
          >
            + Add DKP
          </button>
        </div>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-4 gap-4 mb-7 max-md:grid-cols-2 max-sm:grid-cols-1">
        <WidgetCard icon="💎" value="48,200" label="Total DKP Pool" glowColor="bg-gold" />
        <WidgetCard icon="📈" value="1,240" label="Awarded This Week" glowColor="bg-accent" />
        <WidgetCard icon="📉" value="890" label="Spent This Week" glowColor="bg-destructive" />
        <WidgetCard icon="🔄" value="6" label="Days to Reset" glowColor="bg-primary" />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
        {/* DKP Leaderboard */}
        <div className="bg-card backdrop-blur-xl border border-border rounded-2xl overflow-hidden">
          <div className="p-4 px-6 border-b border-primary/10 text-sm font-bold text-foreground">
            🏆 DKP Leaderboard
          </div>
          {dkpLeaders.map((m, i) => (
            <LeaderboardItem key={m.id} rank={i + 1} member={m} value={m.dkp} maxValue={maxDkp} type="dkp" />
          ))}
        </div>

        {/* Recent DKP Logs */}
        <div className="bg-card backdrop-blur-xl border border-border rounded-2xl overflow-hidden">
          <div className="p-4 px-6 border-b border-primary/10 text-sm font-bold text-foreground">
            📋 Recent DKP Logs
          </div>
          {dkpLogs.map((log, i) => (
            <div key={i} className="flex items-start gap-3 p-3.5 px-6 border-b border-primary/6 transition-colors hover:bg-primary/5 last:border-b-0">
              <div className="w-9 h-9 rounded-full shrink-0 bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-base">
                {log.icon}
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-[10px] font-bold tracking-[1px] py-0.5 px-2 rounded mb-1 inline-block uppercase ${log.type === 'AWARD' ? 'bg-gold/15 text-gold' : log.type === 'SPEND' ? 'bg-primary/15 text-primary-light' : 'bg-destructive/12 text-destructive'}`}>
                  {log.type}
                </span>
                <div 
                  className="text-[13px] text-muted-foreground leading-relaxed [&_b]:text-foreground [&_b]:font-bold [&_.gold]:text-gold [&_.red]:text-destructive"
                  dangerouslySetInnerHTML={{ __html: log.text }}
                />
                <div className="text-[11px] text-muted-foreground/60 mt-0.5">{log.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddDkpModal isOpen={showAddDkp} onClose={() => setShowAddDkp(false)} />
    </div>
  )
}
