<template>
  <USlideover
    v-model:open="isOpen"
    title="Édition du champ"
    description="Label, type, options et conditions d'affichage."
    :ui="{ body: 'overflow-y-auto' }"
  >
    <template #body>
      <div class="space-y-5 p-4">
        <UFormField label="Label" required>
          <UInput v-model="local.label" placeholder="Ex: Nom du client" autofocus class="w-full" />
        </UFormField>

        <UFormField label="Type de champ" required>
          <USelect
            v-model="local.type"
            :items="fieldTypeItems"
            placeholder="Choisir un type"
            class="w-full"
            :ui="{ content: 'min-w-max' }"
          />
        </UFormField>

        <UFormField label="Requis">
          <UCheckbox v-model="local.required" label="Ce champ est obligatoire" />
        </UFormField>

        <template v-if="hasOptions">
          <UFormField label="Options (liste déroulante / radio / cases)">
            <div class="space-y-2">
              <div
                v-for="(opt, idx) in local.options"
                :key="idx"
                class="flex gap-2 items-center"
              >
                <UInput v-model="opt.label" placeholder="Libellé" class="flex-1" />
                <UInput v-model="opt.value" placeholder="Valeur" class="w-28" />
                <UButton
                  icon="i-lucide-trash-2"
                  variant="ghost"
                  color="error"
                  size="xs"
                  aria-label="Supprimer"
                  @click="removeOption(idx)"
                />
              </div>
              <UButton
                variant="outline"
                size="sm"
                icon="i-lucide-plus"
                label="Ajouter une option"
                @click="addOption"
              />
            </div>
          </UFormField>
        </template>

        <div>
          <p class="text-sm font-medium text-highlighted mb-2">Afficher ce champ SI</p>
          <USelect
            v-model="conditionsOperator"
            :items="[
              { label: 'Toutes les conditions (ET)', value: 'and' },
              { label: 'Au moins une condition (OU)', value: 'or' },
            ]"
            class="w-full mb-3"
            :ui="{ content: 'min-w-max' }"
          />
          <div class="space-y-2">
            <div
              v-for="(rule, idx) in local.conditions?.rules ?? []"
              :key="idx"
              class="flex flex-wrap gap-2 items-center p-2 rounded-lg bg-elevated"
            >
              <USelect
                v-model="rule.field_id"
                :items="sourceFieldItems"
                placeholder="Champ source"
                class="min-w-32"
                :ui="{ content: 'min-w-max' }"
              />
              <USelect
                v-model="rule.operator"
                :items="operatorItems"
                placeholder="Opérateur"
                class="min-w-36"
                :ui="{ content: 'min-w-max' }"
              />
              <UInput
                v-if="rule.operator !== 'filled' && rule.operator !== 'empty'"
                v-model="rule.value as string"
                placeholder="Valeur"
                class="min-w-24"
              />
              <UButton
                icon="i-lucide-trash-2"
                variant="ghost"
                color="error"
                size="xs"
                aria-label="Supprimer"
                @click="removeRule(idx)"
              />
            </div>
            <UButton
              variant="outline"
              size="sm"
              icon="i-lucide-plus"
              label="Ajouter une condition"
              :disabled="sourceFieldItems.length === 0"
              @click="addRule"
            />
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2 w-full">
        <UButton variant="ghost" label="Annuler" @click="close" />
        <UButton
          color="primary"
          label="Enregistrer"
          icon="i-lucide-check"
          :disabled="!local.label || !local.type"
          @click="save"
        />
      </div>
    </template>
  </USlideover>
</template>

<script setup lang="ts">
import type { FormField, FormFieldType, ConditionLogicalOperator } from '~/types/forms'
import { FIELD_TYPE_LABELS, CONDITION_OPERATOR_LABELS } from '~/types/forms'

const props = defineProps<{
  open: boolean
  field: FormField | null
  otherFields: FormField[]
}>()

const emit = defineEmits<{
  'update:open': [v: boolean]
  save: [field: FormField]
}>()

const isOpen = computed({
  get: () => props.open,
  set: (v) => emit('update:open', v),
})

const fieldTypeItems = Object.entries(FIELD_TYPE_LABELS).map(([value, label]) => ({ label, value }))
const operatorItems = Object.entries(CONDITION_OPERATOR_LABELS).map(([value, label]) => ({ label, value }))

const local = ref<FormField>({
  id: '',
  label: '',
  type: 'text_short',
  required: false,
  options: [],
  conditions: { operator: 'and', rules: [] },
})

const conditionsOperator = computed({
  get: () => local.value.conditions?.operator ?? 'and',
  set: (v: 'and' | 'or') => {
    if (!local.value.conditions) local.value.conditions = { operator: 'and', rules: [] }
    local.value.conditions.operator = v
  },
})

const hasOptions = computed(() =>
  ['select', 'radio', 'checkbox'].includes(local.value.type)
)

const sourceFieldItems = computed(() =>
  props.otherFields
    .filter((f) => f.id !== props.field?.id && f.label)
    .map((f) => ({ label: f.label, value: f.id }))
)

function addOption() {
  if (!local.value.options) local.value.options = []
  local.value.options.push({ label: '', value: '' })
}

function removeOption(idx: number) {
  local.value.options?.splice(idx, 1)
}

function addRule() {
  if (!local.value.conditions) local.value.conditions = { operator: 'and', rules: [] }
  const firstId = props.otherFields.find((f) => f.id !== props.field?.id)?.id ?? ''
  local.value.conditions.rules.push({ field_id: firstId, operator: 'equals', value: '' })
}

function removeRule(idx: number) {
  local.value.conditions?.rules.splice(idx, 1)
}

function close() {
  emit('update:open', false)
}

function save() {
  if (!local.value.label || !local.value.type) return
  const out: FormField = {
    ...local.value,
    options: hasOptions.value ? (local.value.options?.filter((o) => o.label || o.value) ?? []) : undefined,
    conditions:
      local.value.conditions?.rules?.length
        ? { operator: local.value.conditions.operator, rules: local.value.conditions.rules }
        : undefined,
  }
  emit('save', out)
  close()
}

watch(
  () => [props.open, props.field] as const,
  ([open, field]) => {
    if (open && field) {
      local.value = {
        id: field.id,
        label: field.label,
        type: field.type as FormFieldType,
        required: field.required ?? false,
        options: field.options ? [...field.options] : [],
        conditions: field.conditions
          ? {
              operator: field.conditions.operator as ConditionLogicalOperator,
              rules: field.conditions.rules.map((r) => ({ ...r })),
            }
          : { operator: 'and' as ConditionLogicalOperator, rules: [] },
      }
    }
  },
  { immediate: true }
)
</script>
