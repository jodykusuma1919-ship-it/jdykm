'use client'

import type { Page } from '@/app/page'
import { activityFeed, guildEvents } from '@/lib/data'

interface DashboardPageProps {
  onNavigate: (page: Page) => void
}

function WidgetCard({ icon, value, label, change, changeType, glowColor }: { 
  icon: string
  value: string | number
  label: string
  change: string
  changeType: 'up' | 'down' | 'info'
  glowColor: string
}) {
  return (
    <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-5 relative overflow-hidden cursor-pointer transition-all duration-200 hover:border-primary/50 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] group">
      <div className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-[30px] opacity-30 pointer-events-none ${glowColor}`} />
      <div className="relative z-10">
        <div className="text-[28px] mb-3">{icon}</div>
        <div className="font-mono text-[28px] font-bold text-foreground leading-none">{value}</div>
        <div className="text-xs text-muted-foreground/70 font-semibold tracking-wide mt-1.5">{label}</div>
        <div className={`flex items-center gap-1 text-xs font-bold mt-2 ${changeType === 'up' ? 'text-accent' : changeType === 'down' ? 'text-destructive' : 'text-gold'}`}>
          {change}
        </div>
      </div>
    </div>
  )
}

function FeedItem({ icon, type, text, time }: { icon: string; type: string; text: string; time: string }) {
  const typeStyles: Record<string, string> = {
    DKP: 'bg-gold/15 text-gold',
    LOOT: 'bg-primary/15 text-primary-light',
    JOIN: 'bg-accent/12 text-accent',
    EVENT: 'bg-blue/15 text-blue',
    KICK: 'bg-destructive/12 text-destructive',
  }

  return (
    <div className="flex items-start gap-3 p-3.5 px-6 border-b border-primary/6 transition-colors hover:bg-primary/5 last:border-b-0">
      <div className="w-9 h-9 rounded-full shrink-0 bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-base">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <span className={`text-[10px] font-bold tracking-[1px] py-0.5 px-2 rounded mb-1 inline-block uppercase ${typeStyles[type] || 'bg-muted text-muted-foreground'}`}>
          {type}
        </span>
        <div 
          className="text-[13px] text-muted-foreground leading-relaxed [&_b]:text-foreground [&_b]:font-bold [&_.hl]:text-primary-light [&_.gold]:text-gold"
          dangerouslySetInnerHTML={{ __html: text }}
        />
        <div className="text-[11px] text-muted-foreground/60 mt-0.5">{time}</div>
      </div>
    </div>
  )
}

function EventCard({ day, month, name, type, details, rsvp }: { 
  day: number
  month: string
  name: string
  type: 'RAID' | 'PVP' | 'MEETING' | 'OTHER'
  details: string
  rsvp: { confirmed: number; total: number }
}) {
  const badgeStyles: Record<string, string> = {
    RAID: 'bg-destructive/15 text-red-400 border border-destructive/20',
    PVP: 'bg-gold/15 text-gold border border-gold/20',
    MEETING: 'bg-blue/15 text-blue border border-blue/20',
    OTHER: 'bg-muted/15 text-muted-foreground border border-muted/20',
  }

  return (
    <div className="flex items-center gap-3.5 p-3.5 px-5 border-b border-primary/8 transition-colors hover:bg-primary/6 last:border-b-0">
      <div className="flex flex-col items-center w-11 shrink-0">
        <div className="font-mono text-xl font-bold text-foreground leading-none">{day}</div>
        <div className="text-[10px] text-muted-foreground/70 font-semibold tracking-[1px] uppercase">{month}</div>
      </div>
      <div className="w-0.5 h-10 bg-primary/30 rounded shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <div className="text-[13px] font-bold text-foreground">{name}</div>
          <span className={`text-[10px] font-bold py-0.5 px-2 rounded ${badgeStyles[type]}`}>{type}</span>
        </div>
        <div className="text-[11px] text-muted-foreground">{details}</div>
        <div className="text-[11px] text-muted-foreground/70 mt-1">
          RSVP: <span className="text-accent font-bold">{rsvp.confirmed}/{rsvp.total}</span> confirmed
        </div>
      </div>
    </div>
  )
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="font-serif text-[26px] font-bold text-foreground flex items-center gap-3">
          <span className="text-2xl">⬡</span> Dashboard
        </h1>
        <div className="flex gap-2.5 items-center">
          <div className="flex items-center gap-2 py-1.5 px-3.5 bg-accent/10 border border-accent/25 rounded-full text-xs font-semibold text-accent">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse-glow" />
            Live
          </div>
          <button 
            onClick={() => onNavigate('members')}
            className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl border-none cursor-pointer font-sans text-sm font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-gradient-to-br from-primary to-indigo-600 text-white shadow-[0_4px_15px_rgba(124,58,237,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(124,58,237,0.5)]"
          >
            + Invite Member
          </button>
        </div>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 mb-7">
        <WidgetCard icon="👥" value="247" label="Total Members" change="↑ +3 this week" changeType="up" glowColor="bg-primary" />
        <WidgetCard icon="🟢" value="28" label="Active Now" change="↑ Peak 64 today" changeType="up" glowColor="bg-accent" />
        <WidgetCard icon="✅" value="87%" label="Weekly Attendance" change="↑ +5% vs last week" changeType="up" glowColor="bg-gold" />
        <WidgetCard icon="⚡" value="142" label="Loot Distributed" change="↑ 18 this raid" changeType="up" glowColor="bg-cyan" />
        <WidgetCard icon="🔨" value="3" label="Live Auctions" change="⏱ 14 min left" changeType="info" glowColor="bg-destructive" />
        <WidgetCard icon="📅" value="5" label="Upcoming Events" change="🗓 Next: Tonight" changeType="info" glowColor="bg-blue" />
      </div>

      {/* Activity Grid */}
      <div className="grid grid-cols-[1fr_340px] gap-5 mt-5 max-[900px]:grid-cols-1">
        {/* Activity Feed */}
        <div className="bg-card backdrop-blur-xl border border-border rounded-2xl overflow-hidden">
          <div className="p-4 px-6 border-b border-primary/10 text-sm font-bold text-foreground flex items-center justify-between">
            <span>📡 Live Activity Feed</span>
            <div className="flex items-center gap-1.5 py-0.5 px-2.5 bg-accent/10 border border-accent/25 rounded-full text-[11px] font-semibold text-accent">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse-glow" />
              Realtime
            </div>
          </div>
          {activityFeed.map((item, i) => (
            <FeedItem key={i} icon={item.icon} type={item.type} text={item.text} time={item.time} />
          ))}
        </div>

        {/* Upcoming Events */}
        <div className="bg-card backdrop-blur-xl border border-border rounded-2xl overflow-hidden">
          <div className="p-4 px-6 border-b border-primary/10 text-sm font-bold text-foreground">
            📅 Upcoming Events
          </div>
          {guildEvents.slice(0, 4).map((event) => (
            <EventCard 
              key={event.id}
              day={event.date.getDate()}
              month={months[event.date.getMonth()]}
              name={event.name}
              type={event.type}
              details={`${event.time} · ${event.details}`}
              rsvp={event.rsvp}
            />
          ))}
          <div className="p-3.5 px-5">
            <button 
              onClick={() => onNavigate('events')}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl cursor-pointer font-sans text-sm font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-transparent text-primary-light border border-primary/40 hover:bg-primary/15 hover:border-primary"
            >
              View All Events →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
