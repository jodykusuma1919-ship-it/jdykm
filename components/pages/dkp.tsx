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

export function DkpPage() {
  const dkpLeaders = [...allMembers].sort((a, b) => b.dkp - a.dkp).slice(0, 8)
  const maxDkp = dkpLeaders[0]?.dkp || 1

  const dkpLogs = [
    { icon: '⚔', type: 'AWARD', text: '<b>Valdris</b> +<span class="gold">150 DKP</span> — Dragon Lair Completion', time: '2 min ago' },
    { icon: '🧝', type: 'SPEND', text: '<b>Selara</b> -<span class="red">420 DKP</span> — Loot: Voidweave Spellcloak', time: '8 min ago' },
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
          <button className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl border-none cursor-pointer font-sans text-sm font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-gradient-to-br from-primary to-indigo-600 text-white shadow-[0_4px_15px_rgba(124,58,237,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(124,58,237,0.5)]">
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
    </div>
  )
}
