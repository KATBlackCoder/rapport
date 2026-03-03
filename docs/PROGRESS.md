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

### Authentification (01) — Implémenté

- **Page login** : `app/pages/login.vue` — username (prenom@telephone.org) + mot de passe, pas d'inscription
- **Page change-password** : `app/pages/change-password.vue` — obligatoire au premier login
- **Middleware auth** : `app/middleware/auth.global.ts` — session Supabase + must_change_password
- **Store auth** : login, logout, changePassword, fetchUserProfile (déjà en place, ajusté)

### Design & Layout — Amélioré

- **Composants** : AppLogo, AuthCard, PageHeader, BottomNav
- **Layouts** : default (UHeader, UContainer, menu user, BottomNav mobile), auth (gradient brand, centré)
- **Index** : grille de cartes par module (Dashboard, Utilisateurs, Questionnaires), design system Nuxt UI
- **Auth** : login et change-password partagent le même design (AuthCard, layout auth)
- **Transitions** : page (Transition name="page"), composants (fade-in-up sur cartes auth et index)
- **Bottom Navigation** : visible uniquement sur mobile (`md:hidden`), liens Accueil/Dashboard/Utilisateurs/Questionnaires selon usePermissions
- **Design system** : `.auth-logo-inverted` et `.fade-in-up` dans `main.css`, réduction du Tailwind hardcodé

### Prochaine étape

- `tasks/02-referentiels.md` : zones et localités

### 00-infrastructure — Complété (suite)

- **nuxt.config** : TypeScript strict, routeRules SPA (/login, /change-password), storesDirs
- **Migrations Supabase** : `supabase/migrations/` (schema, seed geo, storage policies)
- **Page index** : exemple usePermissions() avec v-if (Dashboard, Utilisateurs, Questionnaires)
