/**
 * Composable useFormConditions : évalue les conditions d'affichage des champs
 * en temps réel à partir de formData. Utilisé côté remplissage pour v-if et
 * pour effacer les valeurs des champs dont la condition n'est pas satisfaite.
 */
import type { FormField, FormFieldConditions, ConditionOperator } from '~/types/forms'

export type FormDataRecord = Record<string, unknown>

function getFieldValue(formData: FormDataRecord, fieldId: string): unknown {
  const v = formData[fieldId]
  if (v === undefined || v === null) return null
  if (typeof v === 'string' && v.trim() === '') return null
  return v
}

function evaluateRule(
  formData: FormDataRecord,
  fieldId: string,
  operator: ConditionOperator,
  value?: string | number | boolean
): boolean {
  const actual = getFieldValue(formData, fieldId)
  const strActual = actual != null ? String(actual) : ''
  const hasValue = actual !== null && actual !== undefined && strActual !== ''

  switch (operator) {
    case 'equals':
      return actual === value || strActual === String(value ?? '')
    case 'not_equals':
      return actual !== value && strActual !== String(value ?? '')
    case 'contains':
      return typeof strActual === 'string' && typeof value === 'string' && strActual.includes(value)
    case 'filled':
      return hasValue
    case 'empty':
      return !hasValue
    default:
      return false
  }
}

function evaluateConditions(formData: FormDataRecord, conditions: FormFieldConditions): boolean {
  if (!conditions.rules?.length) return true
  const results = conditions.rules.map((r) =>
    evaluateRule(formData, r.field_id, r.operator, r.value)
  )
  if (conditions.operator === 'or') return results.some(Boolean)
  return results.every(Boolean)
}

/**
 * Retourne un objet { [fieldId]: boolean } indiquant si le champ doit être affiché.
 * Si la condition n'est pas satisfaite, le champ est masqué et sa valeur doit être ignorée/effacée.
 */
export function useFormConditions(
  fields: FormField[],
  formData: FormDataRecord
): Record<string, boolean> {
  const visible: Record<string, boolean> = {}
  for (const field of fields) {
    if (!field.conditions?.rules?.length) {
      visible[field.id] = true
      continue
    }
    visible[field.id] = evaluateConditions(formData, field.conditions)
  }
  return visible
}

/**
 * Retourne formData nettoyé : les champs dont la condition n'est pas satisfaite
 * sont retirés (pour éviter données fantômes à l'envoi).
 */
export function useFormConditionsCleanData(
  fields: FormField[],
  formData: FormDataRecord
): FormDataRecord {
  const visible = useFormConditions(fields, formData)
  const out: FormDataRecord = {}
  for (const [key, val] of Object.entries(formData)) {
    const field = fields.find((f) => f.id === key)
    if (!field) {
      out[key] = val
      continue
    }
    if (visible[key] !== false) out[key] = val
  }
  return out
}
