/**
 * Store geo : zones et localités chargées une fois (référentiel).
 * CRUD réservé admin/super_admin (RLS côté Supabase).
 */
import type { Database } from '~/types/database.types'

type ZoneRow = Database['public']['Tables']['zones']['Row']
type LocalityRow = Database['public']['Tables']['localities']['Row']
type ZoneUpdate = Database['public']['Tables']['zones']['Update']
type LocalityUpdate = Database['public']['Tables']['localities']['Update']

export const useGeoStore = defineStore('geo', {
  state: () => ({
    zones: [] as ZoneRow[],
    localities: [] as LocalityRow[],
  }),

  getters: {
    localitiesByZone:
      (state) =>
      (zoneId: string): LocalityRow[] =>
        state.localities.filter((l) => l.zone_id === zoneId),
  },

  actions: {
    setZones(zones: ZoneRow[]) {
      this.zones = zones
    },

    setLocalities(localities: LocalityRow[]) {
      this.localities = localities
    },

    async fetchAll() {
      const supabase = useSupabaseClient()
      const [zRes, lRes] = await Promise.all([
        supabase.from('zones').select('*').order('name'),
        supabase.from('localities').select('*').order('name'),
      ])
      if (zRes.error) throw zRes.error
      if (lRes.error) throw lRes.error
      this.setZones(zRes.data ?? [])
      this.setLocalities(lRes.data ?? [])
    },

    async createZone(name: string): Promise<ZoneRow> {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('zones').insert({ name }).select().single()
      if (error) throw error
      this.zones = [...this.zones, data].sort((a, b) => a.name.localeCompare(b.name))
      return data
    },

    async updateZone(id: string, payload: ZoneUpdate): Promise<ZoneRow> {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('zones').update(payload).eq('id', id).select().single()
      if (error) throw error
      this.zones = this.zones.map((z) => (z.id === id ? data : z)).sort((a, b) => a.name.localeCompare(b.name))
      return data
    },

    async deleteZone(id: string): Promise<void> {
      const supabase = useSupabaseClient()
      const { error } = await supabase.from('zones').delete().eq('id', id)
      if (error) throw error
      this.zones = this.zones.filter((z) => z.id !== id)
      this.localities = this.localities.filter((l) => l.zone_id !== id)
    },

    async createLocality(name: string, zoneId: string): Promise<LocalityRow> {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('localities').insert({ name, zone_id: zoneId }).select().single()
      if (error) throw error
      this.localities = [...this.localities, data].sort((a, b) => a.name.localeCompare(b.name))
      return data
    },

    async updateLocality(id: string, payload: LocalityUpdate): Promise<LocalityRow> {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('localities').update(payload).eq('id', id).select().single()
      if (error) throw error
      this.localities = this.localities.map((l) => (l.id === id ? data : l)).sort((a, b) => a.name.localeCompare(b.name))
      return data
    },

    async deleteLocality(id: string): Promise<void> {
      const supabase = useSupabaseClient()
      const { error } = await supabase.from('localities').delete().eq('id', id)
      if (error) throw error
      this.localities = this.localities.filter((l) => l.id !== id)
    },
  },
})
