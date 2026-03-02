/**
 * Store geo : zones et localités chargées une fois (référentiel).
 */
import type { Database } from '~/types/database.types'

type ZoneRow = Database['public']['Tables']['zones']['Row']
type LocalityRow = Database['public']['Tables']['localities']['Row']

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
  },
})
