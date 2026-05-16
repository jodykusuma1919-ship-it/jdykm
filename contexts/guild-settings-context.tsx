'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export interface BidLimits {
  fragmentCard: number
  timespace: number
  lnd: number
}

export interface EventBidLimits {
  gl: BidLimits
  woe: BidLimits
}

export interface LootRequest {
  id: string
  memberId: number
  memberName: string
  memberClass: { icon: string; name: string }
  itemType: 'Fragment Card' | 'LND' | 'Timespace'
  quantity: number
  dkpCost: number
  note: string
  status: 'pending' | 'approved' | 'declined'
  requestedAt: string
  processedAt?: string
  processedBy?: string
}

export interface LootRewards {
  fragmentCard: { dkpCost: number; quantity: number }
  timespace: { dkpCost: number; quantity: number }
  lnd: { dkpCost: number; quantity: number }
}

export interface LootInventory {
  fragmentCard: { current: number; total: number }
  timespace: { current: number; total: number }
  lnd: { current: number; total: number }
}

export interface DiscordSettings {
  webhookUrl: string
  eventChannelId: string
  botToken: string
  guildId: string
  isConnected: boolean
}

export interface GuildSettings {
  selectedPreset: string
  bidLimits: BidLimits
  eventBidLimits: EventBidLimits
  lootRewards: LootRewards
  lootInventory: LootInventory
  maxDkpPerBid: number
  discord: DiscordSettings
  lootRequests: LootRequest[]
  approvedLoot: LootRequest[]
}

interface GuildSettingsContextType {
  settings: GuildSettings
  updateBidLimits: (limits: BidLimits) => void
  updateEventBidLimits: (eventType: 'gl' | 'woe', limits: BidLimits) => void
  updateLootRewards: (rewards: LootRewards) => void
  updateLootInventory: (inventory: LootInventory) => void
  updateMaxDkpPerBid: (maxDkp: number) => void
  updateDiscordSettings: (discord: Partial<DiscordSettings>) => void
  updatePreset: (preset: string) => void
  addLootRequest: (request: Omit<LootRequest, 'id' | 'status' | 'requestedAt'>) => void
  processLootRequest: (requestId: string, status: 'approved' | 'declined', processedBy: string) => void
  saveSettings: () => void
  isLoading: boolean
}

const defaultSettings: GuildSettings = {
  selectedPreset: '222',
  bidLimits: { fragmentCard: 2, timespace: 2, lnd: 2 },
  eventBidLimits: {
    gl: { fragmentCard: 2, timespace: 2, lnd: 2 },
    woe: { fragmentCard: 2, timespace: 2, lnd: 2 },
  },
  lootRewards: {
    fragmentCard: { dkpCost: 100, quantity: 3 },
    timespace: { dkpCost: 150, quantity: 2 },
    lnd: { dkpCost: 200, quantity: 1 },
  },
  lootInventory: {
    fragmentCard: { current: 127, total: 200 },
    timespace: { current: 45, total: 100 },
    lnd: { current: 83, total: 150 },
  },
  maxDkpPerBid: 50,
  discord: {
    webhookUrl: '',
    eventChannelId: '',
    botToken: '',
    guildId: '',
    isConnected: false,
  },
  lootRequests: [],
  approvedLoot: [],
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
          eventBidLimits: parsed.eventBidLimits || defaultSettings.eventBidLimits,
          lootRewards: parsed.lootRewards || defaultSettings.lootRewards,
          lootInventory: parsed.lootInventory || defaultSettings.lootInventory,
          maxDkpPerBid: parsed.maxDkpPerBid ?? defaultSettings.maxDkpPerBid,
          discord: parsed.discord || defaultSettings.discord,
          lootRequests: parsed.lootRequests || [],
          approvedLoot: parsed.approvedLoot || [],
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

  const updateEventBidLimits = (eventType: 'gl' | 'woe', limits: BidLimits) => {
    setSettings(prev => ({
      ...prev,
      eventBidLimits: {
        ...prev.eventBidLimits,
        [eventType]: limits,
      },
    }))
  }

  const updateLootRewards = (rewards: LootRewards) => {
    setSettings(prev => ({
      ...prev,
      lootRewards: rewards,
    }))
  }

  const updateLootInventory = (inventory: LootInventory) => {
    setSettings(prev => {
      const newSettings = { ...prev, lootInventory: inventory }
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings))
      return newSettings
    })
  }

  const updateMaxDkpPerBid = (maxDkp: number) => {
    setSettings(prev => {
      const newSettings = { ...prev, maxDkpPerBid: maxDkp }
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings))
      return newSettings
    })
  }

  const updateDiscordSettings = (discord: Partial<DiscordSettings>) => {
    setSettings(prev => {
      const newSettings = { 
        ...prev, 
        discord: { ...prev.discord, ...discord } 
      }
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings))
      return newSettings
    })
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

  const addLootRequest = (request: Omit<LootRequest, 'id' | 'status' | 'requestedAt'>) => {
    const newRequest: LootRequest = {
      ...request,
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    }
    setSettings(prev => ({
      ...prev,
      lootRequests: [...prev.lootRequests, newRequest],
    }))
    // Auto-save when adding request
    setTimeout(() => {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({
        ...settings,
        lootRequests: [...settings.lootRequests, newRequest],
      }))
    }, 0)
  }

  const processLootRequest = (requestId: string, status: 'approved' | 'declined', processedBy: string) => {
    setSettings(prev => {
      const request = prev.lootRequests.find(r => r.id === requestId)
      if (!request) return prev

      const processedRequest: LootRequest = {
        ...request,
        status,
        processedAt: new Date().toISOString(),
        processedBy,
      }

      const updatedRequests = prev.lootRequests.filter(r => r.id !== requestId)
      const updatedApprovedLoot = status === 'approved' 
        ? [...prev.approvedLoot, processedRequest]
        : prev.approvedLoot

      const newSettings = {
        ...prev,
        lootRequests: updatedRequests,
        approvedLoot: updatedApprovedLoot,
      }

      // Auto-save when processing request
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings))
      
      return newSettings
    })
  }

  const saveSettings = () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  }

  return (
    <GuildSettingsContext.Provider value={{
      settings,
      updateBidLimits,
      updateEventBidLimits,
      updateLootRewards,
      updateLootInventory,
      updateMaxDkpPerBid,
      updateDiscordSettings,
      updatePreset,
      addLootRequest,
      processLootRequest,
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
