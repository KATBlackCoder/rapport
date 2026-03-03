<template>
  <nav class="bottom-nav md:hidden bg-elevated border-t border-default">
    <div class="flex justify-around py-2">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors min-w-16"
        :class="isActive(item.to) ? 'text-primary bg-primary/10' : 'text-muted hover:text-default hover:bg-muted'"
      >
        <UIcon :name="item.icon" class="size-5 shrink-0" />
        <span class="text-xs font-medium">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { usePermissions } from '~/composables/usePermissions'

const route = useRoute()
const { canViewResponses, canCreateUser, canManageForms } = usePermissions()

const isActive = (path: string) => route.path === path || route.path.startsWith(path + '/')

const navItems = computed(() => {
  const items: { to: string; label: string; icon: string; show: boolean }[] = [
    { to: '/', label: 'Accueil', icon: 'i-lucide-home', show: true },
    { to: '/dashboard', label: 'Dashboard', icon: 'i-lucide-bar-chart-2', show: canViewResponses() },
    { to: '/users', label: 'Utilisateurs', icon: 'i-lucide-users', show: canCreateUser() },
    { to: '/forms', label: 'Questionnaires', icon: 'i-lucide-clipboard-list', show: canManageForms() },
  ]
  return items.filter((i) => i.show)
})
</script>
