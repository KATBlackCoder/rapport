/**
 * Store users : liste des utilisateurs visibles (hiérarchie), CRUD.
 */
import type { Database } from '~/types/database.types'
import { useAuthStore } from '~/stores/auth'

type UserRow = Database['public']['Tables']['users']['Row']
type UserUpdate = Database['public']['Tables']['users']['Update']
type UserPrivilege = Database['public']['Enums']['user_privilege']

export interface UsersFilters {
  role?: string
  zone_id?: string
  locality_id?: string
  is_active?: boolean
}

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [] as UserRow[],
    loading: false,
  }),

  actions: {
    async fetchUsers(filters?: UsersFilters) {
      this.loading = true
      const supabase = useSupabaseClient()
      let query = supabase
        .from('users')
        .select('*, zones!zone_id(name), localities!locality_id(name)')
        .order('last_name')

      if (filters?.role) {
        query = query.eq('role', filters.role as Database['public']['Enums']['user_role'])
      }
      if (filters?.zone_id) {
        query = query.eq('zone_id', filters.zone_id)
      }
      if (filters?.locality_id) {
        query = query.eq('locality_id', filters.locality_id)
      }
      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active)
      }

      const { data, error } = await query
      this.loading = false
      if (error) throw error
      this.users = (data ?? []) as UserRow[]
      return this.users
    },

    async createUser(payload: {
      first_name: string
      last_name: string
      phone: string
      email?: string
      role: string
      zone_id?: string | null
      locality_id?: string | null
      supervisor_id?: string | null
      privileges?: string[]
    }) {
      try {
        return await $fetch<{ user?: unknown; message?: string }>('/api/users/create', {
          method: 'POST',
          body: payload,
        })
      } catch (e: unknown) {
        const err = e as { data?: { message?: string }; message?: string }
        throw new Error(err?.data?.message ?? err?.message ?? 'Erreur création utilisateur')
      }
    },

    async updateUser(userId: string, payload: UserUpdate) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase
        .from('users')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single()
      if (error) throw error
      const idx = this.users.findIndex((u) => u.id === userId)
      if (idx >= 0) this.users[idx] = data
      return data
    },

    async grantPrivilege(userId: string, privilege: UserPrivilege | string) {
      const supabase = useSupabaseClient()
      const authStore = useAuthStore()
      const creatorId = authStore.userId
      if (!creatorId) throw new Error('Non authentifié')
      const { error } = await supabase.from('user_privileges').insert({
        user_id: userId,
        privilege: privilege as UserPrivilege,
        granted_by: creatorId,
      })
      if (error) throw error
    },

    async revokePrivilege(userId: string, privilege: UserPrivilege | string) {
      const supabase = useSupabaseClient()
      const { error } = await supabase
        .from('user_privileges')
        .delete()
        .eq('user_id', userId)
        .eq('privilege', privilege as UserPrivilege)
      if (error) throw error
    },

    async fetchUserPrivileges(userId: string) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase
        .from('user_privileges')
        .select('privilege, granted_by')
        .eq('user_id', userId)
      if (error) throw error
      return data ?? []
    },
  },
})
