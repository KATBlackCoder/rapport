<template>
  <nav
    class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-elevated border-t border-default"
    style="padding-bottom: env(safe-area-inset-bottom);"
  >
    <div class="flex justify-around py-1.5">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-14"
        :class="isActive(item.to) ? 'text-primary' : 'text-muted hover:text-default'"
      >
        <UIcon :name="item.icon" class="size-5 shrink-0" />
        <span class="text-[10px] font-medium leading-tight">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { usePermissions } from '~/composables/usePermissions'

const route = useRoute()
const { canViewResponses, canCreateUser, canManageGeo } = usePermissions()

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path === path || route.path.startsWith(path + '/')
}

const navItems = computed(() => {
  const items: { to: string; label: string; icon: string }[] = [
    { to: '/', label: 'Accueil', icon: 'i-lucide-home' },
  ]
  if (canViewResponses()) {
    items.push({ to: '/dashboard', label: 'Dashboard', icon: 'i-lucide-bar-chart-2' })
  }
  if (canCreateUser()) {
    items.push({ to: '/users', label: 'Utilisateurs', icon: 'i-lucide-users' })
  }
  items.push({ to: '/forms', label: 'Questionnaires', icon: 'i-lucide-clipboard-list' })
  if (canManageGeo()) {
    items.push({ to: '/parametres', label: 'Paramètres', icon: 'i-lucide-settings' })
  }
  return items
})
</script>
