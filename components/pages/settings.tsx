'use client'

import { useState, useEffect } from 'react'
import { canEditAllSettings, canEditBattleSettings, getRoleColor } from '@/lib/roles'
import type { GuildRole } from '@/lib/roles'
import type { Page } from '@/app/page'
import { useGuildSettings } from '@/contexts/guild-settings-context'

interface SettingsPageProps {
  onNavigate?: (page: Page) => void
  userRole: GuildRole
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

// Stepper Component with +/- buttons only (no keyboard input)
function StepperInput({ 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  step = 1,
  disabled = false,
  colorClass = 'border-primary/30 bg-primary/10 hover:bg-primary/30 hover:border-primary'
}: { 
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  colorClass?: string
}) {
  const decrement = () => {
    if (!disabled && value > min) {
      onChange(Math.max(min, value - step))
    }
  }

  const increment = () => {
    if (!disabled && value < max) {
      onChange(Math.min(max, value + step))
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={decrement}
        disabled={disabled || value <= min}
        className={`w-[36px] h-[36px] rounded-lg border ${colorClass} text-foreground text-xl font-bold flex items-center justify-center transition-all duration-150 leading-none ${disabled || value <= min ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      >
        −
      </button>
      <span className="font-mono text-xl font-bold text-primary-light min-w-10 text-center">{value}</span>
      <button 
        onClick={increment}
        disabled={disabled || value >= max}
        className={`w-[36px] h-[36px] rounded-lg border ${colorClass} text-foreground text-xl font-bold flex items-center justify-center transition-all duration-150 leading-none ${disabled || value >= max ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      >
        +
      </button>
    </div>
  )
}

export function SettingsPage({ onNavigate, userRole }: SettingsPageProps) {
  const { settings, updateBidLimits, updateEventBidLimits, updateLootRewards, updateDiscordSettings, updatePreset, saveSettings, isLoading } = useGuildSettings()
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [testingConnection, setTestingConnection] = useState(false)
  const isFullAdmin = canEditAllSettings(userRole)
  const canEditBattle = canEditBattleSettings(userRole)

  // Local state synced with context
  const selectedPreset = settings.selectedPreset
  const customValues = settings.bidLimits
  const lootRewards = settings.lootRewards

  const setSelectedPreset = (preset: string) => {
    updatePreset(preset)
  }

  const setCustomValues = (updater: (prev: typeof customValues) => typeof customValues) => {
    const newValues = updater(customValues)
    updateBidLimits(newValues)
  }

  const setLootRewards = (updater: (prev: typeof lootRewards) => typeof lootRewards) => {
    const newValues = updater(lootRewards)
    updateLootRewards(newValues)
  }
  
  const handleSaveChanges = () => {
    setSaveStatus('saving')
    setTimeout(() => {
      saveSettings()
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }, 500)
  }

  if (isLoading) {
    return <div className="animate-pulse text-center py-10 text-muted-foreground">Loading settings...</div>
  }

  const presets = [
    { id: '333', icon: '⚔', label: '3-3-3', description: 'Balanced', values: { fragmentCard: 3, timespace: 3, lnd: 3 } },
    { id: '222', icon: '🛡', label: '2-2-2', description: 'Default', values: { fragmentCard: 2, timespace: 2, lnd: 2 } },
    { id: '111', icon: '🎯', label: '1-1-1', description: 'Strict', values: { fragmentCard: 1, timespace: 1, lnd: 1 } },
  ]

  const stepValue = (key: 'fragmentCard' | 'timespace' | 'lnd', newValue: number) => {
    if (!isFullAdmin) return
    setSelectedPreset('custom')
    setCustomValues(v => ({
      ...v,
      [key]: newValue
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
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${getRoleColor(userRole)}`}>
              {userRole}
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
          <button 
            onClick={handleSaveChanges}
            disabled={saveStatus === 'saving'}
            className={`inline-flex items-center gap-2 py-2.5 px-4 rounded-xl border-none cursor-pointer font-sans text-sm font-bold tracking-wide transition-all duration-200 whitespace-nowrap ${
              saveStatus === 'saved' 
                ? 'bg-accent text-white shadow-[0_4px_15px_rgba(34,197,94,0.35)]' 
                : saveStatus === 'saving'
                ? 'bg-primary/50 text-white/70 cursor-wait'
                : 'bg-gradient-to-br from-primary to-indigo-600 text-white shadow-[0_4px_15px_rgba(124,58,237,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(124,58,237,0.5)]'
            }`}
          >
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
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
            Fragment Card: max 100 | Timespace: max 100 | LND: max 100
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

        {/* Custom Values with +/- steppers only */}
        {selectedPreset === 'custom' && (
          <div className="grid grid-cols-3 gap-4 p-4 bg-primary/5 border border-primary/20 rounded-xl max-sm:grid-cols-1">
            {(['fragmentCard', 'timespace', 'lnd'] as const).map(key => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{getDisplayLabel(key)}</span>
                <StepperInput
                  value={customValues[key]}
                  onChange={(val) => stepValue(key, val)}
                  min={0}
                  max={100}
                  disabled={!isFullAdmin}
                />
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
              <span className="text-xl">��</span>
              <span className="text-sm font-bold text-foreground">Fragment Card</span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[11px] text-muted-foreground font-semibold mb-2 block">DKP Cost per Bid</label>
                <StepperInput
                  value={lootRewards.fragmentCard.dkpCost}
                  onChange={(val) => isFullAdmin && setLootRewards(r => ({ ...r, fragmentCard: { ...r.fragmentCard, dkpCost: val } }))}
                  min={10}
                  max={1000}
                  step={10}
                  disabled={!isFullAdmin}
                  colorClass="border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 hover:border-purple-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground font-semibold mb-2 block">Default Quantity</label>
                <StepperInput
                  value={lootRewards.fragmentCard.quantity}
                  onChange={(val) => isFullAdmin && setLootRewards(r => ({ ...r, fragmentCard: { ...r.fragmentCard, quantity: val } }))}
                  min={1}
                  max={10}
                  disabled={!isFullAdmin}
                  colorClass="border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 hover:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Timespace Rewards */}
          <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🔮</span>
              <span className="text-sm font-bold text-foreground">Timespace</span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[11px] text-muted-foreground font-semibold mb-2 block">DKP Cost per Bid</label>
                <StepperInput
                  value={lootRewards.timespace.dkpCost}
                  onChange={(val) => isFullAdmin && setLootRewards(r => ({ ...r, timespace: { ...r.timespace, dkpCost: val } }))}
                  min={10}
                  max={1000}
                  step={10}
                  disabled={!isFullAdmin}
                  colorClass="border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 hover:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground font-semibold mb-2 block">Default Quantity</label>
                <StepperInput
                  value={lootRewards.timespace.quantity}
                  onChange={(val) => isFullAdmin && setLootRewards(r => ({ ...r, timespace: { ...r.timespace, quantity: val } }))}
                  min={1}
                  max={10}
                  disabled={!isFullAdmin}
                  colorClass="border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 hover:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* LND Rewards */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">⚡</span>
              <span className="text-sm font-bold text-foreground">LND</span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[11px] text-muted-foreground font-semibold mb-2 block">DKP Cost per Bid</label>
                <StepperInput
                  value={lootRewards.lnd.dkpCost}
                  onChange={(val) => isFullAdmin && setLootRewards(r => ({ ...r, lnd: { ...r.lnd, dkpCost: val } }))}
                  min={10}
                  max={1000}
                  step={10}
                  disabled={!isFullAdmin}
                  colorClass="border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 hover:border-amber-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground font-semibold mb-2 block">Default Quantity</label>
                <StepperInput
                  value={lootRewards.lnd.quantity}
                  onChange={(val) => isFullAdmin && setLootRewards(r => ({ ...r, lnd: { ...r.lnd, quantity: val } }))}
                  min={1}
                  max={10}
                  disabled={!isFullAdmin}
                  colorClass="border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 hover:border-amber-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GL & WOE Event Bid Limits */}
      <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-6 mb-6">
        <div className="border-b border-primary/15 pb-3 mb-5">
          <div className="text-[15px] font-bold text-foreground flex items-center gap-2">
            ⚔ Event Bid Limits (GL & WOE)
            <span className="text-[11px] font-medium text-muted-foreground/70 ml-2">Max bids per member per event</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Configure separate bid limits for Guild League (GL) and War of Emperium (WOE) events
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
          {/* GL Bid Limits */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🏆</span>
              <span className="text-sm font-bold text-foreground">Guild League (GL)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gold/20 text-gold ml-auto">2-2-2</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Fragment Card</span>
                <StepperInput
                  value={settings.eventBidLimits.gl.fragmentCard}
                  onChange={(val) => isFullAdmin && updateEventBidLimits('gl', { ...settings.eventBidLimits.gl, fragmentCard: val })}
                  min={0}
                  max={10}
                  disabled={!isFullAdmin}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Timespace</span>
                <StepperInput
                  value={settings.eventBidLimits.gl.timespace}
                  onChange={(val) => isFullAdmin && updateEventBidLimits('gl', { ...settings.eventBidLimits.gl, timespace: val })}
                  min={0}
                  max={10}
                  disabled={!isFullAdmin}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">LND</span>
                <StepperInput
                  value={settings.eventBidLimits.gl.lnd}
                  onChange={(val) => isFullAdmin && updateEventBidLimits('gl', { ...settings.eventBidLimits.gl, lnd: val })}
                  min={0}
                  max={10}
                  disabled={!isFullAdmin}
                />
              </div>
            </div>
          </div>

          {/* WOE Bid Limits */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">⚔</span>
              <span className="text-sm font-bold text-foreground">War of Emperium (WOE)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 ml-auto">2-2-2</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Fragment Card</span>
                <StepperInput
                  value={settings.eventBidLimits.woe.fragmentCard}
                  onChange={(val) => isFullAdmin && updateEventBidLimits('woe', { ...settings.eventBidLimits.woe, fragmentCard: val })}
                  min={0}
                  max={10}
                  disabled={!isFullAdmin}
                  colorClass="border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 hover:border-amber-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Timespace</span>
                <StepperInput
                  value={settings.eventBidLimits.woe.timespace}
                  onChange={(val) => isFullAdmin && updateEventBidLimits('woe', { ...settings.eventBidLimits.woe, timespace: val })}
                  min={0}
                  max={10}
                  disabled={!isFullAdmin}
                  colorClass="border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 hover:border-amber-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">LND</span>
                <StepperInput
                  value={settings.eventBidLimits.woe.lnd}
                  onChange={(val) => isFullAdmin && updateEventBidLimits('woe', { ...settings.eventBidLimits.woe, lnd: val })}
                  min={0}
                  max={10}
                  disabled={!isFullAdmin}
                  colorClass="border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 hover:border-amber-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Discord Integration - Admin Only */}
      {isFullAdmin && (
        <div className="bg-card backdrop-blur-xl border border-[#5865F2]/25 rounded-2xl p-6 mb-6">
          <div className="border-b border-[#5865F2]/15 pb-3 mb-5">
            <div className="text-[15px] font-bold text-foreground flex items-center gap-2">
              <svg width="20" height="16" viewBox="0 0 18 14" fill="#5865F2">
                <path d="M15.25 1.18A14.78 14.78 0 0 0 11.44 0a.06.06 0 0 0-.06.03c-.17.3-.35.69-.48.99a13.65 13.65 0 0 0-4.05 0c-.13-.3-.32-.68-.49-1a.06.06 0 0 0-.06-.03A14.74 14.74 0 0 0 2.7 1.18a.05.05 0 0 0-.03.02C.4 4.55-.24 7.82.07 11.05c0 .02.02.03.03.04a14.9 14.9 0 0 0 4.47 2.24c.02.01.05 0 .06-.02.34-.47.65-.96.91-1.48.02-.03 0-.07-.03-.08a9.8 9.8 0 0 1-1.4-.66.05.05 0 0 1-.01-.09l.28-.22a.06.06 0 0 1 .06 0c2.94 1.33 6.12 1.33 9.03 0a.06.06 0 0 1 .06 0l.28.22c.03.03.03.07-.01.09-.45.26-.91.48-1.4.66-.04.01-.05.05-.03.08.27.52.58 1 .91 1.48.01.02.04.03.06.02a14.86 14.86 0 0 0 4.49-2.24.05.05 0 0 0 .03-.04c.37-3.79-.62-7.06-2.63-10.87a.04.04 0 0 0-.03-.02ZM6.01 9.06c-.87 0-1.59-.8-1.59-1.78 0-.98.7-1.78 1.59-1.78.9 0 1.6.8 1.59 1.78 0 .98-.7 1.78-1.59 1.78Zm5.88 0c-.87 0-1.59-.8-1.59-1.78 0-.98.7-1.78 1.59-1.78.9 0 1.6.8 1.59 1.78 0 .98-.69 1.78-1.59 1.78Z"/>
              </svg>
              Discord Integration
              {settings.discord.isConnected && (
                <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded bg-accent/20 text-accent">Connected</span>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Connect your Discord server to post events and enable bot features
            </div>
          </div>

          <div className="space-y-4">
            {/* Event Webhook URL */}
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                Event Channel Webhook URL
              </label>
              <input
                type="url"
                value={settings.discord.webhookUrl}
                onChange={e => updateDiscordSettings({ webhookUrl: e.target.value })}
                placeholder="https://discord.com/api/webhooks/..."
                className="w-full bg-white/4 border border-[#5865F2]/20 rounded-xl py-2.5 px-4 text-foreground text-sm font-sans outline-none transition-all duration-200 focus:border-[#5865F2] focus:shadow-[0_0_10px_rgba(88,101,242,0.3)] placeholder:text-muted-foreground/50"
              />
              <div className="text-[10px] text-muted-foreground/60 mt-1">
                Events will be posted to this channel automatically
              </div>
            </div>

            {/* Event Channel ID */}
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                Event Channel ID
              </label>
              <input
                type="text"
                value={settings.discord.eventChannelId}
                onChange={e => updateDiscordSettings({ eventChannelId: e.target.value })}
                placeholder="123456789012345678"
                className="w-full bg-white/4 border border-[#5865F2]/20 rounded-xl py-2.5 px-4 text-foreground text-sm font-mono outline-none transition-all duration-200 focus:border-[#5865F2] focus:shadow-[0_0_10px_rgba(88,101,242,0.3)] placeholder:text-muted-foreground/50"
              />
              <div className="text-[10px] text-muted-foreground/60 mt-1">
                Right-click the channel in Discord and select &quot;Copy Channel ID&quot;
              </div>
            </div>

            {/* Discord Server ID */}
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                Discord Server (Guild) ID
              </label>
              <input
                type="text"
                value={settings.discord.guildId}
                onChange={e => updateDiscordSettings({ guildId: e.target.value })}
                placeholder="123456789012345678"
                className="w-full bg-white/4 border border-[#5865F2]/20 rounded-xl py-2.5 px-4 text-foreground text-sm font-mono outline-none transition-all duration-200 focus:border-[#5865F2] focus:shadow-[0_0_10px_rgba(88,101,242,0.3)] placeholder:text-muted-foreground/50"
              />
              <div className="text-[10px] text-muted-foreground/60 mt-1">
                Right-click your server icon and select &quot;Copy Server ID&quot;
              </div>
            </div>

            {/* Bot Token (for future features) */}
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                Bot Token <span className="text-muted-foreground/50">(Optional - for advanced features)</span>
              </label>
              <input
                type="password"
                value={settings.discord.botToken}
                onChange={e => updateDiscordSettings({ botToken: e.target.value })}
                placeholder="Your bot token..."
                className="w-full bg-white/4 border border-[#5865F2]/20 rounded-xl py-2.5 px-4 text-foreground text-sm font-mono outline-none transition-all duration-200 focus:border-[#5865F2] focus:shadow-[0_0_10px_rgba(88,101,242,0.3)] placeholder:text-muted-foreground/50"
              />
              <div className="text-[10px] text-muted-foreground/60 mt-1">
                Required for bot commands and advanced Discord integration
              </div>
            </div>

            {/* Test Connection Button */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={async () => {
                  if (!settings.discord.webhookUrl) return
                  setTestingConnection(true)
                  try {
                    const res = await fetch('/api/discord', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        name: 'Test Connection',
                        type: 'Test',
                        date: new Date().toISOString(),
                        time: '00:00',
                        details: 'This is a test message from your Guild DKP system.',
                        dkpReward: 0,
                        maxAttendance: 0,
                        webhookUrl: settings.discord.webhookUrl,
                      }),
                    })
                    if (res.ok) {
                      updateDiscordSettings({ isConnected: true })
                    }
                  } catch {
                    updateDiscordSettings({ isConnected: false })
                  }
                  setTestingConnection(false)
                }}
                disabled={!settings.discord.webhookUrl || testingConnection}
                className={`inline-flex items-center gap-2 py-2.5 px-4 rounded-xl font-sans text-sm font-bold tracking-wide transition-all duration-200 ${
                  settings.discord.webhookUrl && !testingConnection
                    ? 'cursor-pointer bg-[#5865F2] text-white hover:bg-[#4752C4] shadow-[0_4px_15px_rgba(88,101,242,0.35)]'
                    : 'cursor-not-allowed bg-gray-600/50 text-gray-400 opacity-60'
                }`}
              >
                {testingConnection ? 'Testing...' : 'Test Connection'}
              </button>
              {settings.discord.isConnected && (
                <span className="text-xs text-accent font-semibold">Connection successful!</span>
              )}
            </div>

            {/* Help Link */}
            <div className="pt-3 border-t border-[#5865F2]/10">
              <a 
                href="https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#5865F2] hover:underline"
              >
                How to create a Discord webhook
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Other Settings */}
      <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
        {/* Guild Settings */}
        <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-6">
          <div className="text-sm font-bold text-foreground mb-4 pb-2.5 border-b border-primary/12">
            Guild Settings
          </div>
          <SettingToggle label="Auto-accept Recruits" description="Automatically accept applications that meet requirements" disabled={!isFullAdmin} />
          <SettingToggle label="Public Guild Profile" description="Allow anyone to view guild stats and members" defaultOn disabled={!isFullAdmin} />
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
