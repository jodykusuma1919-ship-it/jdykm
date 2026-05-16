'use client'

import { useState } from 'react'
import { allMembers } from '@/lib/data'

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

export function PartiesPage() {
  const [party, setParty] = useState<Party>({
    id: 'party-1',
    name: 'Alpha Squad',
    leader: '',
    members: [],
  })
  const [partyName, setPartyName] = useState(party.name)
  const [showMemberPicker, setShowMemberPicker] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const availableMembers = allMembers.filter(
    (m) => !party.members.some((pm) => pm.id === m.id)
  )

  const filteredMembers = availableMembers.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addMember = (member: typeof allMembers[0]) => {
    if (party.members.length >= MAX_PARTY_SIZE) return
    const newMember: PartyMember = {
      id: member.id,
      name: member.name,
      classIcon: member.class.icon,
      className: member.class.name,
      role: member.role,
    }
    const newMembers = [...party.members, newMember]
    setParty({
      ...party,
      members: newMembers,
      leader: party.leader || newMember.name,
    })
    setShowMemberPicker(false)
    setSearchTerm('')
  }

  const removeMember = (memberId: number) => {
    const newMembers = party.members.filter((m) => m.id !== memberId)
    const removedMember = party.members.find((m) => m.id === memberId)
    setParty({
      ...party,
      members: newMembers,
      leader: removedMember?.name === party.leader ? (newMembers[0]?.name || '') : party.leader,
    })
  }

  const setLeader = (memberName: string) => {
    setParty({ ...party, leader: memberName })
  }

  const updatePartyName = () => {
    setParty({ ...party, name: partyName })
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="font-serif text-[26px] font-bold text-foreground flex items-center gap-3">
          <span className="text-2xl">👥</span> Party Management
        </h1>
        <div className="text-sm text-muted-foreground">
          Max 1 Party with {MAX_PARTY_SIZE} Members
        </div>
      </div>

      {/* Party Card */}
      <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-6">
        {/* Party Header */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-primary/15 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(124,58,237,0.3)]">
              ⚔
            </div>
            <div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={partyName}
                  onChange={(e) => setPartyName(e.target.value)}
                  onBlur={updatePartyName}
                  className="font-serif text-xl font-bold text-foreground bg-transparent border-none outline-none focus:ring-1 focus:ring-primary/50 rounded px-1 -ml-1"
                />
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {party.members.length}/{MAX_PARTY_SIZE} Members
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Party Leader:</span>
            <span className="text-sm font-bold text-primary-light">
              {party.leader || 'Not Assigned'}
            </span>
          </div>
        </div>

        {/* Party Members Grid */}
        <div className="grid grid-cols-5 gap-4 mb-6 max-lg:grid-cols-3 max-sm:grid-cols-2">
          {party.members.map((member, index) => (
            <div
              key={member.id}
              className={`
                relative bg-white/3 border rounded-xl p-4 transition-all duration-200
                ${member.name === party.leader 
                  ? 'border-gold/50 bg-gold/5 shadow-[0_0_15px_rgba(255,215,0,0.15)]' 
                  : 'border-primary/20 hover:border-primary/40'
                }
              `}
            >
              {/* Leader Crown */}
              {member.name === party.leader && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gold text-black text-xs flex items-center justify-center font-bold shadow-lg">
                  👑
                </div>
              )}
              
              {/* Slot Number */}
              <div className="absolute top-2 left-2 text-[10px] text-muted-foreground/50 font-mono">
                #{index + 1}
              </div>

              <div className="flex flex-col items-center text-center pt-2">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 to-indigo-600/30 flex items-center justify-center text-2xl mb-2 border-2 border-primary/30">
                  {member.classIcon}
                </div>
                <div className="font-bold text-foreground text-sm truncate w-full">
                  {member.name}
                </div>
                <div className="text-xs text-muted-foreground">{member.className}</div>
                
                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  {member.name !== party.leader && (
                    <button
                      onClick={() => setLeader(member.name)}
                      className="text-[10px] px-2 py-1 rounded bg-gold/20 text-gold hover:bg-gold/30 transition-colors"
                    >
                      Make Leader
                    </button>
                  )}
                  <button
                    onClick={() => removeMember(member.id)}
                    className="text-[10px] px-2 py-1 rounded bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Empty Slots */}
          {Array.from({ length: MAX_PARTY_SIZE - party.members.length }).map((_, i) => (
            <button
              key={`empty-${i}`}
              onClick={() => setShowMemberPicker(true)}
              className="bg-white/3 border-2 border-dashed border-primary/20 rounded-xl p-4 min-h-[140px] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary/50 text-xl">
                +
              </div>
              <span className="text-xs text-muted-foreground">Add Member</span>
            </button>
          ))}
        </div>

        {/* Add Member Button */}
        {party.members.length < MAX_PARTY_SIZE && (
          <button
            onClick={() => setShowMemberPicker(true)}
            className="w-full py-3 rounded-xl border border-primary/30 bg-primary/10 text-primary-light font-semibold text-sm hover:bg-primary/20 transition-all duration-200"
          >
            + Add Member to Party
          </button>
        )}
      </div>

      {/* Member Picker Modal */}
      {showMemberPicker && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-primary/15 flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-foreground">Select Member</h3>
              <button
                onClick={() => {
                  setShowMemberPicker(false)
                  setSearchTerm('')
                }}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground"
              >
                ✕
              </button>
            </div>
            
            {/* Search */}
            <div className="p-4 border-b border-primary/15">
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-primary/20 text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            {/* Member List */}
            <div className="flex-1 overflow-y-auto p-2">
              {filteredMembers.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No available members found
                </div>
              ) : (
                filteredMembers.slice(0, 20).map((member) => (
                  <button
                    key={member.id}
                    onClick={() => addMember(member)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-indigo-600/30 flex items-center justify-center text-lg border border-primary/30">
                      {member.class.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground truncate">{member.name}</div>
                      <div className="text-xs text-muted-foreground">{member.class.name} · {member.role}</div>
                    </div>
                    <div className="text-xs text-primary-light font-mono">GS {member.gs}</div>
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
