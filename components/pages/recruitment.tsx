'use client'

import { recruits } from '@/lib/data'
import { useState, useRef } from 'react'

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
    // Here you would submit the application with images
    onClose()
    setCharacterName('')
    setGearScore('')
    setExperience('')
    setMessage('')
    setGearImages([])
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b border-primary/15">
          <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
            📋 Submit Application
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Fill in your details and upload gear screenshots</p>
        </div>
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
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

export function RecruitmentPage() {
  const [applications, setApplications] = useState(recruits)
  const [showApplyModal, setShowApplyModal] = useState(false)

  const handleAccept = (name: string) => {
    setApplications(apps => apps.filter(a => a.name !== name))
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="font-serif text-[26px] font-bold text-foreground flex items-center gap-3">
          <span className="text-2xl">📋</span> Recruitment
        </h1>
        <div className="flex gap-2.5">
          <button className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl cursor-pointer font-sans text-sm font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-transparent text-primary-light border border-primary/40 hover:bg-primary/15 hover:border-primary">
            ⚙ Manage Requirements
          </button>
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

      {/* Application Cards */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-4">
        {applications.map(recruit => (
          <div key={recruit.id} className="bg-card backdrop-blur-xl border border-border rounded-2xl p-5 transition-all duration-200 hover:border-primary/40 hover:-translate-y-0.5">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3.5">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-[22px]">
                {recruit.clsIcon}
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-bold text-foreground">{recruit.name}</div>
                <div className="text-xs text-muted-foreground">{recruit.cls} · {recruit.role}</div>
              </div>
              <div className="text-[11px] text-muted-foreground/70">{recruit.date}</div>
            </div>

            {/* Application Text */}
            <div className="text-[13px] text-muted-foreground leading-relaxed mb-3.5">
              {recruit.app}
            </div>

            {/* Stats */}
            <div className="flex gap-3 flex-wrap mb-3.5">
              <div className="bg-white/3 border border-primary/10 rounded-lg py-2 px-3 text-xs">
                <div className="text-muted-foreground/70 mb-0.5">Gear Score</div>
                <div className="font-bold text-cyan">{recruit.gs}</div>
              </div>
              <div className="bg-white/3 border border-primary/10 rounded-lg py-2 px-3 text-xs">
                <div className="text-muted-foreground/70 mb-0.5">Experience</div>
                <div className="font-bold text-foreground">{recruit.raids}</div>
              </div>
              <div className="bg-white/3 border border-primary/10 rounded-lg py-2 px-3 text-xs">
                <div className="text-muted-foreground/70 mb-0.5">Att. Rate</div>
                <div className="font-bold text-accent">{recruit.att}</div>
              </div>
            </div>

            {/* Gear Images Placeholder */}
            <div className="mb-3.5">
              <div className="text-[10px] text-muted-foreground/60 mb-1.5 uppercase tracking-wider">Gear Screenshots</div>
              <div className="flex gap-2">
                {[1, 2].map(i => (
                  <div key={i} className="w-16 h-16 rounded-lg bg-white/5 border border-primary/10 flex items-center justify-center text-xs text-muted-foreground/40">
                    📷
                  </div>
                ))}
                <div className="w-16 h-16 rounded-lg bg-white/5 border border-dashed border-primary/20 flex items-center justify-center text-xs text-muted-foreground/40">
                  +2
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button 
                onClick={() => handleAccept(recruit.name)}
                className="inline-flex items-center gap-2 py-2 px-3.5 rounded-lg border-none cursor-pointer font-sans text-xs font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-gradient-to-br from-accent to-green-600 text-white shadow-[0_4px_15px_rgba(34,197,94,0.25)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(34,197,94,0.4)]"
              >
                ✅ Accept
              </button>
              <button className="inline-flex items-center gap-2 py-2 px-3.5 rounded-lg cursor-pointer font-sans text-xs font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-transparent text-primary-light border border-primary/40 hover:bg-primary/15 hover:border-primary">
                💬 Interview
              </button>
              <button className="inline-flex items-center gap-2 py-2 px-3.5 rounded-lg cursor-pointer font-sans text-xs font-bold tracking-wide transition-all duration-200 whitespace-nowrap bg-gradient-to-br from-destructive to-red-700 text-white hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(239,68,68,0.4)]">
                ✕ Decline
              </button>
            </div>
          </div>
        ))}
      </div>

      <ApplyModal isOpen={showApplyModal} onClose={() => setShowApplyModal(false)} />
    </div>
  )
}
