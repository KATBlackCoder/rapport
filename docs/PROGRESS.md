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
- **Composable** : `usePermissions()` (canCreateUser, canSendBack, canViewResponses, canManageForms, canExportCollectif, canSeeUser, canGrantPrivilege, canManageGeo)
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

### Référentiels géographiques (02) — Implémenté

- **Migration RLS** : `20260303000000_zones_localities_rls_admin.sql` — INSERT/UPDATE/DELETE zones et localities réservés à admin et super_admin
- **usePermissions** : `canManageGeo()` — accès admin et super_admin
- **Store geo** : CRUD (createZone, updateZone, deleteZone, createLocality, updateLocality, deleteLocality), chargement au login via plugin auth
- **Pages** : `/parametres` (index), `/parametres/zones-localites` (CRUD zones et localités)
- **Middleware** : `parametres.ts` — redirection si rôle non admin/super_admin
- **UI** : UTable zones et localités, UModal create/edit/delete, USelect filtre par zone, toasts feedback
- **Navigation** : carte Paramètres sur index (v-if canManageGeo), lien Paramètres dans menu utilisateur

### CRUD Utilisateurs (03) — Implémenté

- **Migration RLS** : `20260304000000_users_rls.sql` — lecture hiérarchie (can_see_user), UPDATE users/user_privileges selon privilèges
- **API serveur** : `server/api/users/create.post.ts` — création via Supabase Auth admin (service role), validation create_user + rôle strictement inférieur
- **Store users** : fetchUsers (filtres), createUser, updateUser, grantPrivilege, revokePrivilege, fetchUserPrivileges
- **Pages** : `/users` (liste + filtres rôle/zone/localité/actif), `/users/create` (formulaire + privilèges optionnels), `/users/[userId]` (édition rôle, privilèges, désactivation)
- **Middleware** : `users.ts` — accès si create_user (super_admin, admin, ou privilège accordé)
- **usePermissions** : canModifyRole(), canDisableUser() — super_admin et admin uniquement
- **Règles métier** : username = prenom@telephone.org, mot de passe = ML+phone, privilèges accordés uniquement si possédés

### CRUD Questionnaires (04) — Implémenté

- **Types** : `app/types/forms.ts` — FormField, FormFieldType, ConditionOperator, FormFieldConditions, AssignedTo, FORM_TYPE_LABELS, FIELD_TYPE_LABELS, CONDITION_OPERATOR_LABELS
- **Migration RLS** : `supabase/migrations/20260304000001_forms_rls.sql` — SELECT (admin voit tout, autres par assigned_to), INSERT/UPDATE/DELETE réservés à super_admin et admin
- **Composable** : `useFormConditions(fields, formData)` et `useFormConditionsCleanData()` — évaluation des conditions d’affichage et nettoyage des valeurs masquées
- **Store forms** : fetchForms, fetchFormById, createForm, updateForm, deleteForm, filtres type (daily/urgent) et actif, persistance offline
- **Pages** : `/forms` (liste, filtres type/actif, bouton Créer si canManageForms), `/forms/create` (builder), `/forms/[formId]` (édition + suppression)
- **Builder** : drag & drop (vue-draggable-plus), métadonnées (title, description, type journalier|urgent, is_active), assignation par rôles et utilisateurs (assigned_to)
- **Champs** : types texte court/long, nombre, téléphone, date, heure, select, radio, checkbox, photo ; label, required, options pour listes
- **Logique conditionnelle** : « Afficher ce champ SI » — champ source, opérateur (égal, différent, contient, rempli, vide), ET/OU, stockage dans `fields[].conditions`
- **Composant** : `app/components/forms/FormFieldEditor.vue` — édition champ (label, type, options, conditions) dans USlideover
- **Navigation** : lien Questionnaires visible pour tous les utilisateurs authentifiés (liste filtrée par RLS) ; Créer/Modifier/Supprimer réservés aux admins

### Prochaine étape

- `tasks/05-filling.md` : remplissage des questionnaires (utilisation de useFormConditions côté remplissage)

### 00-infrastructure — Complété (suite)

- **nuxt.config** : TypeScript strict, routeRules SPA (/login, /change-password), storesDirs
- **Migrations Supabase** : `supabase/migrations/` (schema, seed geo, storage policies)
- **Page index** : exemple usePermissions() avec v-if (Dashboard, Utilisateurs, Questionnaires)
