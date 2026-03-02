# 00 — Infrastructure

**Statut :** Terminé  
**Réf. BRIEF :** Stack technique, Structure DB, Stores Pinia

## Objectif

Mettre en place l’arborescence Nuxt 4, le schéma Supabase complet (RLS, Storage, seed), et les stores Pinia de base.

---

## 0.1 Projet Nuxt 4

- [x] Vérifier/ajuster `nuxt.config.ts` : mode SPA/SSR hybride, modules (Supabase, Pinia, PWA, UI)
- [x] Arborescence complète : `app/` (pages, layouts, components, composables, stores), `server/` (api, middleware), `assets/`
- [x] TypeScript strict, Composition API partout
- [x] Dépendances : `@nuxtjs/supabase`, `@pinia/nuxt`, `pinia-plugin-persistedstate`, `@vite-pwa/nuxt`, `@nuxt/ui`, `vue-chartjs`, `chart.js`, `xlsx`, `vue-draggable-plus`, `browser-image-compression`, `idb`
- [x] Variables d’environnement : `SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_SECRET_KEY` (cf. `docs/SUPABASE.md`)
- [x] Fichier `app/types/database.types.ts` : types générés (ou `supabase gen types typescript` → ce fichier)

---

## 0.2 Schéma SQL Supabase

- [x] Tables : `zones`, `localities`, `users`, `user_privileges`, `forms`, `submissions`, `submission_rows`, `submission_history`, `notifications`
- [x] Enums : rôles, privilèges, form_type, submission_status, notification_type
- [x] Colonnes géoloc V2 dans `submission_rows` : `latitude`, `longitude`, `accuracy` (nullable)
- [x] RLS activé sur toutes les tables ; politiques selon rôles et privilèges (visibilité, CRUD)
- [x] Bucket Storage `submissions` (privé), politiques RLS : upload auth, lecture via URLs signées
- [x] Seed : zones maliennes (Bamako, Ségou, Sikasso, etc.), localités Bamako (Lafiabougou, Hamdalaye, etc.)

---

## 0.3 Stores Pinia

- [x] `stores/auth.ts` : utilisateur connecté, rôle, `must_change_password`, méthodes login/logout/changePassword
- [x] `stores/permissions.ts` : logique centralisée des privilèges (défaut + `user_privileges`), alimente le composable
- [x] `stores/forms.ts` : questionnaires assignés à l’utilisateur, cache offline (persistedstate)
- [x] `stores/submissions.ts` : soumissions en cours, file d’attente offline
- [x] `stores/notifications.ts` : notifications non lues
- [x] `stores/geo.ts` : zones et localités chargées une fois (référentiel)
- [x] Typage TypeScript pour chaque store
- [x] Enregistrer `pinia-plugin-persistedstate` (plugin Nuxt ou `pinia.use()`)
- [x] Persistence : `auth` (session), `forms`, `submissions` pour offline

---

## 0.4 Composables de base

- [x] `composables/usePermissions.ts` : alimenté par `permissions` store, expose `canCreateUser()`, `canSendBack()`, `canViewResponses()`, `canManageForms()`, `canExportCollectif()`, `canSeeUser(targetUser)`, `canGrantPrivilege(privilege)`
- [x] Utilisation cohérente avec `v-if` (jamais `v-show`) pour tout élément conditionné au rôle/privilège

---

## Livrables

- Repo prêt pour le développement module par module
- Supabase migré avec RLS et seed géographique
- Stores et `usePermissions()` utilisables dans les pages suivantes
