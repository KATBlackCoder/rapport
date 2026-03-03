<template>
  <NuxtLayout name="auth">
    <div class="auth-login-wrapper">
      <AuthCard class="w-full max-w-md fade-in-up">
        <template #header>
          <PageHeader
            title="Changer le mot de passe"
            description="Vous devez définir un nouveau mot de passe pour continuer."
            inverted
          />
        </template>

        <UForm :state="state" @submit="onSubmit">
          <div class="space-y-4">
            <UFormField name="newPassword" label="Nouveau mot de passe" required>
              <UInput
                v-model="state.newPassword"
                type="password"
                autocomplete="new-password"
                :disabled="loading"
              />
            </UFormField>

            <UFormField name="confirmPassword" label="Confirmer le mot de passe" required>
              <UInput
                v-model="state.confirmPassword"
                type="password"
                autocomplete="new-password"
                :disabled="loading"
              />
            </UFormField>

            <UAlert
              v-if="error"
              :title="error"
              color="error"
              variant="soft"
              class="mb-4"
            />

            <UButton
              type="submit"
              block
              color="primary"
              :loading="loading"
              label="Enregistrer"
            />
          </div>
        </UForm>
      </AuthCard>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: false,
})

const authStore = useAuthStore()
const toast = useToast()
const router = useRouter()

const state = reactive({
  newPassword: '',
  confirmPassword: '',
})

const loading = ref(false)
const error = ref('')

async function onSubmit() {
  const { newPassword, confirmPassword } = state

  if (!newPassword || newPassword.length < 8) {
    error.value = 'Le mot de passe doit contenir au moins 8 caractères.'
    return
  }

  if (newPassword !== confirmPassword) {
    error.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  error.value = ''
  loading.value = true

  try {
    await authStore.changePassword(newPassword)
    toast.add({ title: 'Mot de passe mis à jour', color: 'success' })
    router.replace('/')
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Erreur lors de la mise à jour.'
    error.value = msg
    toast.add({ title: 'Erreur', color: 'error', description: msg })
  } finally {
    loading.value = false
  }
}
</script>
