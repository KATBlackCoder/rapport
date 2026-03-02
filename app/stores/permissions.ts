/**
 * Store permissions : logique centralisée des privilèges.
 * Alimente usePermissions(). Règles BRIEF : défaut par rôle + user_privileges.
 */
import type { Database } from '~/types/database.types'

type UserRole = Database['public']['Enums']['user_role']
type UserPrivilege = Database['public']['Enums']['user_privilege']
type UserRow = Database['public']['Tables']['users']['Row']

const ROLE_ORDER: UserRole[] = [
  'super_admin',
  'admin',
  'manager',
  'superviseur',
  'employe',
]

// Privilèges par défaut selon le rôle (BRIEF)
const DEFAULT_PRIVILEGES: Record<UserRole, UserPrivilege[]> = {
  super_admin: ['create_user', 'send_back', 'view_responses'],
  admin: ['create_user', 'send_back', 'view_responses'],
  manager: ['view_responses'], // create_user et send_back si accordés
  superviseur: [], // create_user si accordé, view_responses si accordé
  employe: [],
}

export const usePermissionsStore = defineStore('permissions', {
  state: () => ({
    grantedPrivileges: [] as UserPrivilege[],
  }),

  getters: {
    effectivePrivileges(state): (role: UserRole | null) => UserPrivilege[] {
      return (role) => {
        if (!role) return []
        const defaults = DEFAULT_PRIVILEGES[role] ?? []
        const granted = new Set([...defaults, ...state.grantedPrivileges])
        return Array.from(granted)
      }
    },
  },

  actions: {
    setGrantedPrivileges(privileges: UserPrivilege[]) {
      this.grantedPrivileges = privileges
    },

    async loadUserPrivileges(userId: string) {
      const supabase = useSupabaseClient()
      const { data } = await supabase
        .from('user_privileges')
        .select('privilege')
        .eq('user_id', userId)
      const privileges = (data ?? []).map((r) => r.privilege as UserPrivilege)
      this.setGrantedPrivileges(privileges)
    },

    hasPrivilege(role: UserRole | null, privilege: UserPrivilege): boolean {
      const privs = this.effectivePrivileges(role)
      return privs.includes(privilege)
    },

    hasRoleOrAbove(role: UserRole | null, minRole: UserRole): boolean {
      if (!role) return false
      const idx = ROLE_ORDER.indexOf(role)
      const minIdx = ROLE_ORDER.indexOf(minRole)
      return idx <= minIdx
    },

    isStrictlyBelow(myRole: UserRole | null, targetRole: UserRole): boolean {
      if (!myRole) return false
      const myIdx = ROLE_ORDER.indexOf(myRole)
      const targetIdx = ROLE_ORDER.indexOf(targetRole)
      return myIdx < targetIdx
    },
  },
})
