'use client'

import { useState } from 'react'
import { getRoleColor } from '@/lib/roles'

// Sample data for current user
const currentUserData = {
  name: 'Thalderin',
  role: 'Guild Master' as const,
  class: { icon: '🧙', name: 'Mage' },
  dkp: 2450,
  weeklyEarned: 320,
  weeklySpent: 150,
  attendance: 94,
  // Remaining bids for each category
  remaining: {
    fragmentCard: 38,
    timespace: 47,
    lnd: 45,
  },
  // Bid limits
  limits: {
    fragmentCard: 40,
    timespace: 50,
    lnd: 50,
  }
}

const dkpHistory = [
  { id: '1', type: 'earn', amount: 150, reason: 'Dragon Lair Raid', date: '2 hours ago' },
  { id: '2', type: 'spend', amount: 420, reason: 'Won Fragment Card x3', date: 'Yesterday' },
  { id: '3', type: 'earn', amount: 100, reason: 'Weekly Attendance Bonus', date: '2 days ago' },
  { id: '4', type: 'earn', amount: 50, reason: 'Event Participation', date: '3 days ago' },
  { id: '5', type: 'spend', amount: 200, reason: 'Won Timespace x2', date: '4 days ago' },
]

function StatCard({ icon, value, label, subLabel, color }: { 
  icon: string
  value: string | number
  label: string
  subLabel?: string
  color: string
}) {
  return (
    <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-5 relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-[30px] opacity-30 pointer-events-none ${color}`} />
      <div className="relative z-10">
        <div className="text-[28px] mb-3">{icon}</div>
        <div className="font-mono text-[28px] font-bold text-foreground leading-none">{value}</div>
        <div className="text-xs text-muted-foreground/70 font-semibold tracking-wide mt-1.5">{label}</div>
        {subLabel && <div className="text-[11px] text-muted-foreground/50 mt-0.5">{subLabel}</div>}
      </div>
    </div>
  )
}

function RemainingBidsCard({ type, icon, remaining, limit, color }: {
  type: string
  icon: string
  remaining: number
  limit: number
  color: string
}) {
  const percentage = (remaining / limit) * 100
  
  return (
    <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <span className="text-sm font-bold text-foreground">{type}</span>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded ${color}`}>
          {remaining}/{limit} Left
        </span>
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-300 ${percentage > 50 ? 'bg-accent' : percentage > 20 ? 'bg-gold' : 'bg-destructive'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-[11px] text-muted-foreground/70 mt-2">
        {limit - remaining} bids used this session
      </div>
    </div>
  )
}

function RequestModal({ isOpen, onClose, type }: { isOpen: boolean; onClose: () => void; type: string }) {
  const [quantity, setQuantity] = useState('1')
  const [note, setNote] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would submit the request
    onClose()
    setQuantity('1')
    setNote('')
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-card border border-border rounded-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b border-primary/15">
          <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
            📋 Request {type}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">Quantity</label>
            <select
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              className="w-full bg-white/4 border border-primary/20 rounded-xl py-2.5 px-4 text-foreground text-sm font-sans outline-none cursor-pointer transition-all duration-200 focus:border-primary focus:shadow-[0_0_10px_rgba(124,58,237,0.3)]"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">Note (Optional)</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Add any additional notes..."
              rows={3}
              className="w-full bg-white/4 border border-primary/20 rounded-xl py-2.5 px-4 text-foreground text-sm font-sans outline-none transition-all duration-200 focus:border-primary focus:shadow-[0_0_10px_rgba(124,58,237,0.3)] placeholder:text-muted-foreground/50 resize-none"
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
              className="flex-1 py-2.5 px-4 rounded-xl border-none cursor-pointer font-sans text-sm font-bold tracking-wide transition-all duration-200 bg-gradient-to-br from-primary to-indigo-600 text-white shadow-[0_4px_15px_rgba(124,58,237,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(124,58,237,0.5)]"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function MyDkpPage() {
  const [requestModal, setRequestModal] = useState<{ open: boolean; type: string }>({ open: false, type: '' })

  const openRequest = (type: string) => {
    setRequestModal({ open: true, type })
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-[26px] font-bold text-foreground flex items-center gap-3">
            <span className="text-2xl">👤</span> My DKP
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-lg">{currentUserData.class.icon}</span>
            <span className="text-sm font-bold text-foreground">{currentUserData.name}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${getRoleColor(currentUserData.role)}`}>
              {currentUserData.role}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-7 max-md:grid-cols-2 max-sm:grid-cols-1">
        <StatCard 
          icon="💎" 
          value={currentUserData.dkp.toLocaleString()} 
          label="Current DKP" 
          color="bg-gold" 
        />
        <StatCard 
          icon="📈" 
          value={`+${currentUserData.weeklyEarned}`} 
          label="Earned This Week" 
          color="bg-accent" 
        />
        <StatCard 
          icon="📉" 
          value={`-${currentUserData.weeklySpent}`} 
          label="Spent This Week" 
          color="bg-destructive" 
        />
        <StatCard 
          icon="✅" 
          value={`${currentUserData.attendance}%`} 
          label="Attendance Rate" 
          color="bg-primary" 
        />
      </div>

      {/* Remaining Bids Section */}
      <div className="mb-7">
        <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          🔨 Your Remaining Bids
          <span className="text-xs font-normal text-muted-foreground">(This Session)</span>
        </h2>
        <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
          <RemainingBidsCard 
            type="Fragment Card" 
            icon="🃏" 
            remaining={currentUserData.remaining.fragmentCard} 
            limit={currentUserData.limits.fragmentCard}
            color="bg-purple-500/20 text-purple-400"
          />
          <RemainingBidsCard 
            type="Timespace" 
            icon="🔮" 
            remaining={currentUserData.remaining.timespace} 
            limit={currentUserData.limits.timespace}
            color="bg-cyan-500/20 text-cyan-400"
          />
          <RemainingBidsCard 
            type="LND" 
            icon="⚡" 
            remaining={currentUserData.remaining.lnd} 
            limit={currentUserData.limits.lnd}
            color="bg-amber-500/20 text-amber-400"
          />
        </div>
      </div>

      {/* Request Items Section */}
      <div className="mb-7">
        <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          📋 Request Items
          <span className="text-xs font-normal text-muted-foreground">(Submit request to guild leadership)</span>
        </h2>
        <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
          <button
            onClick={() => openRequest('Fragment Card')}
            className="bg-card backdrop-blur-xl border border-border rounded-2xl p-5 text-left transition-all duration-200 hover:border-primary/50 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(124,58,237,0.3)]"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-2xl">
                🃏
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">Fragment Card</div>
                <div className="text-xs text-muted-foreground">Request allocation</div>
              </div>
            </div>
            <div className="text-xs text-primary-light flex items-center gap-1">
              Click to request <span className="ml-auto">→</span>
            </div>
          </button>

          <button
            onClick={() => openRequest('LND')}
            className="bg-card backdrop-blur-xl border border-border rounded-2xl p-5 text-left transition-all duration-200 hover:border-primary/50 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(124,58,237,0.3)]"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-2xl">
                ⚡
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">LND</div>
                <div className="text-xs text-muted-foreground">Request allocation</div>
              </div>
            </div>
            <div className="text-xs text-primary-light flex items-center gap-1">
              Click to request <span className="ml-auto">→</span>
            </div>
          </button>

          <button
            onClick={() => openRequest('Timespace')}
            className="bg-card backdrop-blur-xl border border-border rounded-2xl p-5 text-left transition-all duration-200 hover:border-primary/50 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(124,58,237,0.3)]"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-2xl">
                🔮
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">Timespace</div>
                <div className="text-xs text-muted-foreground">Request allocation</div>
              </div>
            </div>
            <div className="text-xs text-primary-light flex items-center gap-1">
              Click to request <span className="ml-auto">→</span>
            </div>
          </button>
        </div>
      </div>

      {/* DKP History */}
      <div className="bg-card backdrop-blur-xl border border-border rounded-2xl overflow-hidden">
        <div className="p-4 px-6 border-b border-primary/10 text-sm font-bold text-foreground flex items-center justify-between">
          <span>📋 Your DKP History</span>
          <button className="text-xs text-primary-light hover:underline">View All</button>
        </div>
        {dkpHistory.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4 px-6 border-b border-primary/6 last:border-b-0 hover:bg-primary/5 transition-colors">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${item.type === 'earn' ? 'bg-accent/20' : 'bg-destructive/20'}`}>
              {item.type === 'earn' ? '📈' : '📉'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-foreground">{item.reason}</div>
              <div className="text-xs text-muted-foreground/70">{item.date}</div>
            </div>
            <div className={`font-mono text-sm font-bold ${item.type === 'earn' ? 'text-accent' : 'text-destructive'}`}>
              {item.type === 'earn' ? '+' : '-'}{item.amount} DKP
            </div>
          </div>
        ))}
      </div>

      <RequestModal 
        isOpen={requestModal.open} 
        onClose={() => setRequestModal({ open: false, type: '' })} 
        type={requestModal.type}
      />
    </div>
  )
}
