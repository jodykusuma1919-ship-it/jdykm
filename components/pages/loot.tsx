'use client'

import { useState, useEffect } from 'react'
import type { Page } from '@/app/page'
import { auctions } from '@/lib/data'

interface LootPageProps {
  onNavigate: (page: Page) => void
}

function AuctionCard({ auction, onBid }: { auction: typeof auctions[0]; onBid: () => void }) {
  const [time, setTime] = useState(auction.timeRemaining)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => Math.max(0, t - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  return (
    <div className="bg-card backdrop-blur-xl border border-gold/25 rounded-2xl p-5 relative overflow-hidden">
      <div className="absolute top-3 right-3 bg-destructive/90 text-white text-[9px] font-bold tracking-[2px] py-0.5 px-2 rounded animate-pulse-glow">
        LIVE
      </div>
      <div className="font-serif text-base font-bold text-gold mb-1">{auction.icon} {auction.name}</div>
      <div className="text-xs text-muted-foreground mb-4">{auction.type}</div>
      
      {/* Bid counter row */}
      <div className="flex items-center gap-2 bg-primary/7 border border-primary/15 rounded-lg p-2 px-3 mb-2.5 flex-wrap">
        <span className="text-[11px] text-muted-foreground/70 font-semibold mr-1 whitespace-nowrap">Bids:</span>
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((_, i) => (
            <div 
              key={i} 
              className={`w-[22px] h-[22px] rounded-md border flex items-center justify-center text-[11px] transition-all duration-200 ${i === 0 ? 'bg-primary border-primary text-white font-bold' : 'bg-primary/8 border-primary/35 text-muted-foreground/70'}`}
            >
              {i + 1}
            </div>
          ))}
        </div>
        <span className="ml-auto text-[10px] font-bold tracking-[1px] py-0.5 px-2 rounded uppercase bg-accent/12 text-accent border border-accent/25">
          2 LEFT
        </span>
      </div>

      <div className="flex flex-col gap-1.5 max-h-[120px] overflow-y-auto">
        {auction.bids.map((bid, i) => (
          <div 
            key={i} 
            className={`flex items-center justify-between p-1.5 px-2.5 rounded-[7px] text-xs font-semibold ${i === 0 ? 'border-gold/35 bg-gold/8' : 'bg-white/3 border border-primary/10'}`}
          >
            <span className="text-foreground">{bid.icon} {bid.user}</span>
            <span className="text-gold font-mono text-[11px]">{bid.dkp} DKP</span>
            <span className="text-muted-foreground/70 text-[10px]">{bid.time}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-3.5 items-center">
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
          ⏱ <span className="font-mono text-gold font-bold">{formatTime(time)}</span> remaining
        </div>
        <button 
          onClick={onBid}
          className="ml-auto inline-flex items-center gap-2 py-1.5 px-3.5 rounded-lg border-none cursor-pointer font-sans text-xs font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-gradient-to-br from-primary to-indigo-600 text-white shadow-[0_4px_15px_rgba(124,58,237,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(124,58,237,0.5)]"
        >
          Place Bid
        </button>
      </div>
    </div>
  )
}

export function LootPage({ onNavigate }: LootPageProps) {
  const lootHistory = [
    { icon: '🗡', type: 'AUCTION WIN', text: '<b>Karath</b> won <span class="hl">Bloodmoon Greaves</span> for <span class="gold">290 DKP</span>', time: 'Yesterday' },
    { icon: '🧝', type: 'ROLL WIN', text: '<b>Lyrath</b> won <span class="hl">Timespace Fragment ×3</span> with roll <span class="green">97</span>', time: '2 days ago' },
    { icon: '⚔', type: 'AUCTION WIN', text: '<b>Valdris</b> won <span class="hl">Soulreaper Ring</span> for <span class="gold">520 DKP</span>', time: '3 days ago' },
  ]

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="font-serif text-[26px] font-bold text-foreground flex items-center gap-3">
          <span className="text-2xl">⚡</span> Loot Management
        </h1>
        <div className="flex gap-2.5">
          <button className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl cursor-pointer font-sans text-sm font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-transparent text-primary-light border border-primary/40 hover:bg-primary/15 hover:border-primary">
            📜 Loot History
          </button>
          <button className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl border-none cursor-pointer font-sans text-sm font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-gradient-to-br from-primary to-indigo-600 text-white shadow-[0_4px_15px_rgba(124,58,237,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(124,58,237,0.5)]">
            + New Auction
          </button>
        </div>
      </div>

      {/* Bid Limit Banner */}
      <div className="flex items-center gap-3.5 flex-wrap bg-primary/8 border border-primary/25 rounded-xl p-3 px-5 mb-5">
        <div className="flex items-center gap-2 text-[13px] font-bold text-primary-light">
          🔨 Bid Limit Rule:
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold bg-primary/18 border border-primary/30 text-primary-light">
            Main <span className="font-mono text-[13px] text-white bg-primary rounded-xl py-0.5 px-1.5 ml-0.5">3</span>
          </span>
          <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold bg-primary/18 border border-primary/30 text-primary-light">
            Fragment <span className="font-mono text-[13px] text-white bg-primary rounded-xl py-0.5 px-1.5 ml-0.5">3</span>
          </span>
          <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold bg-primary/18 border border-primary/30 text-primary-light">
            Timespace <span className="font-mono text-[13px] text-white bg-primary rounded-xl py-0.5 px-1.5 ml-0.5">3</span>
          </span>
        </div>
        <button onClick={() => onNavigate('settings')} className="ml-auto text-xs text-primary-light cursor-pointer underline whitespace-nowrap">
          ⚙ Edit Rule
        </button>
      </div>

      {/* Active status */}
      <div className="text-[13px] text-muted-foreground mb-4 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse-glow" />
        3 active auctions in progress
      </div>

      {/* Auction Grid */}
      <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
        {auctions.map(auction => (
          <AuctionCard key={auction.id} auction={auction} onBid={() => {}} />
        ))}

        {/* Loot History Card */}
        <div className="bg-card backdrop-blur-xl border border-border rounded-2xl overflow-hidden">
          <div className="p-4 px-6 border-b border-primary/10 text-sm font-bold text-foreground">
            📜 Recent Loot History
          </div>
          {lootHistory.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3.5 px-6 border-b border-primary/6 transition-colors hover:bg-primary/5 last:border-b-0">
              <div className="w-9 h-9 rounded-full shrink-0 bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-base">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold tracking-[1px] py-0.5 px-2 rounded mb-1 inline-block uppercase bg-primary/15 text-primary-light">
                  {item.type}
                </span>
                <div 
                  className="text-[13px] text-muted-foreground leading-relaxed [&_b]:text-foreground [&_b]:font-bold [&_.hl]:text-primary-light [&_.gold]:text-gold [&_.green]:text-accent"
                  dangerouslySetInnerHTML={{ __html: item.text }}
                />
                <div className="text-[11px] text-muted-foreground/60 mt-0.5">{item.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
