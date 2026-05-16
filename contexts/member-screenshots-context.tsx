'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { MemberScreenshots } from '@/lib/data'

interface MemberScreenshotsContextType {
  // Current user's screenshots (for My Stats page)
  myScreenshots: MemberScreenshots
  updateMyScreenshot: (type: keyof MemberScreenshots, url: string) => void
  
  // All members' screenshots (keyed by member ID)
  memberScreenshots: Record<number, MemberScreenshots>
  updateMemberScreenshot: (memberId: number, type: keyof MemberScreenshots, url: string) => void
  getMemberScreenshots: (memberId: number) => MemberScreenshots
}

const MemberScreenshotsContext = createContext<MemberScreenshotsContextType | undefined>(undefined)

// Current user ID (in a real app, this would come from auth)
const CURRENT_USER_ID = 1

export function MemberScreenshotsProvider({ children }: { children: ReactNode }) {
  // Store all member screenshots by member ID
  const [memberScreenshots, setMemberScreenshots] = useState<Record<number, MemberScreenshots>>({
    [CURRENT_USER_ID]: {} // Initialize current user's screenshots
  })

  const updateMemberScreenshot = (memberId: number, type: keyof MemberScreenshots, url: string) => {
    setMemberScreenshots(prev => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [type]: url,
        uploadedAt: new Date().toISOString()
      }
    }))
  }

  const updateMyScreenshot = (type: keyof MemberScreenshots, url: string) => {
    updateMemberScreenshot(CURRENT_USER_ID, type, url)
  }

  const getMemberScreenshots = (memberId: number): MemberScreenshots => {
    return memberScreenshots[memberId] || {}
  }

  const myScreenshots = memberScreenshots[CURRENT_USER_ID] || {}

  return (
    <MemberScreenshotsContext.Provider value={{
      myScreenshots,
      updateMyScreenshot,
      memberScreenshots,
      updateMemberScreenshot,
      getMemberScreenshots
    }}>
      {children}
    </MemberScreenshotsContext.Provider>
  )
}

export function useMemberScreenshots() {
  const context = useContext(MemberScreenshotsContext)
  if (!context) {
    throw new Error('useMemberScreenshots must be used within MemberScreenshotsProvider')
  }
  return context
}
