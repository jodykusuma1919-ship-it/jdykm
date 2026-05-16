'use client'

import { useState, useMemo } from 'react'
import { allMembers, roleColors, roleIcons, classes, roles } from '@/lib/data'
import type { Member } from '@/lib/data'
import { MemberModal } from '@/components/member-modal'

function AddMemberModal({ isOpen, onClose, onAdd }: { isOpen: boolean; onClose: () => void; onAdd: (member: Partial<Member>) => void }) {
  const [name, setName] = useState('')
  const [selectedClass, setSelectedClass] = useState(classes[0])
  const [selectedRole, setSelectedRole] = useState('Member')
  const [discord, setDiscord] = useState('')
  const [gs, setGs] = useState(480)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      name,
      class: selectedClass,
      role: selectedRole,
      discord: discord || `@${name.toLowerCase()}`,
      gs,
      status: 'Offline',
      dkp: 0,
      att: 0,
      joinDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastOnline: 'Never',
      totalRaids: 0,
      bidLimits: { fragmentCard: 2, timespace: 2, lnd: 2 },
      screenshots: {},
    })
    setName('')
    setSelectedClass(classes[0])
    setSelectedRole('Member')
    setDiscord('')
    setGs(480)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1001] p-4" onClick={onClose}>
      <div 
        className="bg-card border border-border rounded-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b border-primary/15">
          <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
            + Add New Member
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Add a new member to the guild</p>
        </div>
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">Character Name *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="Enter character name"
              className="w-full bg-white/4 border border-primary/20 rounded-xl py-2.5 px-4 text-foreground text-sm font-sans outline-none transition-all duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:shadow-[0_0_10px_rgba(124,58,237,0.3)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5">Class</label>
              <select
                value={selectedClass.name}
                onChange={e => setSelectedClass(classes.find(c => c.name === e.target.value) || classes[0])}
                className="w-full bg-white/4 border border-primary/20 rounded-xl py-2.5 px-4 text-foreground text-sm font-sans outline-none cursor-pointer transition-all duration-200 focus:border-primary focus:shadow-[0_0_10px_rgba(124,58,237,0.3)]"
              >
                {classes.map(cls => (
                  <option key={cls.name} value={cls.name}>{cls.icon} {cls.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5">Role</label>
              <select
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value)}
                className="w-full bg-white/4 border border-primary/20 rounded-xl py-2.5 px-4 text-foreground text-sm font-sans outline-none cursor-pointer transition-all duration-200 focus:border-primary focus:shadow-[0_0_10px_rgba(124,58,237,0.3)]"
              >
                {roles.map(role => (
                  <option key={role} value={role}>{roleIcons[role]} {role}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5">Discord</label>
              <input
                type="text"
                value={discord}
                onChange={e => setDiscord(e.target.value)}
                placeholder="@username"
                className="w-full bg-white/4 border border-primary/20 rounded-xl py-2.5 px-4 text-foreground text-sm font-sans outline-none transition-all duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:shadow-[0_0_10px_rgba(124,58,237,0.3)]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5">Gear Score</label>
              <input
                type="number"
                value={gs}
                onChange={e => setGs(parseInt(e.target.value) || 0)}
                min={0}
                max={999}
                className="w-full bg-white/4 border border-primary/20 rounded-xl py-2.5 px-4 text-foreground text-sm font-sans font-mono outline-none transition-all duration-200 focus:border-primary focus:shadow-[0_0_10px_rgba(124,58,237,0.3)]"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl cursor-pointer font-sans text-sm font-bold tracking-wide transition-all duration-200 bg-transparent text-muted-foreground border border-white/15 hover:bg-white/5 hover:border-white/25"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl border-none cursor-pointer font-sans text-sm font-bold tracking-wide transition-all duration-200 bg-gradient-to-br from-primary to-indigo-600 text-white shadow-[0_4px_15px_rgba(124,58,237,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(124,58,237,0.5)]"
            >
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: Member['status'] }) {
  const styles: Record<string, string> = {
    'Online': 'bg-accent/15 text-accent border border-accent/30',
    'In Raid': 'bg-gold/15 text-gold border border-gold/30',
    'AFK': 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
    'Offline': 'bg-muted-foreground/15 text-muted-foreground border border-muted-foreground/30',
  }

  return (
    <span className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-[11px] font-bold tracking-wide whitespace-nowrap ${styles[status]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}

function AttendanceBar({ value }: { value: number }) {
  const colorClass = value >= 80 ? 'bg-gradient-to-r from-accent to-green-300' : value >= 60 ? 'bg-gradient-to-r from-gold to-amber-400' : 'bg-gradient-to-r from-destructive to-red-400'

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-white/8 rounded overflow-hidden min-w-[50px]">
        <div className={`h-full rounded transition-all duration-800 ${colorClass}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-bold text-muted-foreground min-w-8">{value}%</span>
    </div>
  )
}

export function MembersPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [showAddMember, setShowAddMember] = useState(false)
  const [members, setMembers] = useState(allMembers)
  const perPage = 12

  const filtered = useMemo(() => {
    let result = members.filter(m => {
      if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.class.name.toLowerCase().includes(search.toLowerCase())) return false
      if (roleFilter && m.role !== roleFilter) return false
      if (statusFilter && m.status !== statusFilter) return false
      return true
    })

    if (sortBy === 'dkp') result = [...result].sort((a, b) => b.dkp - a.dkp)
    else if (sortBy === 'attendance') result = [...result].sort((a, b) => b.att - a.att)
    else if (sortBy === 'status') result = [...result].sort((a, b) => ['Online', 'In Raid', 'AFK', 'Offline'].indexOf(a.status) - ['Online', 'In Raid', 'AFK', 'Offline'].indexOf(b.status))

    return result
  }, [search, roleFilter, statusFilter, sortBy, members])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginatedMembers = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

  const handleAddMember = (newMember: Partial<Member>) => {
    const member: Member = {
      id: members.length + 1,
      name: newMember.name || 'Unknown',
      class: newMember.class || classes[0],
      role: newMember.role || 'Member',
      status: newMember.status || 'Offline',
      dkp: newMember.dkp || 0,
      att: newMember.att || 0,
      joinDate: newMember.joinDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastOnline: newMember.lastOnline || 'Never',
      gs: newMember.gs || 480,
      discord: newMember.discord || `@${(newMember.name || 'unknown').toLowerCase()}`,
      totalRaids: newMember.totalRaids || 0,
      bidLimits: newMember.bidLimits || { fragmentCard: 2, timespace: 2, lnd: 2 },
      screenshots: newMember.screenshots || {},
    }
    setMembers(prev => [member, ...prev])
  }

  const avatarStatusClass = (status: Member['status']) => {
    const map: Record<string, string> = {
      'Online': 'bg-accent',
      'In Raid': 'bg-gold animate-pulse-glow',
      'AFK': 'bg-orange-500',
      'Offline': 'bg-muted-foreground',
    }
    return map[status] || 'bg-muted-foreground'
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Guild Banner */}
      <div className="relative rounded-[20px] overflow-hidden h-[220px] mb-7 bg-gradient-to-br from-[#0d0620] via-[#1a0a3a] via-[#0f1a2e] to-[#070d1a] border border-primary/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_30%_50%,rgba(124,58,237,0.3)_0%,transparent_60%),radial-gradient(ellipse_50%_60%_at_80%_30%,rgba(34,197,94,0.1)_0%,transparent_50%)]" />
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_25%_50%,rgba(124,58,237,0.8)_0%,transparent_40%)]" />
        <div className="relative z-10 h-full flex items-center p-6 px-8 gap-7">
          <div className="w-[100px] h-[100px] rounded-[20px] bg-gradient-to-br from-violet-900 via-primary to-indigo-700 border-[3px] border-primary/60 shadow-[0_0_30px_rgba(124,58,237,0.5),inset_0_0_30px_rgba(0,0,0,0.3)] flex items-center justify-center text-5xl shrink-0 relative overflow-hidden">
            ⚔
            <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent" />
          </div>
          <div className="flex-1">
            <div className="text-[11px] font-bold tracking-[3px] text-primary-light uppercase mb-1.5">【PRSGD】</div>
            <h1 className="font-serif text-4xl font-black text-white drop-shadow-[0_0_30px_rgba(124,58,237,0.6)] leading-none mb-1.5">Prosgard</h1>
            <div className="text-sm text-muted-foreground font-medium">
              Server: <span className="text-primary-light">Aetheria-Prime</span> · World Rank: <span className="text-primary-light">#7</span>
            </div>
            <div className="flex gap-7 mt-4 flex-wrap">
              <div className="flex flex-col gap-0.5">
                <div className="font-mono text-[22px] font-bold text-foreground">247</div>
                <div className="text-[11px] text-muted-foreground/70 font-medium tracking-wide">Members</div>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="font-mono text-[22px] font-bold text-accent">28</div>
                <div className="text-[11px] text-muted-foreground/70 font-medium tracking-wide">Online</div>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="font-mono text-[22px] font-bold text-gold">87%</div>
                <div className="text-[11px] text-muted-foreground/70 font-medium tracking-wide">Weekly Att.</div>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="bg-gradient-to-br from-gold to-amber-600 text-black font-mono text-[11px] font-bold py-1 px-3 rounded-full tracking-[1px] mt-1">LVL 60</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Title Row */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h2 className="font-serif text-[26px] font-bold text-foreground flex items-center gap-3">
          <span className="text-2xl">👥</span> Guild Members
        </h2>
        <div className="flex gap-2.5">
          <button className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl cursor-pointer font-sans text-sm font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-transparent text-primary-light border border-primary/40 hover:bg-primary/15 hover:border-primary">
            📤 Export
          </button>
          <button 
            onClick={() => setShowAddMember(true)}
            className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl border-none cursor-pointer font-sans text-sm font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-gradient-to-br from-primary to-indigo-600 text-white shadow-[0_4px_15px_rgba(124,58,237,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(124,58,237,0.5)]"
          >
            + Add Member
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 items-center flex-wrap bg-card backdrop-blur-xl border border-border rounded-2xl p-4 px-5 mb-5">
        <div className="flex-1 min-w-[200px] relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/70">🔍</span>
          <input
            type="text"
            placeholder="Search by name, class, role…"
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1) }}
            className="w-full bg-white/4 border border-primary/20 rounded-xl py-2.5 px-4 pl-10 text-foreground text-sm font-sans font-medium outline-none transition-all duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:shadow-[0_0_10px_rgba(124,58,237,0.3)] focus:bg-primary/8"
          />
        </div>
        <select 
          value={sortBy} 
          onChange={e => setSortBy(e.target.value)}
          className="bg-white/4 border border-primary/20 rounded-xl py-2.5 px-3.5 text-foreground text-[13px] font-sans font-semibold outline-none cursor-pointer transition-all duration-200 min-w-[130px] focus:border-primary focus:shadow-[0_0_10px_rgba(124,58,237,0.3)]"
        >
          <option value="">Sort By…</option>
          <option value="dkp">DKP (High→Low)</option>
          <option value="attendance">Attendance</option>
          <option value="status">Online Status</option>
        </select>
        <select 
          value={roleFilter} 
          onChange={e => { setRoleFilter(e.target.value); setCurrentPage(1) }}
          className="bg-white/4 border border-primary/20 rounded-xl py-2.5 px-3.5 text-foreground text-[13px] font-sans font-semibold outline-none cursor-pointer transition-all duration-200 min-w-[130px] focus:border-primary focus:shadow-[0_0_10px_rgba(124,58,237,0.3)]"
        >
          <option value="">All Roles</option>
          <option value="Guild Master">Guild Master</option>
          <option value="Vice Master">Vice Master</option>
          <option value="Officer">Officer</option>
          <option value="Raid Leader">Raid Leader</option>
          <option value="Member">Member</option>
          <option value="Recruit">Recruit</option>
        </select>
        <select 
          value={statusFilter} 
          onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1) }}
          className="bg-white/4 border border-primary/20 rounded-xl py-2.5 px-3.5 text-foreground text-[13px] font-sans font-semibold outline-none cursor-pointer transition-all duration-200 min-w-[130px] focus:border-primary focus:shadow-[0_0_10px_rgba(124,58,237,0.3)]"
        >
          <option value="">All Status</option>
          <option value="Online">Online</option>
          <option value="In Raid">In Raid</option>
          <option value="AFK">AFK</option>
          <option value="Offline">Offline</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-card backdrop-blur-xl border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 px-6 border-b border-primary/12">
          <div className="text-sm font-bold text-foreground flex items-center gap-2">👥 Member Roster</div>
          <div className="font-mono text-[13px] text-primary-light bg-primary/15 border border-primary/25 py-0.5 px-2.5 rounded-full">
            {filtered.length} members
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-3.5 px-4 text-left text-[11px] font-bold tracking-[1.5px] uppercase text-muted-foreground/70 bg-primary/5 border-b border-primary/10 cursor-pointer select-none whitespace-nowrap hover:text-primary-light">MEMBER</th>
                <th className="p-3.5 px-4 text-left text-[11px] font-bold tracking-[1.5px] uppercase text-muted-foreground/70 bg-primary/5 border-b border-primary/10 cursor-pointer select-none whitespace-nowrap hover:text-primary-light">CLASS</th>
                <th className="p-3.5 px-4 text-left text-[11px] font-bold tracking-[1.5px] uppercase text-muted-foreground/70 bg-primary/5 border-b border-primary/10 cursor-pointer select-none whitespace-nowrap hover:text-primary-light">ROLE</th>
                <th className="p-3.5 px-4 text-left text-[11px] font-bold tracking-[1.5px] uppercase text-muted-foreground/70 bg-primary/5 border-b border-primary/10 cursor-pointer select-none whitespace-nowrap hover:text-primary-light">DKP</th>
                <th className="p-3.5 px-4 text-left text-[11px] font-bold tracking-[1.5px] uppercase text-muted-foreground/70 bg-primary/5 border-b border-primary/10 cursor-pointer select-none whitespace-nowrap hover:text-primary-light">ATTENDANCE</th>
                <th className="p-3.5 px-4 text-left text-[11px] font-bold tracking-[1.5px] uppercase text-muted-foreground/70 bg-primary/5 border-b border-primary/10 cursor-pointer select-none whitespace-nowrap hover:text-primary-light">STATUS</th>
                <th className="p-3.5 px-4 text-left text-[11px] font-bold tracking-[1.5px] uppercase text-muted-foreground/70 bg-primary/5 border-b border-primary/10 cursor-pointer select-none whitespace-nowrap hover:text-primary-light max-md:hidden">LAST ONLINE</th>
                <th className="p-3.5 px-4 text-left text-[11px] font-bold tracking-[1.5px] uppercase text-muted-foreground/70 bg-primary/5 border-b border-primary/10 cursor-pointer select-none whitespace-nowrap hover:text-primary-light max-md:hidden">JOIN DATE</th>
                <th className="p-3.5 px-4 text-left text-[11px] font-bold tracking-[1.5px] uppercase text-muted-foreground/70 bg-primary/5 border-b border-primary/10">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMembers.map(member => (
                <tr 
                  key={member.id} 
                  onClick={() => setSelectedMember(member)}
                  className="transition-colors cursor-pointer hover:bg-primary/8"
                >
                  <td className="p-3.5 px-4 border-b border-primary/6 text-sm font-medium align-middle">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-900 to-indigo-600 border-2 border-primary/35 flex items-center justify-center text-lg shrink-0 relative">
                        {member.class.icon}
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0d1424] ${avatarStatusClass(member.status)}`} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-foreground">{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.class.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 px-4 border-b border-primary/6 text-sm font-medium align-middle">
                    <span className="text-lg">{member.class.icon}</span> {member.class.name}
                  </td>
                  <td className="p-3.5 px-4 border-b border-primary/6 text-sm font-medium align-middle">
                    <span className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-md text-[11px] font-bold tracking-wide ${roleColors[member.role]}`}>
                      {roleIcons[member.role]} {member.role}
                    </span>
                  </td>
                  <td className="p-3.5 px-4 border-b border-primary/6 text-sm font-medium align-middle">
                    <span className="font-mono text-[13px] font-bold text-gold tracking-wide">{member.dkp.toLocaleString()}</span>
                  </td>
                  <td className="p-3.5 px-4 border-b border-primary/6 text-sm font-medium align-middle">
                    <AttendanceBar value={member.att} />
                  </td>
                  <td className="p-3.5 px-4 border-b border-primary/6 text-sm font-medium align-middle">
                    <StatusBadge status={member.status} />
                  </td>
                  <td className="p-3.5 px-4 border-b border-primary/6 text-[13px] text-muted-foreground align-middle max-md:hidden">
                    {member.lastOnline}
                  </td>
                  <td className="p-3.5 px-4 border-b border-primary/6 text-xs text-muted-foreground align-middle max-md:hidden">
                    {member.joinDate}
                  </td>
                  <td className="p-3.5 px-4 border-b border-primary/6 text-sm font-medium align-middle">
                    <div className="flex gap-1.5 items-center" onClick={e => e.stopPropagation()}>
                      <button onClick={() => setSelectedMember(member)} className="w-[30px] h-[30px] rounded-[7px] border-none cursor-pointer inline-flex items-center justify-center text-[13px] transition-all duration-150 bg-primary/20 text-primary-light hover:bg-primary/40 hover:shadow-[0_0_10px_rgba(124,58,237,0.3)]" title="View">👁</button>
                      <button className="w-[30px] h-[30px] rounded-[7px] border-none cursor-pointer inline-flex items-center justify-center text-[13px] transition-all duration-150 bg-blue/20 text-blue hover:bg-blue/35" title="Edit">✏</button>
                      <button className="w-[30px] h-[30px] rounded-[7px] border-none cursor-pointer inline-flex items-center justify-center text-[13px] transition-all duration-150 bg-gold/20 text-gold hover:bg-gold/35" title="DKP">💎</button>
                      <button className="w-[30px] h-[30px] rounded-[7px] border-none cursor-pointer inline-flex items-center justify-center text-[13px] transition-all duration-150 bg-destructive/15 text-red-400 hover:bg-destructive/30" title="More">⋮</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between p-4 px-6 border-t border-primary/10">
          <div className="text-[13px] text-muted-foreground">
            Showing <span className="text-foreground font-bold">{(currentPage - 1) * perPage + 1}</span>–<span className="text-foreground font-bold">{Math.min(currentPage * perPage, filtered.length)}</span> of <span className="text-foreground font-bold">{filtered.length}</span>
          </div>
          <div className="flex gap-1">
            {currentPage > 1 && (
              <button onClick={() => setCurrentPage(p => p - 1)} className="w-8 h-8 rounded-lg border border-primary/20 bg-transparent text-muted-foreground cursor-pointer flex items-center justify-center text-[13px] font-semibold transition-all duration-150 font-sans hover:bg-primary/20 hover:text-foreground hover:border-primary">‹</button>
            )}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + i
              if (page > totalPages) return null
              return (
                <button 
                  key={page} 
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg border cursor-pointer flex items-center justify-center text-[13px] font-semibold transition-all duration-150 font-sans ${currentPage === page ? 'bg-primary text-white border-primary shadow-[0_0_10px_rgba(124,58,237,0.3)]' : 'border-primary/20 bg-transparent text-muted-foreground hover:bg-primary/20 hover:text-foreground hover:border-primary'}`}
                >
                  {page}
                </button>
              )
            })}
            {currentPage < totalPages && (
              <button onClick={() => setCurrentPage(p => p + 1)} className="w-8 h-8 rounded-lg border border-primary/20 bg-transparent text-muted-foreground cursor-pointer flex items-center justify-center text-[13px] font-semibold transition-all duration-150 font-sans hover:bg-primary/20 hover:text-foreground hover:border-primary">›</button>
            )}
          </div>
        </div>
      </div>

      {/* Member Modal */}
      {selectedMember && (
        <MemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      )}

      {/* Add Member Modal */}
      <AddMemberModal 
        isOpen={showAddMember} 
        onClose={() => setShowAddMember(false)} 
        onAdd={handleAddMember}
      />
    </div>
  )
}
