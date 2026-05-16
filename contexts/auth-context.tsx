'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type GuildRole = 'Admin' | 'Guild Master' | 'Vice Master' | 'Commander' | 'Officer' | 'Raid Leader' | 'Member' | 'Recruit'

export interface User {
  id: string
  username: string
  displayName: string
  role: GuildRole
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (username: string, password: string, displayName: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const USERS_KEY = 'guild_users'
const CURRENT_USER_KEY = 'guild_current_user'

// Demo admin account - Admin role has FULL access to everything
const DEFAULT_ADMIN: User & { password: string } = {
  id: 'admin-001',
  username: 'admin',
  password: 'admin123',
  displayName: 'Administrator',
  role: 'Admin',
  createdAt: new Date().toISOString(),
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize default admin if no users exist
    const storedUsers = localStorage.getItem(USERS_KEY)
    if (!storedUsers) {
      localStorage.setItem(USERS_KEY, JSON.stringify([DEFAULT_ADMIN]))
    } else {
      // Update existing admin user to have correct Admin role
      const users = JSON.parse(storedUsers) as (User & { password: string })[]
      const adminIndex = users.findIndex(u => u.username === 'admin')
      if (adminIndex !== -1 && users[adminIndex].role !== 'Admin') {
        users[adminIndex] = { ...users[adminIndex], role: 'Admin', displayName: 'Administrator' }
        localStorage.setItem(USERS_KEY, JSON.stringify(users))
      }
    }

    // Check for existing session
    const currentUser = localStorage.getItem(CURRENT_USER_KEY)
    if (currentUser) {
      const parsed = JSON.parse(currentUser) as User
      // Fix admin role if cached incorrectly
      if (parsed.username === 'admin' && parsed.role !== 'Admin') {
        parsed.role = 'Admin'
        parsed.displayName = 'Administrator'
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(parsed))
      }
      setUser(parsed)
    }
    setIsLoading(false)
  }, [])

  const getUsers = (): (User & { password: string })[] => {
    const stored = localStorage.getItem(USERS_KEY)
    return stored ? JSON.parse(stored) : [DEFAULT_ADMIN]
  }

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const users = getUsers()
    const foundUser = users.find(u => u.username.toLowerCase() === username.toLowerCase())

    if (!foundUser) {
      return { success: false, error: 'User not found' }
    }

    if (foundUser.password !== password) {
      return { success: false, error: 'Invalid password' }
    }

    const { password: _, ...userWithoutPassword } = foundUser
    setUser(userWithoutPassword)
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword))
    return { success: true }
  }

  const register = async (username: string, password: string, displayName: string): Promise<{ success: boolean; error?: string }> => {
    const users = getUsers()

    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, error: 'Username already exists' }
    }

    if (username.length < 3) {
      return { success: false, error: 'Username must be at least 3 characters' }
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' }
    }

    const newUser: User & { password: string } = {
      id: `user-${Date.now()}`,
      username,
      password,
      displayName: displayName || username,
      role: 'Member',
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    localStorage.setItem(USERS_KEY, JSON.stringify(users))

    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword))
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(CURRENT_USER_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
