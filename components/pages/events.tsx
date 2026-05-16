'use client'

import type { Page } from '@/app/page'
import { guildEvents } from '@/lib/data'
import { useState } from 'react'

interface EventsPageProps {
  onNavigate: (page: Page) => void
}

function EventRow({ event }: { event: typeof guildEvents[0] }) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  const badgeStyles: Record<string, string> = {
    RAID: 'bg-destructive/15 text-red-400 border border-destructive/20',
    PVP: 'bg-gold/15 text-gold border border-gold/20',
    MEETING: 'bg-blue/15 text-blue border border-blue/20',
    OTHER: 'bg-muted/15 text-muted-foreground border border-muted/20',
  }

  return (
    <div className="flex items-center gap-3.5 p-4 px-5 border-b border-primary/7 transition-colors hover:bg-primary/6 last:border-b-0">
      <div className="flex flex-col items-center w-[46px] shrink-0">
        <div className="font-mono text-xl font-bold text-foreground leading-none">{event.date.getDate()}</div>
        <div className="text-[10px] text-muted-foreground/70 font-bold tracking-[1px] uppercase">{months[event.date.getMonth()]}</div>
      </div>
      <div className="w-0.5 h-11 bg-primary/25 rounded shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-foreground flex items-center gap-2 flex-wrap">
          {event.name}
          <span className={`text-[10px] font-bold py-0.5 px-2 rounded ${badgeStyles[event.type]}`}>{event.type}</span>
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">{event.time} · {event.details}</div>
        {event.dkpReward > 0 && (
          <div className="text-[11px] text-gold font-bold mt-1 flex items-center gap-1">
            💎 +{event.dkpReward} DKP on attendance
          </div>
        )}
      </div>
      <div className="flex gap-1.5 shrink-0 items-center">
        <span className="text-[11px] text-muted-foreground/70 whitespace-nowrap">
          <span className="text-accent font-bold">{event.rsvp.confirmed}</span>/{event.rsvp.total}
        </span>
        <button className="inline-flex items-center gap-2 py-1.5 px-3 rounded-lg border-none cursor-pointer font-sans text-xs font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-gradient-to-br from-accent to-green-600 text-white shadow-[0_4px_15px_rgba(34,197,94,0.25)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(34,197,94,0.4)]">
          ✓ RSVP
        </button>
      </div>
    </div>
  )
}

export function EventsPage({ onNavigate }: EventsPageProps) {
  const [filter, setFilter] = useState('')
  
  const filteredEvents = filter 
    ? guildEvents.filter(e => e.type === filter)
    : guildEvents

  const totalDkp = guildEvents.reduce((sum, e) => sum + e.dkpReward, 0)

  const eventHistory = [
    { icon: '⚔', type: 'RAID COMPLETE', text: '<b>Dragon Lair Heroic</b> — Cleared 3h24m · <span class="gold">14 items</span>', time: 'May 10' },
    { icon: '⚔', type: 'RAID WIPE', text: '<b>Abyssal Citadel</b> — 6/8 bosses cleared', time: 'May 8' },
    { icon: '🏹', type: 'PVP WIN', text: '<b>Territory Wars</b> — +3 territories captured', time: 'May 7' },
    { icon: '✨', type: 'DKP AWARDED', text: '<span class="gold">+100 DKP</span> auto-awarded to <b>18 members</b> (Dragon Lair attendance)', time: 'May 10' },
  ]

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="font-serif text-[26px] font-bold text-foreground flex items-center gap-3">
          <span className="text-2xl">📅</span> Events & Raids
        </h1>
        <div className="flex gap-2.5 items-center">
          <div className="flex items-center gap-1.5 py-1.5 px-3.5 bg-gold/10 border border-gold/25 rounded-full text-xs font-bold text-gold">
            💎 Att. DKP: <span>100</span> pts
          </div>
          <button className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl border-none cursor-pointer font-sans text-sm font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-gradient-to-br from-primary to-indigo-600 text-white shadow-[0_4px_15px_rgba(124,58,237,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(124,58,237,0.5)]">
            + Schedule Event
          </button>
        </div>
      </div>

      {/* DKP Auto-Award Banner */}
      <div className="flex items-center gap-3 flex-wrap bg-gold/7 border border-gold/20 rounded-xl p-3 px-5 mb-5">
        <span className="text-lg">💎</span>
        <div>
          <div className="text-[13px] font-bold text-gold">Auto DKP on Attendance</div>
          <div className="text-xs text-muted-foreground">Each member who clicks <b className="text-foreground">Mark Attendance</b> on an event will automatically receive <b className="text-foreground">100</b> DKP.</div>
        </div>
        <button onClick={() => onNavigate('settings')} className="ml-auto inline-flex items-center gap-2 py-1.5 px-3 rounded-lg cursor-pointer font-sans text-xs font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-transparent text-gold border border-gold/40 hover:bg-gold/15 hover:border-gold">
          ⚙ Change Amount
        </button>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-[1fr_320px] gap-5 max-md:grid-cols-1">
        {/* Events List */}
        <div className="bg-card backdrop-blur-xl border border-border rounded-2xl overflow-hidden">
          <div className="p-4 px-6 border-b border-primary/10 flex items-center justify-between">
            <div className="text-sm font-bold text-foreground">📆 Upcoming Events</div>
            <select 
              value={filter} 
              onChange={e => setFilter(e.target.value)}
              className="bg-white/4 border border-primary/20 rounded-xl py-2 px-3 text-foreground text-[13px] font-sans font-semibold outline-none cursor-pointer transition-all duration-200 min-w-[110px] focus:border-primary focus:shadow-[0_0_10px_rgba(124,58,237,0.3)]"
            >
              <option value="">All Types</option>
              <option value="RAID">Raid</option>
              <option value="PVP">PvP</option>
              <option value="MEETING">Meeting</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          {filteredEvents.map(event => (
            <EventRow key={event.id} event={event} />
          ))}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-3.5">
              <div className="text-xl mb-1">📅</div>
              <div className="font-mono text-xl font-bold text-foreground">{guildEvents.length}</div>
              <div className="text-[11px] text-muted-foreground/70">Upcoming</div>
            </div>
            <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-3.5">
              <div className="text-xl mb-1">💎</div>
              <div className="font-mono text-xl font-bold text-gold">{totalDkp}</div>
              <div className="text-[11px] text-muted-foreground/70">DKP up for grabs</div>
            </div>
          </div>

          {/* History */}
          <div className="bg-card backdrop-blur-xl border border-border rounded-2xl overflow-hidden flex-1">
            <div className="p-4 px-6 border-b border-primary/10 text-sm font-bold text-foreground">
              📋 Event History
            </div>
            {eventHistory.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 px-6 border-b border-primary/6 transition-colors hover:bg-primary/5 last:border-b-0">
                <div className="w-9 h-9 rounded-full shrink-0 bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-base">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`text-[10px] font-bold tracking-[1px] py-0.5 px-2 rounded mb-1 inline-block uppercase ${item.type.includes('DKP') ? 'bg-gold/15 text-gold' : 'bg-blue/15 text-blue'}`}>
                    {item.type}
                  </span>
                  <div 
                    className="text-[13px] text-muted-foreground leading-relaxed [&_b]:text-foreground [&_b]:font-bold [&_.gold]:text-gold"
                    dangerouslySetInnerHTML={{ __html: item.text }}
                  />
                  <div className="text-[11px] text-muted-foreground/60 mt-0.5">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
