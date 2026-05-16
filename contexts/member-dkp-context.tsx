'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

export interface DkpHistoryEntry {
  id: string
  type: 'earn' | 'spend'
  amount: number
  reason: string
  date: string
  timestamp: number
}

export interface MemberDkp {
  dkp: number
  weeklyEarned: number
  weeklySpent: number
  attendance: number
  remaining: {
    fragmentCard: number
    timespace: number
    lnd: number
  }
  limits: {
    fragmentCard: number
    timespace: number
    lnd: number
  }
  history: DkpHistoryEntry[]
}

interface MemberDkpContextType {
  memberDkp: Record<number, MemberDkp>
  getMyDkp: () => MemberDkp
  addDkp: (memberId: number, amount: number, reason: string) => void
  spendDkp: (memberId: number, amount: number, reason: string) => void
  setAttendance: (memberId: number, attendance: number) => void
  resetWeekly: (memberId: number) => void
  currentUserId: number
}

// Default values - all starting at 0
const createDefaultMemberDkp = (): MemberDkp => ({
  dkp: 0,
  weeklyEarned: 0,
  weeklySpent: 0,
  attendance: 0,
  remaining: {
    fragmentCard: 40,
    timespace: 50,
    lnd: 50,
  },
  limits: {
    fragmentCard: 40,
    timespace: 50,
    lnd: 50,
  },
  history: [],
})

const MemberDkpContext = createContext<MemberDkpContextType | null>(null)

// Current logged in user ID (in a real app this would come from auth)
const CURRENT_USER_ID = 1

export function MemberDkpProvider({ children }: { children: ReactNode }) {
  const [memberDkp, setMemberDkp] = useState<Record<number, MemberDkp>>({
    [CURRENT_USER_ID]: createDefaultMemberDkp(),
  })

  const getMyDkp = (): MemberDkp => {
    return memberDkp[CURRENT_USER_ID] || createDefaultMemberDkp()
  }

  const addDkp = (memberId: number, amount: number, reason: string) => {
    setMemberDkp(prev => {
      const current = prev[memberId] || createDefaultMemberDkp()
      const newEntry: DkpHistoryEntry = {
        id: `dkp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'earn',
        amount,
        reason,
        date: 'Just now',
        timestamp: Date.now(),
      }
      
      return {
        ...prev,
        [memberId]: {
          ...current,
          dkp: current.dkp + amount,
          weeklyEarned: current.weeklyEarned + amount,
          history: [newEntry, ...current.history],
        },
      }
    })
  }

  const spendDkp = (memberId: number, amount: number, reason: string) => {
    setMemberDkp(prev => {
      const current = prev[memberId] || createDefaultMemberDkp()
      const newEntry: DkpHistoryEntry = {
        id: `dkp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'spend',
        amount,
        reason,
        date: 'Just now',
        timestamp: Date.now(),
      }
      
      return {
        ...prev,
        [memberId]: {
          ...current,
          dkp: Math.max(0, current.dkp - amount),
          weeklySpent: current.weeklySpent + amount,
          history: [newEntry, ...current.history],
        },
      }
    })
  }

  const setAttendance = (memberId: number, attendance: number) => {
    setMemberDkp(prev => {
      const current = prev[memberId] || createDefaultMemberDkp()
      return {
        ...prev,
        [memberId]: {
          ...current,
          attendance,
        },
      }
    })
  }

  const resetWeekly = (memberId: number) => {
    setMemberDkp(prev => {
      const current = prev[memberId] || createDefaultMemberDkp()
      return {
        ...prev,
        [memberId]: {
          ...current,
          weeklyEarned: 0,
          weeklySpent: 0,
        },
      }
    })
  }

  return (
    <MemberDkpContext.Provider value={{
      memberDkp,
      getMyDkp,
      addDkp,
      spendDkp,
      setAttendance,
      resetWeekly,
      currentUserId: CURRENT_USER_ID,
    }}>
      {children}
    </MemberDkpContext.Provider>
  )
}

export function useMemberDkp() {
  const context = useContext(MemberDkpContext)
  if (!context) {
    throw new Error('useMemberDkp must be used within a MemberDkpProvider')
  }
  return context
}
