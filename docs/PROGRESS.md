# PROGRESS — État d'avancement

## 2025-03-01

### Tâches créées

- Création du dossier `tasks/` et de l’ensemble des fiches de tâches à partir de `docs/BRIEF.md`.
- Fichiers : `README.md` (index et ordre), `00-infrastructure.md` à `09-v2-geo.md`.
- Ordre MVP respecté : Infra → Auth → Référentiels → Users → Forms → Filling → Submissions → Analytics → PWA/UI → V2 (archi).

### Prochaine étape

- Démarrer par `tasks/00-infrastructure.md` (projet Nuxt, schéma Supabase, stores Pinia, usePermissions).

---

## 2026-03-01

### Infrastructure (00) — Implémenté

- **Arborescence** : `app/components/`, `app/composables/`, `app/stores/`, `server/api/`, `server/middleware/`
- **Plugin Pinia persistedstate** : `app/plugins/01.pinia-persistedstate.client.ts`
- **Plugin auth** : `app/plugins/02.auth.client.ts` (sync Supabase Auth → stores)
- **Stores** : auth, permissions, forms, submissions, notifications, geo (typés TypeScript)
- **Composable** : `usePermissions()` (canCreateUser, canSendBack, canViewResponses, canManageForms, canExportCollectif, canSeeUser, canGrantPrivilege)
- **Persistence** : auth, forms, submissions (persistedstate)

### Prochaine étape

- `tasks/01-auth.md` : page login, changement mot de passe obligatoire, middleware

### 00-infrastructure — Complété (suite)

- **nuxt.config** : TypeScript strict, routeRules SPA (/login, /change-password), storesDirs
- **Migrations Supabase** : `supabase/migrations/` (schema, seed geo, storage policies)
- **Page index** : exemple usePermissions() avec v-if (Dashboard, Utilisateurs, Questionnaires)
