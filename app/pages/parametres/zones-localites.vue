<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <PageHeader
        title="Zones et localités"
        description="Gérer les zones géographiques et les localités pour les assignations."
      />
      <UButton icon="i-lucide-arrow-left" variant="ghost" to="/parametres" label="Retour" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
      <!-- Zones -->
      <UCard class="lg:col-span-2">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="p-1.5 rounded-lg bg-primary/10">
                <UIcon name="i-lucide-map" class="size-4 text-primary" />
              </div>
              <span class="font-semibold text-highlighted text-sm">Zones</span>
              <UBadge
                :label="String(geoStore.zones.length)"
                size="sm"
                variant="soft"
                color="neutral"
              />
            </div>
            <UButton
              icon="i-lucide-plus"
              label="Créer"
              color="primary"
              size="sm"
              @click="openZoneModal()"
            />
          </div>
        </template>

        <UTable
          :data="geoStore.zones"
          :columns="zoneColumns"
          :loading="loading"
          empty="Aucune zone créée."
          :on-select="selectZone"
          :ui="{ tr: 'cursor-pointer hover:bg-elevated/60 transition-colors', td: 'py-2.5' }"
        >
          <template #name-cell="{ row }">
            <div class="flex items-center gap-2.5 min-w-0">
              <div
                class="size-2 rounded-full shrink-0 transition-colors"
                :class="selectedZoneId === row.original.id ? 'bg-primary' : 'bg-muted/30'"
              />
              <span
                class="font-medium text-sm truncate"
                :class="selectedZoneId === row.original.id ? 'text-primary' : 'text-highlighted'"
              >
                {{ row.original.name }}
              </span>
            </div>
          </template>
          <template #localities-cell="{ row }">
            <UBadge
              :label="`${localityCountForZone(row.original.id)}`"
              size="xs"
              variant="soft"
              :color="localityCountForZone(row.original.id) > 0 ? 'info' : 'neutral'"
              icon="i-lucide-map-pin"
            />
          </template>
          <template #actions-cell="{ row }">
            <div class="flex gap-1 justify-end" @click.stop>
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

        <template v-if="selectedZoneId !== NONE" #footer>
          <div class="flex items-center justify-between px-1 py-0.5">
            <span class="text-xs text-muted">
              Filtre actif : <span class="font-medium text-highlighted">{{ zoneName(selectedZoneId) }}</span>
            </span>
            <UButton
              variant="ghost"
              size="xs"
              icon="i-lucide-x"
              label="Effacer"
              color="neutral"
              @click="selectedZoneId = NONE"
            />
          </div>
        </template>
      </UCard>

      <!-- Localités -->
      <UCard class="lg:col-span-3">
        <template #header>
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-2">
              <div class="p-1.5 rounded-lg bg-info/10">
                <UIcon name="i-lucide-map-pin" class="size-4 text-info" />
              </div>
              <span class="font-semibold text-highlighted text-sm">Localités</span>
              <UBadge
                :label="String(filteredLocalities.length)"
                size="sm"
                variant="soft"
                color="neutral"
              />
            </div>
            <div class="flex items-center gap-2">
              <USelect
                v-model="selectedZoneId"
                :items="zoneOptions"
                placeholder="Toutes les zones"
                size="sm"
                class="w-40"
              />
              <UButton
                icon="i-lucide-plus"
                label="Créer"
                color="primary"
                size="sm"
                :disabled="geoStore.zones.length === 0"
                @click="openLocalityModal()"
              />
            </div>
          </div>
        </template>

        <UTable
          :data="filteredLocalities"
          :columns="localityColumns"
          :loading="loading"
          :empty="selectedZoneId !== NONE ? 'Aucune localité pour cette zone.' : 'Aucune localité créée.'"
          :ui="{ td: 'py-2.5' }"
        >
          <template #name-cell="{ row }">
            <span class="font-medium text-sm text-highlighted">{{ row.original.name }}</span>
          </template>
          <template #zone_id-cell="{ row }">
            <UBadge
              :label="zoneName(row.original.zone_id)"
              variant="soft"
              size="sm"
              color="primary"
              icon="i-lucide-map"
            />
          </template>
          <template #actions-cell="{ row }">
            <div class="flex gap-1 justify-end">
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
    </div>

    <!-- Modal Zone -->
    <UModal
      v-model:open="zoneModalOpen"
      :title="editingZone ? 'Modifier la zone' : 'Créer une zone'"
    >
      <template #body>
        <div class="space-y-4">
          <UFormField label="Nom de la zone" required>
            <UInput
              v-model="zoneForm.name"
              placeholder="Ex: Bamako"
              autofocus
              :disabled="saving"
            />
          </UFormField>
          <UAlert
            v-if="zoneError"
            :title="zoneError"
            color="error"
            variant="soft"
            icon="i-lucide-alert-circle"
          />
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            variant="ghost"
            label="Annuler"
            :disabled="saving"
            @click="zoneModalOpen = false"
          />
          <UButton
            color="primary"
            :label="editingZone ? 'Mettre à jour' : 'Créer'"
            :icon="editingZone ? 'i-lucide-check' : 'i-lucide-plus'"
            :loading="saving"
            :disabled="!zoneForm.name.trim()"
            @click="saveZone"
          />
        </div>
      </template>
    </UModal>

    <!-- Modal Localité -->
    <UModal
      v-model:open="localityModalOpen"
      :title="editingLocality ? 'Modifier la localité' : 'Créer une localité'"
    >
      <template #body>
        <div class="space-y-4">
          <UFormField label="Zone" required>
            <USelect
              v-model="localityForm.zone_id"
              :items="localityZoneOptions"
              placeholder="Sélectionner une zone"
              :disabled="saving || !!editingLocality"
            />
          </UFormField>
          <UFormField label="Nom de la localité" required>
            <UInput
              v-model="localityForm.name"
              placeholder="Ex: Lafiabougou"
              :disabled="saving"
            />
          </UFormField>
          <UAlert
            v-if="localityError"
            :title="localityError"
            color="error"
            variant="soft"
            icon="i-lucide-alert-circle"
          />
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            variant="ghost"
            label="Annuler"
            :disabled="saving"
            @click="localityModalOpen = false"
          />
          <UButton
            color="primary"
            :label="editingLocality ? 'Mettre à jour' : 'Créer'"
            :icon="editingLocality ? 'i-lucide-check' : 'i-lucide-plus'"
            :loading="saving"
            :disabled="!localityForm.name.trim() || !localityForm.zone_id"
            @click="saveLocality"
          />
        </div>
      </template>
    </UModal>

    <!-- Modal suppression zone -->
    <UModal v-model:open="deleteZoneModalOpen" title="Supprimer la zone">
      <template #body>
        <p class="text-sm text-muted">
          Supprimer la zone
          <span class="font-semibold text-highlighted">« {{ zoneToDelete?.name }} »</span> ?
          <template v-if="zoneToDelete && localityCountForZone(zoneToDelete.id) > 0">
            <br />
            <span class="text-warning font-medium">
              {{ localityCountForZone(zoneToDelete.id) }} localité(s) associée(s)
            </span>
            seront également supprimées.
          </template>
          <template v-else>
            Cette action est irréversible.
          </template>
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" label="Annuler" @click="deleteZoneModalOpen = false" />
          <UButton
            color="error"
            icon="i-lucide-trash-2"
            label="Supprimer"
            :loading="saving"
            @click="executeDeleteZone"
          />
        </div>
      </template>
    </UModal>

    <!-- Modal suppression localité -->
    <UModal v-model:open="deleteLocalityModalOpen" title="Supprimer la localité">
      <template #body>
        <p class="text-sm text-muted">
          Supprimer la localité
          <span class="font-semibold text-highlighted">« {{ localityToDelete?.name }} »</span> ?
          Cette action est irréversible.
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" label="Annuler" @click="deleteLocalityModalOpen = false" />
          <UButton
            color="error"
            icon="i-lucide-trash-2"
            label="Supprimer"
            :loading="saving"
            @click="executeDeleteLocality"
          />
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
const NONE = '__none__'
const selectedZoneId = ref<string>(NONE)

const zoneModalOpen = ref(false)
const localityModalOpen = ref(false)
const deleteZoneModalOpen = ref(false)
const deleteLocalityModalOpen = ref(false)

const editingZone = ref<ZoneRow | null>(null)
const editingLocality = ref<LocalityRow | null>(null)
const zoneToDelete = ref<ZoneRow | null>(null)
const localityToDelete = ref<LocalityRow | null>(null)

const zoneForm = reactive({ name: '' })
const localityForm = reactive({ name: '', zone_id: '' as string })
const zoneError = ref('')
const localityError = ref('')

const zoneOptions = computed(() => [
  { label: 'Toutes les zones', value: NONE },
  ...geoStore.zones.map((z: ZoneRow) => ({ label: z.name, value: z.id })),
])

const localityZoneOptions = computed(() =>
  geoStore.zones.map((z: ZoneRow) => ({ label: z.name, value: z.id }))
)

const filteredLocalities = computed(() => {
  if (!selectedZoneId.value || selectedZoneId.value === NONE) return geoStore.localities
  return geoStore.localities.filter((l: LocalityRow) => l.zone_id === selectedZoneId.value)
})

function localityCountForZone(zoneId: string): number {
  return geoStore.localities.filter((l: LocalityRow) => l.zone_id === zoneId).length
}

function zoneName(zoneId: string) {
  return geoStore.zones.find((z: ZoneRow) => z.id === zoneId)?.name ?? '—'
}

function selectZone(_e: Event, row: { original: ZoneRow }) {
  selectedZoneId.value = selectedZoneId.value === row.original.id ? NONE : row.original.id
}

const zoneColumns: TableColumn<ZoneRow>[] = [
  { accessorKey: 'name', header: 'Nom' },
  {
    id: 'localities',
    header: '',
    meta: { class: { th: 'w-16', td: 'w-16' } },
  },
  {
    id: 'actions',
    header: '',
    meta: { class: { th: 'w-20', td: 'w-20 text-right' } },
  },
]

const localityColumns: TableColumn<LocalityRow>[] = [
  { accessorKey: 'name', header: 'Localité' },
  { accessorKey: 'zone_id', header: 'Zone', meta: { class: { th: 'w-36', td: 'w-36' } } },
  {
    id: 'actions',
    header: '',
    meta: { class: { th: 'w-20', td: 'w-20 text-right' } },
  },
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
  localityForm.zone_id = locality?.zone_id
    ?? (selectedZoneId.value !== NONE ? selectedZoneId.value : geoStore.zones[0]?.id ?? '')
  localityError.value = ''
  localityModalOpen.value = true
}

async function saveZone() {
  const name = zoneForm.name.trim()
  if (!name) { zoneError.value = 'Le nom est requis.'; return }
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
    zoneError.value = e instanceof Error ? e.message : 'Erreur lors de l\'enregistrement.'
    toast.add({ title: 'Erreur', description: zoneError.value, color: 'error', icon: 'i-lucide-alert-circle' })
  } finally {
    saving.value = false
  }
}

async function saveLocality() {
  const name = localityForm.name.trim()
  const zoneId = localityForm.zone_id
  if (!name || !zoneId) { localityError.value = 'Le nom et la zone sont requis.'; return }
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
    localityError.value = e instanceof Error ? e.message : 'Erreur lors de l\'enregistrement.'
    toast.add({ title: 'Erreur', description: localityError.value, color: 'error', icon: 'i-lucide-alert-circle' })
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
    if (selectedZoneId.value === zone.id) selectedZoneId.value = NONE
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

onMounted(() => {
  if (geoStore.zones.length === 1 && selectedZoneId.value === NONE) {
    selectedZoneId.value = geoStore.zones[0]!.id
  }
})
</script>
