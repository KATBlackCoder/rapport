/**
 * Plugin auth : synchronise Supabase Auth avec le store auth.
 * Charge le profil users et les privilèges au login.
 */
export default defineNuxtPlugin(async () => {
  const supabase = useSupabaseClient()
  const authStore = useAuthStore()
  const permissionsStore = usePermissionsStore()

  const initFromSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      await authStore.fetchUserProfile(session.user.id)
      if (authStore.userId) {
        await permissionsStore.loadUserPrivileges(authStore.userId)
      }
    } else {
      authStore.setUser(null)
      permissionsStore.setGrantedPrivileges([])
    }
  }

  await initFromSession()

  supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session?.user) {
      await authStore.fetchUserProfile(session.user.id)
      if (authStore.userId) {
        await permissionsStore.loadUserPrivileges(authStore.userId)
      }
    } else {
      authStore.setUser(null)
      permissionsStore.setGrantedPrivileges([])
    }
  })
})
