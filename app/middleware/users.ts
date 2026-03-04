/**
 * Middleware users : accès si create_user (super_admin, admin, ou privilège accordé).
 */
export default defineNuxtRouteMiddleware(async () => {
  const user = useSupabaseUser()
  const userId = user.value?.id ?? user.value?.sub
  if (!userId) return navigateTo('/login', { replace: true })

  const supabase = useSupabaseClient()
  const { data: userRow } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single()

  const role = userRow?.role as string | undefined
  if (role === 'super_admin' || role === 'admin') return

  const { data: privs } = await supabase
    .from('user_privileges')
    .select('privilege')
    .eq('user_id', userId)
  const hasCreateUser =
    (privs ?? []).some((p) => p.privilege === 'create_user')

  if (!hasCreateUser) return navigateTo('/', { replace: true })
})
