'use client'

import { useState } from 'react'
import { CURRENT_USER_ROLE, canEditAllSettings, canEditBattleSettings, getRoleColor } from '@/lib/roles'
import type { Page } from '@/app/page'

interface SettingsPageProps {
  onNavigate?: (page: Page) => void
}

interface PresetCardProps {
  id: string
  icon: string
  label: string
  description: string
  values: { fragmentCard: number; timespace: number; lnd: number }
  active: boolean
  onSelect: () => void
  disabled?: boolean
}

function PresetCard({ icon, label, description, values, active, onSelect, disabled }: PresetCardProps) {
  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={`
        bg-white/3 border-2 rounded-[14px] p-4 transition-all duration-200 relative select-none text-left
        ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
        ${active 
          ? 'border-primary bg-primary/14 shadow-[0_0_0_1px_rgba(124,58,237,0.25),0_0_10px_rgba(124,58,237,0.3)]' 
          : disabled ? 'border-primary/10' : 'border-primary/18 hover:border-primary/45 hover:bg-primary/8 hover:-translate-y-0.5'
        }
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[22px]">{icon}</span>
        <div className={`w-5 h-5 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center transition-opacity duration-200 ${active ? 'opacity-100' : 'opacity-0'}`}>
          ✓
        </div>
      </div>
      <div className="font-mono text-xl font-bold text-foreground tracking-[2px] mb-0.5">{label}</div>
      <div className="text-[11px] text-muted-foreground/70 font-semibold tracking-[1px] uppercase mb-3">{description}</div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Fragment Card</span>
          <span className={`font-bold font-mono text-[11px] ${active ? 'text-primary-light' : 'text-foreground'}`}>{values.fragmentCard}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Timespace</span>
          <span className={`font-bold font-mono text-[11px] ${active ? 'text-primary-light' : 'text-foreground'}`}>{values.timespace}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">LND</span>
          <span className={`font-bold font-mono text-[11px] ${active ? 'text-primary-light' : 'text-foreground'}`}>{values.lnd}</span>
        </div>
      </div>
    </button>
  )
}

function SettingToggle({ label, description, defaultOn, disabled }: { label: string; description: string; defaultOn?: boolean; disabled?: boolean }) {
  const [on, setOn] = useState(defaultOn ?? false)

  return (
    <div className={`flex items-center justify-between py-3.5 border-b border-white/4 last:border-b-0 ${disabled ? 'opacity-60' : ''}`}>
      <div>
        <div className="text-sm font-semibold text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground/70 mt-0.5">{description}</div>
      </div>
      <button
        onClick={() => !disabled && setOn(!on)}
        disabled={disabled}
        className={`w-11 h-6 rounded-xl relative transition-all duration-200 border-none shrink-0 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${on ? 'bg-primary shadow-[0_0_12px_rgba(124,58,237,0.4)]' : 'bg-white/10'}`}
      >
        <span className={`absolute top-[3px] w-[18px] h-[18px] bg-white rounded-full transition-all duration-200 ${on ? 'left-[23px]' : 'left-[3px]'}`} />
      </button>
    </div>
  )
}

export function SettingsPage({ onNavigate }: SettingsPageProps) {
  const [selectedPreset, setSelectedPreset] = useState('222')
  const [customValues, setCustomValues] = useState({ fragmentCard: 2, timespace: 2, lnd: 2 })
  const [lootRewards, setLootRewards] = useState({
    fragmentCard: { dkpCost: 100, quantity: 3 },
    timespace: { dkpCost: 150, quantity: 2 },
    lnd: { dkpCost: 200, quantity: 1 },
  })
  const isFullAdmin = canEditAllSettings()
  const canEditBattle = canEditBattleSettings()

  const presets = [
    { id: '333', icon: '⚔', label: '3-3-3', description: 'Balanced', values: { fragmentCard: 3, timespace: 3, lnd: 3 } },
    { id: '222', icon: '🛡', label: '2-2-2', description: 'Default', values: { fragmentCard: 2, timespace: 2, lnd: 2 } },
    { id: '111', icon: '🎯', label: '1-1-1', description: 'Strict', values: { fragmentCard: 1, timespace: 1, lnd: 1 } },
  ]

  const stepValue = (key: 'fragmentCard' | 'timespace' | 'lnd', dir: number) => {
    if (!isFullAdmin) return
    setSelectedPreset('custom')
    setCustomValues(v => ({
      ...v,
      [key]: Math.max(0, Math.min(9, v[key] + dir))
    }))
  }

  const getDisplayLabel = (key: string) => {
    switch (key) {
      case 'fragmentCard': return 'Fragment Card'
      case 'timespace': return 'Timespace'
      case 'lnd': return 'LND'
      default: return key
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-[26px] font-bold text-foreground flex items-center gap-3">
            <span className="text-2xl">⚙</span> Settings
          </h1>
          {/* Role indicator */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-muted-foreground">Your Role:</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${getRoleColor(CURRENT_USER_ROLE)}`}>
              {CURRENT_USER_ROLE}
            </span>
            {isFullAdmin && (
              <span className="text-[10px] text-accent">Full Edit Access</span>
            )}
            {!isFullAdmin && canEditBattle && (
              <span className="text-[10px] text-primary-light">Battle Settings Only</span>
            )}
            {!isFullAdmin && !canEditBattle && (
              <span className="text-[10px] text-muted-foreground/70">View Only</span>
            )}
          </div>
        </div>
        {isFullAdmin && (
          <button className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl border-none cursor-pointer font-sans text-sm font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-gradient-to-br from-primary to-indigo-600 text-white shadow-[0_4px_15px_rgba(124,58,237,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(124,58,237,0.5)]">
            💾 Save Changes
          </button>
        )}
      </div>

      {/* Role Permissions Info */}
      <div className="bg-primary/8 border border-primary/25 rounded-xl p-4 mb-6">
        <div className="text-sm font-bold text-foreground mb-2">Role Permissions:</div>
        <div className="grid grid-cols-2 gap-3 text-xs max-sm:grid-cols-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold"></span>
            <span className="text-muted-foreground"><span className="text-gold font-semibold">Admin / Guild Master / Vice Master:</span> Full access to all settings</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            <span className="text-muted-foreground"><span className="text-purple-400 font-semibold">Commander / Officer:</span> Parties and Battlefield only</span>
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      {canEditBattle && onNavigate && (
        <div className="flex gap-3 mb-6 flex-wrap">
          <button 
            onClick={() => onNavigate('parties')}
            className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl cursor-pointer font-sans text-sm font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-transparent text-primary-light border border-primary/40 hover:bg-primary/15 hover:border-primary"
          >
            👥 Manage Parties
          </button>
          <button 
            onClick={() => onNavigate('battlefield')}
            className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl cursor-pointer font-sans text-sm font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-transparent text-primary-light border border-primary/40 hover:bg-primary/15 hover:border-primary"
          >
            ⚔ Battlefield Setup
          </button>
        </div>
      )}

      {/* Bid Limit Section */}
      <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-6 mb-6">
        <div className="border-b border-primary/15 pb-3 mb-5">
          <div className="text-[15px] font-bold text-foreground flex items-center gap-2">
            🔨 Bid Limit Rules
            <span className="text-[11px] font-medium text-muted-foreground/70 ml-2">Max bids per member per session</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Fragment Card: max 40 | Timespace: max 50 | LND: max 50
          </div>
        </div>

        {/* Preset Cards */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 mb-6">
          {presets.map(preset => (
            <PresetCard 
              key={preset.id}
              {...preset}
              active={selectedPreset === preset.id}
              onSelect={() => isFullAdmin && setSelectedPreset(preset.id)}
              disabled={!isFullAdmin}
            />
          ))}
          
          {/* Custom Card */}
          <button
            onClick={() => isFullAdmin && setSelectedPreset('custom')}
            disabled={!isFullAdmin}
            className={`
              bg-white/3 border-2 rounded-[14px] p-4 transition-all duration-200 relative select-none text-left
              ${!isFullAdmin ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
              ${selectedPreset === 'custom'
                ? 'border-primary bg-primary/14 shadow-[0_0_0_1px_rgba(124,58,237,0.25),0_0_10px_rgba(124,58,237,0.3)]' 
                : !isFullAdmin ? 'border-primary/10' : 'border-primary/18 hover:border-primary/45 hover:bg-primary/8 hover:-translate-y-0.5'
              }
            `}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[22px]">✨</span>
              <div className={`w-5 h-5 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center transition-opacity duration-200 ${selectedPreset === 'custom' ? 'opacity-100' : 'opacity-0'}`}>
                ✓
              </div>
            </div>
            <div className="font-mono text-xl font-bold text-foreground tracking-[2px] mb-0.5">CUSTOM</div>
            <div className="text-[11px] text-muted-foreground/70 font-semibold tracking-[1px] uppercase mb-3">Set Your Own</div>
            <div className="text-xs text-muted-foreground">Click to customize limits</div>
          </button>
        </div>

        {/* Custom Values */}
        {selectedPreset === 'custom' && (
          <div className="grid grid-cols-3 gap-4 p-4 bg-primary/5 border border-primary/20 rounded-xl max-sm:grid-cols-1">
            {(['fragmentCard', 'timespace', 'lnd'] as const).map(key => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{getDisplayLabel(key)}</span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => stepValue(key, -1)}
                    disabled={!isFullAdmin}
                    className={`w-[30px] h-[30px] rounded-lg border border-primary/30 bg-primary/10 text-foreground text-lg font-bold flex items-center justify-center transition-all duration-150 leading-none ${!isFullAdmin ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-primary/30 hover:border-primary'}`}
                  >
                    −
                  </button>
                  <span className="font-mono text-xl font-bold text-primary-light min-w-7 text-center">{customValues[key]}</span>
                  <button 
                    onClick={() => stepValue(key, 1)}
                    disabled={!isFullAdmin}
                    className={`w-[30px] h-[30px] rounded-lg border border-primary/30 bg-primary/10 text-foreground text-lg font-bold flex items-center justify-center transition-all duration-150 leading-none ${!isFullAdmin ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-primary/30 hover:border-primary'}`}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Loot Rewards Settings - Guild Master & Vice Master Only */}
      <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-6 mb-6">
        <div className="border-b border-primary/15 pb-3 mb-5">
          <div className="text-[15px] font-bold text-foreground flex items-center gap-2">
            🎁 Loot Reward Settings
            <span className="text-[11px] font-medium text-muted-foreground/70 ml-2">Configure DKP cost and quantities for each loot type</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Only Guild Master and Vice Master can edit these settings
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
          {/* Fragment Card Rewards */}
          <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🃏</span>
              <span className="text-sm font-bold text-foreground">Fragment Card</span>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-muted-foreground font-semibold mb-1 block">DKP Cost per Bid</label>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => isFullAdmin && setLootRewards(r => ({ ...r, fragmentCard: { ...r.fragmentCard, dkpCost: Math.max(10, r.fragmentCard.dkpCost - 10) } }))}
                    disabled={!isFullAdmin}
                    className={`w-8 h-8 rounded-lg border border-purple-500/30 bg-purple-500/10 text-foreground font-bold flex items-center justify-center transition-all ${!isFullAdmin ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-purple-500/20'}`}
                  >−</button>
                  <span className="font-mono text-lg font-bold text-purple-400 min-w-[50px] text-center">{lootRewards.fragmentCard.dkpCost}</span>
                  <button 
                    onClick={() => isFullAdmin && setLootRewards(r => ({ ...r, fragmentCard: { ...r.fragmentCard, dkpCost: r.fragmentCard.dkpCost + 10 } }))}
                    disabled={!isFullAdmin}
                    className={`w-8 h-8 rounded-lg border border-purple-500/30 bg-purple-500/10 text-foreground font-bold flex items-center justify-center transition-all ${!isFullAdmin ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-purple-500/20'}`}
                  >+</button>
                </div>
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground font-semibold mb-1 block">Default Quantity</label>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => isFullAdmin && setLootRewards(r => ({ ...r, fragmentCard: { ...r.fragmentCard, quantity: Math.max(1, r.fragmentCard.quantity - 1) } }))}
                    disabled={!isFullAdmin}
                    className={`w-8 h-8 rounded-lg border border-purple-500/30 bg-purple-500/10 text-foreground font-bold flex items-center justify-center transition-all ${!isFullAdmin ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-purple-500/20'}`}
                  >−</button>
                  <span className="font-mono text-lg font-bold text-purple-400 min-w-[50px] text-center">x{lootRewards.fragmentCard.quantity}</span>
                  <button 
                    onClick={() => isFullAdmin && setLootRewards(r => ({ ...r, fragmentCard: { ...r.fragmentCard, quantity: Math.min(10, r.fragmentCard.quantity + 1) } }))}
                    disabled={!isFullAdmin}
                    className={`w-8 h-8 rounded-lg border border-purple-500/30 bg-purple-500/10 text-foreground font-bold flex items-center justify-center transition-all ${!isFullAdmin ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-purple-500/20'}`}
                  >+</button>
                </div>
              </div>
            </div>
          </div>

          {/* Timespace Rewards */}
          <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🔮</span>
              <span className="text-sm font-bold text-foreground">Timespace</span>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-muted-foreground font-semibold mb-1 block">DKP Cost per Bid</label>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => isFullAdmin && setLootRewards(r => ({ ...r, timespace: { ...r.timespace, dkpCost: Math.max(10, r.timespace.dkpCost - 10) } }))}
                    disabled={!isFullAdmin}
                    className={`w-8 h-8 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-foreground font-bold flex items-center justify-center transition-all ${!isFullAdmin ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-cyan-500/20'}`}
                  >−</button>
                  <span className="font-mono text-lg font-bold text-cyan-400 min-w-[50px] text-center">{lootRewards.timespace.dkpCost}</span>
                  <button 
                    onClick={() => isFullAdmin && setLootRewards(r => ({ ...r, timespace: { ...r.timespace, dkpCost: r.timespace.dkpCost + 10 } }))}
                    disabled={!isFullAdmin}
                    className={`w-8 h-8 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-foreground font-bold flex items-center justify-center transition-all ${!isFullAdmin ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-cyan-500/20'}`}
                  >+</button>
                </div>
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground font-semibold mb-1 block">Default Quantity</label>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => isFullAdmin && setLootRewards(r => ({ ...r, timespace: { ...r.timespace, quantity: Math.max(1, r.timespace.quantity - 1) } }))}
                    disabled={!isFullAdmin}
                    className={`w-8 h-8 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-foreground font-bold flex items-center justify-center transition-all ${!isFullAdmin ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-cyan-500/20'}`}
                  >−</button>
                  <span className="font-mono text-lg font-bold text-cyan-400 min-w-[50px] text-center">x{lootRewards.timespace.quantity}</span>
                  <button 
                    onClick={() => isFullAdmin && setLootRewards(r => ({ ...r, timespace: { ...r.timespace, quantity: Math.min(10, r.timespace.quantity + 1) } }))}
                    disabled={!isFullAdmin}
                    className={`w-8 h-8 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-foreground font-bold flex items-center justify-center transition-all ${!isFullAdmin ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-cyan-500/20'}`}
                  >+</button>
                </div>
              </div>
            </div>
          </div>

          {/* LND Rewards */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">⚡</span>
              <span className="text-sm font-bold text-foreground">LND</span>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-muted-foreground font-semibold mb-1 block">DKP Cost per Bid</label>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => isFullAdmin && setLootRewards(r => ({ ...r, lnd: { ...r.lnd, dkpCost: Math.max(10, r.lnd.dkpCost - 10) } }))}
                    disabled={!isFullAdmin}
                    className={`w-8 h-8 rounded-lg border border-amber-500/30 bg-amber-500/10 text-foreground font-bold flex items-center justify-center transition-all ${!isFullAdmin ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-amber-500/20'}`}
                  >−</button>
                  <span className="font-mono text-lg font-bold text-amber-400 min-w-[50px] text-center">{lootRewards.lnd.dkpCost}</span>
                  <button 
                    onClick={() => isFullAdmin && setLootRewards(r => ({ ...r, lnd: { ...r.lnd, dkpCost: r.lnd.dkpCost + 10 } }))}
                    disabled={!isFullAdmin}
                    className={`w-8 h-8 rounded-lg border border-amber-500/30 bg-amber-500/10 text-foreground font-bold flex items-center justify-center transition-all ${!isFullAdmin ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-amber-500/20'}`}
                  >+</button>
                </div>
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground font-semibold mb-1 block">Default Quantity</label>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => isFullAdmin && setLootRewards(r => ({ ...r, lnd: { ...r.lnd, quantity: Math.max(1, r.lnd.quantity - 1) } }))}
                    disabled={!isFullAdmin}
                    className={`w-8 h-8 rounded-lg border border-amber-500/30 bg-amber-500/10 text-foreground font-bold flex items-center justify-center transition-all ${!isFullAdmin ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-amber-500/20'}`}
                  >−</button>
                  <span className="font-mono text-lg font-bold text-amber-400 min-w-[50px] text-center">x{lootRewards.lnd.quantity}</span>
                  <button 
                    onClick={() => isFullAdmin && setLootRewards(r => ({ ...r, lnd: { ...r.lnd, quantity: Math.min(10, r.lnd.quantity + 1) } }))}
                    disabled={!isFullAdmin}
                    className={`w-8 h-8 rounded-lg border border-amber-500/30 bg-amber-500/10 text-foreground font-bold flex items-center justify-center transition-all ${!isFullAdmin ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-amber-500/20'}`}
                  >+</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Other Settings */}
      <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
        {/* Guild Settings */}
        <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-6">
          <div className="text-sm font-bold text-foreground mb-4 pb-2.5 border-b border-primary/12">
            🏰 Guild Settings
          </div>
          <SettingToggle label="Auto-accept Recruits" description="Automatically accept applications that meet requirements" disabled={!isFullAdmin} />
          <SettingToggle label="Public Guild Profile" description="Allow anyone to view guild stats and members" defaultOn disabled={!isFullAdmin} />
          <SettingToggle label="Discord Webhooks" description="Send notifications to connected Discord server" defaultOn disabled={!isFullAdmin} />
        </div>

        {/* DKP Settings */}
        <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-6">
          <div className="text-sm font-bold text-foreground mb-4 pb-2.5 border-b border-primary/12">
            💎 DKP Settings
          </div>
          <SettingToggle label="Auto DKP on Attendance" description="Automatically award DKP when members mark attendance" defaultOn disabled={!isFullAdmin} />
          <SettingToggle label="Weekly DKP Decay" description="Reduce DKP by 5% each week for inactive members" disabled={!isFullAdmin} />
          <SettingToggle label="DKP Cap" description="Set maximum DKP a member can accumulate" disabled={!isFullAdmin} />
        </div>

        {/* Notification Settings */}
        <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-6">
          <div className="text-sm font-bold text-foreground mb-4 pb-2.5 border-b border-primary/12">
            🔔 Notifications
          </div>
          <SettingToggle label="New Applications" description="Notify officers of new recruitment applications" defaultOn disabled={!isFullAdmin} />
          <SettingToggle label="Raid Reminders" description="Send reminders before scheduled raids" defaultOn disabled={!isFullAdmin} />
          <SettingToggle label="Auction Alerts" description="Alert members when auctions are ending" defaultOn disabled={!isFullAdmin} />
        </div>

        {/* Privacy Settings */}
        <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-6">
          <div className="text-sm font-bold text-foreground mb-4 pb-2.5 border-b border-primary/12">
            🔒 Privacy
          </div>
          <SettingToggle label="Hide DKP from Recruits" description="Only show DKP values to full members" disabled={!isFullAdmin} />
          <SettingToggle label="Anonymous Bidding" description="Hide bidder names during auctions" disabled={!isFullAdmin} />
          <SettingToggle label="Member Activity Logs" description="Track detailed member activity" defaultOn disabled={!isFullAdmin} />
        </div>
      </div>
    </div>
  )
}
