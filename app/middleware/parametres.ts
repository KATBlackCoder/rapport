/**
 * Middleware parametres : accès réservé admin et super_admin.
 * Utilise Supabase directement (Pinia non dispo en middleware).
 */
export default defineNuxtRouteMiddleware(async () => {
  const user = useSupabaseUser()
  const userId = user.value?.id ?? user.value?.sub
  if (!userId) return navigateTo('/login', { replace: true })

  const supabase = useSupabaseClient()
  const { data } = await supabase.from('users').select('role').eq('id', userId).single()
  const role = data?.role as string | undefined
  const allowed = role === 'super_admin' || role === 'admin'
  if (!allowed) return navigateTo('/', { replace: true })
})
