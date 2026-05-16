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
// NOTE: Admin role is VIEW ONLY - cannot edit anything (same as Member for edit permissions)

export function canEditAllSettings(role: GuildRole): boolean {
  // Admin CANNOT edit - only Guild Master and Vice Master
  return ['Guild Master', 'Vice Master'].includes(role)
}

export function canEditBattleSettings(role: GuildRole): boolean {
  // Admin CANNOT edit - only guild leadership
  return ['Guild Master', 'Vice Master', 'Commander', 'Officer'].includes(role)
}

export function canManageRecruitment(role: GuildRole): boolean {
  // Admin CANNOT manage - only guild leadership
  return ['Guild Master', 'Vice Master', 'Commander', 'Officer'].includes(role)
}

export function canScheduleEvents(role: GuildRole): boolean {
  // Only Guild Master and Vice Master can schedule events
  return ['Guild Master', 'Vice Master'].includes(role)
}

export function canRecordAttendance(role: GuildRole): boolean {
  // Admin can view but leadership can record
  return ['Guild Master', 'Vice Master', 'Commander', 'Officer', 'Raid Leader'].includes(role)
}

export function canViewReports(role: GuildRole): boolean {
  // Admin CAN view reports (read-only)
  return ['Admin', 'Guild Master', 'Vice Master', 'Commander', 'Officer'].includes(role)
}

export function canViewAllMembers(role: GuildRole): boolean {
  // Admin CAN view all members (read-only)
  return ['Admin', 'Guild Master', 'Vice Master', 'Commander', 'Officer', 'Raid Leader'].includes(role)
}

export function canEditMembers(role: GuildRole): boolean {
  // Admin CANNOT edit members - only guild leadership
  return ['Guild Master', 'Vice Master', 'Commander', 'Officer'].includes(role)
}

export function canManageDKP(role: GuildRole): boolean {
  // Admin CANNOT manage DKP - only guild leadership
  return ['Guild Master', 'Vice Master', 'Commander', 'Officer'].includes(role)
}

export function canManageLoot(role: GuildRole): boolean {
  // Admin CANNOT manage loot - only guild leadership can create auctions
  return ['Guild Master', 'Vice Master', 'Commander', 'Officer'].includes(role)
}

export function canBidOnLoot(role: GuildRole): boolean {
  // All members (including Admin) can bid/request loot
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
