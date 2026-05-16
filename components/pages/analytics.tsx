'use client'

function BarChart({ data, color1, color2 }: { data: number[]; color1: string; color2: string }) {
  const max = Math.max(...data)
  const labels = ['Apr W1', 'W2', 'W3', 'W4', 'May W1', 'W2', 'W3', 'W4', '', '', '', '']

  return (
    <div className="flex items-end gap-1.5 h-[120px]">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="text-[9px] font-bold" style={{ color: color2 }}>{v}</div>
          <div 
            className="w-full rounded-t transition-all duration-800 opacity-85"
            style={{ 
              height: `${(v / max * 100)}px`,
              background: `linear-gradient(to top, ${color1}, ${color2})`,
            }}
          />
          <div className="text-[10px] text-muted-foreground/70 font-semibold text-center">{labels[i] || ''}</div>
        </div>
      ))}
    </div>
  )
}

function ProgressBar({ label, value, colorClass }: { label: string; value: number; colorClass: string }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs font-bold text-foreground">{value}%</span>
      </div>
      <div className="h-2 bg-white/7 rounded overflow-hidden">
        <div className={`h-full rounded ${colorClass}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

export function AnalyticsPage() {
  const attData = [72, 78, 81, 75, 84, 87, 90, 85, 88, 92, 87, 85]
  const dkpData = [820, 940, 780, 1100, 960, 1240, 880, 1050, 1200, 980, 1300, 1150]
  const growthData = [210, 215, 218, 220, 224, 228, 230, 233, 236, 240, 244, 247]

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="font-serif text-[26px] font-bold text-foreground flex items-center gap-3">
          <span className="text-2xl">📊</span> Analytics
        </h1>
        <div className="flex gap-2.5">
          <select className="bg-white/4 border border-primary/20 rounded-xl py-2.5 px-3.5 text-foreground text-[13px] font-sans font-semibold outline-none cursor-pointer transition-all duration-200 min-w-[130px] focus:border-primary focus:shadow-[0_0_10px_rgba(124,58,237,0.3)]">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-5 mb-5 max-md:grid-cols-1">
        <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-6">
          <div className="text-sm font-bold text-foreground mb-5 flex items-center gap-2">
            📈 Weekly Attendance Rate
          </div>
          <BarChart data={attData} color1="#22c55e" color2="#86efac" />
          <div className="flex justify-between mt-2">
            <span className="text-[11px] text-muted-foreground/70">Week 1</span>
            <span className="text-[11px] text-muted-foreground/70">Week 4</span>
          </div>
        </div>

        <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-6">
          <div className="text-sm font-bold text-foreground mb-5 flex items-center gap-2">
            💎 DKP Distribution
          </div>
          <BarChart data={dkpData} color1="#7c3aed" color2="#9d5cf6" />
          <div className="flex justify-between mt-2">
            <span className="text-[11px] text-muted-foreground/70">Apr W1</span>
            <span className="text-[11px] text-muted-foreground/70">May W4</span>
          </div>
        </div>

        <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-6">
          <div className="text-sm font-bold text-foreground mb-5 flex items-center gap-2">
            👥 Member Growth
          </div>
          <BarChart data={growthData} color1="#3b82f6" color2="#60a5fa" />
        </div>

        <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-6">
          <div className="text-sm font-bold text-foreground mb-5 flex items-center gap-2">
            ⚡ Loot by Category
          </div>
          <div className="flex flex-col gap-3 mt-2">
            <ProgressBar label="Weapons" value={34} colorClass="bg-gradient-to-r from-accent to-green-300" />
            <ProgressBar label="Armor" value={28} colorClass="bg-gradient-to-r from-gold to-amber-400" />
            <ProgressBar label="Accessories" value={22} colorClass="bg-gradient-to-r from-accent to-green-300" />
            <ProgressBar label="Fragments" value={16} colorClass="bg-gradient-to-r from-destructive to-red-400" />
          </div>
        </div>
      </div>
    </div>
  )
}
