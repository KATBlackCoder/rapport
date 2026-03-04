<template>
  <NuxtLayout name="auth">
    <div class="auth-login-wrapper fade-in-up">
      <div class="flex flex-col items-center gap-3 mb-6">
        <AppLogo :show-subtitle="true" />
      </div>

      <UPageCard
        class="w-full max-w-sm border border-default"
        :ui="{ root: 'rounded-xl', body: 'p-6' }"
      >
        <UAuthForm
          :schema="schema"
          :fields="fields"
          :loading="loading"
          title="Connexion"
          description="Saisissez vos identifiants pour accéder à l'application."
          :submit="{ label: 'Se connecter', block: true, color: 'primary', size: 'md' }"
          :ui="authFormUi"
          @submit="onSubmit"
        >
          <template #validation>
            <UAlert
              v-if="error"
              :title="error"
              color="error"
              variant="soft"
              class="mb-2"
              icon="i-lucide-alert-circle"
            />
          </template>
        </UAuthForm>
      </UPageCard>

      <p class="mt-4 text-xs text-center text-muted">
        Format identifiant : <code class="text-highlighted">prenom@telephone.org</code>
      </p>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: false,
})

const authStore = useAuthStore()
const toast = useToast()
const router = useRouter()

const schema = z.object({
  username: z.string().min(1, 'Identifiant requis'),
  password: z.string().min(1, 'Mot de passe requis'),
})

type Schema = z.output<typeof schema>

const fields: AuthFormField[] = [
  {
    name: 'username',
    type: 'text',
    label: 'Identifiant',
    placeholder: 'moussa@76543210.org',
    required: true,
  },
  {
    name: 'password',
    type: 'password',
    label: 'Mot de passe',
    placeholder: '••••••••',
    required: true,
  },
]

const authFormUi = {
  root: 'auth-form',
  header: 'flex flex-col text-center',
  leading: 'hidden',
  title: 'text-lg font-semibold text-highlighted',
  description: 'mt-1 text-sm text-muted',
  body: 'gap-y-4 flex flex-col mt-4',
  form: 'space-y-4',
  input: 'w-full rounded-lg',
}

const loading = ref(false)
const error = ref('')

onMounted(() => {
  if (authStore.isAuthenticated) {
    if (authStore.mustChangePassword) {
      router.replace('/change-password')
    } else {
      router.replace('/')
    }
  }
})

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  const { username, password } = payload.data
  error.value = ''
  loading.value = true

  try {
    await authStore.login(username.trim(), password)

    if (authStore.mustChangePassword) {
      router.replace('/change-password')
    } else {
      router.replace('/')
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Erreur de connexion.'
    error.value = msg
    toast.add({ title: 'Connexion échouée', color: 'error', description: msg })
  } finally {
    loading.value = false
  }
}
</script>
