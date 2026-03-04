<template>
  <div v-if="!authStore.isAuthenticated" class="min-h-dvh flex items-center justify-center bg-default">
    <UIcon name="i-lucide-loader-2" class="size-6 animate-spin text-muted" />
  </div>

  <template v-else>
    <UDashboardGroup>
      <!-- Sidebar — desktop uniquement -->
      <UDashboardSidebar
        v-model:collapsed="sidebarCollapsed"
        collapsible
        :toggle="false"
        class="hidden md:flex"
        :ui="{
          header: 'border-b border-default px-3 py-3',
          footer: 'border-t border-default px-3 py-3',
          body: 'px-2 py-2',
        }"
      >
        <!-- Header : logo + bouton collapse -->
        <template #header>
          <div
            class="flex items-center"
            :class="sidebarCollapsed ? 'justify-center' : 'justify-between gap-2'"
          >
            <AppLogo v-show="!sidebarCollapsed" />
            <UDashboardSidebarCollapse
              :icon="sidebarCollapsed ? 'i-lucide-panel-left-open' : 'i-lucide-panel-left-close'"
              size="sm"
              color="neutral"
              variant="ghost"
            />
          </div>
        </template>

        <!-- Navigation -->
        <div class="space-y-0.5">
          <UTooltip
            v-for="item in navItems"
            :key="item.to"
            :text="item.label"
            :disabled="!sidebarCollapsed"
            :content="{ side: 'right', sideOffset: 8 }"
          >
            <NuxtLink
              :to="item.to"
              class="flex items-center rounded-(--ui-radius) text-sm font-medium transition-colors"
              :class="[
                sidebarCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5',
                isActive(item.to)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted hover:text-default hover:bg-elevated',
              ]"
            >
              <UIcon
                :name="item.icon"
                :class="sidebarCollapsed ? 'size-5' : 'size-4.5 shrink-0'"
              />
              <span v-show="!sidebarCollapsed">{{ item.label }}</span>
            </NuxtLink>
          </UTooltip>
        </div>

        <!-- Footer : utilisateur -->
        <template #footer>
          <!-- Mode étendu -->
          <div v-if="!sidebarCollapsed" class="space-y-1">
            <div class="flex items-center gap-3 px-2 py-2 rounded-(--ui-radius)">
              <UAvatar
                :text="authStore.fullName?.charAt(0)?.toUpperCase() ?? '?'"
                size="sm"
                class="shrink-0 bg-primary/15 text-primary font-semibold"
              />
              <div class="min-w-0">
                <p class="text-sm font-medium text-highlighted truncate">{{ authStore.fullName }}</p>
                <p class="text-xs text-muted truncate capitalize">{{ roleLabel(authStore.role) }}</p>
              </div>
            </div>
            <UButton
              block
              label="Déconnexion"
              icon="i-lucide-log-out"
              variant="ghost"
              color="error"
              class="justify-start text-sm"
              @click="logout"
            />
          </div>
          <!-- Mode collapsé : avatar seul + logout icon -->
          <div v-else class="flex flex-col items-center gap-1.5">
            <UTooltip :text="authStore.fullName ?? ''" :content="{ side: 'right' }">
              <UAvatar
                :text="authStore.fullName?.charAt(0)?.toUpperCase() ?? '?'"
                size="sm"
                class="bg-primary/15 text-primary font-semibold cursor-default"
              />
            </UTooltip>
            <UTooltip text="Déconnexion" :content="{ side: 'right' }">
              <UButton
                icon="i-lucide-log-out"
                size="sm"
                variant="ghost"
                color="error"
                square
                @click="logout"
              />
            </UTooltip>
          </div>
        </template>
      </UDashboardSidebar>

      <UDashboardPanel>
        <template #header>
          <UDashboardNavbar
            :toggle="false"
            :ui="{ root: 'border-b border-default' }"
          >
            <template #right>
              <UDropdownMenu :items="userMenuItems">
                <UButton
                  icon="i-lucide-user-circle"
                  variant="ghost"
                  color="neutral"
                  :label="authStore.fullName ?? undefined"
                  class="hidden sm:flex gap-2 text-sm font-medium"
                />
                <UButton
                  icon="i-lucide-user-circle"
                  variant="ghost"
                  color="neutral"
                  class="sm:hidden"
                  aria-label="Menu utilisateur"
                />
              </UDropdownMenu>
            </template>
          </UDashboardNavbar>
        </template>

        <template #body>
          <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-6">
            <slot />
          </div>
        </template>
      </UDashboardPanel>
    </UDashboardGroup>

    <!-- Bottom nav — mobile uniquement -->
    <BottomNav />
  </template>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { usePermissions } from '~/composables/usePermissions'
import { roleLabel } from '~/utils/roles'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const { canViewResponses, canCreateUser, canManageForms, canManageGeo } = usePermissions()

const sidebarCollapsed = ref(false)

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.replace('/login')
  }
})

function isActive(path: string) {
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

const userMenuItems = computed(() => {
  const group: {
    label: string
    icon?: string
    to?: string
    color?: 'error'
    onSelect?: () => Promise<void>
  }[] = []
  if (canManageGeo()) {
    group.push({ label: 'Paramètres', icon: 'i-lucide-settings', to: '/parametres' })
  }
  group.push({
    label: 'Déconnexion',
    icon: 'i-lucide-log-out',
    color: 'error' as const,
    onSelect: async () => {
      await logout()
    },
  })
  return [group]
})

async function logout() {
  await authStore.logout()
  router.replace('/login')
}
</script>
