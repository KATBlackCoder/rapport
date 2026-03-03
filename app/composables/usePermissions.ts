/**
 * Composable usePermissions : alimenté par le store permissions.
 * Expose les méthodes pour RBAC visuel (v-if partout).
 * BRIEF : canCreateUser, canSendBack, canViewResponses, canManageForms,
 * canExportCollectif, canSeeUser, canGrantPrivilege
 */
import type { Database } from '~/types/database.types'

import { useAuthStore } from '~/stores/auth'
import { usePermissionsStore } from '~/stores/permissions'

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

export function usePermissions() {
  const authStore = useAuthStore()
  const permissionsStore = usePermissionsStore()

  const role = computed(() => authStore.role)

  function canCreateUser(): boolean {
    return permissionsStore.hasPrivilege(role.value, 'create_user')
  }

  function canSendBack(): boolean {
    return permissionsStore.hasPrivilege(role.value, 'send_back')
  }

  function canViewResponses(): boolean {
    return permissionsStore.hasPrivilege(role.value, 'view_responses')
  }

  function canManageForms(): boolean {
    return permissionsStore.hasRoleOrAbove(role.value, 'admin')
  }

  function canExportCollectif(): boolean {
    return permissionsStore.hasRoleOrAbove(role.value, 'admin')
  }

  function canSeeUser(targetUser: UserRow | null): boolean {
    if (!targetUser || !role.value) return false
    return permissionsStore.isStrictlyBelow(role.value, targetUser.role)
  }

  function canGrantPrivilege(privilege: UserPrivilege): boolean {
    return permissionsStore.hasPrivilege(role.value, privilege)
  }

  return {
    canCreateUser,
    canSendBack,
    canViewResponses,
    canManageForms,
    canExportCollectif,
    canSeeUser,
    canGrantPrivilege,
    role,
  }
}
