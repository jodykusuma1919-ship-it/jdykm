'use client'

import { useState } from 'react'
import { allMembers } from '@/lib/data'
import { getRoleColor } from '@/lib/roles'

interface PartyMember {
  id: number
  name: string
  classIcon: string
  className: string
  role: string
}

interface Party {
  id: string
  name: string
  leader: string
  members: PartyMember[]
}

const MAX_PARTY_SIZE = 5
const MAX_MAIN_PARTIES = 8
const MAX_SUB_ELITE_PARTIES = 99 // "unlimited"

function PartyCard({
  party,
  onUpdateName,
  onSetLeader,
  onRemoveMember,
  onAddMember,
  onDeleteParty,
  usedMemberIds,
  canEdit,
}: {
  party: Party
  onUpdateName: (name: string) => void
  onSetLeader: (name: string) => void
  onRemoveMember: (memberId: number) => void
  onAddMember: (member: typeof allMembers[0]) => void
  onDeleteParty?: () => void
  usedMemberIds: Set<number>
  canEdit: boolean
}) {
  const [editingName, setEditingName] = useState(party.name)
  const [showMemberPicker, setShowMemberPicker] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const availableMembers = allMembers.filter((m) => !usedMemberIds.has(m.id))
  const filteredMembers = availableMembers.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="bg-white/3 border border-primary/20 rounded-xl p-4 hover:border-primary/35 transition-all duration-200">
      {/* Party Header */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-primary/15">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-sm shadow-sm">
            ⚔
          </div>
          <input
            type="text"
            value={editingName}
            onChange={(e) => canEdit && setEditingName(e.target.value)}
            onBlur={() => canEdit && onUpdateName(editingName)}
            disabled={!canEdit}
            className={`font-bold text-foreground bg-transparent border-none outline-none focus:ring-1 focus:ring-primary/50 rounded px-1 text-sm flex-1 min-w-0 ${!canEdit ? 'cursor-not-allowed' : ''}`}
          />
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded bg-primary/10">
            {party.members.length}/{MAX_PARTY_SIZE}
          </span>
          {onDeleteParty && canEdit && (
            <button
              onClick={onDeleteParty}
              className="w-6 h-6 rounded bg-destructive/20 text-destructive hover:bg-destructive/30 flex items-center justify-center text-xs transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Leader Display */}
      {party.leader && (
        <div className="flex items-center gap-1.5 mb-2 text-[10px]">
          <span className="text-gold">👑</span>
          <span className="text-muted-foreground">Leader:</span>
          <span className="text-gold font-semibold">{party.leader}</span>
        </div>
      )}

      {/* Members List */}
      <div className="space-y-1.5 mb-3">
        {party.members.map((member, index) => (
          <div
            key={member.id}
            className={`
              flex items-center gap-2 p-2 rounded-lg transition-colors
              ${member.name === party.leader 
                ? 'bg-gold/10 border border-gold/30' 
                : 'bg-white/3 hover:bg-white/5'
              }
            `}
          >
            <span className="text-[10px] text-muted-foreground/50 w-4">#{index + 1}</span>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/30 to-indigo-600/30 flex items-center justify-center text-sm border border-primary/30">
              {member.classIcon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-foreground truncate flex items-center gap-1">
                {member.name}
                {member.name === party.leader && <span className="text-gold text-[10px]">👑</span>}
              </div>
              <div className="text-[10px] text-muted-foreground">{member.className}</div>
            </div>
            {canEdit && (
              <div className="flex gap-1">
                {member.name !== party.leader && (
                  <button
                    onClick={() => onSetLeader(member.name)}
                    title="Make Leader"
                    className="w-5 h-5 rounded bg-gold/20 text-gold hover:bg-gold/30 flex items-center justify-center text-[10px] transition-colors"
                  >
                    👑
                  </button>
                )}
                <button
                  onClick={() => onRemoveMember(member.id)}
                  className="w-5 h-5 rounded bg-destructive/20 text-destructive hover:bg-destructive/30 flex items-center justify-center text-[10px] transition-colors"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Empty Slots */}
        {Array.from({ length: MAX_PARTY_SIZE - party.members.length }).map((_, i) => (
          <button
            key={`empty-${i}`}
            onClick={() => canEdit && setShowMemberPicker(true)}
            disabled={!canEdit}
            className={`w-full flex items-center gap-2 p-2 rounded-lg border border-dashed border-primary/20 transition-all text-left ${
              canEdit ? 'hover:border-primary/40 hover:bg-primary/5' : 'opacity-50 cursor-not-allowed'
            }`}
          >
            <span className="text-[10px] text-muted-foreground/50 w-4">#{party.members.length + i + 1}</span>
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary/50 text-sm">
              +
            </div>
            <span className="text-xs text-muted-foreground">Empty Slot</span>
          </button>
        ))}
      </div>

      {/* Add Member Button */}
      {canEdit && party.members.length < MAX_PARTY_SIZE && (
        <button
          onClick={() => setShowMemberPicker(true)}
          className="w-full py-2 rounded-lg border border-primary/30 bg-primary/10 text-primary-light font-semibold text-xs hover:bg-primary/20 transition-all"
        >
          + Add Member
        </button>
      )}

      {/* Member Picker Modal */}
      {showMemberPicker && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md max-h-[70vh] flex flex-col">
            <div className="p-4 border-b border-primary/15 flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-foreground">Add to {party.name}</h3>
              <button
                onClick={() => {
                  setShowMemberPicker(false)
                  setSearchTerm('')
                }}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground text-sm"
              >
                ✕
              </button>
            </div>
            
            <div className="p-3 border-b border-primary/15">
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-primary/20 text-foreground text-sm placeholder:text-muted-foreground/50 outline-none focus:border-primary/50"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {filteredMembers.length === 0 ? (
                <div className="text-center text-muted-foreground py-6 text-sm">
                  No available members
                </div>
              ) : (
                filteredMembers.slice(0, 15).map((member) => (
                  <button
                    key={member.id}
                    onClick={() => {
                      onAddMember(member)
                      setShowMemberPicker(false)
                      setSearchTerm('')
                    }}
                    className="w-full flex items-center gap-2 p-2.5 rounded-lg hover:bg-primary/10 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-indigo-600/30 flex items-center justify-center text-base border border-primary/30">
                      {member.class.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground text-sm truncate">{member.name}</div>
                      <div className="text-[10px] text-muted-foreground">{member.class.name} · {member.role}</div>
                    </div>
                    <div className="text-[10px] text-primary-light font-mono">GS {member.gs}</div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function BattlefieldPage() {
  // For now, allow editing - in full implementation this would come from user context
  const canEdit = true
  
  const [mainParties, setMainParties] = useState<Party[]>([
    { id: 'main-1', name: 'Main Party 1', leader: '', members: [] },
  ])
  const [subEliteParties, setSubEliteParties] = useState<Party[]>([
    { id: 'sub-1', name: 'Sub Elite 1', leader: '', members: [] },
  ])

  // Get all used member IDs across all parties
  const getUsedMemberIds = () => {
    const ids = new Set<number>()
    mainParties.forEach((p) => p.members.forEach((m) => ids.add(m.id)))
    subEliteParties.forEach((p) => p.members.forEach((m) => ids.add(m.id)))
    return ids
  }

  const createParty = (section: 'main' | 'subElite') => {
    if (!canEdit) return
    const newParty: Party = {
      id: `${section}-${Date.now()}`,
      name: section === 'main' ? `Main Party ${mainParties.length + 1}` : `Sub Elite ${subEliteParties.length + 1}`,
      leader: '',
      members: [],
    }
    if (section === 'main') {
      if (mainParties.length < MAX_MAIN_PARTIES) {
        setMainParties([...mainParties, newParty])
      }
    } else {
      if (subEliteParties.length < MAX_SUB_ELITE_PARTIES) {
        setSubEliteParties([...subEliteParties, newParty])
      }
    }
  }

  const updateParty = (section: 'main' | 'subElite', partyId: string, updates: Partial<Party>) => {
    if (!canEdit) return
    const setter = section === 'main' ? setMainParties : setSubEliteParties
    const parties = section === 'main' ? mainParties : subEliteParties
    setter(parties.map((p) => (p.id === partyId ? { ...p, ...updates } : p)))
  }

  const deleteParty = (section: 'main' | 'subElite', partyId: string) => {
    if (!canEdit) return
    const setter = section === 'main' ? setMainParties : setSubEliteParties
    const parties = section === 'main' ? mainParties : subEliteParties
    setter(parties.filter((p) => p.id !== partyId))
  }

  const addMemberToParty = (section: 'main' | 'subElite', partyId: string, member: typeof allMembers[0]) => {
    if (!canEdit) return
    const parties = section === 'main' ? mainParties : subEliteParties
    const party = parties.find((p) => p.id === partyId)
    if (!party || party.members.length >= MAX_PARTY_SIZE) return

    const newMember: PartyMember = {
      id: member.id,
      name: member.name,
      classIcon: member.class.icon,
      className: member.class.name,
      role: member.role,
    }
    updateParty(section, partyId, {
      members: [...party.members, newMember],
      leader: party.leader || newMember.name,
    })
  }

  const removeMemberFromParty = (section: 'main' | 'subElite', partyId: string, memberId: number) => {
    if (!canEdit) return
    const parties = section === 'main' ? mainParties : subEliteParties
    const party = parties.find((p) => p.id === partyId)
    if (!party) return

    const removedMember = party.members.find((m) => m.id === memberId)
    const newMembers = party.members.filter((m) => m.id !== memberId)
    updateParty(section, partyId, {
      members: newMembers,
      leader: removedMember?.name === party.leader ? (newMembers[0]?.name || '') : party.leader,
    })
  }

  const usedMemberIds = getUsedMemberIds()
  const totalMainMembers = mainParties.reduce((sum, p) => sum + p.members.length, 0)
  const totalSubMembers = subEliteParties.reduce((sum, p) => sum + p.members.length, 0)

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-[26px] font-bold text-foreground flex items-center gap-3">
            <span className="text-2xl">⚔</span> Battlefield Setup
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground">Your Role:</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${getRoleColor(CURRENT_USER_ROLE)}`}>
              {CURRENT_USER_ROLE}
            </span>
            {canEdit ? (
              <span className="text-[10px] text-accent">Can Edit</span>
            ) : (
              <span className="text-[10px] text-muted-foreground/70">View Only</span>
            )}
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Organize parties for raids and battles
        </div>
      </div>

      {/* Main Battlefield Section */}
      <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-primary/15 flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="text-primary">🛡</span> Main Battlefield
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Max {MAX_MAIN_PARTIES} parties · {totalMainMembers} members assigned
            </p>
          </div>
          {canEdit && mainParties.length < MAX_MAIN_PARTIES && (
            <button
              onClick={() => createParty('main')}
              className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-primary/20 text-primary-light font-semibold text-sm hover:bg-primary/30 transition-all"
            >
              + Add Party ({mainParties.length}/{MAX_MAIN_PARTIES})
            </button>
          )}
        </div>

        <div className="grid grid-cols-4 gap-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {mainParties.map((party) => (
            <PartyCard
              key={party.id}
              party={party}
              onUpdateName={(name) => updateParty('main', party.id, { name })}
              onSetLeader={(leader) => updateParty('main', party.id, { leader })}
              onRemoveMember={(memberId) => removeMemberFromParty('main', party.id, memberId)}
              onAddMember={(member) => addMemberToParty('main', party.id, member)}
              onDeleteParty={mainParties.length > 1 ? () => deleteParty('main', party.id) : undefined}
              usedMemberIds={usedMemberIds}
              canEdit={canEdit}
            />
          ))}
        </div>
      </div>

      {/* Sub Elite Section */}
      <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-primary/15 flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="text-accent">⚡</span> Sub Elite
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              12+ parties allowed · {totalSubMembers} members assigned
            </p>
          </div>
          {canEdit && (
            <button
              onClick={() => createParty('subElite')}
              className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-accent/20 text-accent font-semibold text-sm hover:bg-accent/30 transition-all"
            >
              + Add Party ({subEliteParties.length})
            </button>
          )}
        </div>

        <div className="grid grid-cols-4 gap-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {subEliteParties.map((party) => (
            <PartyCard
              key={party.id}
              party={party}
              onUpdateName={(name) => updateParty('subElite', party.id, { name })}
              onSetLeader={(leader) => updateParty('subElite', party.id, { leader })}
              onRemoveMember={(memberId) => removeMemberFromParty('subElite', party.id, memberId)}
              onAddMember={(member) => addMemberToParty('subElite', party.id, member)}
              onDeleteParty={subEliteParties.length > 1 ? () => deleteParty('subElite', party.id) : undefined}
              usedMemberIds={usedMemberIds}
              canEdit={canEdit}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
