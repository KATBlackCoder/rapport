<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <PageHeader
        title="Questionnaires"
        description="Créer et gérer les formulaires assignés par rôle ou utilisateur."
      />
      <UButton
        v-if="canManageForms()"
        icon="i-lucide-plus"
        label="Créer un questionnaire"
        color="primary"
        to="/forms/create"
      />
    </div>

    <!-- Filtres -->
    <UCard>
      <div class="grid grid-cols-2 gap-2 md:flex md:flex-row md:flex-wrap md:items-center md:gap-3">
        <USelect
          v-model="filterType"
          :items="typeOptions"
          placeholder="Type"
          class="w-full md:w-40"
        />
        <USelect
          v-model="filterActiveStr"
          :items="activeOptions"
          placeholder="Statut"
          class="w-full md:w-36"
        />
        <UButton
          variant="ghost"
          icon="i-lucide-filter-x"
          label="Réinitialiser"
          class="col-span-2 md:col-auto md:ml-auto"
          @click="resetFilters"
        />
      </div>
    </UCard>

    <div v-if="formsStore.loading" class="flex justify-center py-10">
      <UIcon name="i-lucide-loader-2" class="size-6 animate-spin text-muted" />
    </div>

    <template v-else>
      <UCard v-if="filteredForms.length === 0" class="text-center py-10">
        <div class="flex flex-col items-center gap-2 text-muted">
          <UIcon name="i-lucide-clipboard-list" class="size-10 opacity-30" />
          <p class="text-sm">Aucun questionnaire trouvé.</p>
          <UButton
            v-if="canManageForms()"
            to="/forms/create"
            color="primary"
            variant="soft"
            label="Créer un questionnaire"
            class="mt-2"
          />
        </div>
      </UCard>

      <div v-else class="space-y-3">
        <NuxtLink
          v-for="form in filteredForms"
          :key="form.id"
          :to="canManageForms() ? `/forms/${form.id}` : undefined"
          class="block"
        >
          <UCard
            class="transition-shadow hover:shadow-md"
            :class="canManageForms() ? 'cursor-pointer' : ''"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0 flex-1">
                <h3 class="font-semibold text-highlighted truncate">{{ form.title }}</h3>
                <p v-if="form.description" class="mt-0.5 text-sm text-muted line-clamp-2">
                  {{ form.description }}
                </p>
                <div class="mt-2 flex flex-wrap gap-2">
                  <UBadge
                    :label="formTypeLabel(form.type)"
                    variant="soft"
                    size="sm"
                    color="primary"
                  />
                  <UBadge
                    :label="form.is_active ? 'Actif' : 'Inactif'"
                    :color="form.is_active ? 'success' : 'neutral'"
                    variant="soft"
                    size="sm"
                  />
                  <UBadge
                    :label="fieldCount(form)"
                    variant="soft"
                    size="sm"
                    color="neutral"
                    icon="i-lucide-layout-list"
                  />
                </div>
              </div>
              <UIcon
                v-if="canManageForms()"
                name="i-lucide-chevron-right"
                class="size-5 shrink-0 text-muted mt-0.5"
              />
            </div>
          </UCard>
        </NuxtLink>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useFormsStore } from '~/stores/forms'
import type { StoredForm } from '~/stores/forms'
import { usePermissions } from '~/composables/usePermissions'
import { FORM_TYPE_LABELS } from '~/types/forms'
import type { FormTypeDb } from '~/types/forms'

const formsStore = useFormsStore()
const { canManageForms } = usePermissions()

const typeOptions = [
  { label: 'Tous les types', value: 'all' },
  { label: FORM_TYPE_LABELS.daily, value: 'daily' },
  { label: FORM_TYPE_LABELS.urgent, value: 'urgent' },
]

// USelect requires consistent types — use strings, convert on set
const activeOptions = [
  { label: 'Tous', value: 'all' },
  { label: 'Actif', value: 'true' },
  { label: 'Inactif', value: 'false' },
]

const filterType = computed({
  get: () => formsStore.filterType ?? 'all',
  set: (v: FormTypeDb | 'all') => formsStore.setFilters({ type: v === 'all' ? 'all' : v }),
})

const filterActiveStr = computed({
  get: () => {
    const v = formsStore.filterActive
    if (v === true) return 'true'
    if (v === false) return 'false'
    return 'all'
  },
  set: (v: string) => {
    if (v === 'true') formsStore.setFilters({ active: true })
    else if (v === 'false') formsStore.setFilters({ active: false })
    else formsStore.setFilters({ active: 'all' })
  },
})

const filteredForms = computed(() => formsStore.filteredForms)

function formTypeLabel(type: string) {
  return FORM_TYPE_LABELS[type as FormTypeDb] ?? type
}

function fieldCount(form: StoredForm): string {
  const count = Array.isArray(form.fields) ? (form.fields as unknown[]).length : 0
  return `${count} champ${count !== 1 ? 's' : ''}`
}

function resetFilters() {
  formsStore.setFilters({ type: 'all', active: 'all' })
}

onMounted(() => {
  formsStore.fetchForms()
})
</script>
