'use client'

import type { Page } from '@/app/page'
import { defaultGuildEvents } from '@/lib/data'
import type { GuildEvent } from '@/lib/data'
import { useState } from 'react'
import { canScheduleEvents, canEditAllSettings } from '@/lib/roles'
import type { GuildRole } from '@/lib/roles'
import { useGuildSettings } from '@/contexts/guild-settings-context'

interface EventsPageProps {
  onNavigate: (page: Page) => void
  userRole: GuildRole
}

function EventRow({ 
  event, 
  onRecordAttendance,
  currentUserAttended
}: { 
  event: GuildEvent
  onRecordAttendance: (eventId: number) => void
  currentUserAttended: boolean
}) {
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
      <div className="flex gap-1.5 shrink-0 items-center flex-wrap">
        <span className="text-[11px] text-muted-foreground/70 whitespace-nowrap">
          <span className="text-accent font-bold">{event.rsvp.confirmed}</span>/{event.rsvp.total}
        </span>
        {currentUserAttended ? (
          <span className="inline-flex items-center gap-1 py-1.5 px-3 rounded-lg text-xs font-bold bg-accent/15 text-accent border border-accent/30">
            ✓ Attended
          </span>
        ) : (
          <button 
            onClick={() => onRecordAttendance(event.id)}
            className="inline-flex items-center gap-2 py-1.5 px-3 rounded-lg border-none cursor-pointer font-sans text-xs font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-gradient-to-br from-accent to-green-600 text-white shadow-[0_4px_15px_rgba(34,197,94,0.25)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(34,197,94,0.4)]"
          >
            ✓ Record Attendance
          </button>
        )}
      </div>
    </div>
  )
}

function ScheduleEventModal({ 
  isOpen, 
  onClose,
  onSchedule 
}: { 
  isOpen: boolean
  onClose: () => void
  onSchedule: (event: GuildEvent) => void
}) {
  const [eventName, setEventName] = useState('')
  const [eventType, setEventType] = useState<'RAID' | 'PVP' | 'MEETING' | 'OTHER'>('RAID')
  const [eventDate, setEventDate] = useState('')
  const [eventTime, setEventTime] = useState('')
  const [eventDetails, setEventDetails] = useState('')
  const [dkpReward, setDkpReward] = useState('100')
  const [maxAttendance, setMaxAttendance] = useState(25)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const [year, month, day] = eventDate.split('-').map(Number)
    const newEvent: GuildEvent = {
      id: Date.now(),
      name: eventName,
      type: eventType,
      date: new Date(year, month - 1, day),
      time: eventTime,
      details: eventDetails || 'No details provided',
      rsvp: { confirmed: 0, total: maxAttendance },
      dkpReward: parseInt(dkpReward) || 0,
      attendees: [],
    }
    
    onSchedule(newEvent)
    onClose()
    setEventName('')
    setEventType('RAID')
    setEventDate('')
    setEventTime('')
    setEventDetails('')
    setDkpReward('100')
    setMaxAttendance(25)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-card border border-border rounded-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b border-primary/15">
          <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
            📅 Schedule Event
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">Event Name</label>
            <input
              type="text"
              value={eventName}
              onChange={e => setEventName(e.target.value)}
              placeholder="e.g., Dragon Lair Heroic"
              className="w-full bg-white/4 border border-primary/20 rounded-xl py-2.5 px-4 text-foreground text-sm font-sans outline-none transition-all duration-200 focus:border-primary focus:shadow-[0_0_10px_rgba(124,58,237,0.3)] placeholder:text-muted-foreground/50"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">Event Type</label>
            <select
              value={eventType}
              onChange={e => setEventType(e.target.value as 'RAID' | 'PVP' | 'MEETING' | 'OTHER')}
              className="w-full bg-white/4 border border-primary/20 rounded-xl py-2.5 px-4 text-foreground text-sm font-sans outline-none cursor-pointer transition-all duration-200 focus:border-primary focus:shadow-[0_0_10px_rgba(124,58,237,0.3)]"
            >
              <option value="RAID">Raid</option>
              <option value="PVP">PvP</option>
              <option value="MEETING">Meeting</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5">Date</label>
              <input
                type="date"
                value={eventDate}
                onChange={e => setEventDate(e.target.value)}
                className="w-full bg-white/4 border border-primary/20 rounded-xl py-2.5 px-4 text-foreground text-sm font-sans outline-none transition-all duration-200 focus:border-primary focus:shadow-[0_0_10px_rgba(124,58,237,0.3)]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5">Time</label>
              <input
                type="time"
                value={eventTime}
                onChange={e => setEventTime(e.target.value)}
                className="w-full bg-white/4 border border-primary/20 rounded-xl py-2.5 px-4 text-foreground text-sm font-sans outline-none transition-all duration-200 focus:border-primary focus:shadow-[0_0_10px_rgba(124,58,237,0.3)]"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">Details</label>
            <input
              type="text"
              value={eventDetails}
              onChange={e => setEventDetails(e.target.value)}
              placeholder="e.g., Full clear attempt, bring consumables"
              className="w-full bg-white/4 border border-primary/20 rounded-xl py-2.5 px-4 text-foreground text-sm font-sans outline-none transition-all duration-200 focus:border-primary focus:shadow-[0_0_10px_rgba(124,58,237,0.3)] placeholder:text-muted-foreground/50"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">Max Attendance (1-100)</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMaxAttendance(prev => Math.max(1, prev - 1))}
                className="w-10 h-10 rounded-xl border border-primary/30 bg-primary/10 text-foreground font-bold flex items-center justify-center transition-all cursor-pointer hover:bg-primary/30 hover:border-primary text-lg"
              >-</button>
              <span className="font-mono text-xl font-bold text-primary-light min-w-12 text-center">{maxAttendance}</span>
              <button
                type="button"
                onClick={() => setMaxAttendance(prev => Math.min(100, prev + 1))}
                className="w-10 h-10 rounded-xl border border-primary/30 bg-primary/10 text-foreground font-bold flex items-center justify-center transition-all cursor-pointer hover:bg-primary/30 hover:border-primary text-lg"
              >+</button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">DKP Reward for Attendance</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDkpReward(prev => String(Math.max(0, parseInt(prev) - 10)))}
                className="w-10 h-10 rounded-xl border border-gold/30 bg-gold/10 text-foreground font-bold flex items-center justify-center transition-all cursor-pointer hover:bg-gold/30 hover:border-gold text-lg"
              >-</button>
              <span className="font-mono text-xl font-bold text-gold min-w-16 text-center">{dkpReward}</span>
              <button
                type="button"
                onClick={() => setDkpReward(prev => String(Math.min(9999, parseInt(prev) + 10)))}
                className="w-10 h-10 rounded-xl border border-gold/30 bg-gold/10 text-foreground font-bold flex items-center justify-center transition-all cursor-pointer hover:bg-gold/30 hover:border-gold text-lg"
              >+</button>
            </div>
            <div className="text-[10px] text-muted-foreground/70 mt-1">Increments of 10</div>
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
              Schedule Event
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function DkpAwardedToast({ show, dkpAmount }: { show: boolean; dkpAmount: number }) {
  if (!show) return null
  
  return (
    <div className="fixed bottom-6 right-6 bg-accent/90 text-white py-3 px-5 rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 z-50">
      <span className="text-xl">💎</span>
      <div>
        <div className="font-bold text-sm">Attendance Recorded!</div>
        <div className="text-xs opacity-90">+{dkpAmount} DKP added to your account</div>
      </div>
    </div>
  )
}

export function EventsPage({ onNavigate, userRole }: EventsPageProps) {
  const canSchedule = canScheduleEvents(userRole)
  const canEditSettings = canEditAllSettings(userRole)
  const [filter, setFilter] = useState('')
  const [showScheduleEvent, setShowScheduleEvent] = useState(false)
  const { settings } = useGuildSettings()
  const [events, setEvents] = useState<GuildEvent[]>(defaultGuildEvents)
  const [attendedEvents, setAttendedEvents] = useState<number[]>([])
  const [showDkpToast, setShowDkpToast] = useState(false)
  const [lastDkpReward, setLastDkpReward] = useState(0)
  
  const filteredEvents = filter 
    ? events.filter(e => e.type === filter)
    : events

  const totalDkp = events.reduce((sum, e) => sum + e.dkpReward, 0)

  const handleScheduleEvent = async (newEvent: GuildEvent) => {
    setEvents(prev => [newEvent, ...prev].sort((a, b) => a.date.getTime() - b.date.getTime()))
    
    // Post to Discord if webhook is configured
    if (settings.discord.webhookUrl) {
      try {
        await fetch('/api/discord', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newEvent.name,
            type: newEvent.type,
            date: newEvent.date.toISOString(),
            time: newEvent.time,
            details: newEvent.details,
            dkpReward: newEvent.dkpReward,
            maxAttendance: newEvent.rsvp.total,
            webhookUrl: settings.discord.webhookUrl,
          }),
        })
      } catch (error) {
        console.error('Failed to post to Discord:', error)
      }
    }
  }

  const handleRecordAttendance = (eventId: number) => {
    const event = events.find(e => e.id === eventId)
    if (!event) return

    // Mark as attended
    setAttendedEvents(prev => [...prev, eventId])
    
    // Update event RSVP
    setEvents(prev => prev.map(e => 
      e.id === eventId 
        ? { ...e, rsvp: { ...e.rsvp, confirmed: e.rsvp.confirmed + 1 } }
        : e
    ))

    // Show DKP toast
    if (event.dkpReward > 0) {
      setLastDkpReward(event.dkpReward)
      setShowDkpToast(true)
      setTimeout(() => setShowDkpToast(false), 4000)
    }
  }

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
          {canSchedule && (
            <button 
              onClick={() => setShowScheduleEvent(true)}
              className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl border-none cursor-pointer font-sans text-sm font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-gradient-to-br from-primary to-indigo-600 text-white shadow-[0_4px_15px_rgba(124,58,237,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(124,58,237,0.5)]"
            >
              + Schedule Event
            </button>
          )}
        </div>
      </div>

      {/* DKP Auto-Award Banner */}
      <div className="flex items-center gap-3 flex-wrap bg-gold/7 border border-gold/20 rounded-xl p-3 px-5 mb-5">
        <span className="text-lg">💎</span>
        <div>
          <div className="text-[13px] font-bold text-gold">Auto DKP on Attendance</div>
          <div className="text-xs text-muted-foreground">Each member who clicks <b className="text-foreground">Record Attendance</b> on an event will automatically receive the event&apos;s DKP reward.</div>
        </div>
        {canEditSettings && (
          <button onClick={() => onNavigate('settings')} className="ml-auto inline-flex items-center gap-2 py-1.5 px-3 rounded-lg cursor-pointer font-sans text-xs font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-transparent text-gold border border-gold/40 hover:bg-gold/15 hover:border-gold">
            ⚙ Change Amount
          </button>
        )}
      </div>

      {/* Layout */}
      <div className="grid grid-cols-[1fr_320px] gap-5 max-md:grid-cols-1">
        {/* Events List */}
        <div className="bg-card backdrop-blur-xl border border-border rounded-2xl overflow-hidden">
          <div className="p-4 px-6 border-b border-primary/10 flex items-center justify-between">
            <div className="text-sm font-bold text-foreground">📆 Upcoming Events ({filteredEvents.length})</div>
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
          {filteredEvents.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <div className="text-3xl mb-2">📅</div>
              <div className="text-sm">No events scheduled</div>
              <div className="text-xs mt-1">Click &quot;+ Schedule Event&quot; to create one</div>
            </div>
          ) : (
            filteredEvents.map(event => (
              <EventRow 
                key={event.id} 
                event={event} 
                onRecordAttendance={handleRecordAttendance}
                currentUserAttended={attendedEvents.includes(event.id)}
              />
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-3.5">
              <div className="text-xl mb-1">📅</div>
              <div className="font-mono text-xl font-bold text-foreground">{events.length}</div>
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

      <ScheduleEventModal 
        isOpen={showScheduleEvent} 
        onClose={() => setShowScheduleEvent(false)} 
        onSchedule={handleScheduleEvent}
      />
      
      <DkpAwardedToast show={showDkpToast} dkpAmount={lastDkpReward} />
    </div>
  )
}
