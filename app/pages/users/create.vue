<template>
  <div class="max-w-2xl mx-auto space-y-6 fade-in-up">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-highlighted">Créer un utilisateur</h1>
        <p class="text-sm text-muted mt-0.5">Les identifiants seront générés automatiquement.</p>
      </div>
      <UButton
        icon="i-lucide-arrow-left"
        variant="ghost"
        color="neutral"
        to="/users"
        label="Retour"
        size="sm"
      />
    </div>

    <UForm ref="formRef" :schema="schema" :state="state" class="space-y-5" @submit="onSubmit">
      <!-- Section : Identité -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <div class="p-1.5 rounded-lg bg-primary/10">
              <UIcon name="i-lucide-user" class="size-4 text-primary" />
            </div>
            <span class="font-semibold text-highlighted text-sm">Identité</span>
          </div>
        </template>

        <div class="space-y-4">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <UFormField name="first_name" label="Prénom" required>
              <UInput v-model="state.first_name" placeholder="Moussa" class="w-full" />
            </UFormField>
            <UFormField name="last_name" label="Nom" required>
              <UInput v-model="state.last_name" placeholder="Diallo" class="w-full" />
            </UFormField>
          </div>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <UFormField name="phone" label="Téléphone" required>
              <UInput v-model="state.phone" placeholder="76543210" type="tel" class="w-full" />
            </UFormField>
            <UFormField name="email" label="Email">
              <UInput v-model="state.email" type="email" placeholder="moussa@example.com" class="w-full" />
            </UFormField>
          </div>
        </div>
      </UCard>

      <!-- Section : Rôle & Localisation -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <div class="p-1.5 rounded-lg bg-info/10">
              <UIcon name="i-lucide-shield" class="size-4 text-info" />
            </div>
            <span class="font-semibold text-highlighted text-sm">Rôle &amp; Localisation</span>
          </div>
        </template>

        <div class="space-y-4">
          <UFormField name="role" label="Rôle" required>
            <USelect
              v-model="state.role"
              :items="allowedRoleOptions"
              placeholder="Sélectionner un rôle"
              class="w-full"
            />
          </UFormField>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <UFormField name="zone_id" label="Zone">
              <USelect
                v-model="state.zone_id"
                :items="zoneOptions"
                placeholder="Sélectionner une zone"
                class="w-full"
              />
            </UFormField>
            <UFormField name="locality_id" label="Localité">
              <USelect
                v-model="state.locality_id"
                :items="localityOptionsByZone"
                placeholder="Sélectionner une localité"
                class="w-full"
                :disabled="!state.zone_id || state.zone_id === NONE"
              />
            </UFormField>
          </div>

          <UFormField
            v-if="showSupervisor"
            name="supervisor_id"
            :label="supervisorFieldLabel"
            required
          >
            <USelect
              v-model="state.supervisor_id"
              :items="supervisorOptions"
              :placeholder="supervisorPlaceholder"
              class="w-full"
            />
          </UFormField>
        </div>
      </UCard>

      <!-- Section : Privilèges -->
      <UCard v-if="privilegeOptions.length > 0">
        <template #header>
          <div class="flex items-center gap-2">
            <div class="p-1.5 rounded-lg bg-warning/10">
              <UIcon name="i-lucide-key" class="size-4 text-warning" />
            </div>
            <span class="font-semibold text-highlighted text-sm">Privilèges à accorder</span>
          </div>
        </template>

        <UCheckboxGroup
          v-model="state.privileges"
          :items="privilegeOptions"
          class="space-y-2"
        />
      </UCard>

      <!-- Alerte erreur -->
      <UAlert
        v-if="error"
        :title="error"
        color="error"
        variant="soft"
        icon="i-lucide-alert-circle"
      />

      <!-- Actions -->
      <div class="flex justify-end gap-3 pt-1">
        <UButton variant="ghost" color="neutral" to="/users" label="Annuler" />
        <UButton
          type="submit"
          label="Créer l'utilisateur"
          color="primary"
          icon="i-lucide-user-plus"
          :loading="loading"
          :disabled="!canCreate"
        />
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { Database } from '~/types/database.types'
import { useUsersStore } from '~/stores/users'
import { useGeoStore } from '~/stores/geo'
import { useAuthStore } from '~/stores/auth'
import { usePermissionsStore } from '~/stores/permissions'

definePageMeta({ middleware: 'users' })

type UserRole = Database['public']['Enums']['user_role']

const ROLE_ORDER: UserRole[] = ['super_admin', 'admin', 'manager', 'superviseur', 'employe']
const NONE = '__none__'

const schema = z.object({
  first_name: z.string().min(1, 'Prénom requis'),
  last_name: z.string().min(1, 'Nom requis'),
  phone: z.string().min(1, 'Téléphone requis').regex(/^\d+$/, 'Chiffres uniquement'),
  email: z.string().email().optional().or(z.literal('')),
  role: z.enum(['admin', 'manager', 'superviseur', 'employe']),
  zone_id: z.union([z.string().uuid(), z.literal(NONE)]).optional().nullable()
    .transform((v) => (v === NONE || !v ? null : v)),
  locality_id: z.union([z.string().uuid(), z.literal(NONE)]).optional().nullable()
    .transform((v) => (v === NONE || !v ? null : v)),
  supervisor_id: z.union([z.string().uuid(), z.literal(NONE)]).optional().nullable()
    .transform((v) => (v === NONE || !v ? null : v)),
  privileges: z.array(z.string()).optional(),
})

type Schema = z.output<typeof schema>

const usersStore = useUsersStore()
const geoStore = useGeoStore()
const authStore = useAuthStore()
const permissionsStore = usePermissionsStore()
const toast = useToast()

const formRef = ref()
const loading = ref(false)
const error = ref('')

const state = reactive<Partial<Schema> & { zone_id?: string; locality_id?: string; supervisor_id?: string }>({
  first_name: '',
  last_name: '',
  phone: '',
  email: '',
  role: 'employe',
  zone_id: NONE,
  locality_id: NONE,
  supervisor_id: NONE,
  privileges: [] as string[],
})

const myRole = computed(() => authStore.role)

function roleOrder(r: UserRole): number {
  return ROLE_ORDER.indexOf(r) >= 0 ? ROLE_ORDER.indexOf(r) : 999
}

const allowedRoleOptions = computed(() => {
  if (!myRole.value) return []
  const myIdx = roleOrder(myRole.value)
  return [
    { label: 'Admin', value: 'admin' },
    { label: 'Manager', value: 'manager' },
    { label: 'Superviseur', value: 'superviseur' },
    { label: 'Employé', value: 'employe' },
  ].filter((r) => roleOrder(r.value as UserRole) > myIdx)
})

const zoneOptions = computed(() => [
  { label: '—', value: NONE },
  ...geoStore.zones.map((z) => ({ label: z.name, value: z.id })),
])

const localityOptionsByZone = computed(() => {
  if (!state.zone_id || state.zone_id === NONE) return [{ label: '—', value: NONE }]
  const list = geoStore.localitiesByZone(state.zone_id)
  return [{ label: '—', value: NONE }, ...list.map((l) => ({ label: l.name, value: l.id }))]
})

const showSupervisor = computed(() => ['superviseur', 'employe'].includes(state.role ?? ''))
const supervisorFieldLabel = computed(() => state.role === 'superviseur' ? 'Manageur' : 'Superviseur')
const supervisorPlaceholder = computed(() => state.role === 'superviseur' ? 'Sélectionner un manageur' : 'Sélectionner un superviseur')
const isSupervisorRequired = computed(() => showSupervisor.value && (!state.supervisor_id || state.supervisor_id === NONE))
const canCreate = computed(() => !isSupervisorRequired.value)

const supervisorOptions = computed(() => {
  const list = usersStore.users.filter((u) => ['manager', 'superviseur'].includes(u.role))
  return [{ label: '—', value: NONE }, ...list.map((u) => ({ label: `${u.first_name} ${u.last_name}`, value: u.id }))]
})

const privilegeOptions = computed(() => {
  const opts: { label: string; value: string }[] = []
  if (permissionsStore.hasPrivilege(myRole.value, 'create_user')) opts.push({ label: 'Créer des utilisateurs', value: 'create_user' })
  if (permissionsStore.hasPrivilege(myRole.value, 'send_back')) opts.push({ label: 'Renvoyer pour correction', value: 'send_back' })
  if (permissionsStore.hasPrivilege(myRole.value, 'view_responses')) opts.push({ label: 'Voir les réponses', value: 'view_responses' })
  return opts
})

async function onSubmit() {
  error.value = ''
  const valid = await formRef.value?.validate()
  if (!valid) return
  loading.value = true
  try {
    const payload = {
      first_name: state.first_name!,
      last_name: state.last_name!,
      phone: state.phone!,
      email: state.email || undefined,
      role: state.role!,
      zone_id: (state.zone_id && state.zone_id !== NONE) ? state.zone_id : null,
      locality_id: (state.locality_id && state.locality_id !== NONE) ? state.locality_id : null,
      supervisor_id: (state.supervisor_id && state.supervisor_id !== NONE) ? state.supervisor_id : null,
      privileges: state.privileges ?? [],
    }
    const res = await usersStore.createUser(payload)
    toast.add({
      title: 'Utilisateur créé',
      description: (res as { message?: string })?.message,
      color: 'success',
      icon: 'i-lucide-check',
    })
    await navigateTo('/users')
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Erreur'
    error.value = msg
    toast.add({ title: 'Erreur', description: msg, color: 'error', icon: 'i-lucide-alert-circle' })
  } finally {
    loading.value = false
  }
}

watch(() => state.zone_id, () => { state.locality_id = NONE })

onMounted(async () => {
  await usersStore.fetchUsers()
})
</script>
