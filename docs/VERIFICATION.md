# Vérification de l'implémentation — MCP & Skills

**Date :** 2026-03-01  
**Sources :** Nuxt MCP, Nuxt UI MCP, Supabase MCP, skills nuxt-ui

---

## ✅ Supabase MCP — Projet Orange Rapport (cjiuhgrfwdkyocdczove)

| Élément | Statut | Détail |
|---------|--------|--------|
| Projet | ✅ ACTIVE_HEALTHY | eu-central-1, Postgres 17.6 |
| **Tables** | ✅ 9/9 | zones, localities, users, user_privileges, forms, submissions, submission_rows, submission_history, notifications |
| **RLS** | ✅ Activé | Sur toutes les tables |
| **Zones** | ✅ 9 lignes | Bamako, Gao, Kayes, Kidal, Koulikoro, Mopti, Segou, Sikasso, Timbuktu |
| **Localités** | ✅ 32 lignes | Seed Bamako + autres zones |
| **Enums** | ✅ | user_role, user_privilege, form_type, submission_status, notification_type |
| **Géoloc V2** | ✅ | latitude, longitude, accuracy dans submission_rows |
| **Fonctions RPC** | ✅ | get_my_role, has_privilege |

---

## ✅ Nuxt UI (réf. docs MCP)

| Élément | Attendu (docs) | Implémenté | Statut |
|---------|----------------|------------|--------|
| Module | `@nuxt/ui` dans nuxt.config | ✅ `modules: ['@nuxt/ui']` | OK |
| CSS | `@import "tailwindcss"; @import "@nuxt/ui";` | ✅ `app/assets/css/main.css` | OK |
| Config | `css: ['~/assets/css/main.css']` | ✅ | OK |
| UApp | Wrapper requis pour Toast, Tooltip, overlays | ✅ `<UApp><UMain><NuxtLayout><NuxtPage /></NuxtLayout></UMain></UApp>` | OK |
| UMain | Optionnel, remplit la hauteur viewport | ✅ Utilisé | OK |
| Composants | UAlert testé sur index | ✅ `pages/index.vue` | OK |

---

## ✅ Nuxt 4

| Élément | Statut |
|---------|--------|
| Modules : Supabase, Pinia, PWA, UI | OK |
| Arborescence app/ (pages, layouts, components, composables, stores) | OK |
| server/ (api, middleware) | OK |
| Plugins client (01. persistedstate, 02. auth) | OK |

---

## ✅ Pinia & Stores

| Store | Persist | Typage | Statut |
|-------|---------|--------|--------|
| auth | ✅ localStorage | UserRow | OK |
| permissions | — | UserRole, UserPrivilege | OK |
| forms | ✅ localStorage | StoredForm | OK |
| submissions | ✅ localStorage | PendingSubmission | OK |
| notifications | — | NotificationRow | OK |
| geo | — | ZoneRow, LocalityRow | OK |

---

## ✅ Composable usePermissions

Méthodes exposées (BRIEF) : `canCreateUser`, `canSendBack`, `canViewResponses`, `canManageForms`, `canExportCollectif`, `canSeeUser`, `canGrantPrivilege` — toutes implémentées.

---

## ✅ Build & TypeCheck

- `pnpm run build` : succès
- `nuxi typecheck` : succès

---

## Recommandations (non bloquantes)

1. **Palette BRIEF** : Configurer `app.config.ts` avec `ui: { colors: { primary: 'green', ... } }` pour la palette (#1B5E20, #F57C00, etc.).
2. **Layout** : Le layout `default.vue` utilise `<slot />` ; vérifier que le contenu des pages s’affiche correctement.
3. **AuthForm** : Nuxt UI propose `UAuthForm` pour login/register ; à envisager pour la tâche 01-auth.
