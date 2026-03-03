<template>
  <div class="space-y-8">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <PageHeader
        title="Zones et localités"
        description="Gérer les zones géographiques et les localités pour les assignations."
      />
      <UButton
        icon="i-lucide-arrow-left"
        variant="ghost"
        to="/parametres"
        label="Retour"
      />
    </div>

    <!-- Zones -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">Zones</h2>
          <UButton
            icon="i-lucide-plus"
            label="Créer une zone"
            color="primary"
            @click="openZoneModal()"
          />
        </div>
      </template>

      <UTable
        :data="geoStore.zones"
        :columns="zoneColumns"
        :loading="loading"
      >
        <template #name-cell="{ row }">
          <span class="font-medium">{{ row.original.name }}</span>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex gap-2">
            <UButton
              icon="i-lucide-pencil"
              variant="ghost"
              color="neutral"
              size="xs"
              aria-label="Modifier"
              @click="openZoneModal(row.original)"
            />
            <UButton
              icon="i-lucide-trash-2"
              variant="ghost"
              color="error"
              size="xs"
              aria-label="Supprimer"
              @click="confirmDeleteZone(row.original)"
            />
          </div>
        </template>
      </UTable>
    </UCard>

    <!-- Localités -->
    <UCard>
      <template #header>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 class="text-lg font-semibold">Localités</h2>
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
            <USelect
              v-model="selectedZoneId"
              :items="zoneOptions"
              placeholder="Filtrer par zone"
              class="min-w-48"
            />
            <UButton
              icon="i-lucide-plus"
              label="Créer une localité"
              color="primary"
              :disabled="!selectedZoneId || geoStore.zones.length === 0"
              @click="openLocalityModal()"
            />
          </div>
        </div>
      </template>

      <UTable
        :data="filteredLocalities"
        :columns="localityColumns"
        :loading="loading"
      >
        <template #name-cell="{ row }">
          <span class="font-medium">{{ row.original.name }}</span>
        </template>
        <template #zone_id-cell="{ row }">
          {{ zoneName(row.original.zone_id) }}
        </template>
        <template #actions-cell="{ row }">
          <div class="flex gap-2">
            <UButton
              icon="i-lucide-pencil"
              variant="ghost"
              color="neutral"
              size="xs"
              aria-label="Modifier"
              @click="openLocalityModal(row.original)"
            />
            <UButton
              icon="i-lucide-trash-2"
              variant="ghost"
              color="error"
              size="xs"
              aria-label="Supprimer"
              @click="confirmDeleteLocality(row.original)"
            />
          </div>
        </template>
      </UTable>
    </UCard>

    <!-- Modal Zone -->
    <UModal v-model:open="zoneModalOpen" :title="editingZone ? 'Modifier la zone' : 'Créer une zone'">
      <form class="space-y-4" @submit.prevent="saveZone">
        <UFormField label="Nom">
          <UInput
            v-model="zoneForm.name"
            placeholder="Ex: Bamako"
            required
            :disabled="saving"
          />
        </UFormField>
        <p v-if="zoneError" class="text-sm text-error">{{ zoneError }}</p>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" label="Annuler" @click="zoneModalOpen = false" />
          <UButton type="submit" label="Enregistrer" color="primary" :loading="saving" />
        </div>
      </form>
    </UModal>

    <!-- Modal Localité -->
    <UModal v-model:open="localityModalOpen" :title="editingLocality ? 'Modifier la localité' : 'Créer une localité'">
      <form class="space-y-4" @submit.prevent="saveLocality">
        <UFormField label="Zone">
          <USelect
            v-model="localityForm.zone_id"
            :items="localityZoneOptions"
            placeholder="Sélectionner une zone"
            :disabled="saving || !!editingLocality"
          />
        </UFormField>
        <UFormField label="Nom">
          <UInput
            v-model="localityForm.name"
            placeholder="Ex: Lafiabougou"
            required
            :disabled="saving"
          />
        </UFormField>
        <p v-if="localityError" class="text-sm text-error">{{ localityError }}</p>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" label="Annuler" @click="localityModalOpen = false" />
          <UButton type="submit" label="Enregistrer" color="primary" :loading="saving" />
        </div>
      </form>
    </UModal>

    <!-- Modal Confirmation suppression zone -->
    <UModal v-model:open="deleteZoneModalOpen" title="Supprimer la zone">
      <p class="text-muted">
        Êtes-vous sûr de vouloir supprimer la zone « {{ zoneToDelete?.name }} » ?
        Les localités associées seront également supprimées.
      </p>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" label="Annuler" @click="deleteZoneModalOpen = false" />
          <UButton color="error" label="Supprimer" :loading="saving" @click="executeDeleteZone" />
        </div>
      </template>
    </UModal>

    <!-- Modal Confirmation suppression localité -->
    <UModal v-model:open="deleteLocalityModalOpen" title="Supprimer la localité">
      <p class="text-muted">
        Êtes-vous sûr de vouloir supprimer la localité « {{ localityToDelete?.name }} » ?
      </p>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" label="Annuler" @click="deleteLocalityModalOpen = false" />
          <UButton color="error" label="Supprimer" :loading="saving" @click="executeDeleteLocality" />
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Database } from '~/types/database.types'
import { useGeoStore } from '~/stores/geo'

definePageMeta({ middleware: 'parametres' })

type ZoneRow = Database['public']['Tables']['zones']['Row']
type LocalityRow = Database['public']['Tables']['localities']['Row']

const geoStore = useGeoStore()
const toast = useToast()

const loading = ref(false)
const saving = ref(false)
const selectedZoneId = ref<string>('')

const zoneModalOpen = ref(false)
const localityModalOpen = ref(false)
const deleteZoneModalOpen = ref(false)
const deleteLocalityModalOpen = ref(false)

const editingZone = ref<ZoneRow | null>(null)
const editingLocality = ref<LocalityRow | null>(null)
const zoneToDelete = ref<ZoneRow | null>(null)
const localityToDelete = ref<LocalityRow | null>(null)

const zoneForm = reactive({ name: '' })
const localityForm = reactive({ name: '', zone_id: '' })
const zoneError = ref('')
const localityError = ref('')

const zoneOptions = computed(() => {
  const opts = geoStore.zones.map((z: ZoneRow) => ({ label: z.name, value: z.id }))
  return [{ label: 'Toutes les zones', value: '' }, ...opts]
})

const localityZoneOptions = computed(() =>
  geoStore.zones.map((z: ZoneRow) => ({ label: z.name, value: z.id }))
)

const filteredLocalities = computed(() => {
  if (!selectedZoneId.value) return geoStore.localities
  return geoStore.localities.filter((l: LocalityRow) => l.zone_id === selectedZoneId.value)
})

function zoneName(zoneId: string) {
  return geoStore.zones.find((z: ZoneRow) => z.id === zoneId)?.name ?? zoneId
}

const zoneColumns: TableColumn<ZoneRow>[] = [
  { accessorKey: 'name', header: 'Nom' },
  { id: 'actions', header: '', meta: { class: { td: 'text-right' } } },
]

const localityColumns: TableColumn<LocalityRow>[] = [
  { accessorKey: 'name', header: 'Nom' },
  { accessorKey: 'zone_id', header: 'Zone' },
  { id: 'actions', header: '', meta: { class: { td: 'text-right' } } },
]

function openZoneModal(zone?: ZoneRow) {
  editingZone.value = zone ?? null
  zoneForm.name = zone?.name ?? ''
  zoneError.value = ''
  zoneModalOpen.value = true
}

function openLocalityModal(locality?: LocalityRow) {
  editingLocality.value = locality ?? null
  localityForm.name = locality?.name ?? ''
  localityForm.zone_id = locality?.zone_id ?? (selectedZoneId.value || geoStore.zones[0]?.id || '')
  localityError.value = ''
  localityModalOpen.value = true
}

async function saveZone() {
  const name = zoneForm.name.trim()
  if (!name) {
    zoneError.value = 'Le nom est requis.'
    return
  }
  saving.value = true
  zoneError.value = ''
  try {
    if (editingZone.value) {
      await geoStore.updateZone(editingZone.value.id, { name })
      toast.add({ title: 'Zone modifiée', color: 'success', icon: 'i-lucide-check' })
    } else {
      await geoStore.createZone(name)
      toast.add({ title: 'Zone créée', color: 'success', icon: 'i-lucide-check' })
    }
    zoneModalOpen.value = false
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Erreur lors de l\'enregistrement.'
    zoneError.value = msg
    toast.add({ title: 'Erreur', description: msg, color: 'error', icon: 'i-lucide-alert-circle' })
  } finally {
    saving.value = false
  }
}

async function saveLocality() {
  const name = localityForm.name.trim()
  const zoneId = localityForm.zone_id
  if (!name || !zoneId) {
    localityError.value = 'Le nom et la zone sont requis.'
    return
  }
  saving.value = true
  localityError.value = ''
  try {
    if (editingLocality.value) {
      await geoStore.updateLocality(editingLocality.value.id, { name })
      toast.add({ title: 'Localité modifiée', color: 'success', icon: 'i-lucide-check' })
    } else {
      await geoStore.createLocality(name, zoneId)
      toast.add({ title: 'Localité créée', color: 'success', icon: 'i-lucide-check' })
    }
    localityModalOpen.value = false
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Erreur lors de l\'enregistrement.'
    localityError.value = msg
    toast.add({ title: 'Erreur', description: msg, color: 'error', icon: 'i-lucide-alert-circle' })
  } finally {
    saving.value = false
  }
}

function confirmDeleteZone(zone: ZoneRow) {
  zoneToDelete.value = zone
  deleteZoneModalOpen.value = true
}

function confirmDeleteLocality(locality: LocalityRow) {
  localityToDelete.value = locality
  deleteLocalityModalOpen.value = true
}

async function executeDeleteZone() {
  const zone = zoneToDelete.value
  if (!zone) return
  saving.value = true
  try {
    await geoStore.deleteZone(zone.id)
    toast.add({ title: 'Zone supprimée', color: 'success', icon: 'i-lucide-check' })
    deleteZoneModalOpen.value = false
    zoneToDelete.value = null
    if (selectedZoneId.value === zone.id) selectedZoneId.value = ''
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Erreur lors de la suppression.'
    toast.add({ title: 'Erreur', description: msg, color: 'error', icon: 'i-lucide-alert-circle' })
  } finally {
    saving.value = false
  }
}

async function executeDeleteLocality() {
  if (!localityToDelete.value) return
  saving.value = true
  try {
    await geoStore.deleteLocality(localityToDelete.value.id)
    toast.add({ title: 'Localité supprimée', color: 'success', icon: 'i-lucide-check' })
    deleteLocalityModalOpen.value = false
    localityToDelete.value = null
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Erreur lors de la suppression.'
    toast.add({ title: 'Erreur', description: msg, color: 'error', icon: 'i-lucide-alert-circle' })
  } finally {
    saving.value = false
  }
}

// Initialiser le filtre zone si une seule zone
onMounted(() => {
  if (geoStore.zones.length === 1 && !selectedZoneId.value) {
    selectedZoneId.value = geoStore.zones[0]!.id
  }
})
</script>
