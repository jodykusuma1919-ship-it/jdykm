'use client'

import { recruits } from '@/lib/data'
import { useState, useRef } from 'react'
import { canManageRecruitment } from '@/lib/roles'
import type { GuildRole } from '@/lib/roles'

interface RecruitmentPageProps {
  userRole: GuildRole
}

interface GearImage {
  id: string
  url: string
  name: string
}

function ApplyModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [characterName, setCharacterName] = useState('')
  const [characterClass, setCharacterClass] = useState('Warrior')
  const [gearScore, setGearScore] = useState('')
  const [experience, setExperience] = useState('')
  const [message, setMessage] = useState('')
  const [gearImages, setGearImages] = useState<GearImage[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const newImage: GearImage = {
            id: `img-${Date.now()}-${Math.random()}`,
            url: event.target?.result as string,
            name: file.name
          }
          setGearImages(prev => [...prev, newImage])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const removeImage = (id: string) => {
    setGearImages(prev => prev.filter(img => img.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onClose()
    setCharacterName('')
    setGearScore('')
    setExperience('')
    setMessage('')
    setGearImages([])
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
      <div 
        className="bg-card border border-border rounded-2xl w-full max-w-xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b border-primary/15 sticky top-0 bg-card z-10">
          <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
            Submit Application
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Fill in your details and upload gear screenshots</p>
        </div>
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5">Character Name</label>
              <input
                type="text"
                value={characterName}
                onChange={e => setCharacterName(e.target.value)}
                placeholder="Your character name"
                className="w-full bg-white/4 border border-primary/20 rounded-xl py-2.5 px-4 text-foreground text-sm font-sans outline-none transition-all duration-200 focus:border-primary focus:shadow-[0_0_10px_rgba(124,58,237,0.3)] placeholder:text-muted-foreground/50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5">Class</label>
              <select
                value={characterClass}
                onChange={e => setCharacterClass(e.target.value)}
                className="w-full bg-white/4 border border-primary/20 rounded-xl py-2.5 px-4 text-foreground text-sm font-sans outline-none cursor-pointer transition-all duration-200 focus:border-primary"
              >
                <option value="Warrior">Warrior</option>
                <option value="Mage">Mage</option>
                <option value="Ranger">Ranger</option>
                <option value="Priest">Priest</option>
                <option value="Assassin">Assassin</option>
                <option value="Paladin">Paladin</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5">Gear Score</label>
              <input
                type="text"
                value={gearScore}
                onChange={e => setGearScore(e.target.value)}
                placeholder="e.g. 5,200"
                className="w-full bg-white/4 border border-primary/20 rounded-xl py-2.5 px-4 text-foreground text-sm font-sans outline-none transition-all duration-200 focus:border-primary placeholder:text-muted-foreground/50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5">Raid Experience</label>
              <input
                type="text"
                value={experience}
                onChange={e => setExperience(e.target.value)}
                placeholder="e.g. 50+ raids"
                className="w-full bg-white/4 border border-primary/20 rounded-xl py-2.5 px-4 text-foreground text-sm font-sans outline-none transition-all duration-200 focus:border-primary placeholder:text-muted-foreground/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">Why do you want to join?</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={3}
              className="w-full bg-white/4 border border-primary/20 rounded-xl py-2.5 px-4 text-foreground text-sm font-sans outline-none transition-all duration-200 focus:border-primary placeholder:text-muted-foreground/50 resize-none"
            />
          </div>

          {/* Gear Image Upload */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">
              Gear Screenshots <span className="text-muted-foreground/50">(Upload images of your gear/character)</span>
            </label>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Upload Area */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-primary/30 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-xl">
                📷
              </div>
              <span className="text-sm text-muted-foreground">Click to upload gear images</span>
              <span className="text-xs text-muted-foreground/60">PNG, JPG up to 10MB each</span>
            </button>

            {/* Uploaded Images Preview */}
            {gearImages.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2 max-sm:grid-cols-2">
                {gearImages.map(img => (
                  <div key={img.id} className="relative group">
                    <img 
                      src={img.url} 
                      alt={img.name}
                      className="w-full aspect-square object-cover rounded-lg border border-primary/20"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[10px] text-white p-1 truncate rounded-b-lg">
                      {img.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              className="flex-1 py-2.5 px-4 rounded-xl border-none cursor-pointer font-sans text-sm font-bold tracking-wide transition-all duration-200 bg-gradient-to-br from-accent to-green-600 text-white shadow-[0_4px_15px_rgba(34,197,94,0.25)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(34,197,94,0.4)]"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ManageRequirementsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [minGearScore, setMinGearScore] = useState('450')
  const [minAttendance, setMinAttendance] = useState('75')
  const [lookingFor, setLookingFor] = useState(['Tank', 'Healer'])

  if (!isOpen) return null

  const roles = ['Tank', 'Healer', 'DPS', 'Support', 'Flex']

  const toggleRole = (role: string) => {
    setLookingFor(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-card border border-border rounded-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b border-primary/15">
          <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
            Manage Requirements
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Set recruitment criteria for applicants</p>
        </div>
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">Minimum Gear Score</label>
            <input
              type="number"
              value={minGearScore}
              onChange={e => setMinGearScore(e.target.value)}
              placeholder="e.g. 450"
              className="w-full bg-white/4 border border-primary/20 rounded-xl py-2.5 px-4 text-foreground text-sm font-sans outline-none transition-all duration-200 focus:border-primary focus:shadow-[0_0_10px_rgba(124,58,237,0.3)] placeholder:text-muted-foreground/50"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">Minimum Attendance Rate (%)</label>
            <input
              type="number"
              value={minAttendance}
              onChange={e => setMinAttendance(e.target.value)}
              placeholder="e.g. 75"
              min="0"
              max="100"
              className="w-full bg-white/4 border border-primary/20 rounded-xl py-2.5 px-4 text-foreground text-sm font-sans outline-none transition-all duration-200 focus:border-primary focus:shadow-[0_0_10px_rgba(124,58,237,0.3)] placeholder:text-muted-foreground/50"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">Looking For Roles</label>
            <div className="flex flex-wrap gap-2">
              {roles.map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all duration-200 ${
                    lookingFor.includes(role) 
                      ? 'bg-primary text-white' 
                      : 'bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {role}
                </button>
              ))}
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
              Save Requirements
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ViewApplicationModal({ 
  recruit, 
  isOpen, 
  onClose, 
  onAccept, 
  onDecline 
}: { 
  recruit: typeof recruits[0] | null
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
  onDecline: () => void
}) {
  if (!isOpen || !recruit) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-primary/15 sticky top-0 bg-card z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-[32px]">
              {recruit.clsIcon}
            </div>
            <div className="flex-1">
              <h2 className="font-serif text-xl font-bold text-foreground">{recruit.name}</h2>
              <div className="text-sm text-muted-foreground">{recruit.cls} · {recruit.role}</div>
            </div>
            <div className="text-xs text-muted-foreground/70">{recruit.date}</div>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Application Message */}
          <div className="mb-6">
            <div className="text-xs font-bold text-muted-foreground/70 uppercase tracking-wider mb-2">Application Message</div>
            <div className="text-sm text-foreground bg-white/3 border border-primary/10 rounded-xl p-4 leading-relaxed">
              {recruit.app}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6 max-sm:grid-cols-1">
            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-mono font-bold text-cyan">{recruit.gs}</div>
              <div className="text-xs text-muted-foreground mt-1">Gear Score</div>
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-mono font-bold text-foreground">{recruit.raids}</div>
              <div className="text-xs text-muted-foreground mt-1">Raid Experience</div>
            </div>
            <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-mono font-bold text-accent">{recruit.att}</div>
              <div className="text-xs text-muted-foreground mt-1">Attendance Rate</div>
            </div>
          </div>

          {/* Gear Screenshots */}
          <div className="mb-6">
            <div className="text-xs font-bold text-muted-foreground/70 uppercase tracking-wider mb-3">Gear Screenshots</div>
            <div className="grid grid-cols-4 gap-3 max-sm:grid-cols-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square rounded-xl bg-white/3 border border-primary/10 flex items-center justify-center text-2xl text-muted-foreground/40 hover:border-primary/30 transition-colors cursor-pointer">
                  📷
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-primary/15 flex gap-3 justify-end">
          <button 
            onClick={onDecline}
            className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl cursor-pointer font-sans text-sm font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-gradient-to-br from-destructive to-red-700 text-white hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(239,68,68,0.4)]"
          >
            ✕ Decline
          </button>
          <button 
            onClick={onClose}
            className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl cursor-pointer font-sans text-sm font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-transparent text-primary-light border border-primary/40 hover:bg-primary/15 hover:border-primary"
          >
            💬 Interview
          </button>
          <button 
            onClick={onAccept}
            className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl border-none cursor-pointer font-sans text-sm font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-gradient-to-br from-accent to-green-600 text-white shadow-[0_4px_15px_rgba(34,197,94,0.25)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(34,197,94,0.4)]"
          >
            ✅ Accept
          </button>
        </div>
      </div>
    </div>
  )
}

export function RecruitmentPage({ userRole }: RecruitmentPageProps) {
  const [applications, setApplications] = useState(recruits)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [showRequirementsModal, setShowRequirementsModal] = useState(false)
  const [selectedRecruit, setSelectedRecruit] = useState<typeof recruits[0] | null>(null)

  const canManage = canManageRecruitment(userRole)

  const handleAccept = (name: string) => {
    setApplications(apps => apps.filter(a => a.name !== name))
    setSelectedRecruit(null)
  }

  const handleDecline = (name: string) => {
    setApplications(apps => apps.filter(a => a.name !== name))
    setSelectedRecruit(null)
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="font-serif text-[26px] font-bold text-foreground flex items-center gap-3">
          <span className="text-2xl">📋</span> Recruitment
        </h1>
        <div className="flex gap-2.5">
          {canManage && (
            <button 
              onClick={() => setShowRequirementsModal(true)}
              className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl cursor-pointer font-sans text-sm font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-transparent text-primary-light border border-primary/40 hover:bg-primary/15 hover:border-primary"
            >
              Manage Requirements
            </button>
          )}
          <button 
            onClick={() => setShowApplyModal(true)}
            className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl border-none cursor-pointer font-sans text-sm font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-gradient-to-br from-accent to-green-600 text-white shadow-[0_4px_15px_rgba(34,197,94,0.25)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(34,197,94,0.4)]"
          >
            ✅ Apply Now
          </button>
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <span className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full text-xs font-bold bg-accent/15 text-accent border border-accent/30">
          {applications.length} Pending Applications
        </span>
        <span className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full text-xs font-bold bg-muted-foreground/15 text-muted-foreground border border-muted-foreground/30">
          Looking for: Tank, Healer
        </span>
      </div>

      {/* Application Cards - Bigger and better organized */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {applications.map(recruit => (
          <div key={recruit.id} className="bg-card backdrop-blur-xl border border-border rounded-2xl p-6 transition-all duration-200 hover:border-primary/40 hover:-translate-y-0.5">
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-[28px]">
                {recruit.clsIcon}
              </div>
              <div className="flex-1">
                <div className="text-lg font-bold text-foreground">{recruit.name}</div>
                <div className="text-sm text-muted-foreground">{recruit.cls} · {recruit.role}</div>
              </div>
              <div className="text-xs text-muted-foreground/70">{recruit.date}</div>
            </div>

            {/* Application Text */}
            <div className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
              {recruit.app}
            </div>

            {/* Stats - Bigger */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-cyan-500/5 border border-cyan-500/15 rounded-xl py-3 px-4 text-center">
                <div className="font-mono text-lg font-bold text-cyan">{recruit.gs}</div>
                <div className="text-[10px] text-muted-foreground/70 uppercase tracking-wider mt-0.5">Gear Score</div>
              </div>
              <div className="bg-white/3 border border-primary/10 rounded-xl py-3 px-4 text-center">
                <div className="font-mono text-lg font-bold text-foreground">{recruit.raids}</div>
                <div className="text-[10px] text-muted-foreground/70 uppercase tracking-wider mt-0.5">Experience</div>
              </div>
              <div className="bg-accent/5 border border-accent/15 rounded-xl py-3 px-4 text-center">
                <div className="font-mono text-lg font-bold text-accent">{recruit.att}</div>
                <div className="text-[10px] text-muted-foreground/70 uppercase tracking-wider mt-0.5">Att. Rate</div>
              </div>
            </div>

            {/* Gear Images Placeholder - Bigger */}
            <div className="mb-4">
              <div className="text-[10px] text-muted-foreground/60 mb-2 uppercase tracking-wider font-semibold">Gear Screenshots</div>
              <div className="flex gap-2">
                {[1, 2].map(i => (
                  <div key={i} className="w-20 h-20 rounded-xl bg-white/5 border border-primary/10 flex items-center justify-center text-lg text-muted-foreground/40">
                    📷
                  </div>
                ))}
                <div className="w-20 h-20 rounded-xl bg-white/5 border border-dashed border-primary/20 flex items-center justify-center text-sm text-muted-foreground/40 font-mono">
                  +2
                </div>
              </div>
            </div>

            {/* Actions - Bigger buttons */}
            <div className="flex gap-2">
              {canManage ? (
                <>
                  <button 
                    onClick={() => handleAccept(recruit.name)}
                    className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl border-none cursor-pointer font-sans text-sm font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-gradient-to-br from-accent to-green-600 text-white shadow-[0_4px_15px_rgba(34,197,94,0.25)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(34,197,94,0.4)]"
                  >
                    ✅ Accept
                  </button>
                  <button 
                    onClick={() => setSelectedRecruit(recruit)}
                    className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl cursor-pointer font-sans text-sm font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-transparent text-primary-light border border-primary/40 hover:bg-primary/15 hover:border-primary"
                  >
                    👁 View Full
                  </button>
                  <button 
                    onClick={() => handleDecline(recruit.name)}
                    className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl cursor-pointer font-sans text-sm font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-gradient-to-br from-destructive to-red-700 text-white hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(239,68,68,0.4)]"
                  >
                    ✕ Decline
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setSelectedRecruit(recruit)}
                  className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl cursor-pointer font-sans text-sm font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-transparent text-primary-light border border-primary/40 hover:bg-primary/15 hover:border-primary"
                >
                  👁 View Details
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {applications.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📭</div>
          <div className="text-lg font-bold text-foreground mb-2">No Pending Applications</div>
          <div className="text-sm text-muted-foreground">New applications will appear here when submitted</div>
        </div>
      )}

      <ApplyModal isOpen={showApplyModal} onClose={() => setShowApplyModal(false)} />
      <ManageRequirementsModal isOpen={showRequirementsModal} onClose={() => setShowRequirementsModal(false)} />
      <ViewApplicationModal 
        recruit={selectedRecruit}
        isOpen={!!selectedRecruit}
        onClose={() => setSelectedRecruit(null)}
        onAccept={() => selectedRecruit && handleAccept(selectedRecruit.name)}
        onDecline={() => selectedRecruit && handleDecline(selectedRecruit.name)}
      />
    </div>
  )
}
