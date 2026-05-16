'use client'

import { useState } from 'react'
import { AuthProvider, useAuth } from '@/contexts/auth-context'
import { LoginPage } from '@/components/login-page'
import { Sidebar } from '@/components/sidebar'
import { Topbar } from '@/components/topbar'
import { DashboardPage } from '@/components/pages/dashboard'
import { MembersPage } from '@/components/pages/members'
import { DkpPage } from '@/components/pages/dkp'
import { MyDkpPage } from '@/components/pages/my-dkp'
import { MyStatsPage } from '@/components/pages/my-stats'
import { LootPage } from '@/components/pages/loot'
import { EventsPage } from '@/components/pages/events'
import { AttendancePage } from '@/components/pages/attendance'
import { AnalyticsPage } from '@/components/pages/analytics'
import { RecruitmentPage } from '@/components/pages/recruitment'
import { SettingsPage } from '@/components/pages/settings'
import { PartiesPage } from '@/components/pages/parties'
import { BattlefieldPage } from '@/components/pages/battlefield'
import type { GuildRole } from '@/contexts/auth-context'

export type Page = 'dashboard' | 'members' | 'dkp' | 'my-dkp' | 'my-stats' | 'loot' | 'events' | 'attendance' | 'analytics' | 'recruitment' | 'settings' | 'parties' | 'battlefield'

const pageLabels: Record<Page, string> = {
  dashboard: 'Dashboard',
  members: 'Guild Members',
  dkp: 'DKP System',
  'my-dkp': 'My DKP',
  'my-stats': 'My Character Stats',
  loot: 'Loot Management',
  events: 'Events',
  attendance: 'Attendance',
  analytics: 'Analytics',
  recruitment: 'Recruitment',
  settings: 'Settings',
  parties: 'Party Management',
  battlefield: 'Battlefield Setup',
}

function GuildApp() {
  const { user } = useAuth()
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const userRole = (user?.role || 'Member') as GuildRole

  const navigate = (page: Page) => {
    setCurrentPage(page)
    setMobileMenuOpen(false)
  }

  const toggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 769) {
      setMobileMenuOpen(!mobileMenuOpen)
    } else {
      setSidebarCollapsed(!sidebarCollapsed)
    }
  }

  return (
    <div className="relative z-[1] flex min-h-screen">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[99] backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <Sidebar 
        currentPage={currentPage} 
        onNavigate={navigate}
        collapsed={sidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        userRole={userRole}
        userName={user?.displayName || 'User'}
      />

      <Topbar 
        breadcrumb={pageLabels[currentPage]}
        collapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        onNavigate={navigate}
      />

      <main 
        className={`
          mt-16 min-h-[calc(100vh-4rem)] p-7 transition-all duration-300 ease-out
          ${sidebarCollapsed ? 'ml-[72px]' : 'ml-[260px]'}
          max-md:ml-0 max-md:p-4
        `}
      >
        {currentPage === 'dashboard' && <DashboardPage onNavigate={navigate} />}
        {currentPage === 'members' && <MembersPage userRole={userRole} />}
        {currentPage === 'dkp' && <DkpPage />}
        {currentPage === 'my-dkp' && <MyDkpPage />}
        {currentPage === 'my-stats' && <MyStatsPage />}
        {currentPage === 'loot' && <LootPage onNavigate={navigate} userRole={userRole} />}
        {currentPage === 'events' && <EventsPage onNavigate={navigate} userRole={userRole} />}
        {currentPage === 'attendance' && <AttendancePage />}
        {currentPage === 'analytics' && <AnalyticsPage />}
        {currentPage === 'recruitment' && <RecruitmentPage userRole={userRole} />}
        {currentPage === 'settings' && <SettingsPage onNavigate={navigate} userRole={userRole} />}
        {currentPage === 'parties' && <PartiesPage />}
        {currentPage === 'battlefield' && <BattlefieldPage />}
      </main>
    </div>
  )
}

function AuthenticatedApp() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="relative z-[1] flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  return <GuildApp />
}

export default function Home() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  )
}
