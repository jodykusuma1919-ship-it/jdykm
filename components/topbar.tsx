'use client'

import type { Page } from '@/app/page'
import { useAuth } from '@/contexts/auth-context'
import { LogOut, User } from 'lucide-react'

interface TopbarProps {
  breadcrumb: string
  collapsed: boolean
  onToggleSidebar: () => void
  onNavigate: (page: Page) => void
}

export function Topbar({ breadcrumb, collapsed, onToggleSidebar, onNavigate }: TopbarProps) {
  const { user, logout } = useAuth()

  return (
    <header 
      className={`
        fixed right-0 top-0 h-16 bg-[rgba(9,12,24,0.9)] backdrop-blur-xl
        border-b border-primary/15 flex items-center gap-4 px-6 z-[90]
        transition-all duration-300 ease-out
        ${collapsed ? 'left-[72px]' : 'left-[260px]'}
        max-md:left-0
      `}
    >
      <button 
        onClick={onToggleSidebar}
        className="w-9 h-9 rounded-lg bg-primary/8 border border-primary/25 flex items-center justify-center cursor-pointer transition-all duration-200 text-muted-foreground text-lg hover:bg-primary/20 hover:text-primary-light hover:shadow-[0_0_10px_rgba(124,58,237,0.3)]"
      >
        ☰
      </button>

      <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
        <span>Prosgard</span>
        <span className="opacity-40">/</span>
        <span className="text-foreground font-semibold">{breadcrumb}</span>
      </div>

      <div className="flex-1 max-w-[340px] ml-auto relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 text-base">🔍</span>
        <input
          type="text"
          placeholder="Search members, events, loot..."
          className="w-full bg-white/4 border border-primary/20 rounded-xl py-2 px-4 pl-10 text-foreground text-[13px] font-sans outline-none transition-all duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:bg-primary/8 focus:shadow-[0_0_10px_rgba(124,58,237,0.3)]"
        />
      </div>

      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 py-1.5 px-3 bg-accent/10 border border-accent/20 rounded-full text-xs font-semibold text-accent">
          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse-glow" />
          <span>28 Online</span>
        </div>

        <button 
          onClick={() => {/* Could open notifications panel */}}
          className="w-[38px] h-[38px] rounded-xl bg-primary/8 border border-primary/25 flex items-center justify-center cursor-pointer transition-all duration-200 text-muted-foreground text-lg relative hover:bg-primary/20 hover:text-primary-light hover:border-primary hover:shadow-[0_0_10px_rgba(124,58,237,0.3)]"
          title="Notifications"
        >
          🔔
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-[#0d1424] animate-pulse-glow" />
        </button>

        <button 
          onClick={() => {/* Could open Discord integration */}}
          className="w-[38px] h-[38px] rounded-xl bg-primary/8 border border-primary/25 flex items-center justify-center cursor-pointer transition-all duration-200 text-muted-foreground hover:bg-primary/20 hover:text-primary-light hover:border-primary hover:shadow-[0_0_10px_rgba(124,58,237,0.3)]"
          title="Discord"
        >
          <svg width="18" height="14" viewBox="0 0 18 14" fill="currentColor">
            <path d="M15.25 1.18A14.78 14.78 0 0 0 11.44 0a.06.06 0 0 0-.06.03c-.17.3-.35.69-.48.99a13.65 13.65 0 0 0-4.05 0c-.13-.3-.32-.68-.49-1a.06.06 0 0 0-.06-.03A14.74 14.74 0 0 0 2.7 1.18a.05.05 0 0 0-.03.02C.4 4.55-.24 7.82.07 11.05c0 .02.02.03.03.04a14.9 14.9 0 0 0 4.47 2.24c.02.01.05 0 .06-.02.34-.47.65-.96.91-1.48.02-.03 0-.07-.03-.08a9.8 9.8 0 0 1-1.4-.66.05.05 0 0 1-.01-.09l.28-.22a.06.06 0 0 1 .06 0c2.94 1.33 6.12 1.33 9.03 0a.06.06 0 0 1 .06 0l.28.22c.03.03.03.07-.01.09-.45.26-.91.48-1.4.66-.04.01-.05.05-.03.08.27.52.58 1 .91 1.48.01.02.04.03.06.02a14.86 14.86 0 0 0 4.49-2.24.05.05 0 0 0 .03-.04c.37-3.79-.62-7.06-2.63-10.87a.04.04 0 0 0-.03-.02ZM6.01 9.06c-.87 0-1.59-.8-1.59-1.78 0-.98.7-1.78 1.59-1.78.9 0 1.6.8 1.59 1.78 0 .98-.7 1.78-1.59 1.78Zm5.88 0c-.87 0-1.59-.8-1.59-1.78 0-.98.7-1.78 1.59-1.78.9 0 1.6.8 1.59 1.78 0 .98-.69 1.78-1.59 1.78Z"/>
          </svg>
        </button>

        <button 
          onClick={() => onNavigate('settings')}
          className="w-[38px] h-[38px] rounded-xl bg-primary/8 border border-primary/25 flex items-center justify-center cursor-pointer transition-all duration-200 text-muted-foreground text-lg hover:bg-primary/20 hover:text-primary-light hover:border-primary hover:shadow-[0_0_10px_rgba(124,58,237,0.3)]"
          title="Settings"
        >
          ⚙
        </button>

        {/* User Menu */}
        <div className="flex items-center gap-2 ml-2 pl-3 border-l border-primary/20">
          <div className="flex items-center gap-2 py-1.5 px-3 bg-primary/8 border border-primary/25 rounded-xl">
            <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
              <User className="w-4 h-4 text-primary-light" />
            </div>
            <div className="flex flex-col max-md:hidden">
              <span className="text-xs font-semibold text-foreground leading-tight">{user?.displayName}</span>
              <span className="text-[10px] text-muted-foreground leading-tight capitalize">{user?.role}</span>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-[38px] h-[38px] rounded-xl bg-destructive/10 border border-destructive/25 flex items-center justify-center cursor-pointer transition-all duration-200 text-destructive hover:bg-destructive/20 hover:border-destructive hover:shadow-[0_0_10px_rgba(239,68,68,0.3)]"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
