<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-highlighted">Créer un questionnaire</h1>
        <p class="text-sm text-muted mt-0.5">Définir les champs, l'assignation et la logique conditionnelle.</p>
      </div>
      <UButton
        icon="i-lucide-arrow-left"
        variant="ghost"
        color="neutral"
        to="/forms"
        label="Retour"
        size="sm"
      />
    </div>

    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <div class="p-1.5 rounded-lg bg-primary/10">
            <UIcon name="i-lucide-file-text" class="size-4 text-primary" />
          </div>
          <span class="font-semibold text-highlighted text-sm">Métadonnées</span>
        </div>
      </template>
      <div class="space-y-4">
        <UFormField label="Titre" required>
          <UInput v-model="state.title" placeholder="Ex: Rapport journalier terrain" />
        </UFormField>
        <UFormField label="Description">
          <UTextarea v-model="state.description" placeholder="Description optionnelle" :rows="2" />
        </UFormField>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <UFormField label="Type" required>
            <USelect v-model="state.type" :items="formTypeItems" placeholder="Type" />
          </UFormField>
          <UFormField label="Actif">
            <UCheckbox v-model="state.is_active" label="Questionnaire actif (visible aux assignés)" />
          </UFormField>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <div class="p-1.5 rounded-lg bg-info/10">
            <UIcon name="i-lucide-users" class="size-4 text-info" />
          </div>
          <span class="font-semibold text-highlighted text-sm">Assignation</span>
        </div>
      </template>
      <p class="text-sm text-muted mb-3">Rôles et/ou utilisateurs qui verront ce questionnaire.</p>
      <div class="space-y-4">
        <UFormField label="Par rôles">
          <UCheckboxGroup v-model="assignedRolesModel" :items="roleItems" value-key="value" orientation="horizontal" />
        </UFormField>
        <UFormField label="Par utilisateurs">
          <USelectMenu
            v-model="state.assigned_user_ids"
            :items="userItems"
            multiple
            value-key="value"
            placeholder="Sélectionner des utilisateurs"
          />
        </UFormField>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="p-1.5 rounded-lg bg-warning/10">
              <UIcon name="i-lucide-list-checks" class="size-4 text-warning" />
            </div>
            <span class="font-semibold text-highlighted text-sm">
              Champs
              <UBadge v-if="state.fields.length" :label="String(state.fields.length)" size="sm" variant="soft" color="neutral" class="ml-1" />
            </span>
          </div>
          <UButton icon="i-lucide-plus" label="Ajouter un champ" size="sm" color="primary" @click="openNewField" />
        </div>
      </template>
      <p class="text-sm text-muted mb-3">Glissez pour réordonner. Cliquez sur un champ pour modifier.</p>
      <div v-if="state.fields.length === 0" class="rounded-lg border border-dashed border-default py-8 text-center text-muted text-sm">
        Aucun champ. Cliquez sur « Ajouter un champ » pour commencer.
      </div>
      <VueDraggable v-else v-model="state.fields" :animation="150" handle=".drag-handle" class="space-y-2">
        <div
          v-for="element in state.fields"
          :key="element.id"
          class="flex items-center gap-2 p-3 rounded-lg border border-default bg-elevated/50 hover:bg-elevated"
        >
          <button type="button" class="drag-handle cursor-grab touch-none p-1 text-muted hover:text-highlighted" aria-label="Déplacer">
            <UIcon name="i-lucide-grip-vertical" class="size-4" />
          </button>
          <span class="flex-1 min-w-0 font-medium truncate">{{ element.label || '(sans label)' }}</span>
          <UBadge :label="fieldTypeLabel(element.type)" variant="soft" size="sm" color="neutral" />
          <UButton icon="i-lucide-pencil" variant="ghost" size="xs" aria-label="Modifier" @click="editField(element)" />
          <UButton icon="i-lucide-trash-2" variant="ghost" color="error" size="xs" aria-label="Supprimer" @click="removeField(element.id)" />
        </div>
      </VueDraggable>
    </UCard>

    <UAlert v-if="error" :title="error" color="error" variant="soft" icon="i-lucide-alert-circle" />

    <div class="flex justify-end gap-3">
      <UButton variant="ghost" color="neutral" to="/forms" label="Annuler" />
      <UButton
        color="primary"
        label="Créer le questionnaire"
        icon="i-lucide-check"
        :loading="loading"
        :disabled="!state.title || !state.type"
        @click="onSubmit"
      />
    </div>

    <FormsFormFieldEditor
      :open="fieldEditorOpen"
      :field="editingField"
      :other-fields="state.fields"
      @update:open="fieldEditorOpen = $event"
      @save="onFieldSave"
    />
  </div>
</template>

<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import { useFormsStore } from '~/stores/forms'
import { useUsersStore } from '~/stores/users'
import { useFormEditor } from '~/composables/useFormEditor'

definePageMeta({ middleware: 'forms-admin' })

const formsStore = useFormsStore()
const toast = useToast()
const router = useRouter()

const {
  state, formTypeItems, roleItems, userItems, assignedRolesModel,
  fieldEditorOpen, editingField, fieldTypeLabel,
  openNewField, editField, onFieldSave, removeField, buildAssignedTo,
} = useFormEditor()

const loading = ref(false)
const error = ref('')

async function onSubmit() {
  error.value = ''
  if (!state.title || !state.type) return
  loading.value = true
  try {
    await formsStore.createForm({
      title: state.title,
      description: state.description || null,
      type: state.type,
      is_active: state.is_active,
      fields: state.fields,
      assigned_to: buildAssignedTo(),
    })
    toast.add({ title: 'Questionnaire créé', color: 'success', icon: 'i-lucide-check' })
    await router.push('/forms')
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Erreur'
    error.value = msg
    toast.add({ title: 'Erreur', description: msg, color: 'error', icon: 'i-lucide-alert-circle' })
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await useUsersStore().fetchUsers()
})
</script>
