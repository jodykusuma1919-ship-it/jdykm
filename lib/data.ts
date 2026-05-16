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
  feather?: string
  medal?: string
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

// Generate members deterministically for SSR
function generateMembers(): Member[] {
  // Use a seeded random for consistent data
  let seed = 12345
  const seededRng = (s: number, e: number) => {
    seed = (seed * 9301 + 49297) % 233280
    return s + Math.floor((seed / 233280) * (e - s + 1))
  }
  const seededRoll = (n: number) => {
    seed = (seed * 9301 + 49297) % 233280
    return (seed / 233280) < n
  }

  return names.map((n, i) => {
    const cls = classes[i % classes.length]
    const role = i === 0 ? 'Guild Master' : i === 1 ? 'Vice Master' : i < 5 ? 'Officer' : i < 8 ? 'Raid Leader' : i < 30 ? 'Member' : 'Recruit'
    const st: Member['status'] = i < 5 ? 'Online' : i < 10 ? (seededRoll(0.4) ? 'In Raid' : seededRoll(0.3) ? 'AFK' : 'Online') : statuses[seededRng(0, 5)]
    const dkp = seededRng(100, 2200)
    const att = seededRng(45, 100)
    const joinDays = seededRng(10, 400)
    const joinDate = new Date(Date.now() - joinDays * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    const lastOnline = st === 'Online' ? 'Now' : st === 'In Raid' ? 'In Raid' : st === 'AFK' ? '5 min ago' : `${seededRng(1, 72)}h ago`
    
    return {
      id: i,
      name: n,
      class: cls,
      role,
      status: st,
      dkp,
      att,
      joinDate,
      lastOnline,
      gs: seededRng(480, 520),
      discord: `@${n.toLowerCase()}`,
      totalRaids: seededRng(5, 100),
      bidLimits: {
        fragmentCard: 2,
        timespace: 2,
        lnd: 2,
      },
      screenshots: {},
    }
  })
}

export const allMembers: Member[] = generateMembers()

export const auctions: Auction[] = [
  {
    id: 1,
    name: 'Fragment Card',
    icon: '🃏',
    type: 'Fragment Card · Enhancement · Bound on pickup',
    ilvl: 0,
    category: 'fragmentCard',
    bids: [
      { user: 'Valdris', icon: '🧙', dkp: 680, time: 'HIGHEST' },
      { user: 'Thorgur', icon: '⚔', dkp: 550, time: '2m ago' },
      { user: 'Karath', icon: '🛡', dkp: 480, time: '5m ago' },
      { user: 'Selara', icon: '🧝', dkp: 460, time: '6m ago' },
      { user: 'Miravel', icon: '🧙', dkp: 440, time: '8m ago' },
      { user: 'Lyrath', icon: '🏹', dkp: 420, time: '10m ago' },
      { user: 'Daerith', icon: '⚔', dkp: 400, time: '12m ago' },
      { user: 'Korrath', icon: '🛡', dkp: 380, time: '14m ago' },
      { user: 'Varessa', icon: '✨', dkp: 360, time: '16m ago' },
      { user: 'Aelindra', icon: '🔮', dkp: 340, time: '18m ago' },
      { user: 'Braxus', icon: '⚔', dkp: 320, time: '20m ago' },
      { user: 'Cyndra', icon: '🧙', dkp: 300, time: '22m ago' },
      { user: 'Duriel', icon: '🛡', dkp: 280, time: '24m ago' },
      { user: 'Elara', icon: '✨', dkp: 260, time: '26m ago' },
      { user: 'Farath', icon: '⚔', dkp: 240, time: '28m ago' },
      { user: 'Gwendal', icon: '🏹', dkp: 220, time: '30m ago' },
      { user: 'Halion', icon: '🔮', dkp: 200, time: '32m ago' },
      { user: 'Ilnora', icon: '🧙', dkp: 180, time: '34m ago' },
      { user: 'Jaxar', icon: '⚔', dkp: 160, time: '36m ago' },
      { user: 'Kaelis', icon: '🛡', dkp: 140, time: '38m ago' },
    ],
    timeRemaining: 754,
  },
  {
    id: 2,
    name: 'LND',
    icon: '⚡',
    type: 'LND · Special Item · Bound on pickup',
    ilvl: 0,
    category: 'lnd',
    bids: [
      { user: 'Selara', icon: '🧝', dkp: 520, time: 'HIGHEST' },
      { user: 'Miravel', icon: '🧙', dkp: 480, time: '3m ago' },
      { user: 'Thorgur', icon: '⚔', dkp: 450, time: '5m ago' },
      { user: 'Karath', icon: '🛡', dkp: 420, time: '7m ago' },
      { user: 'Valdris', icon: '🧙', dkp: 400, time: '9m ago' },
      { user: 'Lyrath', icon: '🏹', dkp: 380, time: '11m ago' },
      { user: 'Daerith', icon: '⚔', dkp: 360, time: '13m ago' },
      { user: 'Korrath', icon: '🛡', dkp: 340, time: '15m ago' },
      { user: 'Varessa', icon: '✨', dkp: 320, time: '17m ago' },
      { user: 'Aelindra', icon: '🔮', dkp: 300, time: '19m ago' },
      { user: 'Braxus', icon: '⚔', dkp: 280, time: '21m ago' },
      { user: 'Cyndra', icon: '🧙', dkp: 260, time: '23m ago' },
      { user: 'Duriel', icon: '🛡', dkp: 240, time: '25m ago' },
      { user: 'Elara', icon: '✨', dkp: 220, time: '27m ago' },
      { user: 'Farath', icon: '⚔', dkp: 200, time: '29m ago' },
      { user: 'Gwendal', icon: '🏹', dkp: 180, time: '31m ago' },
    ],
    timeRemaining: 492,
  },
  {
    id: 3,
    name: 'Time Space',
    icon: '🔮',
    type: 'Timespace · Enhancement · Bound on pickup',
    ilvl: 0,
    category: 'timespace',
    bids: [
      { user: 'Thorgur', icon: '🛡', dkp: 410, time: 'HIGHEST' },
      { user: 'Daerith', icon: '⚔', dkp: 380, time: '1m ago' },
      { user: 'Lyrath', icon: '🏹', dkp: 350, time: '4m ago' },
      { user: 'Valdris', icon: '🧙', dkp: 320, time: '6m ago' },
      { user: 'Selara', icon: '🧝', dkp: 300, time: '8m ago' },
      { user: 'Miravel', icon: '🧙', dkp: 280, time: '10m ago' },
      { user: 'Karath', icon: '🛡', dkp: 260, time: '12m ago' },
      { user: 'Korrath', icon: '🛡', dkp: 240, time: '14m ago' },
      { user: 'Varessa', icon: '✨', dkp: 220, time: '16m ago' },
      { user: 'Aelindra', icon: '🔮', dkp: 200, time: '18m ago' },
      { user: 'Braxus', icon: '⚔', dkp: 180, time: '20m ago' },
      { user: 'Cyndra', icon: '🧙', dkp: 160, time: '22m ago' },
      { user: 'Duriel', icon: '🛡', dkp: 140, time: '24m ago' },
      { user: 'Elara', icon: '✨', dkp: 120, time: '26m ago' },
      { user: 'Farath', icon: '⚔', dkp: 100, time: '28m ago' },
      { user: 'Gwendal', icon: '🏹', dkp: 80, time: '30m ago' },
      { user: 'Halion', icon: '🔮', dkp: 60, time: '32m ago' },
      { user: 'Ilnora', icon: '🧙', dkp: 40, time: '34m ago' },
    ],
    timeRemaining: 224,
  },
]

export const defaultGuildEvents: GuildEvent[] = [
  {
    id: 1,
    name: 'Abyssal Citadel Raid',
    type: 'RAID',
    date: new Date(2026, 4, 12),
    time: '20:00 UTC',
    details: '25-man · Ilvl 480+',
    rsvp: { confirmed: 18, total: 25 },
    dkpReward: 100,
    attendees: [],
  },
  {
    id: 2,
    name: 'Guild vs Guild PvP',
    type: 'PVP',
    date: new Date(2026, 4, 14),
    time: '18:00 UTC',
    details: 'Open World · All ranks',
    rsvp: { confirmed: 34, total: 40 },
    dkpReward: 100,
    attendees: [],
  },
  {
    id: 3,
    name: 'Weekly Officers Meeting',
    type: 'MEETING',
    date: new Date(2026, 4, 16),
    time: '19:00 UTC',
    details: 'Voice channel',
    rsvp: { confirmed: 7, total: 8 },
    dkpReward: 0,
    attendees: [],
  },
  {
    id: 4,
    name: 'Timespace Rift Event',
    type: 'RAID',
    date: new Date(2026, 4, 18),
    time: '21:00 UTC',
    details: '10-man · Weekly reset',
    rsvp: { confirmed: 6, total: 10 },
    dkpReward: 100,
    attendees: [],
  },
  {
    id: 5,
    name: 'Dragon Lair Heroic',
    type: 'RAID',
    date: new Date(2026, 4, 20),
    time: '20:00 UTC',
    details: '25-man · Mythic progression',
    rsvp: { confirmed: 22, total: 25 },
    dkpReward: 150,
    attendees: [],
  },
  {
    id: 6,
    name: 'Territory Control',
    type: 'PVP',
    date: new Date(2026, 4, 22),
    time: '17:00 UTC',
    details: 'Capture objectives · Team event',
    rsvp: { confirmed: 28, total: 40 },
    dkpReward: 75,
    attendees: [],
  },
  {
    id: 7,
    name: 'Recruitment Open House',
    type: 'OTHER',
    date: new Date(2026, 4, 24),
    time: '19:00 UTC',
    details: 'Meet new recruits · Social event',
    rsvp: { confirmed: 15, total: 30 },
    dkpReward: 50,
    attendees: [],
  },
]

export const recruits: Recruit[] = [
  {
    id: 1,
    name: 'Solaris',
    cls: 'Mage',
    clsIcon: '🧙',
    app: 'Experienced raider, 6/8 mythic prog. Seeking active guild for endgame content.',
    gs: 496,
    raids: '3 years',
    att: '94%',
    role: 'DPS',
    date: '2 days ago',
  },
  {
    id: 2,
    name: 'Dawnfyre',
    cls: 'Paladin',
    clsIcon: '🛡',
    app: 'Tank main looking for progression guild. Available 5 days/week. Strong awareness.',
    gs: 488,
    raids: '2 years',
    att: '88%',
    role: 'Tank',
    date: '2 days ago',
  },
  {
    id: 3,
    name: 'Vyraneth',
    cls: 'Priest',
    clsIcon: '✨',
    app: 'Holy healer, experienced in all current content. Clear comms, discord always on.',
    gs: 502,
    raids: '4 years',
    att: '97%',
    role: 'Healer',
    date: '3 days ago',
  },
  {
    id: 4,
    name: 'Thessar',
    cls: 'Shaman',
    clsIcon: '⚡',
    app: 'Elemental/Restoration flex. Happy to fill whatever role is needed for progression.',
    gs: 478,
    raids: '2 years',
    att: '79%',
    role: 'Flex',
    date: '4 days ago',
  },
  {
    id: 5,
    name: 'Korrath',
    cls: 'Hunter',
    clsIcon: '🏹',
    app: 'Recently server transferred. Beast Mastery main, flex to Marksmanship as needed.',
    gs: 481,
    raids: '1.5 years',
    att: '82%',
    role: 'DPS',
    date: '5 days ago',
  },
]

export const activityFeed = [
  { icon: '⚔', type: 'DKP', text: '<b>Valdris</b> received <span class="gold">+150 DKP</span> for <span class="hl">Dragon Lair Raid</span> completion', time: '2 minutes ago' },
  { icon: '🧝', type: 'LOOT', text: '<b>Selara</b> won <span class="hl">LND</span> via auction for <span class="gold">420 DKP</span>', time: '8 minutes ago' },
  { icon: '🛡', type: 'JOIN', text: '<b>Korrath</b> joined the guild as <span class="hl">Recruit</span>', time: '21 minutes ago' },
  { icon: '🗡', type: 'EVENT', text: '<b>Thalderin</b> scheduled <span class="hl">Abyssal Citadel Raid</span> for tonight 20:00 UTC', time: '1 hour ago' },
  { icon: '🧙', type: 'DKP', text: '<b>Miravel</b> had <span class="gold">-80 DKP</span> removed for missed raid attendance', time: '3 hours ago' },
  { icon: '🏹', type: 'KICK', text: '<b>Daelith</b> was removed from guild by <b>Varessa</b>', time: '5 hours ago' },
]
