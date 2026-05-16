// Role system for guild management
export type GuildRole = 'Admin' | 'Guild Master' | 'Vice Master' | 'Commander' | 'Officer' | 'Raid Leader' | 'Member' | 'Recruit'

// Role hierarchy levels (higher = more permissions)
const ROLE_LEVELS: Record<GuildRole, number> = {
  'Admin': 100,
  'Guild Master': 90,
  'Vice Master': 80,
  'Commander': 60,
  'Officer': 50,
  'Raid Leader': 40,
  'Member': 20,
  'Recruit': 10,
}

// Permission checks - these accept a role parameter now
// Admin, Guild Master, Vice Master have FULL access to everything

export function canEditAllSettings(role: GuildRole): boolean {
  // Admin, Guild Master, Vice Master can edit all settings
  return ['Admin', 'Guild Master', 'Vice Master'].includes(role)
}

export function canEditBattleSettings(role: GuildRole): boolean {
  // Admin, Guild Master, Vice Master + Commander, Officer can edit battle settings
  return ['Admin', 'Guild Master', 'Vice Master', 'Commander', 'Officer'].includes(role)
}

export function canManageRecruitment(role: GuildRole): boolean {
  // Admin, Guild Master, Vice Master + Commander, Officer can manage recruitment
  return ['Admin', 'Guild Master', 'Vice Master', 'Commander', 'Officer'].includes(role)
}

export function canScheduleEvents(role: GuildRole): boolean {
  // Admin, Guild Master, Vice Master can schedule events
  return ['Admin', 'Guild Master', 'Vice Master'].includes(role)
}

export function canRecordAttendance(role: GuildRole): boolean {
  // Admin, Guild Master, Vice Master + leadership can record attendance
  return ['Admin', 'Guild Master', 'Vice Master', 'Commander', 'Officer', 'Raid Leader'].includes(role)
}

export function canViewReports(role: GuildRole): boolean {
  // Admin, Guild Master, Vice Master + leadership can view reports
  return ['Admin', 'Guild Master', 'Vice Master', 'Commander', 'Officer'].includes(role)
}

export function canViewAllMembers(role: GuildRole): boolean {
  // Admin, Guild Master, Vice Master + leadership can view all members
  return ['Admin', 'Guild Master', 'Vice Master', 'Commander', 'Officer', 'Raid Leader'].includes(role)
}

export function canEditMembers(role: GuildRole): boolean {
  // Admin, Guild Master, Vice Master + Commander, Officer can edit members
  return ['Admin', 'Guild Master', 'Vice Master', 'Commander', 'Officer'].includes(role)
}

export function canManageDKP(role: GuildRole): boolean {
  // Admin, Guild Master, Vice Master + Commander, Officer can manage DKP
  return ['Admin', 'Guild Master', 'Vice Master', 'Commander', 'Officer'].includes(role)
}

export function canManageLoot(role: GuildRole): boolean {
  // Admin, Guild Master, Vice Master + Commander, Officer can manage loot/auctions
  return ['Admin', 'Guild Master', 'Vice Master', 'Commander', 'Officer'].includes(role)
}

export function canBidOnLoot(role: GuildRole): boolean {
  // All members can bid/request loot
  return ['Admin', 'Guild Master', 'Vice Master', 'Commander', 'Officer', 'Raid Leader', 'Member', 'Recruit'].includes(role)
}

export function getRoleLevel(role: GuildRole): number {
  return ROLE_LEVELS[role] || 0
}

export function isRoleHigherOrEqual(role1: GuildRole, role2: GuildRole): boolean {
  return getRoleLevel(role1) >= getRoleLevel(role2)
}

// Role display colors
export function getRoleColor(role: GuildRole): string {
  switch (role) {
    case 'Admin':
      return 'bg-red-500/20 text-red-400'
    case 'Guild Master':
      return 'bg-gold/20 text-gold'
    case 'Vice Master':
      return 'bg-amber-500/20 text-amber-400'
    case 'Commander':
      return 'bg-purple-500/20 text-purple-400'
    case 'Officer':
      return 'bg-blue-500/20 text-blue-400'
    case 'Raid Leader':
      return 'bg-cyan-500/20 text-cyan-400'
    case 'Member':
      return 'bg-green-500/20 text-green-400'
    case 'Recruit':
      return 'bg-muted-foreground/20 text-muted-foreground'
    default:
      return 'bg-muted-foreground/20 text-muted-foreground'
  }
}
