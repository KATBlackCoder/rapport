/**
 * Store auth : utilisateur connecté, rôle, must_change_password.
 * Synchronisé avec Supabase Auth et la table users.
 */
import type { Database } from '~/types/database.types'

type UserRow = Database['public']['Tables']['users']['Row']
type UserRole = Database['public']['Enums']['user_role']

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as UserRow | null,
    mustChangePassword: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    role: (state): UserRole | null => state.user?.role ?? null,
    userId: (state) => state.user?.id ?? null,
    fullName: (state) =>
      state.user
        ? `${state.user.first_name} ${state.user.last_name}`.trim()
        : '',
  },

  actions: {
    setUser(user: UserRow | null) {
      this.user = user
      this.mustChangePassword = user?.must_change_password ?? false
    },

    async login(username: string, password: string) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username,
        password,
      })
      if (error) throw error
      if (data.user) await this.fetchUserProfile(data.user.id)
      return data
    },

    async logout() {
      const supabase = useSupabaseClient()
      await supabase.auth.signOut()
      this.setUser(null)
    },

    async changePassword(newPassword: string) {
      const supabase = useSupabaseClient()
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      if (this.user) {
        // Mettre à jour le flag côté serveur (RPC ou API)
        const { error: updateError } = await supabase
          .from('users')
          .update({ must_change_password: false })
          .eq('id', this.user.id)
        if (!updateError) this.mustChangePassword = false
      }
    },

    async fetchUserProfile(authUserId: string) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUserId)
        .single()
      if (error) throw error
      this.setUser(data)
      return data
    },
  },

  persist: {
    key: 'auth',
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    pick: ['user', 'mustChangePassword'],
  },
})
