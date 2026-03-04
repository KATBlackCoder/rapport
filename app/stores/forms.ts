/**
 * Store forms : questionnaires. RLS restreint la liste (assignés ou tous pour admin).
 * Filtres optionnels : type (journalier/urgent), actif. Cache offline via persistedstate.
 */
import type { Json } from '~/types/database.types'
import type { FormTypeDb } from '~/types/forms'
import { useAuthStore } from '~/stores/auth'

export interface StoredForm {
  id: string
  title: string
  description: string | null
  type: FormTypeDb
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
    loading: false,
    /** Filtres liste : type (daily | urgent | all), is_active (true | false | all) */
    filterType: null as FormTypeDb | 'all' | null,
    filterActive: null as boolean | 'all' | null,
  }),

  getters: {
    activeForms: (state) => state.forms.filter((f) => f.is_active),

    filteredForms(state): StoredForm[] {
      let list = state.forms
      if (state.filterType && state.filterType !== 'all') {
        list = list.filter((f) => f.type === state.filterType)
      }
      if (state.filterActive !== null && state.filterActive !== 'all') {
        list = list.filter((f) => f.is_active === state.filterActive)
      }
      return list
    },
  },

  actions: {
    setForms(forms: StoredForm[]) {
      this.forms = forms
      this.lastFetchedAt = Date.now()
    },

    setFilters(payload: { type?: FormTypeDb | 'all'; active?: boolean | 'all' }) {
      if (payload.type !== undefined) this.filterType = payload.type
      if (payload.active !== undefined) this.filterActive = payload.active
    },

    /**
     * Charge les formulaires. RLS : admin voit tout, les autres uniquement les assignés.
     */
    async fetchForms() {
      this.loading = true
      try {
        const supabase = useSupabaseClient()
        const { data, error } = await supabase.from('forms').select('*').order('updated_at', { ascending: false })
        if (error) throw error
        this.setForms((data ?? []) as StoredForm[])
        return this.forms
      } finally {
        this.loading = false
      }
    },

    async fetchFormById(id: string): Promise<StoredForm | null> {
      const existing = this.forms.find((f) => f.id === id)
      if (existing) return existing
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('forms').select('*').eq('id', id).single()
      if (error || !data) return null
      return data as StoredForm
    },

    async createForm(payload: {
      title: string
      description?: string | null
      type: FormTypeDb
      fields: unknown
      assigned_to: unknown
      is_active?: boolean
    }) {
      const supabase = useSupabaseClient()
      const user = useAuthStore().user
      if (!user) throw new Error('Non authentifié')
      const { data, error } = await supabase
        .from('forms')
        .insert({
          title: payload.title,
          description: payload.description ?? null,
          type: payload.type,
          fields: (payload.fields ?? []) as Json,
          assigned_to: (payload.assigned_to ?? {}) as Json,
          is_active: payload.is_active ?? true,
          created_by: user.id,
        })
        .select()
        .single()
      if (error) throw error
      this.forms = [data as StoredForm, ...this.forms]
      return data as StoredForm
    },

    async updateForm(
      id: string,
      payload: Partial<{
        title: string
        description: string | null
        type: FormTypeDb
        fields: unknown
        assigned_to: unknown
        is_active: boolean
      }>
    ) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase
        .from('forms')
        .update({
          ...payload,
          fields: payload.fields !== undefined ? (payload.fields as Json) : undefined,
          assigned_to: payload.assigned_to !== undefined ? (payload.assigned_to as Json) : undefined,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      const idx = this.forms.findIndex((f) => f.id === id)
      if (idx >= 0) this.forms[idx] = data as StoredForm
      return data as StoredForm
    },

    async deleteForm(id: string) {
      const supabase = useSupabaseClient()
      const { error } = await supabase.from('forms').delete().eq('id', id)
      if (error) throw error
      this.forms = this.forms.filter((f) => f.id !== id)
    },
  },

  persist: {
    key: 'forms',
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    pick: ['forms', 'lastFetchedAt', 'filterType', 'filterActive'],
  },
})
