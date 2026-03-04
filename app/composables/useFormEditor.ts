/**
 * Logique partagée entre /forms/create et /forms/[formId].
 * Gère l'état du builder, l'édition des champs et l'assignation.
 */
import type { CheckboxGroupItem } from '@nuxt/ui'
import type { FormField, FormTypeDb } from '~/types/forms'
import { FORM_TYPE_LABELS, FIELD_TYPE_LABELS } from '~/types/forms'
import { useUsersStore } from '~/stores/users'

export interface FormEditorState {
  title: string
  description: string
  type: FormTypeDb
  is_active: boolean
  assigned_roles: string[]
  assigned_user_ids: string[]
  fields: FormField[]
}

export function useFormEditor() {
  const usersStore = useUsersStore()

  const state = reactive<FormEditorState>({
    title: '',
    description: '',
    type: 'daily',
    is_active: true,
    assigned_roles: [],
    assigned_user_ids: [],
    fields: [],
  })

  const formTypeItems = [
    { label: FORM_TYPE_LABELS.daily, value: 'daily' },
    { label: FORM_TYPE_LABELS.urgent, value: 'urgent' },
  ]

  const roleItems: CheckboxGroupItem[] = [
    { label: 'Employé', value: 'employe' },
    { label: 'Superviseur', value: 'superviseur' },
    { label: 'Manager', value: 'manager' },
    { label: 'Admin', value: 'admin' },
  ]

  const userItems = computed(() =>
    usersStore.users.map((u) => ({
      label: `${u.first_name} ${u.last_name}`,
      value: u.id,
    }))
  )

  // Proxy typed pour UCheckboxGroup (v-model attend (string | undefined)[])
  const assignedRolesModel = computed<(string | undefined)[]>({
    get: () => state.assigned_roles,
    set: (v) => { state.assigned_roles = (v ?? []).filter(Boolean) as string[] },
  })

  const fieldEditorOpen = ref(false)
  const editingField = ref<FormField | null>(null)

  function fieldTypeLabel(type: string) {
    return FIELD_TYPE_LABELS[type as keyof typeof FIELD_TYPE_LABELS] ?? type
  }

  function newId() {
    return crypto.randomUUID?.() ?? `f_${Date.now()}_${Math.random().toString(36).slice(2)}`
  }

  function openNewField() {
    editingField.value = {
      id: newId(),
      label: '',
      type: 'text_short',
      required: false,
      options: [],
      conditions: { operator: 'and', rules: [] },
    }
    fieldEditorOpen.value = true
  }

  function editField(field: FormField) {
    editingField.value = { ...field, options: field.options ? [...field.options] : [] }
    if (field.conditions) {
      editingField.value.conditions = {
        operator: field.conditions.operator,
        rules: field.conditions.rules.map((r) => ({ ...r })),
      }
    }
    fieldEditorOpen.value = true
  }

  function onFieldSave(field: FormField) {
    const idx = state.fields.findIndex((f) => f.id === field.id)
    if (idx >= 0) {
      state.fields[idx] = field
    } else {
      state.fields.push(field)
    }
    editingField.value = null
  }

  function removeField(id: string) {
    state.fields = state.fields.filter((f) => f.id !== id)
  }

  function buildAssignedTo() {
    return {
      roles: state.assigned_roles.filter(Boolean),
      user_ids: state.assigned_user_ids.filter(Boolean),
    }
  }

  return {
    state,
    formTypeItems,
    roleItems,
    userItems,
    assignedRolesModel,
    fieldEditorOpen,
    editingField,
    fieldTypeLabel,
    openNewField,
    editField,
    onFieldSave,
    removeField,
    buildAssignedTo,
  }
}
