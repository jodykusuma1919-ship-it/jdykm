'use client'

import { useState, useRef } from 'react'
import type { MemberScreenshots } from '@/lib/data'

// Sample data for current user
const currentUserData = {
  id: 1,
  name: 'Thalderin',
  role: 'Guild Master' as const,
  class: { icon: '🧙', name: 'Mage' },
  gs: 523000,
  screenshots: {} as MemberScreenshots,
}

function ScreenshotUploadCard({ 
  label, 
  icon,
  description, 
  imageUrl, 
  onUpload,
  color
}: { 
  label: string
  icon: string
  description: string
  imageUrl?: string
  onUpload: (url: string) => void
  color: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      onUpload(url)
    }
  }

  return (
    <div className={`bg-card backdrop-blur-xl border rounded-2xl p-4 ${color}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base font-bold text-primary-light bg-primary/20 px-2 py-1 rounded">{icon}</span>
        <div>
          <div className="text-sm font-bold text-foreground">{label}</div>
          <div className="text-[10px] text-muted-foreground/70">{description}</div>
        </div>
      </div>
      {imageUrl ? (
        <div className="relative group">
          <img src={imageUrl} alt={label} className="w-full h-32 object-cover rounded-xl border border-white/10" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
            <button 
              onClick={() => window.open(imageUrl, '_blank')}
              className="py-1.5 px-3 rounded-lg text-xs font-bold bg-white/20 text-white hover:bg-white/30 transition-all"
            >
              View
            </button>
            <button 
              onClick={() => inputRef.current?.click()}
              className="py-1.5 px-3 rounded-lg text-xs font-bold bg-primary/80 text-white hover:bg-primary transition-all"
            >
              Replace
            </button>
          </div>
          <span className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent/80 text-white">Uploaded</span>
        </div>
      ) : (
        <button 
          onClick={() => inputRef.current?.click()}
          className="w-full h-28 border-2 border-dashed border-primary/25 rounded-xl flex flex-col items-center justify-center gap-2 text-muted-foreground/60 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
        >
          <span className="text-2xl">📷</span>
          <span className="text-xs font-semibold">Click to Upload</span>
        </button>
      )}
      <input 
        ref={inputRef}
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleFileChange}
      />
    </div>
  )
}

function StatsSectionHeader({ title, icon, count }: { title: string; icon: string; count?: number }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-xl">{icon}</span>
      <h2 className="text-sm font-bold text-foreground">{title}</h2>
      {count !== undefined && (
        <span className="text-xs font-normal text-muted-foreground">({count}/5 uploaded)</span>
      )}
    </div>
  )
}

export function MyStatsPage() {
  const [screenshots, setScreenshots] = useState<MemberScreenshots>(currentUserData.screenshots)

  const handleScreenshotUpload = (type: keyof MemberScreenshots, url: string) => {
    setScreenshots(prev => ({
      ...prev,
      [type]: url,
      uploadedAt: new Date().toISOString()
    }))
    // In a real app, this would save to the database
  }

  // Count uploaded feathers
  const attackFeatherCount = [
    screenshots.attackFeather1, 
    screenshots.attackFeather2, 
    screenshots.attackFeather3, 
    screenshots.attackFeather4, 
    screenshots.attackFeather5
  ].filter(Boolean).length

  const defendFeatherCount = [
    screenshots.defendFeather1, 
    screenshots.defendFeather2, 
    screenshots.defendFeather3, 
    screenshots.defendFeather4, 
    screenshots.defendFeather5
  ].filter(Boolean).length

  // Count total uploaded
  const totalUploaded = Object.entries(screenshots).filter(([key, value]) => key !== 'uploadedAt' && value).length
  const totalSlots = 14 // gearscore, pvpStats, medal, gear, 5 attack, 5 defend

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-[26px] font-bold text-foreground flex items-center gap-3">
            <span className="text-2xl">📊</span> My Character Stats
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload screenshots of your character stats for guild leadership verification
          </p>
        </div>
        <div className="flex items-center gap-3">
          {screenshots.uploadedAt && (
            <span className="text-xs text-muted-foreground">
              Last updated: {new Date(screenshots.uploadedAt).toLocaleDateString()}
            </span>
          )}
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
            totalUploaded === totalSlots 
              ? 'bg-accent/20 text-accent border border-accent/30' 
              : 'bg-gold/20 text-gold border border-gold/30'
          }`}>
            {totalUploaded}/{totalSlots} Complete
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-5 mb-7">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-foreground">Upload Progress</span>
          <span className="text-sm font-mono text-primary-light">{Math.round((totalUploaded / totalSlots) * 100)}%</span>
        </div>
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              totalUploaded === totalSlots 
                ? 'bg-gradient-to-r from-accent to-green-400' 
                : 'bg-gradient-to-r from-primary to-indigo-500'
            }`}
            style={{ width: `${(totalUploaded / totalSlots) * 100}%` }}
          />
        </div>
        <p className="text-[11px] text-muted-foreground/70 mt-2">
          Complete all uploads for guild verification. Officers can review your stats at any time.
        </p>
      </div>

      {/* Main Stats Section */}
      <div className="mb-7">
        <StatsSectionHeader title="Main Stats" icon="⚡" />
        <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
          <ScreenshotUploadCard
            label="Gear Score"
            icon="GS"
            description="Screenshot showing your GS"
            imageUrl={screenshots.gearscore}
            onUpload={(url) => handleScreenshotUpload('gearscore', url)}
            color="border-cyan-500/25"
          />
          <ScreenshotUploadCard
            label="PVP Stats"
            icon="PVP"
            description="Your PVP ranking and stats"
            imageUrl={screenshots.pvpStats}
            onUpload={(url) => handleScreenshotUpload('pvpStats', url)}
            color="border-destructive/25"
          />
          <ScreenshotUploadCard
            label="Medal Collection"
            icon="M"
            description="Your medal collection"
            imageUrl={screenshots.medal}
            onUpload={(url) => handleScreenshotUpload('medal', url)}
            color="border-gold/25"
          />
          <ScreenshotUploadCard
            label="Gear / Equipment"
            icon="EQ"
            description="Your equipped gear"
            imageUrl={screenshots.gear}
            onUpload={(url) => handleScreenshotUpload('gear', url)}
            color="border-purple-500/25"
          />
        </div>
      </div>

      {/* Attack Feather Section */}
      <div className="mb-7">
        <StatsSectionHeader title="Attack Feathers" icon="⚔" count={attackFeatherCount} />
        <div className="grid grid-cols-5 gap-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
          <ScreenshotUploadCard
            label="Attack Feather 1"
            icon="ATK1"
            description="First attack feather tab"
            imageUrl={screenshots.attackFeather1}
            onUpload={(url) => handleScreenshotUpload('attackFeather1', url)}
            color="border-orange-500/25"
          />
          <ScreenshotUploadCard
            label="Attack Feather 2"
            icon="ATK2"
            description="Second attack feather tab"
            imageUrl={screenshots.attackFeather2}
            onUpload={(url) => handleScreenshotUpload('attackFeather2', url)}
            color="border-orange-500/25"
          />
          <ScreenshotUploadCard
            label="Attack Feather 3"
            icon="ATK3"
            description="Third attack feather tab"
            imageUrl={screenshots.attackFeather3}
            onUpload={(url) => handleScreenshotUpload('attackFeather3', url)}
            color="border-orange-500/25"
          />
          <ScreenshotUploadCard
            label="Attack Feather 4"
            icon="ATK4"
            description="Fourth attack feather tab"
            imageUrl={screenshots.attackFeather4}
            onUpload={(url) => handleScreenshotUpload('attackFeather4', url)}
            color="border-orange-500/25"
          />
          <ScreenshotUploadCard
            label="Attack Feather 5"
            icon="ATK5"
            description="Fifth attack feather tab"
            imageUrl={screenshots.attackFeather5}
            onUpload={(url) => handleScreenshotUpload('attackFeather5', url)}
            color="border-orange-500/25"
          />
        </div>
      </div>

      {/* Defend Feather Section */}
      <div className="mb-7">
        <StatsSectionHeader title="Defend Feathers" icon="🛡" count={defendFeatherCount} />
        <div className="grid grid-cols-5 gap-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
          <ScreenshotUploadCard
            label="Defend Feather 1"
            icon="DEF1"
            description="First defend feather tab"
            imageUrl={screenshots.defendFeather1}
            onUpload={(url) => handleScreenshotUpload('defendFeather1', url)}
            color="border-blue-500/25"
          />
          <ScreenshotUploadCard
            label="Defend Feather 2"
            icon="DEF2"
            description="Second defend feather tab"
            imageUrl={screenshots.defendFeather2}
            onUpload={(url) => handleScreenshotUpload('defendFeather2', url)}
            color="border-blue-500/25"
          />
          <ScreenshotUploadCard
            label="Defend Feather 3"
            icon="DEF3"
            description="Third defend feather tab"
            imageUrl={screenshots.defendFeather3}
            onUpload={(url) => handleScreenshotUpload('defendFeather3', url)}
            color="border-blue-500/25"
          />
          <ScreenshotUploadCard
            label="Defend Feather 4"
            icon="DEF4"
            description="Fourth defend feather tab"
            imageUrl={screenshots.defendFeather4}
            onUpload={(url) => handleScreenshotUpload('defendFeather4', url)}
            color="border-blue-500/25"
          />
          <ScreenshotUploadCard
            label="Defend Feather 5"
            icon="DEF5"
            description="Fifth defend feather tab"
            imageUrl={screenshots.defendFeather5}
            onUpload={(url) => handleScreenshotUpload('defendFeather5', url)}
            color="border-blue-500/25"
          />
        </div>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-primary/5 border border-primary/15 rounded-xl">
        <div className="flex items-start gap-3">
          <span className="text-lg">ℹ️</span>
          <div>
            <h3 className="text-sm font-bold text-foreground mb-1">Why upload your stats?</h3>
            <p className="text-xs text-muted-foreground">
              Uploading screenshots of your character stats helps guild leadership verify member progression and assign appropriate roles for raids and events. 
              Keep your stats updated regularly to ensure you are eligible for all guild activities. All uploads are visible only to guild officers and leadership.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
