'use client'

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

export function AttendancePage() {
  const attLeaders = [...allMembers].sort((a, b) => b.att - a.att).slice(0, 10)

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="font-serif text-[26px] font-bold text-foreground flex items-center gap-3">
          <span className="text-2xl">✅</span> Attendance Tracker
        </h1>
        <div className="flex gap-2.5">
          <button className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl cursor-pointer font-sans text-sm font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-transparent text-primary-light border border-primary/40 hover:bg-primary/15 hover:border-primary">
            📊 Monthly Report
          </button>
          <button className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl border-none cursor-pointer font-sans text-sm font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-gradient-to-br from-primary to-indigo-600 text-white shadow-[0_4px_15px_rgba(124,58,237,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(124,58,237,0.5)]">
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
    </div>
  )
}
