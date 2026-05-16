'use client'

import { recruits } from '@/lib/data'
import { useState } from 'react'

export function RecruitmentPage() {
  const [applications, setApplications] = useState(recruits)

  const handleAccept = (name: string) => {
    setApplications(apps => apps.filter(a => a.name !== name))
    // Could show a toast here
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="font-serif text-[26px] font-bold text-foreground flex items-center gap-3">
          <span className="text-2xl">📋</span> Recruitment
        </h1>
        <div className="flex gap-2.5">
          <button className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl cursor-pointer font-sans text-sm font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-transparent text-primary-light border border-primary/40 hover:bg-primary/15 hover:border-primary">
            ⚙ Manage Requirements
          </button>
          <button className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl border-none cursor-pointer font-sans text-sm font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-gradient-to-br from-accent to-green-600 text-white shadow-[0_4px_15px_rgba(34,197,94,0.25)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(34,197,94,0.4)]">
            ✅ Quick Accept
          </button>
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <span className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full text-xs font-bold bg-accent/15 text-accent border border-accent/30">
          {applications.length} Pending Applications
        </span>
        <span className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full text-xs font-bold bg-muted-foreground/15 text-muted-foreground border border-muted-foreground/30">
          Looking for: Tank, Healer
        </span>
      </div>

      {/* Application Cards */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-4">
        {applications.map(recruit => (
          <div key={recruit.id} className="bg-card backdrop-blur-xl border border-border rounded-2xl p-5 transition-all duration-200 hover:border-primary/40 hover:-translate-y-0.5">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3.5">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-[22px]">
                {recruit.clsIcon}
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-bold text-foreground">{recruit.name}</div>
                <div className="text-xs text-muted-foreground">{recruit.cls} · {recruit.role}</div>
              </div>
              <div className="text-[11px] text-muted-foreground/70">{recruit.date}</div>
            </div>

            {/* Application Text */}
            <div className="text-[13px] text-muted-foreground leading-relaxed mb-3.5">
              {recruit.app}
            </div>

            {/* Stats */}
            <div className="flex gap-3 flex-wrap mb-3.5">
              <div className="bg-white/3 border border-primary/10 rounded-lg py-2 px-3 text-xs">
                <div className="text-muted-foreground/70 mb-0.5">Gear Score</div>
                <div className="font-bold text-cyan">{recruit.gs}</div>
              </div>
              <div className="bg-white/3 border border-primary/10 rounded-lg py-2 px-3 text-xs">
                <div className="text-muted-foreground/70 mb-0.5">Experience</div>
                <div className="font-bold text-foreground">{recruit.raids}</div>
              </div>
              <div className="bg-white/3 border border-primary/10 rounded-lg py-2 px-3 text-xs">
                <div className="text-muted-foreground/70 mb-0.5">Att. Rate</div>
                <div className="font-bold text-accent">{recruit.att}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button 
                onClick={() => handleAccept(recruit.name)}
                className="inline-flex items-center gap-2 py-2 px-3.5 rounded-lg border-none cursor-pointer font-sans text-xs font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-gradient-to-br from-accent to-green-600 text-white shadow-[0_4px_15px_rgba(34,197,94,0.25)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(34,197,94,0.4)]"
              >
                ✅ Accept
              </button>
              <button className="inline-flex items-center gap-2 py-2 px-3.5 rounded-lg cursor-pointer font-sans text-xs font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-transparent text-primary-light border border-primary/40 hover:bg-primary/15 hover:border-primary">
                💬 Interview
              </button>
              <button className="inline-flex items-center gap-2 py-2 px-3.5 rounded-lg cursor-pointer font-sans text-xs font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-gradient-to-br from-destructive to-red-700 text-white hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(239,68,68,0.4)]">
                ✕ Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
