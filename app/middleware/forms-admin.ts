/**
 * Middleware forms-admin : accès aux pages création/édition de questionnaires (super_admin, admin).
 */
import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()
  const role = authStore.role ?? null
  if (role === 'super_admin' || role === 'admin') return
  return navigateTo('/forms', { replace: true })
})
