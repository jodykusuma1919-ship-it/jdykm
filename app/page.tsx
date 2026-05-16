'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Topbar } from '@/components/topbar'
import { DashboardPage } from '@/components/pages/dashboard'
import { MembersPage } from '@/components/pages/members'
import { DkpPage } from '@/components/pages/dkp'
import { MyDkpPage } from '@/components/pages/my-dkp'
import { LootPage } from '@/components/pages/loot'
import { EventsPage } from '@/components/pages/events'
import { AttendancePage } from '@/components/pages/attendance'
import { AnalyticsPage } from '@/components/pages/analytics'
import { RecruitmentPage } from '@/components/pages/recruitment'
import { SettingsPage } from '@/components/pages/settings'
import { PartiesPage } from '@/components/pages/parties'
import { BattlefieldPage } from '@/components/pages/battlefield'

export type Page = 'dashboard' | 'members' | 'dkp' | 'my-dkp' | 'loot' | 'events' | 'attendance' | 'analytics' | 'recruitment' | 'settings' | 'parties' | 'battlefield'

const pageLabels: Record<Page, string> = {
  dashboard: 'Dashboard',
  members: 'Guild Members',
  dkp: 'DKP System',
  'my-dkp': 'My DKP',
  loot: 'Loot Management',
  events: 'Events',
  attendance: 'Attendance',
  analytics: 'Analytics',
  recruitment: 'Recruitment',
  settings: 'Settings',
  parties: 'Party Management',
  battlefield: 'Battlefield Setup',
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
        {currentPage === 'members' && <MembersPage />}
        {currentPage === 'dkp' && <DkpPage />}
        {currentPage === 'my-dkp' && <MyDkpPage />}
        {currentPage === 'loot' && <LootPage onNavigate={navigate} />}
        {currentPage === 'events' && <EventsPage onNavigate={navigate} />}
        {currentPage === 'attendance' && <AttendancePage />}
        {currentPage === 'analytics' && <AnalyticsPage />}
        {currentPage === 'recruitment' && <RecruitmentPage />}
        {currentPage === 'settings' && <SettingsPage onNavigate={navigate} />}
        {currentPage === 'parties' && <PartiesPage />}
        {currentPage === 'battlefield' && <BattlefieldPage />}
      </main>
    </div>
  )
}
