<template>
  <div class="flex min-h-dvh flex-col bg-default" :class="{ 'main-with-bottom-nav': showHeader }">
    <UHeader v-if="showHeader">
      <template #left>
        <AppLogo to="/" :show-subtitle="false" />
      </template>

      <template #right>
        <div v-if="authStore.isAuthenticated" class="flex items-center gap-2">
          <span class="text-sm text-muted hidden sm:inline">
            {{ authStore.fullName }}
          </span>
          <UDropdownMenu :items="userMenuItems">
            <UButton
              icon="i-lucide-user"
              variant="ghost"
              color="neutral"
              aria-label="Menu utilisateur"
            />
          </UDropdownMenu>
        </div>
      </template>
    </UHeader>

    <UMain>
      <UContainer class="py-6">
        <slot />
      </UContainer>
    </UMain>

    <BottomNav v-if="showHeader" />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

// Header visible uniquement si authentifié (évite flash)
const showHeader = computed(() => authStore.isAuthenticated)

// Garde client : redirection si non connecté (fallback si middleware a laissé passer)
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.replace('/login')
  }
})

const userMenuItems = computed(() => [
  [
    {
      label: 'Déconnexion',
      icon: 'i-lucide-log-out',
      color: 'error' as const,
      onSelect: async () => {
        await authStore.logout()
        router.replace('/login')
      },
    },
  ],
])
</script>
