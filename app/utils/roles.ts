import type { Database } from '~/types/database.types'

type UserRole = Database['public']['Enums']['user_role']

export const ROLE_ORDER: UserRole[] = [
  'super_admin',
  'admin',
  'manager',
  'superviseur',
  'employe',
]

export function roleOrder(r: UserRole | string): number {
  const idx = ROLE_ORDER.indexOf(r as UserRole)
  return idx >= 0 ? idx : 999
}

export function roleLabel(role: string | null | undefined): string {
  const labels: Record<string, string> = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    manager: 'Manager',
    superviseur: 'Superviseur',
    employe: 'Employé',
  }
  return role ? (labels[role] ?? role) : ''
}

export function roleColor(
  role: string | null | undefined
): 'info' | 'error' | 'primary' | 'secondary' | 'success' | 'warning' | 'neutral' {
  const colors: Record<string, 'info' | 'error' | 'primary' | 'secondary' | 'success' | 'warning' | 'neutral'> = {
    super_admin: 'error',
    admin: 'warning',
    manager: 'info',
    superviseur: 'primary',
    employe: 'neutral',
  }
  return colors[role ?? ''] ?? 'neutral'
}
