'use client'

import type { Page } from '@/app/page'

interface SidebarProps {
  currentPage: Page
  onNavigate: (page: Page) => void
  collapsed: boolean
  mobileOpen: boolean
}

interface NavItemProps {
  page: Page
  icon: string
  label: string
  badge?: number
  active: boolean
  onClick: () => void
  collapsed: boolean
}

function NavItem({ icon, label, badge, active, onClick, collapsed }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-3.5 py-2.5 px-4 cursor-pointer rounded-xl mx-2 my-0.5
        transition-all duration-200 relative text-left w-[calc(100%-1rem)] overflow-hidden
        ${active 
          ? 'bg-gradient-to-r from-primary/25 to-primary/5 text-primary-light border-l-2 border-primary pl-4' 
          : 'text-muted-foreground hover:bg-primary/15 hover:text-foreground hover:shadow-[0_0_10px_rgba(124,58,237,0.3)]'
        }
      `}
    >
      {active && (
        <div className="absolute left-0 top-[20%] bottom-[20%] w-[3px] bg-primary rounded-r-sm shadow-[0_0_8px_var(--primary)]" />
      )}
      <span className="text-lg min-w-[22px] flex items-center justify-center">{icon}</span>
      <span className={`text-sm font-semibold tracking-wide transition-all duration-200 whitespace-nowrap ${collapsed ? 'opacity-0 w-0' : ''}`}>
        {label}
      </span>
      {badge && !collapsed && (
        <span className="ml-auto bg-primary text-white text-[10px] font-bold py-0.5 px-2 rounded-full min-w-5 text-center">
          {badge}
        </span>
      )}
    </button>
  )
}

function SidebarSection({ title, collapsed }: { title: string; collapsed: boolean }) {
  return (
    <div className={`px-3 pt-4 pb-2 text-[10px] font-bold tracking-[2.5px] text-muted-foreground/70 uppercase whitespace-nowrap overflow-hidden transition-opacity duration-200 ${collapsed ? 'opacity-0' : ''}`}>
      {title}
    </div>
  )
}

export function Sidebar({ currentPage, onNavigate, collapsed, mobileOpen }: SidebarProps) {
  return (
    <nav 
      className={`
        fixed left-0 top-0 bottom-0 bg-[rgba(9,12,24,0.97)] border-r border-primary/20
        flex flex-col transition-all duration-300 ease-out z-[100] backdrop-blur-xl overflow-hidden
        ${collapsed ? 'w-[72px]' : 'w-[260px]'}
        max-md:w-[72px] max-md:-translate-x-full max-md:transition-transform
        ${mobileOpen ? 'max-md:translate-x-0 max-md:w-[260px]' : ''}
      `}
    >
      {/* Logo */}
      <button 
        onClick={() => onNavigate('dashboard')}
        className="flex items-center gap-3.5 px-4 py-5 border-b border-primary/15 min-h-16 cursor-pointer"
      >
        <div className="w-[38px] h-[38px] min-w-[38px] rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center font-serif text-lg font-bold text-white shadow-[0_0_10px_rgba(124,58,237,0.3)] relative overflow-hidden">
          <span className="relative z-10">⚔</span>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        </div>
        <div className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${collapsed ? 'opacity-0 w-0' : ''} ${mobileOpen ? 'max-md:opacity-100 max-md:w-auto' : ''}`}>
          <div className="font-serif text-base font-bold text-foreground tracking-wide leading-tight">PROSGARD</div>
          <div className="font-sans text-[11px] text-primary-light tracking-[2px] uppercase font-medium">Guild Manager</div>
        </div>
      </button>

      {/* Navigation */}
      <SidebarSection title="MAIN" collapsed={collapsed && !mobileOpen} />
      <NavItem page="dashboard" icon="⬡" label="Dashboard" active={currentPage === 'dashboard'} onClick={() => onNavigate('dashboard')} collapsed={collapsed && !mobileOpen} />
      <NavItem page="members" icon="👥" label="Members" badge={47} active={currentPage === 'members'} onClick={() => onNavigate('members')} collapsed={collapsed && !mobileOpen} />

      <SidebarSection title="ECONOMY" collapsed={collapsed && !mobileOpen} />
      <NavItem page="dkp" icon="💎" label="DKP" active={currentPage === 'dkp'} onClick={() => onNavigate('dkp')} collapsed={collapsed && !mobileOpen} />
      <NavItem page="loot" icon="⚡" label="Loot" badge={3} active={currentPage === 'loot'} onClick={() => onNavigate('loot')} collapsed={collapsed && !mobileOpen} />

      <SidebarSection title="GUILD" collapsed={collapsed && !mobileOpen} />
      <NavItem page="events" icon="📅" label="Events" active={currentPage === 'events'} onClick={() => onNavigate('events')} collapsed={collapsed && !mobileOpen} />
      <NavItem page="attendance" icon="✅" label="Attendance" active={currentPage === 'attendance'} onClick={() => onNavigate('attendance')} collapsed={collapsed && !mobileOpen} />
      <NavItem page="analytics" icon="📊" label="Analytics" active={currentPage === 'analytics'} onClick={() => onNavigate('analytics')} collapsed={collapsed && !mobileOpen} />
      <NavItem page="recruitment" icon="📋" label="Recruitment" badge={5} active={currentPage === 'recruitment'} onClick={() => onNavigate('recruitment')} collapsed={collapsed && !mobileOpen} />

      <SidebarSection title="SYSTEM" collapsed={collapsed && !mobileOpen} />
      <NavItem page="settings" icon="⚙" label="Settings" active={currentPage === 'settings'} onClick={() => onNavigate('settings')} collapsed={collapsed && !mobileOpen} />

      {/* User */}
      <div className="mt-auto border-t border-primary/15 p-2">
        <div className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-primary/12 transition-colors">
          <div className="w-[38px] h-[38px] min-w-[38px] rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-base border-2 border-primary/40 relative">
            🧙
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-accent rounded-full border-2 border-[#0d1424]" />
          </div>
          <div className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${collapsed ? 'hidden' : ''} ${mobileOpen ? 'max-md:block' : ''}`}>
            <div className="text-[13px] font-bold text-foreground">Thalderin</div>
            <div className="text-[11px] text-primary-light font-medium">Guild Master</div>
          </div>
        </div>
      </div>
    </nav>
  )
}
