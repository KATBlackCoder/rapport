/**
 * Types pour les questionnaires (forms) et champs dynamiques.
 * Alignés avec forms.fields (jsonb) et assigned_to (jsonb).
 */

export type FormFieldType =
  | 'text_short'
  | 'text_long'
  | 'number'
  | 'phone'
  | 'date'
  | 'time'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'photo'

export type ConditionOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'filled'
  | 'empty'

export type ConditionLogicalOperator = 'and' | 'or'

export interface ConditionRule {
  field_id: string
  operator: ConditionOperator
  value?: string | number | boolean
}

export interface FormFieldConditions {
  operator: ConditionLogicalOperator
  rules: ConditionRule[]
}

export interface FormField {
  id: string
  label: string
  type: FormFieldType
  required: boolean
  options?: { label: string; value: string }[]
  conditions?: FormFieldConditions
}

export interface AssignedTo {
  roles?: string[]
  user_ids?: string[]
}

export type FormTypeDb = 'daily' | 'urgent'

export const FORM_TYPE_LABELS: Record<FormTypeDb, string> = {
  daily: 'Journalier',
  urgent: 'Urgent',
}

export const FIELD_TYPE_LABELS: Record<FormFieldType, string> = {
  text_short: 'Texte court',
  text_long: 'Texte long',
  number: 'Nombre',
  phone: 'Téléphone',
  date: 'Date',
  time: 'Heure',
  select: 'Liste déroulante',
  radio: 'Choix unique (radio)',
  checkbox: 'Choix multiple (checkbox)',
  photo: 'Photo',
}

export const CONDITION_OPERATOR_LABELS: Record<ConditionOperator, string> = {
  equals: 'est égal à',
  not_equals: 'est différent de',
  contains: 'contient',
  filled: 'est rempli',
  empty: 'est vide',
}
