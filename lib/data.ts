// Member and game data types and mock data

export interface GameClass {
  name: string
  icon: string
}

export interface MemberBidLimits {
  fragmentCard: number
  timespace: number
  lnd: number
}

export interface MemberScreenshots {
  gearscore?: string
  pvpStats?: string
  attackFeather?: string
  defendFeather?: string
  medal?: string
  gear?: string
  uploadedAt?: string
}

export interface Member {
  id: number
  name: string
  class: GameClass
  role: string
  status: 'Online' | 'In Raid' | 'AFK' | 'Offline'
  dkp: number
  att: number
  joinDate: string
  lastOnline: string
  gs: number
  discord: string
  totalRaids: number
  bidLimits: MemberBidLimits
  screenshots: MemberScreenshots
}

export interface Auction {
  id: number
  name: string
  icon: string
  type: string
  ilvl: number
  category: 'fragmentCard' | 'timespace' | 'lnd'
  bids: { user: string; icon: string; dkp: number; time: string }[]
  timeRemaining: number
}

export interface GuildEvent {
  id: number
  name: string
  type: 'RAID' | 'PVP' | 'MEETING' | 'OTHER'
  date: Date
  time: string
  details: string
  rsvp: { confirmed: number; total: number }
  dkpReward: number
  attendees?: string[]
}

export interface Recruit {
  id: number
  name: string
  cls: string
  clsIcon: string
  app: string
  gs: number
  raids: string
  att: string
  role: string
  date: string
}

export const classes: GameClass[] = [
  { name: 'Warrior', icon: '⚔' },
  { name: 'Mage', icon: '🧙' },
  { name: 'Ranger', icon: '🏹' },
  { name: 'Priest', icon: '✨' },
  { name: 'Paladin', icon: '🛡' },
  { name: 'Rogue', icon: '🗡' },
  { name: 'Warlock', icon: '🔮' },
  { name: 'Shaman', icon: '⚡' },
  { name: 'Druid', icon: '🌿' },
  { name: 'Monk', icon: '👊' },
]

export const roles = ['Guild Master', 'Vice Master', 'Officer', 'Raid Leader', 'Member', 'Recruit']
export const statuses: ('Online' | 'In Raid' | 'AFK' | 'Offline')[] = ['Online', 'In Raid', 'AFK', 'Offline', 'Offline', 'Offline']

export const names = [
  'Valdris', 'Selara', 'Thorgur', 'Miravel', 'Lyrath', 'Daerith', 'Korrath', 'Varessa',
  'Aelindra', 'Braxus', 'Cyndra', 'Duriel', 'Elara', 'Farath', 'Gwendal', 'Halion',
  'Ilnora', 'Jaxar', 'Kaelis', 'Lerath', 'Marek', 'Noreth', 'Ophara', 'Pyraxis',
  'Quentel', 'Rhaena', 'Syveth', 'Talon', 'Ulvar', 'Vesper', 'Wrath', 'Xyvara',
  'Ysgard', 'Zephyr', 'Aldric', 'Bael', 'Caer', 'Dusk', 'Elar', 'Fynd',
  'Gael', 'Hort', 'Ivan', 'Jaxx', 'Kira', 'Lorn', 'Mira'
]

export const roleColors: Record<string, string> = {
  'Guild Master': 'bg-gradient-to-r from-gold/25 to-amber-600/15 text-gold border border-gold/35',
  'Vice Master': 'bg-gradient-to-r from-primary/25 to-violet-500/15 text-primary-light border border-primary/35',
  'Officer': 'bg-blue/15 text-blue border border-blue/30',
  'Raid Leader': 'bg-destructive/15 text-destructive border border-destructive/30',
  'Member': 'bg-muted-foreground/12 text-muted-foreground border border-muted-foreground/25',
  'Recruit': 'bg-accent/12 text-green-300 border border-accent/25',
}

export const roleIcons: Record<string, string> = {
  'Guild Master': '👑',
  'Vice Master': '⭐',
  'Officer': '🛡',
  'Raid Leader': '⚔',
  'Member': '⚡',
  'Recruit': '🌱',
}

// Empty members array - start fresh
export const allMembers: Member[] = []

// Empty auctions array - start fresh
export const auctions: Auction[] = []

// Empty events array - start fresh
export const defaultGuildEvents: GuildEvent[] = []

// Empty recruits array - start fresh
export const recruits: Recruit[] = []

// Empty activity feed - start fresh
export const activityFeed: { icon: string; type: string; text: string; time: string }[] = []
