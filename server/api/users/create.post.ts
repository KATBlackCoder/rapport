/**
 * Création d'un utilisateur via Supabase Auth admin + table users.
 * Règles : create_user, rôle strictement inférieur, username = prenom@telephone.org, password = ML+phone
 */
import { serverSupabaseClient, serverSupabaseServiceRole } from '#supabase/server'
import { z } from 'zod'
import type { Database } from '~/types/database.types'

type UserRole = Database['public']['Enums']['user_role']
type UserPrivilege = Database['public']['Enums']['user_privilege']

const ROLE_ORDER: UserRole[] = [
  'super_admin',
  'admin',
  'manager',
  'superviseur',
  'employe',
]

const CreateUserSchema = z.object({
  first_name: z.string().min(1, 'Prénom requis'),
  last_name: z.string().min(1, 'Nom requis'),
  phone: z.string().min(1, 'Téléphone requis').regex(/^\d+$/, 'Téléphone : chiffres uniquement'),
  email: z.string().email().optional().or(z.literal('')),
  role: z.enum(['admin', 'manager', 'superviseur', 'employe']),
  zone_id: z.string().uuid().optional().nullable(),
  locality_id: z.string().uuid().optional().nullable(),
  supervisor_id: z.string().uuid().optional().nullable(),
  privileges: z.array(z.enum(['create_user', 'send_back', 'view_responses'])).optional().default([]),
})

type CreateUserPayload = z.output<typeof CreateUserSchema>

function roleOrder(r: UserRole): number {
  const idx = ROLE_ORDER.indexOf(r)
  return idx >= 0 ? idx : 999
}

function isStrictlyBelow(myRole: UserRole, targetRole: UserRole): boolean {
  return roleOrder(myRole) < roleOrder(targetRole)
}

function hasPrivilege(
  role: UserRole,
  granted: UserPrivilege[],
  privilege: UserPrivilege
): boolean {
  const defaults: Record<UserRole, UserPrivilege[]> = {
    super_admin: ['create_user', 'send_back', 'view_responses'],
    admin: ['create_user', 'send_back', 'view_responses'],
    manager: ['view_responses'],
    superviseur: [],
    employe: [],
  }
  const all = new Set([...(defaults[role] ?? []), ...granted])
  return all.has(privilege)
}

export default defineEventHandler(async (event) => {
  const supabaseClient = await serverSupabaseClient(event)
  const { data: { user } } = await supabaseClient.auth.getUser()
  if (!user) {
    throw createError({ statusCode: 401, message: 'Non authentifié' })
  }

  const raw = await readBody(event)
  const body = CreateUserSchema.parse(raw) as CreateUserPayload
  const creatorId = user.id

  const supabaseAdmin = serverSupabaseServiceRole(event)

  // Charger le créateur (role + privileges)
  const { data: creator, error: creatorErr } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('id', creatorId)
    .single()

  if (creatorErr || !creator) {
    throw createError({ statusCode: 403, message: 'Profil créateur introuvable' })
  }

  const { data: creatorPrivs } = await supabaseAdmin
    .from('user_privileges')
    .select('privilege')
    .eq('user_id', creatorId)
  const grantedPrivs = (creatorPrivs ?? []).map((p: { privilege: UserPrivilege }) => p.privilege)

  if (!hasPrivilege(creator.role as UserRole, grantedPrivs, 'create_user')) {
    throw createError({ statusCode: 403, message: 'Privilège create_user requis' })
  }

  if (!isStrictlyBelow(creator.role as UserRole, body.role as UserRole)) {
    throw createError({
      statusCode: 400,
      message: 'On ne peut créer que des comptes de rôle strictement inférieur',
    })
  }

  // Vérifier qu'on n'accorde que des privilèges qu'on possède
  for (const p of body.privileges ?? []) {
    if (!hasPrivilege(creator.role as UserRole, grantedPrivs, p)) {
      throw createError({
        statusCode: 400,
        message: `Vous ne pouvez pas accorder le privilège ${p}`,
      })
    }
  }

  const prenom = body.first_name
    .trim()
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
  const username = `${prenom}@${body.phone}.org`
  const defaultPassword = `ML${body.phone}`

  const { data: authUser, error: authErr } = await supabaseAdmin.auth.admin.createUser({
    email: username,
    password: defaultPassword,
    email_confirm: true,
  })

  if (authErr) {
    if (authErr.message.includes('already been registered')) {
      throw createError({
        statusCode: 400,
        message: 'Un compte existe déjà avec ce téléphone ou ce format d\'identifiant',
      })
    }
    throw createError({
      statusCode: 500,
      message: authErr.message || 'Erreur création compte',
    })
  }

  if (!authUser.user) {
    throw createError({ statusCode: 500, message: 'Création échouée' })
  }

  const userInsert = {
    id: authUser.user.id,
    username,
    first_name: body.first_name.trim(),
    last_name: body.last_name.trim(),
    phone: body.phone,
    email: body.email?.trim() || null,
    zone_id: body.zone_id || null,
    locality_id: body.locality_id || null,
    role: body.role,
    supervisor_id: body.supervisor_id || null,
    must_change_password: true,
    is_active: true,
    created_by: creatorId,
  }

  const { data: dbUser, error: dbErr } = await supabaseAdmin
    .from('users')
    .insert(userInsert)
    .select()
    .single()

  if (dbErr) {
    await supabaseAdmin.auth.admin.deleteUser(authUser.user.id)
    throw createError({
      statusCode: 500,
      message: dbErr.message || 'Erreur enregistrement profil',
    })
  }

  // Accorder les privilèges optionnels
  const privs = body.privileges ?? []
  if (privs.length > 0) {
    await supabaseAdmin.from('user_privileges').insert(
      privs.map((privilege) => ({
        user_id: dbUser.id,
        privilege,
        granted_by: creatorId,
      }))
    )
  }

  setResponseStatus(event, 201)
  return {
    user: dbUser,
    message: `Utilisateur créé. Identifiant : ${username} — Mot de passe temporaire : ML + numéro de téléphone`,
  }
})
