'use client'

import { useState } from 'react'
import { roleColors, roleIcons } from '@/lib/data'
import type { Member } from '@/lib/data'

interface MemberModalProps {
  member: Member
  onClose: () => void
}

function StatusBadge({ status }: { status: Member['status'] }) {
  const styles: Record<string, string> = {
    'Online': 'bg-accent/15 text-accent border border-accent/30',
    'In Raid': 'bg-gold/15 text-gold border border-gold/30',
    'AFK': 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
    'Offline': 'bg-muted-foreground/15 text-muted-foreground border border-muted-foreground/30',
  }

  return (
    <span className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-[11px] font-bold tracking-wide whitespace-nowrap ${styles[status]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}

export function MemberModal({ member, onClose }: MemberModalProps) {
  const [activeTab, setActiveTab] = useState<'character' | 'dkp' | 'loot'>('character')

  const dkpHistory = [
    { desc: 'Dragon Lair Raid', amount: '+150 DKP', positive: true },
    { desc: 'Weekly Attendance', amount: '+100 DKP', positive: true },
    { desc: 'Loot Purchase', amount: '-180 DKP', positive: false },
    { desc: 'Boss Kill Bonus', amount: '+200 DKP', positive: true },
    { desc: 'No-show Penalty', amount: '-80 DKP', positive: false },
  ]

  const lootHistory = [
    { item: 'Shadowfang Executioner', cost: '680 DKP' },
    { item: 'Soulreaper Ring', cost: '520 DKP' },
    { item: 'Bloodmoon Greaves', cost: '290 DKP' },
  ]

  return (
    <div 
      className="fixed inset-0 bg-black/75 z-[1000] flex items-center justify-center p-5 backdrop-blur-lg animate-in fade-in duration-250"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#0d1120] border border-primary/35 rounded-[20px] w-full max-w-[780px] max-h-[90vh] overflow-y-auto shadow-[0_30px_80px_rgba(0,0,0,0.8),0_0_60px_rgba(124,58,237,0.15)] animate-in slide-in-from-bottom-5 zoom-in-98 duration-250">
        {/* Header */}
        <div className="p-6 px-7 border-b border-primary/15 flex items-center gap-4 sticky top-0 bg-[#0d1120] z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 border-2 border-primary/50 flex items-center justify-center text-[32px]">
            {member.class.icon}
          </div>
          <div>
            <h2 className="font-serif text-[22px] font-bold text-foreground">{member.name}</h2>
            <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-md text-[11px] font-bold tracking-wide ${roleColors[member.role]}`}>
                {roleIcons[member.role]} {member.role}
              </span>
              <StatusBadge status={member.status} />
              <span className="font-mono text-[13px] font-bold text-gold">{member.dkp.toLocaleString()} DKP</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="ml-auto w-9 h-9 rounded-lg bg-white/5 border border-white/10 cursor-pointer flex items-center justify-center text-xl text-muted-foreground transition-all duration-200 hover:bg-destructive/20 hover:text-destructive hover:border-destructive/30"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="p-7">
          <div className="flex gap-1 mb-6 bg-white/3 rounded-xl p-1">
            {(['character', 'dkp', 'loot'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-4 text-center rounded-lg cursor-pointer text-xs font-bold tracking-wide transition-all duration-200 capitalize ${activeTab === tab ? 'bg-primary/25 text-primary-light' : 'text-muted-foreground/70 hover:bg-white/5 hover:text-muted-foreground'}`}
              >
                {tab === 'character' ? '📋 Character' : tab === 'dkp' ? '💎 DKP History' : '⚡ Loot History'}
              </button>
            ))}
          </div>

          {/* Character Tab */}
          {activeTab === 'character' && (
            <div className="grid grid-cols-2 gap-4 max-[500px]:grid-cols-1 animate-in fade-in duration-200">
              <div className="bg-white/3 border border-primary/10 rounded-xl p-3.5">
                <div className="text-[11px] text-muted-foreground/70 font-semibold tracking-wide mb-1">Class</div>
                <div className="text-sm font-bold text-foreground">{member.class.icon} {member.class.name}</div>
              </div>
              <div className="bg-white/3 border border-primary/10 rounded-xl p-3.5">
                <div className="text-[11px] text-muted-foreground/70 font-semibold tracking-wide mb-1">Guild Role</div>
                <div className="text-sm font-bold text-foreground">{member.role}</div>
              </div>
              <div className="bg-white/3 border border-primary/10 rounded-xl p-3.5">
                <div className="text-[11px] text-muted-foreground/70 font-semibold tracking-wide mb-1">Gear Score</div>
                <div className="font-mono text-[22px] font-bold text-cyan">{member.gs}</div>
              </div>
              <div className="bg-white/3 border border-primary/10 rounded-xl p-3.5">
                <div className="text-[11px] text-muted-foreground/70 font-semibold tracking-wide mb-1">Current DKP</div>
                <div className="text-sm font-bold text-foreground">{member.dkp.toLocaleString()} DKP</div>
              </div>
              <div className="bg-white/3 border border-primary/10 rounded-xl p-3.5">
                <div className="text-[11px] text-muted-foreground/70 font-semibold tracking-wide mb-1">Attendance Rate</div>
                <div className="text-sm font-bold text-foreground">{member.att}%</div>
              </div>
              <div className="bg-white/3 border border-primary/10 rounded-xl p-3.5">
                <div className="text-[11px] text-muted-foreground/70 font-semibold tracking-wide mb-1">Discord</div>
                <div className="text-sm font-bold text-foreground">{member.discord}</div>
              </div>
              <div className="bg-white/3 border border-primary/10 rounded-xl p-3.5">
                <div className="text-[11px] text-muted-foreground/70 font-semibold tracking-wide mb-1">Joined</div>
                <div className="text-sm font-bold text-foreground">{member.joinDate}</div>
              </div>
              <div className="bg-white/3 border border-primary/10 rounded-xl p-3.5">
                <div className="text-[11px] text-muted-foreground/70 font-semibold tracking-wide mb-1">Last Online</div>
                <div className="text-sm font-bold text-foreground">{member.lastOnline}</div>
              </div>
              <div className="bg-white/3 border border-primary/10 rounded-xl p-3.5 col-span-2 max-[500px]:col-span-1">
                <div className="text-[11px] text-muted-foreground/70 font-semibold tracking-wide mb-1">Total Raids</div>
                <div className="text-sm font-bold text-foreground">{member.totalRaids}</div>
              </div>
            </div>
          )}

          {/* DKP History Tab */}
          {activeTab === 'dkp' && (
            <div className="flex flex-col gap-2 animate-in fade-in duration-200">
              {dkpHistory.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 px-3.5 rounded-lg bg-white/2 border border-primary/8">
                  <div className="text-[13px] text-muted-foreground"><b className="text-foreground">{member.name}</b> — {item.desc}</div>
                  <div className={`font-mono text-[13px] font-bold ${item.positive ? 'text-accent' : 'text-destructive'}`}>{item.amount}</div>
                </div>
              ))}
            </div>
          )}

          {/* Loot History Tab */}
          {activeTab === 'loot' && (
            <div className="flex flex-col gap-2 animate-in fade-in duration-200">
              {lootHistory.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 px-3.5 rounded-lg bg-white/2 border border-primary/8">
                  <div className="text-[13px] text-foreground">{item.item}</div>
                  <div className="font-mono text-[13px] font-bold text-destructive">-{item.cost}</div>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 mt-6">
            <button className="inline-flex items-center gap-2 py-2 px-3.5 rounded-xl border-none cursor-pointer font-sans text-xs font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-gradient-to-br from-primary to-indigo-600 text-white shadow-[0_4px_15px_rgba(124,58,237,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(124,58,237,0.5)]">
              💎 Add DKP
            </button>
            <button className="inline-flex items-center gap-2 py-2 px-3.5 rounded-xl cursor-pointer font-sans text-xs font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-transparent text-primary-light border border-primary/40 hover:bg-primary/15 hover:border-primary">
              ✏ Edit Role
            </button>
            <button className="inline-flex items-center gap-2 py-2 px-3.5 rounded-xl cursor-pointer font-sans text-xs font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-gradient-to-br from-destructive to-red-700 text-white hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(239,68,68,0.4)]">
              🥾 Kick
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
