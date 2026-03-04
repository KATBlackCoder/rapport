<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <div v-if="loadingForm" class="flex justify-center py-12">
      <UIcon name="i-lucide-loader-2" class="size-8 animate-spin text-muted" />
    </div>

    <template v-else-if="form">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-highlighted">Modifier le questionnaire</h1>
          <p class="text-sm text-muted mt-0.5">{{ form.title }}</p>
        </div>
        <div class="flex gap-2">
          <UButton icon="i-lucide-arrow-left" variant="ghost" color="neutral" to="/forms" label="Retour" size="sm" />
          <UButton
            v-if="canManageForms()"
            color="error"
            variant="soft"
            icon="i-lucide-trash-2"
            label="Supprimer"
            size="sm"
            :loading="deleting"
            @click="deleteModalOpen = true"
          />
        </div>
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
          label="Enregistrer"
          icon="i-lucide-check"
          :loading="saving"
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
    </template>

    <UCard v-else class="text-center py-10">
      <p class="text-muted">Questionnaire introuvable.</p>
      <UButton to="/forms" variant="soft" class="mt-3" label="Retour à la liste" />
    </UCard>

    <!-- Modal suppression -->
    <UModal v-model:open="deleteModalOpen" title="Supprimer le questionnaire">
      <template #body>
        <p class="text-sm text-muted">
          Supprimer <span class="font-semibold text-highlighted">« {{ form?.title }} »</span> ?
          Cette action est irréversible et supprimera toutes les données associées.
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" label="Annuler" @click="deleteModalOpen = false" />
          <UButton color="error" icon="i-lucide-trash-2" label="Supprimer" :loading="deleting" @click="doDelete" />
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import type { FormField, FormTypeDb } from '~/types/forms'
import type { StoredForm } from '~/stores/forms'
import { useFormsStore } from '~/stores/forms'
import { useUsersStore } from '~/stores/users'
import { usePermissions } from '~/composables/usePermissions'
import { useFormEditor } from '~/composables/useFormEditor'

definePageMeta({ middleware: 'forms-admin' })

const route = useRoute()
const router = useRouter()
const formsStore = useFormsStore()
const { canManageForms } = usePermissions()
const toast = useToast()

const formId = computed(() => route.params.formId as string)
const form = ref<StoredForm | null>(null)
const loadingForm = ref(true)

const {
  state, formTypeItems, roleItems, userItems, assignedRolesModel,
  fieldEditorOpen, editingField, fieldTypeLabel,
  openNewField, editField, onFieldSave, removeField, buildAssignedTo,
} = useFormEditor()

const saving = ref(false)
const deleting = ref(false)
const error = ref('')
const deleteModalOpen = ref(false)

function assignFromForm(f: StoredForm) {
  state.title = f.title
  state.description = f.description ?? ''
  state.type = f.type as FormTypeDb
  state.is_active = f.is_active
  const a = f.assigned_to as { roles?: string[]; user_ids?: string[] } | null
  state.assigned_roles = a?.roles ?? []
  state.assigned_user_ids = a?.user_ids ?? []
  state.fields = Array.isArray(f.fields) ? (f.fields as FormField[]) : []
}

async function onSubmit() {
  error.value = ''
  if (!formId.value || !state.title || !state.type) return
  saving.value = true
  try {
    await formsStore.updateForm(formId.value, {
      title: state.title,
      description: state.description || null,
      type: state.type,
      is_active: state.is_active,
      fields: state.fields,
      assigned_to: buildAssignedTo(),
    })
    toast.add({ title: 'Questionnaire enregistré', color: 'success', icon: 'i-lucide-check' })
    await router.push('/forms')
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Erreur'
    error.value = msg
    toast.add({ title: 'Erreur', description: msg, color: 'error', icon: 'i-lucide-alert-circle' })
  } finally {
    saving.value = false
  }
}

async function doDelete() {
  if (!formId.value) return
  deleting.value = true
  try {
    await formsStore.deleteForm(formId.value)
    deleteModalOpen.value = false
    toast.add({ title: 'Questionnaire supprimé', color: 'success', icon: 'i-lucide-check' })
    await router.push('/forms')
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Erreur'
    toast.add({ title: 'Erreur', description: msg, color: 'error', icon: 'i-lucide-alert-circle' })
  } finally {
    deleting.value = false
  }
}

onMounted(async () => {
  await useUsersStore().fetchUsers()
  const f = await formsStore.fetchFormById(formId.value)
  form.value = f
  if (f) assignFromForm(f)
  loadingForm.value = false
})
</script>
