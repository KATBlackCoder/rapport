<template>
  <div class="p-6 space-y-4">
    <h1 class="text-2xl font-bold">Rapport — Gestion Questionnaires</h1>
    <UAlert title="Bienvenue" description="Application de gestion terrain pour le Mali." />

    <!-- Exemple RBAC : v-if (jamais v-show) selon usePermissions -->
    <div v-if="canViewResponses()" class="flex gap-2">
      <UButton to="/dashboard" label="Dashboard" />
    </div>
    <div v-if="canCreateUser()" class="flex gap-2">
      <UButton to="/users" label="Utilisateurs" />
    </div>
    <div v-if="canManageForms()" class="flex gap-2">
      <UButton to="/forms" label="Questionnaires" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { canViewResponses, canCreateUser, canManageForms } = usePermissions()
</script>