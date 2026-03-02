/**
 * Store forms : questionnaires assignés à l'utilisateur.
 * Cache offline via persistedstate pour usage terrain.
 * Type simplifié pour éviter "Type instantiation is excessively deep" (Json récursif dans DB types).
 */
interface StoredForm {
  id: string
  title: string
  description: string | null
  type: string
  fields: unknown
  assigned_to: unknown
  is_active: boolean
  created_by: string
  created_at: string | null
  updated_at: string | null
}

export const useFormsStore = defineStore('forms', {
  state: () => ({
    forms: [] as StoredForm[],
    lastFetchedAt: null as number | null,
  }),

  getters: {
    activeForms: (state) => state.forms.filter((f) => f.is_active),
  },

  actions: {
    setForms(forms: StoredForm[]) {
      this.forms = forms
      this.lastFetchedAt = Date.now()
    },

    async fetchAssignedForms(userId: string, role: string) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .eq('is_active', true)
      if (error) throw error
      const assigned = (data ?? []).filter((f) => {
        const a = f.assigned_to as { roles?: string[]; userIds?: string[]; user_ids?: string[] } | null
        if (!a) return false
        if (Array.isArray(a)) return true
        const roles = a.roles ?? []
        const userIds = (a.userIds ?? a.user_ids ?? []) as string[]
        return roles.includes(role) || userIds.includes(userId)
      }) as StoredForm[]
      this.setForms(assigned)
      return assigned
    },
  },

  persist: {
    key: 'forms',
    storage: typeof window !== 'undefined' ? localStorage : undefined,
  },
})
