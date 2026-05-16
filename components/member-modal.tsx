'use client'

import { useState, useRef } from 'react'
import { roleColors, roleIcons, roles } from '@/lib/data'
import type { Member, MemberBidLimits, MemberScreenshots } from '@/lib/data'
import { useMemberDkp } from '@/contexts/member-dkp-context'

interface MemberModalProps {
  member: Member
  onClose: () => void
  onUpdateMember?: (memberId: number, updates: Partial<Member>) => void
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

function ScreenshotUpload({ 
  label, 
  description, 
  imageUrl, 
  onUpload 
}: { 
  label: string
  description: string
  imageUrl?: string
  onUpload: (url: string) => void 
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      onUpload(url)
    }
  }

  return (
    <div className="bg-white/3 border border-primary/10 rounded-xl p-3.5">
      <div className="text-[11px] text-muted-foreground/70 font-semibold tracking-wide mb-1">{label}</div>
      <div className="text-[10px] text-muted-foreground/50 mb-2">{description}</div>
      {imageUrl ? (
        <div className="relative">
          <img src={imageUrl} alt={label} className="w-full h-24 object-cover rounded-lg border border-primary/20" />
          <button 
            onClick={() => inputRef.current?.click()}
            className="absolute top-1 right-1 w-6 h-6 rounded bg-black/60 text-white text-xs flex items-center justify-center hover:bg-black/80"
          >
            ✏
          </button>
        </div>
      ) : (
        <button 
          onClick={() => inputRef.current?.click()}
          className="w-full h-20 border-2 border-dashed border-primary/25 rounded-lg flex flex-col items-center justify-center gap-1 text-muted-foreground/60 hover:border-primary/50 hover:bg-primary/5 transition-all"
        >
          <span className="text-lg">📷</span>
          <span className="text-[10px] font-semibold">Upload Screenshot</span>
        </button>
      )}
      <input 
        ref={inputRef}
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleFileChange}
      />
    </div>
  )
}

function EditRoleModal({ 
  member, 
  isOpen, 
  onClose, 
  onSave 
}: { 
  member: Member
  isOpen: boolean
  onClose: () => void
  onSave: (role: string, bidLimits: MemberBidLimits) => void
}) {
  const [selectedRole, setSelectedRole] = useState(member.role)
  const [bidLimits, setBidLimits] = useState<MemberBidLimits>(member.bidLimits || { fragmentCard: 2, timespace: 2, lnd: 2 })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(selectedRole, bidLimits)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1001] p-4" onClick={onClose}>
      <div 
        className="bg-card border border-border rounded-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b border-primary/15">
          <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
            ✏ Edit Role & Bid Limits
          </h2>
          <p className="text-xs text-muted-foreground mt-1">For {member.name}</p>
        </div>
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">Guild Role</label>
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              className="w-full bg-white/4 border border-primary/20 rounded-xl py-2.5 px-4 text-foreground text-sm font-sans outline-none cursor-pointer transition-all duration-200 focus:border-primary focus:shadow-[0_0_10px_rgba(124,58,237,0.3)]"
            >
              {roles.map(role => (
                <option key={role} value={role}>{roleIcons[role]} {role}</option>
              ))}
            </select>
          </div>

          <div className="border-t border-primary/10 pt-4">
            <label className="block text-xs font-bold text-muted-foreground mb-3">Max Bid Limits (per category)</label>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between bg-white/3 rounded-lg p-3">
                <span className="text-sm text-foreground">🃏 Fragment Card</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setBidLimits(prev => ({ ...prev, fragmentCard: Math.max(0, prev.fragmentCard - 1) }))}
                    className="w-8 h-8 rounded-lg border border-primary/30 bg-primary/10 text-foreground font-bold flex items-center justify-center transition-all cursor-pointer hover:bg-primary/30 hover:border-primary"
                  >−</button>
                  <span className="font-mono text-lg font-bold text-primary-light min-w-8 text-center">{bidLimits.fragmentCard}</span>
                  <button
                    type="button"
                    onClick={() => setBidLimits(prev => ({ ...prev, fragmentCard: Math.min(10, prev.fragmentCard + 1) }))}
                    className="w-8 h-8 rounded-lg border border-primary/30 bg-primary/10 text-foreground font-bold flex items-center justify-center transition-all cursor-pointer hover:bg-primary/30 hover:border-primary"
                  >+</button>
                </div>
              </div>
              <div className="flex items-center justify-between bg-white/3 rounded-lg p-3">
                <span className="text-sm text-foreground">🔮 Timespace</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setBidLimits(prev => ({ ...prev, timespace: Math.max(0, prev.timespace - 1) }))}
                    className="w-8 h-8 rounded-lg border border-primary/30 bg-primary/10 text-foreground font-bold flex items-center justify-center transition-all cursor-pointer hover:bg-primary/30 hover:border-primary"
                  >−</button>
                  <span className="font-mono text-lg font-bold text-primary-light min-w-8 text-center">{bidLimits.timespace}</span>
                  <button
                    type="button"
                    onClick={() => setBidLimits(prev => ({ ...prev, timespace: Math.min(10, prev.timespace + 1) }))}
                    className="w-8 h-8 rounded-lg border border-primary/30 bg-primary/10 text-foreground font-bold flex items-center justify-center transition-all cursor-pointer hover:bg-primary/30 hover:border-primary"
                  >+</button>
                </div>
              </div>
              <div className="flex items-center justify-between bg-white/3 rounded-lg p-3">
                <span className="text-sm text-foreground">⚡ LND</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setBidLimits(prev => ({ ...prev, lnd: Math.max(0, prev.lnd - 1) }))}
                    className="w-8 h-8 rounded-lg border border-primary/30 bg-primary/10 text-foreground font-bold flex items-center justify-center transition-all cursor-pointer hover:bg-primary/30 hover:border-primary"
                  >−</button>
                  <span className="font-mono text-lg font-bold text-primary-light min-w-8 text-center">{bidLimits.lnd}</span>
                  <button
                    type="button"
                    onClick={() => setBidLimits(prev => ({ ...prev, lnd: Math.min(10, prev.lnd + 1) }))}
                    className="w-8 h-8 rounded-lg border border-primary/30 bg-primary/10 text-foreground font-bold flex items-center justify-center transition-all cursor-pointer hover:bg-primary/30 hover:border-primary"
                  >+</button>
                </div>
              </div>
            </div>
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AddDkpModal({ 
  member, 
  isOpen, 
  onClose, 
  onAdd 
}: { 
  member: Member
  isOpen: boolean
  onClose: () => void
  onAdd: (amount: number, reason: string) => void
}) {
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const numAmount = parseInt(amount, 10)
    if (numAmount > 0 && reason.trim()) {
      onAdd(numAmount, reason.trim())
      setAmount('')
      setReason('')
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4" onClick={onClose}>
      <div 
        className="bg-card border border-border rounded-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b border-primary/15">
          <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
            Add DKP to {member.name}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">DKP Amount</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Enter DKP amount"
              min="1"
              className="w-full bg-white/4 border border-primary/20 rounded-xl py-2.5 px-4 text-foreground text-sm font-sans outline-none transition-all duration-200 focus:border-primary focus:shadow-[0_0_10px_rgba(124,58,237,0.3)] placeholder:text-muted-foreground/50"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">Reason</label>
            <select
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full bg-white/4 border border-primary/20 rounded-xl py-2.5 px-4 text-foreground text-sm font-sans outline-none cursor-pointer transition-all duration-200 focus:border-primary focus:shadow-[0_0_10px_rgba(124,58,237,0.3)]"
              required
            >
              <option value="">Select reason...</option>
              <option value="Raid Participation">Raid Participation</option>
              <option value="Boss Kill Bonus">Boss Kill Bonus</option>
              <option value="Weekly Attendance Bonus">Weekly Attendance Bonus</option>
              <option value="Event Participation">Event Participation</option>
              <option value="Guild Contribution">Guild Contribution</option>
              <option value="Leadership Bonus">Leadership Bonus</option>
              <option value="Manual Adjustment">Manual Adjustment</option>
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
              Add DKP
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function MemberModal({ member, onClose, onUpdateMember }: MemberModalProps) {
  const { addDkp, memberDkp } = useMemberDkp()
  const [activeTab, setActiveTab] = useState<'character' | 'screenshots' | 'dkp' | 'loot'>('character')
  const [showEditRole, setShowEditRole] = useState(false)
  const [showAddDkp, setShowAddDkp] = useState(false)
  const [localMember, setLocalMember] = useState(member)

  // Get DKP data from context
  const memberDkpData = memberDkp[member.id]
  const dkpHistory = memberDkpData?.history || []

  const handleAddDkp = (amount: number, reason: string) => {
    addDkp(member.id, amount, reason)
  }

  const lootHistory = [
    { item: 'Fragment Card x5', cost: '680 DKP' },
    { item: 'LND Fragment', cost: '520 DKP' },
    { item: 'Time Space x3', cost: '290 DKP' },
  ]

  const handleScreenshotUpload = (type: keyof MemberScreenshots, url: string) => {
    const updatedMember = {
      ...localMember,
      screenshots: {
        ...localMember.screenshots,
        [type]: url
      }
    }
    setLocalMember(updatedMember)
    onUpdateMember?.(member.id, { screenshots: updatedMember.screenshots })
  }

  const handleRoleSave = (role: string, bidLimits: MemberBidLimits) => {
    const updatedMember = {
      ...localMember,
      role,
      bidLimits
    }
    setLocalMember(updatedMember)
    onUpdateMember?.(member.id, { role, bidLimits })
  }

  return (
    <div 
      className="fixed inset-0 bg-black/75 z-[1000] flex items-center justify-center p-5 backdrop-blur-lg animate-in fade-in duration-250"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#0d1120] border border-primary/35 rounded-[20px] w-full max-w-[780px] max-h-[90vh] overflow-y-auto shadow-[0_30px_80px_rgba(0,0,0,0.8),0_0_60px_rgba(124,58,237,0.15)] animate-in slide-in-from-bottom-5 zoom-in-98 duration-250">
        {/* Header */}
        <div className="p-6 px-7 border-b border-primary/15 flex items-center gap-4 sticky top-0 bg-[#0d1120] z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 border-2 border-primary/50 flex items-center justify-center text-[32px]">
            {localMember.class.icon}
          </div>
          <div>
            <h2 className="font-serif text-[22px] font-bold text-foreground">{localMember.name}</h2>
            <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-md text-[11px] font-bold tracking-wide ${roleColors[localMember.role]}`}>
                {roleIcons[localMember.role]} {localMember.role}
              </span>
              <StatusBadge status={localMember.status} />
              <span className="font-mono text-[13px] font-bold text-gold">{localMember.dkp.toLocaleString()} DKP</span>
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
          <div className="flex gap-1 mb-6 bg-white/3 rounded-xl p-1 overflow-x-auto">
            {(['character', 'screenshots', 'dkp', 'loot'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-3 text-center rounded-lg cursor-pointer text-xs font-bold tracking-wide transition-all duration-200 capitalize whitespace-nowrap ${activeTab === tab ? 'bg-primary/25 text-primary-light' : 'text-muted-foreground/70 hover:bg-white/5 hover:text-muted-foreground'}`}
              >
                {tab === 'character' ? '📋 Character' : tab === 'screenshots' ? '📷 Screenshots' : tab === 'dkp' ? '💎 DKP History' : '⚡ Loot History'}
              </button>
            ))}
          </div>

          {/* Character Tab */}
          {activeTab === 'character' && (
            <div className="grid grid-cols-2 gap-4 max-[500px]:grid-cols-1 animate-in fade-in duration-200">
              <div className="bg-white/3 border border-primary/10 rounded-xl p-3.5">
                <div className="text-[11px] text-muted-foreground/70 font-semibold tracking-wide mb-1">Class</div>
                <div className="text-sm font-bold text-foreground">{localMember.class.icon} {localMember.class.name}</div>
              </div>
              <div className="bg-white/3 border border-primary/10 rounded-xl p-3.5">
                <div className="text-[11px] text-muted-foreground/70 font-semibold tracking-wide mb-1">Guild Role</div>
                <div className="text-sm font-bold text-foreground">{localMember.role}</div>
              </div>
              <div className="bg-white/3 border border-primary/10 rounded-xl p-3.5">
                <div className="text-[11px] text-muted-foreground/70 font-semibold tracking-wide mb-1">Gear Score</div>
                <div className="font-mono text-[22px] font-bold text-cyan">{localMember.gs}</div>
              </div>
              <div className="bg-white/3 border border-primary/10 rounded-xl p-3.5">
                <div className="text-[11px] text-muted-foreground/70 font-semibold tracking-wide mb-1">Current DKP</div>
                <div className="text-sm font-bold text-foreground">{localMember.dkp.toLocaleString()} DKP</div>
              </div>
              <div className="bg-white/3 border border-primary/10 rounded-xl p-3.5">
                <div className="text-[11px] text-muted-foreground/70 font-semibold tracking-wide mb-1">Attendance Rate</div>
                <div className="text-sm font-bold text-foreground">{localMember.att}%</div>
              </div>
              <div className="bg-white/3 border border-primary/10 rounded-xl p-3.5">
                <div className="text-[11px] text-muted-foreground/70 font-semibold tracking-wide mb-1">Discord</div>
                <div className="text-sm font-bold text-foreground">{localMember.discord}</div>
              </div>
              <div className="bg-white/3 border border-primary/10 rounded-xl p-3.5">
                <div className="text-[11px] text-muted-foreground/70 font-semibold tracking-wide mb-1">Joined</div>
                <div className="text-sm font-bold text-foreground">{localMember.joinDate}</div>
              </div>
              <div className="bg-white/3 border border-primary/10 rounded-xl p-3.5">
                <div className="text-[11px] text-muted-foreground/70 font-semibold tracking-wide mb-1">Last Online</div>
                <div className="text-sm font-bold text-foreground">{localMember.lastOnline}</div>
              </div>
              <div className="bg-white/3 border border-primary/10 rounded-xl p-3.5">
                <div className="text-[11px] text-muted-foreground/70 font-semibold tracking-wide mb-1">Total Raids</div>
                <div className="text-sm font-bold text-foreground">{localMember.totalRaids}</div>
              </div>
              <div className="bg-white/3 border border-primary/10 rounded-xl p-3.5">
                <div className="text-[11px] text-muted-foreground/70 font-semibold tracking-wide mb-1">Bid Limits</div>
                <div className="text-xs text-foreground flex gap-2 flex-wrap">
                  <span className="bg-primary/15 px-2 py-0.5 rounded">FC: {localMember.bidLimits?.fragmentCard ?? 2}</span>
                  <span className="bg-primary/15 px-2 py-0.5 rounded">TS: {localMember.bidLimits?.timespace ?? 2}</span>
                  <span className="bg-primary/15 px-2 py-0.5 rounded">LND: {localMember.bidLimits?.lnd ?? 2}</span>
                </div>
              </div>
            </div>
          )}

          {/* Screenshots Tab */}
          {activeTab === 'screenshots' && (
            <div className="animate-in fade-in duration-200">
              <p className="text-xs text-muted-foreground mb-4">Upload screenshots to verify your character stats. These help officers verify your progression.</p>
              
              {/* Main Stats */}
              <div className="mb-4">
                <h4 className="text-xs font-bold text-muted-foreground mb-3 flex items-center gap-2">
                  Main Stats
                  <span className="text-[10px] font-normal text-muted-foreground/60">
                    ({[localMember.screenshots?.gearscore, localMember.screenshots?.pvpStats, localMember.screenshots?.medal, localMember.screenshots?.gear].filter(Boolean).length}/4)
                  </span>
                </h4>
                <div className="grid grid-cols-2 gap-3 max-[600px]:grid-cols-1">
                  <ScreenshotUpload
                    label="Gearscore"
                    description="Screenshot showing your GS number"
                    imageUrl={localMember.screenshots?.gearscore}
                    onUpload={(url) => handleScreenshotUpload('gearscore', url)}
                  />
                  <ScreenshotUpload
                    label="PVP Stats"
                    description="Your PVP ranking and stats"
                    imageUrl={localMember.screenshots?.pvpStats}
                    onUpload={(url) => handleScreenshotUpload('pvpStats', url)}
                  />
                  <ScreenshotUpload
                    label="Medal Collection"
                    description="Your medal collection"
                    imageUrl={localMember.screenshots?.medal}
                    onUpload={(url) => handleScreenshotUpload('medal', url)}
                  />
                  <ScreenshotUpload
                    label="Gear / Equipment"
                    description="Your equipped gear"
                    imageUrl={localMember.screenshots?.gear}
                    onUpload={(url) => handleScreenshotUpload('gear', url)}
                  />
                </div>
              </div>

              {/* Attack Feathers */}
              <div className="mb-4">
                <h4 className="text-xs font-bold text-muted-foreground mb-3 flex items-center gap-2">
                  <span className="text-orange-400">ATK</span> Attack Feathers
                  <span className="text-[10px] font-normal text-muted-foreground/60">
                    ({[localMember.screenshots?.attackFeather1, localMember.screenshots?.attackFeather2, localMember.screenshots?.attackFeather3, localMember.screenshots?.attackFeather4, localMember.screenshots?.attackFeather5].filter(Boolean).length}/5)
                  </span>
                </h4>
                <div className="grid grid-cols-5 gap-2 max-lg:grid-cols-3 max-[600px]:grid-cols-2">
                  {[1, 2, 3, 4, 5].map(num => (
                    <ScreenshotUpload
                      key={`atk-${num}`}
                      label={`ATK ${num}`}
                      description={`Attack feather tab ${num}`}
                      imageUrl={localMember.screenshots?.[`attackFeather${num}` as keyof MemberScreenshots] as string | undefined}
                      onUpload={(url) => handleScreenshotUpload(`attackFeather${num}` as keyof MemberScreenshots, url)}
                    />
                  ))}
                </div>
              </div>

              {/* Defend Feathers */}
              <div>
                <h4 className="text-xs font-bold text-muted-foreground mb-3 flex items-center gap-2">
                  <span className="text-blue-400">DEF</span> Defend Feathers
                  <span className="text-[10px] font-normal text-muted-foreground/60">
                    ({[localMember.screenshots?.defendFeather1, localMember.screenshots?.defendFeather2, localMember.screenshots?.defendFeather3, localMember.screenshots?.defendFeather4, localMember.screenshots?.defendFeather5].filter(Boolean).length}/5)
                  </span>
                </h4>
                <div className="grid grid-cols-5 gap-2 max-lg:grid-cols-3 max-[600px]:grid-cols-2">
                  {[1, 2, 3, 4, 5].map(num => (
                    <ScreenshotUpload
                      key={`def-${num}`}
                      label={`DEF ${num}`}
                      description={`Defend feather tab ${num}`}
                      imageUrl={localMember.screenshots?.[`defendFeather${num}` as keyof MemberScreenshots] as string | undefined}
                      onUpload={(url) => handleScreenshotUpload(`defendFeather${num}` as keyof MemberScreenshots, url)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DKP History Tab */}
          {activeTab === 'dkp' && (
            <div className="flex flex-col gap-2 animate-in fade-in duration-200">
              {/* DKP Summary */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-center">
                  <div className="font-mono text-xl font-bold text-primary-light">{memberDkpData?.dkp || 0}</div>
                  <div className="text-[10px] text-muted-foreground">Current DKP</div>
                </div>
                <div className="bg-accent/10 border border-accent/20 rounded-xl p-3 text-center">
                  <div className="font-mono text-xl font-bold text-accent">+{memberDkpData?.weeklyEarned || 0}</div>
                  <div className="text-[10px] text-muted-foreground">This Week</div>
                </div>
              </div>
              
              {dkpHistory.length === 0 ? (
                <div className="text-center py-6">
                  <div className="text-3xl mb-2">No history</div>
                  <div className="text-xs text-muted-foreground">No DKP transactions yet</div>
                </div>
              ) : (
                dkpHistory.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2.5 px-3.5 rounded-lg bg-white/2 border border-primary/8">
                    <div className="text-[13px] text-muted-foreground"><b className="text-foreground">{localMember.name}</b> {item.reason}</div>
                    <div className={`font-mono text-[13px] font-bold ${item.type === 'earn' ? 'text-accent' : 'text-destructive'}`}>
                      {item.type === 'earn' ? '+' : '-'}{item.amount} DKP
                    </div>
                  </div>
                ))
              )}
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
          <div className="flex gap-2 mt-6 flex-wrap">
            <button 
              onClick={() => setShowAddDkp(true)}
              className="inline-flex items-center gap-2 py-2 px-3.5 rounded-xl border-none cursor-pointer font-sans text-xs font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-gradient-to-br from-primary to-indigo-600 text-white shadow-[0_4px_15px_rgba(124,58,237,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(124,58,237,0.5)]"
            >
              Add DKP
            </button>
            <button 
              onClick={() => setShowEditRole(true)}
              className="inline-flex items-center gap-2 py-2 px-3.5 rounded-xl cursor-pointer font-sans text-xs font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-transparent text-primary-light border border-primary/40 hover:bg-primary/15 hover:border-primary"
            >
              ✏ Edit Role
            </button>
            <button className="inline-flex items-center gap-2 py-2 px-3.5 rounded-xl cursor-pointer font-sans text-xs font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-gradient-to-br from-destructive to-red-700 text-white hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(239,68,68,0.4)]">
              🥾 Kick
            </button>
          </div>
        </div>
      </div>

      <EditRoleModal 
        member={localMember}
        isOpen={showEditRole}
        onClose={() => setShowEditRole(false)}
        onSave={handleRoleSave}
      />

      <AddDkpModal 
        member={localMember}
        isOpen={showAddDkp}
        onClose={() => setShowAddDkp(false)}
        onAdd={handleAddDkp}
      />
    </div>
  )
}
