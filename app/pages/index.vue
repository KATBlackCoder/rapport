<template>
  <div class="space-y-8 fade-in-up">
    <!-- Welcome header -->
    <div class="flex flex-col gap-1">
      <h1 class="text-2xl font-bold text-highlighted">
        Bonjour, {{ authStore.user?.first_name ?? 'Bienvenue' }} 👋
      </h1>
      <p class="text-sm text-muted">
        {{ today }} · Application de gestion terrain — Mali
      </p>
    </div>

    <!-- Module cards -->
    <div v-if="hasAnyModule" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-if="canViewResponses()"
        to="/dashboard"
        class="group block"
      >
        <UCard class="h-full transition-shadow hover:shadow-lg cursor-pointer border border-default hover:border-primary/30">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-info/10 text-info group-hover:bg-info/20 transition-colors">
              <UIcon name="i-lucide-bar-chart-2" class="size-6" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-highlighted">Dashboard</p>
              <p class="text-sm text-muted mt-1">
                Consulter les réponses et statistiques des questionnaires.
              </p>
            </div>
            <UIcon name="i-lucide-arrow-right" class="size-4 text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all mt-0.5 shrink-0" />
          </div>
        </UCard>
      </NuxtLink>

      <NuxtLink
        v-if="canCreateUser()"
        to="/users"
        class="group block"
      >
        <UCard class="h-full transition-shadow hover:shadow-lg cursor-pointer border border-default hover:border-primary/30">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
              <UIcon name="i-lucide-users" class="size-6" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-highlighted">Utilisateurs</p>
              <p class="text-sm text-muted mt-1">
                Gérer les comptes et les privilèges des employés.
              </p>
            </div>
            <UIcon name="i-lucide-arrow-right" class="size-4 text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all mt-0.5 shrink-0" />
          </div>
        </UCard>
      </NuxtLink>

      <NuxtLink
        to="/forms"
        class="group block"
      >
        <UCard class="h-full transition-shadow hover:shadow-lg cursor-pointer border border-default hover:border-primary/30">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-success/10 text-success group-hover:bg-success/20 transition-colors">
              <UIcon name="i-lucide-clipboard-list" class="size-6" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-highlighted">Questionnaires</p>
              <p class="text-sm text-muted mt-1">
                Consulter et remplir les questionnaires qui vous sont assignés.
              </p>
            </div>
            <UIcon name="i-lucide-arrow-right" class="size-4 text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all mt-0.5 shrink-0" />
          </div>
        </UCard>
      </NuxtLink>

      <NuxtLink
        v-if="canManageGeo()"
        to="/parametres"
        class="group block"
      >
        <UCard class="h-full transition-shadow hover:shadow-lg cursor-pointer border border-default hover:border-primary/30">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-warning/10 text-warning group-hover:bg-warning/20 transition-colors">
              <UIcon name="i-lucide-settings" class="size-6" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-highlighted">Paramètres</p>
              <p class="text-sm text-muted mt-1">
                Gérer les zones géographiques et référentiels.
              </p>
            </div>
            <UIcon name="i-lucide-arrow-right" class="size-4 text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all mt-0.5 shrink-0" />
          </div>
        </UCard>
      </NuxtLink>
    </div>

    <!-- No module -->
    <UCard v-else class="text-center py-8">
      <div class="flex flex-col items-center gap-3 text-muted">
        <UIcon name="i-lucide-lock" class="size-10 opacity-40" />
        <p class="text-sm">Aucun module accessible avec votre rôle actuel.</p>
        <p class="text-xs">Contactez votre superviseur pour obtenir les accès nécessaires.</p>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const { canViewResponses, canCreateUser, canManageGeo } = usePermissions()

const hasAnyModule = computed(
  () => canViewResponses() || canCreateUser() || canManageGeo() || true
)

const today = computed(() => {
  return new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
})
</script>
