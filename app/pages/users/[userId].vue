<template>
  <div class="max-w-2xl mx-auto space-y-6 fade-in-up">
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <UIcon name="i-lucide-loader-2" class="size-8 animate-spin text-muted" />
    </div>

    <!-- Not found -->
    <UAlert
      v-else-if="!user"
      title="Utilisateur introuvable"
      description="Vous n'avez pas accès à cet utilisateur ou il n'existe pas."
      color="warning"
      icon="i-lucide-alert-triangle"
    />

    <template v-else>
      <!-- Hero header -->
      <div class="flex items-start justify-between gap-4">
        <div class="flex items-center gap-4">
          <UAvatar
            :text="user.first_name?.charAt(0)?.toUpperCase() ?? '?'"
            size="xl"
            class="bg-primary/15 text-primary font-bold text-2xl shrink-0"
          />
          <div>
            <h1 class="text-xl font-bold text-highlighted">{{ user.first_name }} {{ user.last_name }}</h1>
            <div class="flex items-center gap-2 mt-1 flex-wrap">
              <code class="text-xs text-muted">{{ user.username }}</code>
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
        </div>
        <UButton
          icon="i-lucide-arrow-left"
          variant="ghost"
          color="neutral"
          to="/users"
          label="Retour"
          size="sm"
          class="shrink-0"
        />
      </div>

      <!-- Profil -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <div class="p-1.5 rounded-lg bg-primary/10">
              <UIcon name="i-lucide-contact" class="size-4 text-primary" />
            </div>
            <span class="font-semibold text-highlighted text-sm">Informations</span>
          </div>
        </template>

        <dl class="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
          <div>
            <dt class="text-xs text-muted uppercase tracking-wide mb-1">Téléphone</dt>
            <dd class="font-medium text-sm">{{ user.phone }}</dd>
          </div>
          <div>
            <dt class="text-xs text-muted uppercase tracking-wide mb-1">Email</dt>
            <dd class="font-medium text-sm">{{ user.email || '—' }}</dd>
          </div>
          <div>
            <dt class="text-xs text-muted uppercase tracking-wide mb-1">Zone</dt>
            <dd class="font-medium text-sm">{{ (user as UserWithJoins).zones?.name ?? '—' }}</dd>
          </div>
          <div>
            <dt class="text-xs text-muted uppercase tracking-wide mb-1">Localité</dt>
            <dd class="font-medium text-sm">{{ (user as UserWithJoins).localities?.name ?? '—' }}</dd>
          </div>
          <div>
            <dt class="text-xs text-muted uppercase tracking-wide mb-1">Superviseur</dt>
            <dd class="font-medium text-sm">{{ supervisorName(user.supervisor_id) }}</dd>
          </div>
          <div>
            <dt class="text-xs text-muted uppercase tracking-wide mb-1">Identifiant</dt>
            <dd><code class="text-xs text-muted">{{ user.username }}</code></dd>
          </div>
        </dl>
      </UCard>

      <!-- Rôle -->
      <UCard v-if="canModifyRole() && canSeeUser(user)">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="p-1.5 rounded-lg bg-info/10">
                <UIcon name="i-lucide-shield" class="size-4 text-info" />
              </div>
              <span class="font-semibold text-highlighted text-sm">Rôle</span>
            </div>
            <UButton
              v-if="!editingRole"
              icon="i-lucide-pencil"
              variant="ghost"
              color="neutral"
              size="xs"
              label="Modifier"
              @click="editingRole = true"
            />
          </div>
        </template>

        <div v-if="editingRole" class="flex items-end gap-3">
          <USelect
            v-model="roleForm"
            :items="allowedRoleOptions"
            placeholder="Rôle"
            class="w-48"
          />
          <UButton size="sm" label="Enregistrer" color="primary" :loading="saving" @click="saveRole" />
          <UButton
            size="sm"
            variant="ghost"
            label="Annuler"
            @click="editingRole = false; roleForm = (user?.role ?? 'employe')"
          />
        </div>
        <div v-else class="flex items-center gap-2">
          <UBadge
            :label="roleLabel(user.role)"
            :color="roleColor(user.role)"
            variant="soft"
          />
        </div>
      </UCard>

      <!-- Privilèges -->
      <UCard v-if="canSeeUser(user)">
        <template #header>
          <div class="flex items-center gap-2">
            <div class="p-1.5 rounded-lg bg-warning/10">
              <UIcon name="i-lucide-key" class="size-4 text-warning" />
            </div>
            <span class="font-semibold text-highlighted text-sm">Privilèges</span>
          </div>
        </template>

        <div class="space-y-2">
          <div
            v-for="p in allPrivileges"
            :key="p.value"
            class="flex items-center justify-between rounded-lg px-3 py-2.5 border border-default"
            :class="userPrivileges.includes(p.value as UserPrivilege) ? 'bg-success/5 border-success/20' : ''"
          >
            <div class="flex items-center gap-2">
              <UIcon
                :name="userPrivileges.includes(p.value as UserPrivilege) ? 'i-lucide-check-circle' : 'i-lucide-circle'"
                class="size-4 shrink-0"
                :class="userPrivileges.includes(p.value as UserPrivilege) ? 'text-success' : 'text-muted'"
              />
              <span class="text-sm">{{ p.label }}</span>
            </div>
            <div class="flex items-center gap-2">
              <UButton
                v-if="!userPrivileges.includes(p.value as UserPrivilege) && canGrantPrivilege(p.value)"
                icon="i-lucide-plus"
                label="Accorder"
                variant="ghost"
                color="primary"
                size="xs"
                :loading="granting === p.value"
                @click="grantPrivilege(p.value as UserPrivilege)"
              />
              <UButton
                v-else-if="userPrivileges.includes(p.value as UserPrivilege) && (canGrantPrivilege(p.value as UserPrivilege) || canDisableUser())"
                icon="i-lucide-minus"
                label="Révoquer"
                variant="ghost"
                color="error"
                size="xs"
                :loading="revoking === p.value"
                @click="revokePrivilege(p.value as UserPrivilege)"
              />
            </div>
          </div>
        </div>
      </UCard>

      <!-- Statut -->
      <UCard v-if="canDisableUser() && canSeeUser(user)">
        <template #header>
          <div class="flex items-center gap-2">
            <div class="p-1.5 rounded-lg" :class="user.is_active ? 'bg-success/10' : 'bg-neutral/10'">
              <UIcon
                name="i-lucide-power"
                class="size-4"
                :class="user.is_active ? 'text-success' : 'text-muted'"
              />
            </div>
            <span class="font-semibold text-highlighted text-sm">Statut du compte</span>
          </div>
        </template>

        <div class="flex items-center justify-between">
          <div>
            <UBadge
              :label="user.is_active ? 'Compte actif' : 'Compte inactif'"
              :color="user.is_active ? 'success' : 'neutral'"
              variant="soft"
            />
            <p class="text-xs text-muted mt-1.5">
              {{ user.is_active ? 'L\'utilisateur peut se connecter.' : 'L\'accès est suspendu.' }}
            </p>
          </div>
          <UButton
            :label="user.is_active ? 'Désactiver' : 'Réactiver'"
            :color="user.is_active ? 'error' : 'success'"
            :icon="user.is_active ? 'i-lucide-user-x' : 'i-lucide-user-check'"
            variant="soft"
            :loading="saving"
            @click="toggleActive"
          />
        </div>
      </UCard>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Database } from '~/types/database.types'
import { useUsersStore } from '~/stores/users'
import { useAuthStore } from '~/stores/auth'
import { usePermissions } from '~/composables/usePermissions'
import { roleLabel, roleColor, roleOrder, ROLE_ORDER } from '~/utils/roles'

definePageMeta({ middleware: 'users' })

type UserRow = Database['public']['Tables']['users']['Row']
type UserRole = Database['public']['Enums']['user_role']
type UserPrivilege = Database['public']['Enums']['user_privilege']
type UserWithJoins = UserRow & {
  zones?: { name: string } | null
  localities?: { name: string } | null
}

const route = useRoute()
const userId = computed(() => route.params.userId as string)
const usersStore = useUsersStore()
const authStore = useAuthStore()
const { canSeeUser, canModifyRole, canDisableUser, canGrantPrivilege } = usePermissions()
const toast = useToast()

const loading = ref(true)
const saving = ref(false)
const granting = ref<UserPrivilege | null>(null)
const revoking = ref<UserPrivilege | null>(null)
const editingRole = ref(false)
const roleForm = ref<UserRole | string>('employe')
const userPrivileges = ref<UserPrivilege[]>([])

const user = computed(() => usersStore.users.find((u) => u.id === userId.value) ?? null)

const allPrivileges: { label: string; value: UserPrivilege }[] = [
  { label: 'Créer des utilisateurs', value: 'create_user' },
  { label: 'Renvoyer pour correction', value: 'send_back' },
  { label: 'Voir les réponses', value: 'view_responses' },
]

const allowedRoleOptions = computed(() => {
  const myRole = authStore.role
  if (!myRole || !user.value) return []
  const myIdx = roleOrder(myRole)
  return [
    { label: 'Admin', value: 'admin' },
    { label: 'Manager', value: 'manager' },
    { label: 'Superviseur', value: 'superviseur' },
    { label: 'Employé', value: 'employe' },
  ].filter((r) => roleOrder(r.value as UserRole) > myIdx)
})

function supervisorName(supervisorId: string | null) {
  if (!supervisorId) return '—'
  const u = usersStore.users.find((u) => u.id === supervisorId)
  return u ? `${u.first_name} ${u.last_name}` : '—'
}

async function saveRole() {
  if (!user.value || !allowedRoleOptions.value.some((r) => r.value === roleForm.value)) return
  saving.value = true
  try {
    await usersStore.updateUser(user.value.id, { role: roleForm.value as UserRole })
    toast.add({ title: 'Rôle mis à jour', color: 'success', icon: 'i-lucide-check' })
    editingRole.value = false
  } catch (e: unknown) {
    toast.add({ title: 'Erreur', description: e instanceof Error ? e.message : 'Erreur', color: 'error' })
  } finally {
    saving.value = false
  }
}

async function grantPrivilege(privilege: UserPrivilege) {
  if (!user.value) return
  granting.value = privilege
  try {
    await usersStore.grantPrivilege(user.value.id, privilege)
    userPrivileges.value = [...userPrivileges.value, privilege]
    toast.add({ title: 'Privilège accordé', color: 'success', icon: 'i-lucide-check' })
  } catch (e: unknown) {
    toast.add({ title: 'Erreur', description: e instanceof Error ? e.message : 'Erreur', color: 'error' })
  } finally {
    granting.value = null
  }
}

async function revokePrivilege(privilege: UserPrivilege) {
  if (!user.value) return
  revoking.value = privilege
  try {
    await usersStore.revokePrivilege(user.value.id, privilege)
    userPrivileges.value = userPrivileges.value.filter((p) => p !== privilege)
    toast.add({ title: 'Privilège révoqué', color: 'success', icon: 'i-lucide-check' })
  } catch (e: unknown) {
    toast.add({ title: 'Erreur', description: e instanceof Error ? e.message : 'Erreur', color: 'error' })
  } finally {
    revoking.value = null
  }
}

async function toggleActive() {
  if (!user.value) return
  saving.value = true
  try {
    await usersStore.updateUser(user.value.id, { is_active: !user.value.is_active })
    toast.add({
      title: user.value.is_active ? 'Compte désactivé' : 'Compte réactivé',
      color: 'success',
      icon: 'i-lucide-check',
    })
  } catch (e: unknown) {
    toast.add({ title: 'Erreur', description: e instanceof Error ? e.message : 'Erreur', color: 'error' })
  } finally {
    saving.value = false
  }
}

watch(user, (u) => { if (u) roleForm.value = u.role }, { immediate: true })

onMounted(async () => {
  await usersStore.fetchUsers()
  if (userId.value) {
    const privs = await usersStore.fetchUserPrivileges(userId.value)
    userPrivileges.value = privs.map((p) => p.privilege as UserPrivilege)
  }
  loading.value = false
})
</script>
