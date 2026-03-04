<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <PageHeader
        title="Utilisateurs"
        description="Gérer les comptes et privilèges."
      />
      <UButton
        v-if="canCreateUser()"
        icon="i-lucide-plus"
        label="Créer un utilisateur"
        color="primary"
        to="/users/create"
      />
    </div>

    <!-- Filtres -->
    <UCard>
      <div class="grid grid-cols-2 gap-2 md:flex md:flex-row md:flex-wrap md:items-center md:gap-3">
        <USelect
          v-model="filters.role"
          :items="roleOptions"
          placeholder="Rôle"
          class="w-full md:w-36"
        />
        <USelect
          v-model="filters.zone_id"
          :items="zoneOptions"
          placeholder="Zone"
          class="w-full md:w-40"
        />
        <USelect
          v-model="filters.locality_id"
          :items="localityOptions"
          placeholder="Localité"
          class="w-full md:w-44"
        />
        <USelect
          v-model="filters.is_active"
          :items="statusOptions"
          placeholder="Statut"
          class="w-full md:w-32"
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

    <!-- Loading -->
    <div v-if="usersStore.loading" class="flex justify-center py-10">
      <UIcon name="i-lucide-loader-2" class="size-6 animate-spin text-muted" />
    </div>

    <template v-else>
      <!-- Vide -->
      <UCard v-if="filteredUsers.length === 0" class="text-center py-10">
        <div class="flex flex-col items-center gap-2 text-muted">
          <UIcon name="i-lucide-users" class="size-10 opacity-30" />
          <p class="text-sm">Aucun utilisateur trouvé.</p>
        </div>
      </UCard>

      <!-- Mobile : cartes -->
      <div class="md:hidden space-y-3">
        <NuxtLink
          v-for="user in filteredUsers"
          :key="user.id"
          :to="canSeeUser(user) ? `/users/${user.id}` : undefined"
          class="block"
        >
          <UCard class="transition-shadow hover:shadow-md" :class="canSeeUser(user) ? 'cursor-pointer' : ''">
            <!-- Ligne principale : nom + badge statut -->
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <UAvatar
                  :text="user.first_name?.charAt(0)?.toUpperCase() ?? '?'"
                  size="md"
                  class="bg-primary/10 text-primary font-semibold shrink-0"
                />
                <div class="min-w-0">
                  <p class="font-semibold text-highlighted truncate">
                    {{ user.first_name }} {{ user.last_name }}
                  </p>
                  <code class="text-xs text-muted truncate block">{{ user.username }}</code>
                </div>
              </div>
              <div class="flex flex-col items-end gap-1.5 shrink-0">
                <UBadge
                  :label="roleLabel(user.role)"
                  :color="roleColor(user.role)"
                  variant="soft"
                  size="sm"
                />
                <UBadge
                  :label="user.is_active ? 'Actif' : 'Inactif'"
                  :color="user.is_active ? 'success' : 'neutral'"
                  variant="soft"
                  size="sm"
                />
              </div>
            </div>

            <!-- Détails : zone, localité, superviseur -->
            <div class="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted border-t border-default pt-3">
              <div v-if="zoneName(user)">
                <span class="block text-[10px] uppercase tracking-wide font-medium text-muted/70 mb-0.5">Zone</span>
                <span class="text-default font-medium">{{ zoneName(user) }}</span>
              </div>
              <div v-if="localityName(user)">
                <span class="block text-[10px] uppercase tracking-wide font-medium text-muted/70 mb-0.5">Localité</span>
                <span class="text-default font-medium">{{ localityName(user) }}</span>
              </div>
              <div v-if="user.email" class="col-span-2">
                <span class="block text-[10px] uppercase tracking-wide font-medium text-muted/70 mb-0.5">Email</span>
                <span class="text-default truncate block">{{ user.email }}</span>
              </div>
            </div>
          </UCard>
        </NuxtLink>
      </div>

      <!-- Desktop : table -->
      <UCard class="hidden md:block overflow-hidden">
        <UTable
          :data="filteredUsers"
          :columns="columns"
          :ui="{ th: 'whitespace-nowrap', td: 'whitespace-nowrap' }"
        >
          <template #name-cell="{ row }">
            <div class="flex flex-col">
              <span class="font-medium text-highlighted">{{ row.original.first_name }} {{ row.original.last_name }}</span>
              <code class="text-xs text-muted">{{ row.original.username }}</code>
            </div>
          </template>
          <template #role-cell="{ row }">
            <UBadge :label="roleLabel(row.original.role)" :color="roleColor(row.original.role)" variant="soft" />
          </template>
          <template #zone_id-cell="{ row }">
            {{ (row.original as UserWithJoins).zones?.name ?? '—' }}
          </template>
          <template #locality_id-cell="{ row }">
            {{ (row.original as UserWithJoins).localities?.name ?? '—' }}
          </template>
          <template #is_active-cell="{ row }">
            <UBadge
              :label="row.original.is_active ? 'Actif' : 'Inactif'"
              :color="row.original.is_active ? 'success' : 'neutral'"
              variant="soft"
            />
          </template>
          <template #actions-cell="{ row }">
            <div v-if="canSeeUser(row.original)" class="flex justify-end">
              <UButton
                icon="i-lucide-pencil"
                variant="ghost"
                color="neutral"
                size="xs"
                :to="`/users/${row.original.id}`"
                aria-label="Modifier"
              />
            </div>
          </template>
        </UTable>
      </UCard>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Database } from '~/types/database.types'
import { useUsersStore } from '~/stores/users'
import { useGeoStore } from '~/stores/geo'
import { usePermissions } from '~/composables/usePermissions'
import { roleLabel, roleColor } from '~/utils/roles'

definePageMeta({ middleware: 'users' })

type UserRow = Database['public']['Tables']['users']['Row']
type UserWithJoins = UserRow & {
  zones?: { name: string } | null
  localities?: { name: string } | null
}

const usersStore = useUsersStore()
const geoStore = useGeoStore()
const { canCreateUser, canSeeUser } = usePermissions()

const NONE = '__none__'

const filters = reactive<{
  role: string
  zone_id: string
  locality_id: string
  is_active: string
}>({
  role: NONE,
  zone_id: NONE,
  locality_id: NONE,
  is_active: NONE,
})

const roleOptions = [
  { label: 'Tous les rôles', value: NONE },
  { label: 'Admin', value: 'admin' },
  { label: 'Manager', value: 'manager' },
  { label: 'Superviseur', value: 'superviseur' },
  { label: 'Employé', value: 'employe' },
]

const statusOptions = [
  { label: 'Tous', value: NONE },
  { label: 'Actif', value: 'true' },
  { label: 'Inactif', value: 'false' },
]

const zoneOptions = computed(() => [
  { label: 'Toutes les zones', value: NONE },
  ...geoStore.zones.map((z) => ({ label: z.name, value: z.id })),
])

const localityOptions = computed(() => [
  { label: 'Toutes les localités', value: NONE },
  ...geoStore.localities.map((l) => ({ label: l.name, value: l.id })),
])

const filteredUsers = computed(() => {
  let list = usersStore.users as UserWithJoins[]
  if (filters.role !== NONE) list = list.filter((u) => u.role === filters.role)
  if (filters.zone_id !== NONE) list = list.filter((u) => u.zone_id === filters.zone_id)
  if (filters.locality_id !== NONE) list = list.filter((u) => u.locality_id === filters.locality_id)
  if (filters.is_active === 'true') list = list.filter((u) => u.is_active)
  if (filters.is_active === 'false') list = list.filter((u) => !u.is_active)
  return list
})

function zoneName(user: UserWithJoins) {
  return user.zones?.name ?? null
}

function localityName(user: UserWithJoins) {
  return user.localities?.name ?? null
}

function resetFilters() {
  filters.role = NONE
  filters.zone_id = NONE
  filters.locality_id = NONE
  filters.is_active = NONE
}

const columns: TableColumn<UserRow>[] = [
  { accessorKey: 'first_name', header: 'Nom / Identifiant', id: 'name' },
  { accessorKey: 'role', header: 'Rôle', id: 'role' },
  { accessorKey: 'zone_id', header: 'Zone', id: 'zone_id' },
  { accessorKey: 'locality_id', header: 'Localité', id: 'locality_id' },
  { accessorKey: 'is_active', header: 'Statut', id: 'is_active' },
  { id: 'actions', header: '' },
]

onMounted(async () => {
  await geoStore.fetchAll()
  await usersStore.fetchUsers()
})
</script>
