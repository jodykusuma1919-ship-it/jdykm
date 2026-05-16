'use client'

import { useState, useEffect } from 'react'
import type { Page } from '@/app/page'
import { auctions } from '@/lib/data'

interface LootPageProps {
  onNavigate: (page: Page) => void
}

// Display setting options (20 - 50 range)
const DISPLAY_OPTIONS = [20, 25, 30, 40, 50] as const
const BIDS_PER_PAGE = 20

// Guild loot inventory remaining
const guildLootRemaining = {
  fragmentCard: { current: 127, total: 200 },
  timespace: { current: 45, total: 100 },
  lnd: { current: 83, total: 150 },
}

function AuctionCard({ auction, onBid }: { auction: typeof auctions[0]; onBid: () => void }) {
  const [time, setTime] = useState(auction.timeRemaining)
  const [currentPage, setCurrentPage] = useState(1)

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

  const totalPages = Math.ceil(auction.bids.length / BIDS_PER_PAGE)
  const startIndex = (currentPage - 1) * BIDS_PER_PAGE
  const visibleBids = auction.bids.slice(startIndex, startIndex + BIDS_PER_PAGE)
  const bidsLeft = Math.max(0, (auction.category === 'fragmentCard' ? 40 : 50) - auction.bids.length)

  return (
    <div className="bg-card backdrop-blur-xl border border-gold/25 rounded-2xl p-5 relative overflow-hidden">
      <div className="absolute top-3 right-3 bg-destructive/90 text-white text-[9px] font-bold tracking-[2px] py-0.5 px-2 rounded animate-pulse-glow">
        LIVE
      </div>
      <div className="font-serif text-base font-bold text-gold mb-1">{auction.icon} {auction.name}</div>
      <div className="text-xs text-muted-foreground mb-4">{auction.type}</div>
      
      {/* Bid counter row with pagination */}
      <div className="flex items-center gap-2 bg-primary/7 border border-primary/15 rounded-lg p-2 px-3 mb-2.5 flex-wrap">
        <span className="text-[11px] text-muted-foreground/70 font-semibold mr-1 whitespace-nowrap">Bids ({auction.bids.length}):</span>
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button 
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-[22px] h-[22px] rounded-md border flex items-center justify-center text-[11px] transition-all duration-200 cursor-pointer ${
                page === currentPage 
                  ? 'bg-primary border-primary text-white font-bold' 
                  : 'bg-primary/8 border-primary/35 text-muted-foreground/70 hover:bg-primary/20'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        <span className="ml-auto text-[10px] font-bold tracking-[1px] py-0.5 px-2 rounded uppercase bg-accent/12 text-accent border border-accent/25">
          {bidsLeft} LEFT
        </span>
      </div>

      <div className="flex flex-col gap-1.5 max-h-[320px] overflow-y-auto">
        {visibleBids.map((bid, i) => {
          const globalIndex = startIndex + i
          return (
            <div 
              key={i} 
              className={`flex items-center justify-between p-1.5 px-2.5 rounded-[7px] text-xs font-semibold ${
                globalIndex === 0 ? 'border-gold/35 bg-gold/8 border' : 'bg-white/3 border border-primary/10'
              }`}
            >
              <span className="text-muted-foreground/60 text-[10px] w-5">#{globalIndex + 1}</span>
              <span className="text-foreground flex-1">{bid.icon} {bid.user}</span>
              <span className="text-gold font-mono text-[11px] mx-2">{bid.dkp} DKP</span>
              <span className="text-muted-foreground/70 text-[10px]">{bid.time}</span>
            </div>
          )
        })}
      </div>

      <div className="flex gap-2 mt-3.5 items-center">
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <span>Showing {startIndex + 1}-{Math.min(startIndex + BIDS_PER_PAGE, auction.bids.length)} of {auction.bids.length}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs ml-auto mr-2">
          <span className="font-mono text-gold font-bold">{formatTime(time)}</span> remaining
        </div>
        <button 
          onClick={onBid}
          className="inline-flex items-center gap-2 py-1.5 px-3.5 rounded-lg border-none cursor-pointer font-sans text-xs font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-gradient-to-br from-primary to-indigo-600 text-white shadow-[0_4px_15px_rgba(124,58,237,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(124,58,237,0.5)]"
        >
          Place Bid
        </button>
      </div>
    </div>
  )
}

function NewAuctionModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [itemName, setItemName] = useState('')
  const [itemType, setItemType] = useState('Fragment Card')
  const [duration, setDuration] = useState('5')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would add the auction logic
    onClose()
    setItemName('')
    setItemType('Fragment Card')
    setDuration('5')
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-card border border-border rounded-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b border-primary/15">
          <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
            ⚡ New Auction
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">Item Name</label>
            <input
              type="text"
              value={itemName}
              onChange={e => setItemName(e.target.value)}
              placeholder="Enter item name..."
              className="w-full bg-white/4 border border-primary/20 rounded-xl py-2.5 px-4 text-foreground text-sm font-sans outline-none transition-all duration-200 focus:border-primary focus:shadow-[0_0_10px_rgba(124,58,237,0.3)] placeholder:text-muted-foreground/50"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">Item Type</label>
            <select
              value={itemType}
              onChange={e => setItemType(e.target.value)}
              className="w-full bg-white/4 border border-primary/20 rounded-xl py-2.5 px-4 text-foreground text-sm font-sans outline-none cursor-pointer transition-all duration-200 focus:border-primary focus:shadow-[0_0_10px_rgba(124,58,237,0.3)]"
            >
              <option value="Fragment Card">Fragment Card</option>
              <option value="Timespace">Timespace</option>
              <option value="LND">LND</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">Duration (minutes)</label>
            <select
              value={duration}
              onChange={e => setDuration(e.target.value)}
              className="w-full bg-white/4 border border-primary/20 rounded-xl py-2.5 px-4 text-foreground text-sm font-sans outline-none cursor-pointer transition-all duration-200 focus:border-primary focus:shadow-[0_0_10px_rgba(124,58,237,0.3)]"
            >
              <option value="2">2 minutes</option>
              <option value="5">5 minutes</option>
              <option value="10">10 minutes</option>
              <option value="15">15 minutes</option>
            </select>
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
              Create Auction
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function LootPage({ onNavigate }: LootPageProps) {
  const [showNewAuction, setShowNewAuction] = useState(false)
  
  const lootHistory = [
    { icon: '🃏', type: 'AUCTION WIN', text: '<b>Karath</b> won <span class="hl">Fragment Card x3</span> for <span class="gold">290 DKP</span>', time: 'Yesterday' },
    { icon: '🔮', type: 'ROLL WIN', text: '<b>Lyrath</b> won <span class="hl">Time Space x3</span> with roll <span class="green">97</span>', time: '2 days ago' },
    { icon: '⚡', type: 'AUCTION WIN', text: '<b>Valdris</b> won <span class="hl">LND Piece</span> for <span class="gold">520 DKP</span>', time: '3 days ago' },
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
          <button 
            onClick={() => setShowNewAuction(true)}
            className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl border-none cursor-pointer font-sans text-sm font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-gradient-to-br from-primary to-indigo-600 text-white shadow-[0_4px_15px_rgba(124,58,237,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(124,58,237,0.5)]"
          >
            + New Auction
          </button>
        </div>
      </div>

      {/* Guild Loot Inventory Remaining */}
      <div className="grid grid-cols-3 gap-4 mb-5 max-md:grid-cols-1">
        <div className="bg-card backdrop-blur-xl border border-purple-500/25 rounded-2xl p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 rounded-full blur-[25px] opacity-30 pointer-events-none bg-purple-500" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-2xl">🃏</div>
            <div className="flex-1">
              <div className="text-xs text-muted-foreground font-semibold">Fragment Card Remaining</div>
              <div className="font-mono text-2xl font-bold text-foreground">{guildLootRemaining.fragmentCard.current}</div>
              <div className="w-full h-1.5 bg-white/10 rounded-full mt-1">
                <div className="h-full rounded-full bg-purple-500" style={{ width: `${(guildLootRemaining.fragmentCard.current / guildLootRemaining.fragmentCard.total) * 100}%` }} />
              </div>
              <div className="text-[10px] text-muted-foreground/60 mt-1">of {guildLootRemaining.fragmentCard.total} total</div>
            </div>
          </div>
        </div>

        <div className="bg-card backdrop-blur-xl border border-cyan-500/25 rounded-2xl p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 rounded-full blur-[25px] opacity-30 pointer-events-none bg-cyan-500" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-2xl">🔮</div>
            <div className="flex-1">
              <div className="text-xs text-muted-foreground font-semibold">Timespace Remaining</div>
              <div className="font-mono text-2xl font-bold text-foreground">{guildLootRemaining.timespace.current}</div>
              <div className="w-full h-1.5 bg-white/10 rounded-full mt-1">
                <div className="h-full rounded-full bg-cyan-500" style={{ width: `${(guildLootRemaining.timespace.current / guildLootRemaining.timespace.total) * 100}%` }} />
              </div>
              <div className="text-[10px] text-muted-foreground/60 mt-1">of {guildLootRemaining.timespace.total} total</div>
            </div>
          </div>
        </div>

        <div className="bg-card backdrop-blur-xl border border-amber-500/25 rounded-2xl p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 rounded-full blur-[25px] opacity-30 pointer-events-none bg-amber-500" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-2xl">⚡</div>
            <div className="flex-1">
              <div className="text-xs text-muted-foreground font-semibold">LND Remaining</div>
              <div className="font-mono text-2xl font-bold text-foreground">{guildLootRemaining.lnd.current}</div>
              <div className="w-full h-1.5 bg-white/10 rounded-full mt-1">
                <div className="h-full rounded-full bg-amber-500" style={{ width: `${(guildLootRemaining.lnd.current / guildLootRemaining.lnd.total) * 100}%` }} />
              </div>
              <div className="text-[10px] text-muted-foreground/60 mt-1">of {guildLootRemaining.lnd.total} total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bid Limit Banner */}
      <div className="flex items-center gap-3.5 flex-wrap bg-primary/8 border border-primary/25 rounded-xl p-3 px-5 mb-5">
        <div className="flex items-center gap-2 text-[13px] font-bold text-primary-light">
          🔨 Max Bid Limits:
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold bg-primary/18 border border-primary/30 text-primary-light">
            Fragment Card <span className="font-mono text-[13px] text-white bg-primary rounded-xl py-0.5 px-1.5 ml-0.5">40</span>
          </span>
          <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold bg-primary/18 border border-primary/30 text-primary-light">
            Timespace <span className="font-mono text-[13px] text-white bg-primary rounded-xl py-0.5 px-1.5 ml-0.5">50</span>
          </span>
          <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold bg-primary/18 border border-primary/30 text-primary-light">
            LND <span className="font-mono text-[13px] text-white bg-primary rounded-xl py-0.5 px-1.5 ml-0.5">50</span>
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

      <NewAuctionModal isOpen={showNewAuction} onClose={() => setShowNewAuction(false)} />
    </div>
  )
}
