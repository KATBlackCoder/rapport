/**
 * Middleware auth global : vérifie session Supabase + must_change_password.
 * Utilise Supabase directement (Pinia non dispo en SSR avant plugins).
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const publicPaths = ['/login', '/change-password']

  const user = useSupabaseUser()
  const userId = user.value?.sub ?? user.value?.id

  if (publicPaths.includes(to.path)) {
    if (userId) {
      const supabase = useSupabaseClient()
      const { data } = await supabase
        .from('users')
        .select('must_change_password')
        .eq('id', userId)
        .single()
      const mustChange = data?.must_change_password ?? false
      if (mustChange) {
        return to.path === '/change-password' ? undefined : navigateTo('/change-password')
      }
      return to.path === '/login' ? navigateTo('/') : undefined
    }
    return
  }

  if (!userId) {
    return navigateTo('/login', { replace: true })
  }

  const supabase = useSupabaseClient()
  const { data } = await supabase
    .from('users')
    .select('must_change_password')
    .eq('id', userId)
    .single()

  if (data?.must_change_password) {
    return navigateTo('/change-password')
  }
})
