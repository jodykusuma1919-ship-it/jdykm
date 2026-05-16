// Member and game data types and mock data

export interface GameClass {
  name: string
  icon: string
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
}

export interface Auction {
  id: number
  name: string
  icon: string
  type: string
  ilvl: number
  category: 'main' | 'fragment' | 'timespace'
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

function rng(s: number, e: number): number {
  return Math.floor(Math.random() * (e - s + 1)) + s
}

function roll(n: number): boolean {
  return Math.random() < n
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
    }
  })
}

export const allMembers: Member[] = generateMembers()

export const auctions: Auction[] = [
  {
    id: 1,
    name: 'Shadowfang Executioner',
    icon: '⚔',
    type: 'Legendary Weapon · Two-Handed Sword · ilvl 510',
    ilvl: 510,
    category: 'main',
    bids: [
      { user: 'Valdris', icon: '🧙', dkp: 680, time: 'HIGHEST' },
      { user: 'Thorgur', icon: '⚔', dkp: 550, time: '2m ago' },
      { user: 'Karath', icon: '🛡', dkp: 480, time: '5m ago' },
    ],
    timeRemaining: 754,
  },
  {
    id: 2,
    name: 'Voidweave Spellcloak',
    icon: '🧝',
    type: 'Epic Chest Armor · Cloth · ilvl 495',
    ilvl: 495,
    category: 'main',
    bids: [
      { user: 'Selara', icon: '🧝', dkp: 420, time: 'HIGHEST' },
      { user: 'Miravel', icon: '🧙', dkp: 350, time: '3m ago' },
    ],
    timeRemaining: 492,
  },
  {
    id: 3,
    name: 'Voidheart Fragment ×5',
    icon: '🔮',
    type: 'Fragment Card · Enhancement · Bound on pickup',
    ilvl: 0,
    category: 'fragment',
    bids: [
      { user: 'Thorgur', icon: '🛡', dkp: 310, time: 'HIGHEST' },
      { user: 'Daerith', icon: '⚔', dkp: 280, time: '1m ago' },
      { user: 'Lyrath', icon: '🏹', dkp: 250, time: '4m ago' },
    ],
    timeRemaining: 224,
  },
]

export const guildEvents: GuildEvent[] = [
  {
    id: 1,
    name: 'Abyssal Citadel Raid',
    type: 'RAID',
    date: new Date(2026, 4, 12),
    time: '20:00 UTC',
    details: '25-man · Ilvl 480+',
    rsvp: { confirmed: 18, total: 25 },
    dkpReward: 100,
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
  { icon: '🧝', type: 'LOOT', text: '<b>Selara</b> won <span class="hl">Voidweave Spellcloak</span> via auction for <span class="gold">420 DKP</span>', time: '8 minutes ago' },
  { icon: '🛡', type: 'JOIN', text: '<b>Korrath</b> joined the guild as <span class="hl">Recruit</span>', time: '21 minutes ago' },
  { icon: '🗡', type: 'EVENT', text: '<b>Thalderin</b> scheduled <span class="hl">Abyssal Citadel Raid</span> for tonight 20:00 UTC', time: '1 hour ago' },
  { icon: '🧙', type: 'DKP', text: '<b>Miravel</b> had <span class="gold">-80 DKP</span> removed for missed raid attendance', time: '3 hours ago' },
  { icon: '🏹', type: 'KICK', text: '<b>Daelith</b> was removed from guild by <b>Varessa</b>', time: '5 hours ago' },
]
