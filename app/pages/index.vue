<template>
  <div class="space-y-6">
    <PageHeader
      title="Rapport — Gestion Questionnaires"
      description="Application de gestion terrain pour le Mali."
    />

    <UAlert
      title="Bienvenue"
      description="Connectez-vous pour accéder aux questionnaires et soumettre vos rapports."
      color="info"
      variant="soft"
    />

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <UCard
        v-if="canViewResponses()"
        variant="soft"
        :ui="{ body: 'space-y-3' }"
        class="fade-in-up"
      >
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-bar-chart-2" class="size-5 text-primary" />
            <span class="font-medium text-highlighted">Dashboard</span>
          </div>
        </template>
        <p class="text-sm text-muted">
          Consulter les réponses et statistiques des questionnaires.
        </p>
        <UButton to="/dashboard" label="Accéder" color="primary" block />
      </UCard>

      <UCard
        v-if="canCreateUser()"
        variant="soft"
        :ui="{ body: 'space-y-3' }"
        class="fade-in-up"
      >
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-users" class="size-5 text-primary" />
            <span class="font-medium text-highlighted">Utilisateurs</span>
          </div>
        </template>
        <p class="text-sm text-muted">
          Gérer les comptes et les privilèges des employés.
        </p>
        <UButton to="/users" label="Accéder" color="primary" block />
      </UCard>

      <UCard
        v-if="canManageForms()"
        variant="soft"
        :ui="{ body: 'space-y-3' }"
        class="fade-in-up"
      >
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-clipboard-list" class="size-5 text-primary" />
            <span class="font-medium text-highlighted">Questionnaires</span>
          </div>
        </template>
        <p class="text-sm text-muted">
          Créer et assigner les formulaires aux équipes.
        </p>
        <UButton to="/forms" label="Accéder" color="primary" block />
      </UCard>

    </div>

    <div v-if="!canViewResponses() && !canCreateUser() && !canManageForms()" class="rounded-[var(--ui-radius)] border border-default bg-muted/50 p-6 text-center">
      <p class="text-muted">
        Aucun module accessible avec votre rôle. Contactez votre superviseur.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { canViewResponses, canCreateUser, canManageForms } = usePermissions()
</script>
