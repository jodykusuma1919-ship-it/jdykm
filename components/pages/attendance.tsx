'use client'

import { useState } from 'react'
import { allMembers } from '@/lib/data'
import { canRecordAttendance, canViewReports, CURRENT_USER_ROLE, getRoleColor } from '@/lib/roles'

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

function RecordAttendanceModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [eventName, setEventName] = useState('')
  const [eventType, setEventType] = useState('Raid')
  const [selectedMembers, setSelectedMembers] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  if (!isOpen) return null

  const filteredMembers = allMembers.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleMember = (id: number) => {
    setSelectedMembers(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    )
  }

  const selectAll = () => {
    setSelectedMembers(filteredMembers.map(m => m.id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would save the attendance record
    onClose()
    setEventName('')
    setSelectedMembers([])
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b border-primary/15">
          <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
            ✅ Record Attendance
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-5 space-y-4 border-b border-primary/15">
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5">Event Name</label>
              <input
                type="text"
                value={eventName}
                onChange={e => setEventName(e.target.value)}
                placeholder="Enter event name..."
                className="w-full bg-white/4 border border-primary/20 rounded-xl py-2.5 px-4 text-foreground text-sm font-sans outline-none transition-all duration-200 focus:border-primary focus:shadow-[0_0_10px_rgba(124,58,237,0.3)] placeholder:text-muted-foreground/50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5">Event Type</label>
              <select
                value={eventType}
                onChange={e => setEventType(e.target.value)}
                className="w-full bg-white/4 border border-primary/20 rounded-xl py-2.5 px-4 text-foreground text-sm font-sans outline-none cursor-pointer transition-all duration-200 focus:border-primary focus:shadow-[0_0_10px_rgba(124,58,237,0.3)]"
              >
                <option value="Raid">Raid</option>
                <option value="Guild War">Guild War</option>
                <option value="Dungeon">Dungeon</option>
                <option value="World Boss">World Boss</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="p-4 border-b border-primary/15">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-muted-foreground">Select Attendees ({selectedMembers.length})</label>
              <button type="button" onClick={selectAll} className="text-xs text-primary-light hover:underline">
                Select All
              </button>
            </div>
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white/4 border border-primary/20 rounded-lg py-2 px-3 text-foreground text-sm outline-none focus:border-primary/50"
            />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {filteredMembers.slice(0, 30).map(member => (
              <button
                key={member.id}
                type="button"
                onClick={() => toggleMember(member.id)}
                className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors text-left ${
                  selectedMembers.includes(member.id) 
                    ? 'bg-primary/20 border border-primary/40' 
                    : 'hover:bg-white/5'
                }`}
              >
                <div className={`w-5 h-5 rounded border flex items-center justify-center text-xs ${
                  selectedMembers.includes(member.id) 
                    ? 'bg-primary border-primary text-white' 
                    : 'border-muted-foreground/30'
                }`}>
                  {selectedMembers.includes(member.id) && '✓'}
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-indigo-600/30 flex items-center justify-center text-sm">
                  {member.class.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground text-sm truncate">{member.name}</div>
                  <div className="text-[10px] text-muted-foreground">{member.class.name}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="p-4 border-t border-primary/15 flex gap-3">
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
              Save Attendance
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function MonthlyReportModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null

  const topAttenders = [...allMembers].sort((a, b) => b.att - a.att).slice(0, 5)
  const lowAttenders = [...allMembers].sort((a, b) => a.att - b.att).slice(0, 5)

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b border-primary/15 flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
            📊 Monthly Report - May 2026
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground">
            ✕
          </button>
        </div>
        
        <div className="p-5 space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4 max-sm:grid-cols-2">
            <div className="bg-white/3 border border-primary/15 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-accent">87%</div>
              <div className="text-xs text-muted-foreground">Avg Attendance</div>
            </div>
            <div className="bg-white/3 border border-primary/15 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-foreground">28</div>
              <div className="text-xs text-muted-foreground">Total Events</div>
            </div>
            <div className="bg-white/3 border border-primary/15 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-gold">215</div>
              <div className="text-xs text-muted-foreground">Perfect Records</div>
            </div>
            <div className="bg-white/3 border border-primary/15 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-destructive">12</div>
              <div className="text-xs text-muted-foreground">Low Attendance</div>
            </div>
          </div>

          {/* Top Attenders */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="text-accent">🏆</span> Top Attenders
            </h3>
            <div className="space-y-2">
              {topAttenders.map((m, i) => (
                <div key={m.id} className="flex items-center gap-3 p-2 bg-accent/5 border border-accent/20 rounded-lg">
                  <span className="text-xs font-bold text-gold w-5">#{i + 1}</span>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/30 to-indigo-600/30 flex items-center justify-center text-sm">
                    {m.class.icon}
                  </div>
                  <span className="flex-1 font-semibold text-foreground text-sm">{m.name}</span>
                  <span className="text-accent font-bold text-sm">{m.att}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Low Attenders */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="text-destructive">⚠</span> Needs Improvement
            </h3>
            <div className="space-y-2">
              {lowAttenders.map((m) => (
                <div key={m.id} className="flex items-center gap-3 p-2 bg-destructive/5 border border-destructive/20 rounded-lg">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/30 to-indigo-600/30 flex items-center justify-center text-sm">
                    {m.class.icon}
                  </div>
                  <span className="flex-1 font-semibold text-foreground text-sm">{m.name}</span>
                  <span className="text-destructive font-bold text-sm">{m.att}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-primary/15">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl border-none cursor-pointer font-sans text-sm font-bold tracking-wide transition-all duration-200 bg-gradient-to-br from-primary to-indigo-600 text-white shadow-[0_4px_15px_rgba(124,58,237,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(124,58,237,0.5)]"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  )
}

export function AttendancePage() {
  const attLeaders = [...allMembers].sort((a, b) => b.att - a.att).slice(0, 10)
  const [showRecordModal, setShowRecordModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  
  const canRecord = canRecordAttendance()
  const canReport = canViewReports()

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-[26px] font-bold text-foreground flex items-center gap-3">
            <span className="text-2xl">✅</span> Attendance Tracker
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground">Your Role:</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${getRoleColor(CURRENT_USER_ROLE)}`}>
              {CURRENT_USER_ROLE}
            </span>
          </div>
        </div>
        <div className="flex gap-2.5">
          <button 
            onClick={() => canReport && setShowReportModal(true)}
            disabled={!canReport}
            className={`inline-flex items-center gap-2 py-2.5 px-4 rounded-xl font-sans text-sm font-bold tracking-wide transition-all duration-200 whitespace-nowrap ${
              canReport 
                ? 'cursor-pointer bg-transparent text-primary-light border border-primary/40 hover:bg-primary/15 hover:border-primary' 
                : 'cursor-not-allowed opacity-50 bg-transparent text-muted-foreground border border-muted-foreground/20'
            }`}
          >
            📊 Monthly Report
          </button>
          <button 
            onClick={() => canRecord && setShowRecordModal(true)}
            disabled={!canRecord}
            className={`inline-flex items-center gap-2 py-2.5 px-4 rounded-xl border-none font-sans text-sm font-bold tracking-wide transition-all duration-200 whitespace-nowrap ${
              canRecord 
                ? 'cursor-pointer bg-gradient-to-br from-primary to-indigo-600 text-white shadow-[0_4px_15px_rgba(124,58,237,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(124,58,237,0.5)]' 
                : 'cursor-not-allowed opacity-50 bg-muted-foreground/30 text-muted-foreground'
            }`}
          >
            + Record Attendance
          </button>
        </div>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-4 gap-4 mb-7 max-md:grid-cols-2 max-sm:grid-cols-1">
        <WidgetCard icon="✅" value="87%" label="Weekly Average" glowColor="bg-accent" />
        <WidgetCard icon="🏆" value="215" label="Perfect Attendance" glowColor="bg-primary" />
        <WidgetCard icon="❌" value="12" label="Absent Members" glowColor="bg-destructive" />
        <WidgetCard icon="📅" value="28" label="Events This Month" glowColor="bg-gold" />
      </div>

      {/* Attendance Leaderboard */}
      <div className="bg-card backdrop-blur-xl border border-border rounded-2xl overflow-hidden">
        <div className="p-4 px-6 border-b border-primary/10 text-sm font-bold text-foreground">
          🏅 Attendance Leaderboard — May 2026
        </div>
        {attLeaders.map((m, i) => {
          const rankClass = i === 0 ? 'text-gold drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' : i === 1 ? 'text-slate-200' : i === 2 ? 'text-amber-700' : 'text-muted-foreground/70'
          const barColor = m.att >= 80 ? 'bg-gradient-to-r from-accent to-green-300' : m.att >= 60 ? 'bg-gradient-to-r from-gold to-amber-400' : 'bg-gradient-to-r from-destructive to-red-400'

          return (
            <div key={m.id} className="flex items-center gap-3.5 p-3 px-5 border-b border-primary/7 transition-colors hover:bg-primary/6 last:border-b-0">
              <div className={`font-mono text-sm font-bold w-6 text-center ${rankClass}`}>{i + 1}</div>
              <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-[15px] shrink-0">
                {m.class.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-bold text-foreground">{m.name}</div>
                <div className="text-[11px] text-muted-foreground">{m.role} · {m.class.name}</div>
              </div>
              <div className="flex items-center gap-2 min-w-[120px]">
                <div className="flex-1 h-1 bg-white/7 rounded overflow-hidden">
                  <div className={`h-full rounded transition-all duration-800 ${barColor}`} style={{ width: `${m.att}%` }} />
                </div>
                <span className="text-xs font-bold text-foreground min-w-8">{m.att}%</span>
              </div>
            </div>
          )
        })}
      </div>

      <RecordAttendanceModal isOpen={showRecordModal} onClose={() => setShowRecordModal(false)} />
      <MonthlyReportModal isOpen={showReportModal} onClose={() => setShowReportModal(false)} />
    </div>
  )
}
