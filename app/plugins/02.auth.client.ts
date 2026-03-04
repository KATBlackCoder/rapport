/**
 * Plugin auth : synchronise Supabase Auth avec le store auth.
 * Charge le profil users et les privilèges au login.
 */
import { useAuthStore } from '~/stores/auth'
import { useGeoStore } from '~/stores/geo'
import { usePermissionsStore } from '~/stores/permissions'

export default defineNuxtPlugin(async () => {
  const supabase = useSupabaseClient()
  const authStore = useAuthStore()
  const permissionsStore = usePermissionsStore()
  const geoStore = useGeoStore()

  const initFromSession = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await authStore.fetchUserProfile(user.id)
      if (authStore.userId) {
        await permissionsStore.loadUserPrivileges(authStore.userId)
      }
      await geoStore.fetchAll()
    } else {
      authStore.setUser(null)
      permissionsStore.setGrantedPrivileges([])
      geoStore.setZones([])
      geoStore.setLocalities([])
    }
  }

  await initFromSession()

  supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session?.user) {
      await authStore.fetchUserProfile(session.user.id)
      if (authStore.userId) {
        await permissionsStore.loadUserPrivileges(authStore.userId)
      }
      await geoStore.fetchAll()
    } else {
      authStore.setUser(null)
      permissionsStore.setGrantedPrivileges([])
      geoStore.setZones([])
      geoStore.setLocalities([])
    }
  })
})
