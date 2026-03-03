<template>
  <div class="space-y-6">
    <PageHeader
      title="Paramètres"
      description="Gestion des référentiels et configurations."
    />

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <UCard
        variant="soft"
        :ui="{ body: 'space-y-3' }"
        class="fade-in-up"
      >
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-map-pin" class="size-5 text-primary" />
            <span class="font-medium text-highlighted">Zones et localités</span>
          </div>
        </template>
        <p class="text-sm text-muted">
          Gérer les zones géographiques et les localités pour les assignations.
        </p>
        <UButton to="/parametres/zones-localites" label="Accéder" color="primary" block />
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'parametres' })
</script>
