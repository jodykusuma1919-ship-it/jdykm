'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export interface BidLimits {
  fragmentCard: number
  timespace: number
  lnd: number
}

export interface LootRewards {
  fragmentCard: { dkpCost: number; quantity: number }
  timespace: { dkpCost: number; quantity: number }
  lnd: { dkpCost: number; quantity: number }
}

export interface GuildSettings {
  selectedPreset: string
  bidLimits: BidLimits
  lootRewards: LootRewards
}

interface GuildSettingsContextType {
  settings: GuildSettings
  updateBidLimits: (limits: BidLimits) => void
  updateLootRewards: (rewards: LootRewards) => void
  updatePreset: (preset: string) => void
  saveSettings: () => void
  isLoading: boolean
}

const defaultSettings: GuildSettings = {
  selectedPreset: '222',
  bidLimits: { fragmentCard: 2, timespace: 2, lnd: 2 },
  lootRewards: {
    fragmentCard: { dkpCost: 100, quantity: 3 },
    timespace: { dkpCost: 150, quantity: 2 },
    lnd: { dkpCost: 200, quantity: 1 },
  }
}

const presetValues: Record<string, BidLimits> = {
  '333': { fragmentCard: 3, timespace: 3, lnd: 3 },
  '222': { fragmentCard: 2, timespace: 2, lnd: 2 },
  '111': { fragmentCard: 1, timespace: 1, lnd: 1 },
}

const GuildSettingsContext = createContext<GuildSettingsContextType | null>(null)

const SETTINGS_KEY = 'guildSettings'

export function GuildSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<GuildSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)

  // Load settings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(SETTINGS_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Handle both old format (customValues) and new format (bidLimits)
        const bidLimits = parsed.bidLimits || parsed.customValues || defaultSettings.bidLimits
        setSettings({
          selectedPreset: parsed.selectedPreset || '222',
          bidLimits: bidLimits,
          lootRewards: parsed.lootRewards || defaultSettings.lootRewards,
        })
      } catch (e) {
        console.error('Failed to parse guild settings:', e)
      }
    }
    setIsLoading(false)
  }, [])

  const updateBidLimits = (limits: BidLimits) => {
    setSettings(prev => ({
      ...prev,
      selectedPreset: 'custom',
      bidLimits: limits,
    }))
  }

  const updateLootRewards = (rewards: LootRewards) => {
    setSettings(prev => ({
      ...prev,
      lootRewards: rewards,
    }))
  }

  const updatePreset = (preset: string) => {
    const limits = preset === 'custom' 
      ? settings.bidLimits 
      : presetValues[preset] || defaultSettings.bidLimits
    
    setSettings(prev => ({
      ...prev,
      selectedPreset: preset,
      bidLimits: limits,
    }))
  }

  const saveSettings = () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  }

  return (
    <GuildSettingsContext.Provider value={{
      settings,
      updateBidLimits,
      updateLootRewards,
      updatePreset,
      saveSettings,
      isLoading,
    }}>
      {children}
    </GuildSettingsContext.Provider>
  )
}

export function useGuildSettings() {
  const context = useContext(GuildSettingsContext)
  if (!context) {
    throw new Error('useGuildSettings must be used within a GuildSettingsProvider')
  }
  return context
}
