<template>
  <NuxtLayout name="auth">
    <div class="auth-login-wrapper">
      <UPageCard class="w-full max-w-md bg-elevated border border-default fade-in-up" :ui="{ root: 'rounded-[var(--ui-radius)]' }">
        <UAuthForm
          :schema="schema"
          :fields="fields"
          :loading="loading"
          title="Connexion"
          description="Identifiant au format prenom@telephone.org"
          icon="i-lucide-clipboard-list"
          :submit="{ label: 'Se connecter', block: true, color: 'primary' }"
          :ui="authFormUi"
          @submit="onSubmit"
        >
          <template #validation>
            <UAlert
              v-if="error"
              :title="error"
              color="error"
              variant="soft"
              class="mb-4"
            />
          </template>
        </UAuthForm>
      </UPageCard>
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
    placeholder: 'Entrez votre mot de passe',
    required: true,
  },
]

const authFormUi = {
  root: 'auth-form',
  header: 'flex flex-col text-center',
  leading: 'mb-3',
  leadingIcon: 'size-9 shrink-0 text-highlighted',
  title: 'text-xl font-semibold text-highlighted',
  description: 'mt-2 text-sm text-muted',
  body: 'gap-y-6 flex flex-col',
  form: 'space-y-5',
  input: 'w-full rounded-[var(--ui-radius)]',
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
