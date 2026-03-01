⚙️ Configuration Supabase — Guide complet

--------------------------------------------
🔷 ÉTAPE 1 — Créer le projet

1. Va sur https://supabase.com
2. Clique "Start your project"
3. Connecte-toi avec GitHub (recommandé)
4. Clique "New project"
5. Remplis :
   - Name        : nom-de-ton-app
   - Password    : génère un mot de passe fort
                   (SAUVEGARDE-LE précieusement)
   - Region      : Europe West (le plus proche du Mali)
   - Plan        : Free pour commencer
6. Attends 2-3 minutes que le projet se crée

--------------------------------------------
🔷 ÉTAPE 2 — Récupérer les clés API

Dans ton dashboard Supabase :
Settings → API

Tu auras besoin de :
┌─────────────────────────────────────────────────┐
│ Project URL      → https://xxxxx.supabase.co    │
│ anon public key  → eyJxxx... (clé publique)     │
│ service_role key → eyJxxx... (⚠️ SECRÈTE)       │
└─────────────────────────────────────────────────┘

⚠️ La service_role key ne va JAMAIS dans le frontend
   Elle sert uniquement côté serveur (Nuxt server/)

--------------------------------------------
🔷 ÉTAPE 3 — Variables d'environnement Nuxt

Crée le fichier .env à la racine de ton projet :
# .env

SUPABASE_URL= # URL de ton projet Supabase
SUPABASE_KEY= # Clé publique de ton projet Supabase
SUPABASE_SERVICE_KEY= # Clé secrète de ton projet Supabase

Dans nuxt.config.ts :

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@vite-pwa/nuxt'
  ],
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_KEY,
    redirect: false  // on gère les redirections manuellement
  }
})
```

--------------------------------------------

### 🔷 ÉTAPE 4 — Configurer l'Auth Supabase
```
Dans Supabase Dashboard :
Authentication → Providers

✅ Activer : Email (déjà actif par défaut)
❌ Désactiver TOUT le reste :
   Google, GitHub, Discord, etc.
   (ton app = login interne uniquement)

Authentication → Email Templates
→ Désactiver "Confirm email" car pas d'emails prévus

Authentication → URL Configuration
→ Site URL : https://ton-app.vercel.app
→ Redirect URLs : https://ton-app.vercel.app/**

Authentication → Settings
→ Désactiver "Enable email confirmations"
→ Désactiver "Enable phone confirmations"
```

--------------------------------------------

### 🔷 ÉTAPE 5 — Créer les tables SQL
```
Dans Supabase Dashboard :
SQL Editor → New query

Colle et exécute le schéma SQL généré par Cursor
(depuis le BRIEF.md) dans cet ordre :
  1. Extensions et types enum
  2. Table zones
  3. Table localites
  4. Table users
  5. Table user_privileges
  6. Table forms
  7. Table submissions
  8. Table submission_rows
  9. Table submission_history
  10. Table notifications
  11. Seed zones et localités maliennes
```

--------------------------------------------

### 🔷 ÉTAPE 6 — Configurer Row Level Security (RLS)
```
Pour CHAQUE table créée :
Table Editor → [nom_table] → RLS → Enable RLS

⚠️ Si tu actives RLS sans créer de policies,
   PERSONNE ne peut lire/écrire → app cassée.
   Cursor va générer les policies, mais voici
   la logique à vérifier :

Policy type "SELECT" sur users :
  → Un user peut lire les users de rang inférieur
  → super_admin lit tout

Policy type "INSERT" sur users :
  → Seulement si create_user dans user_privileges
    ou rôle super_admin/admin

Policy type "SELECT" sur submissions :
  → Selon les règles de visibilité du brief
```

---

### 🔷 ÉTAPE 7 — Configurer Supabase Storage
```
Dans Supabase Dashboard :
Storage → New bucket

Crée le bucket :
  Name     : submissions
  Public   : NON (privé obligatoire)
  
Puis dans Storage → Policies :
Crée ces policies sur le bucket "submissions" :

Policy 1 — Upload (INSERT) :
  Name : "Agents peuvent uploader leurs photos"
  Allowed operation : INSERT
  Target roles : authenticated
  Expression : auth.uid() IS NOT NULL

Policy 2 — Read (SELECT) :
  Name : "Lecture selon droits soumission"
  Allowed operation : SELECT
  Target roles : authenticated
  Expression : auth.uid() IS NOT NULL
  (la logique fine est gérée côté app via
   les URLs signées générées à la demande)
```

--------------------------------------------

### 🔷 ÉTAPE 8 — Déployer sur Vercel
```
1. Push ton projet sur GitHub

2. Va sur https://vercel.com
   → New Project → Import depuis GitHub

3. Dans "Environment Variables", ajoute :
   SUPABASE_URL         = https://xxxxx.supabase.co
   SUPABASE_KEY         = eyJxxx... (anon)
   SUPABASE_SERVICE_KEY = eyJxxx... (service role)

4. Framework Preset : Nuxt.js (auto-détecté)

5. Deploy → ton app est en ligne en 2 minutes

6. Copie l'URL Vercel (ex: ton-app.vercel.app)
   et mets-la dans Supabase :
   Authentication → URL Configuration → Site URL
```

---

### 🔷 ÉTAPE 9 — Créer le super_admin manuellement
```
Supabase ne permet pas de créer un user avec
un username custom directement depuis l'UI.
Voici comment créer TON compte super_admin :

Dans SQL Editor :

-- 1. Créer le user dans Supabase Auth
SELECT supabase_admin.create_user(
  '{"email": "toi@76543210.org",
    "password": "ML76543210",
    "email_confirm": true}'
);

-- 2. Récupère l'UUID généré
-- Authentication → Users → copie ton UUID

-- 3. Insère dans ta table users
INSERT INTO users (
  id, username, first_name, last_name,
  phone, role, must_change_password, is_active
) VALUES (
  'uuid-copié-ci-dessus',
  'toi@76543210.org',
  'Ton Prénom',
  'Ton Nom',
  '76543210',
  'super_admin',
  false,   -- toi tu n'as pas besoin de changer le mdp
  true
);
```

--------------------------------------------

### 📋 Checklist finale Supabase
```
□ Projet créé sur supabase.com
□ Clés API récupérées et dans .env
□ Auth Email uniquement activé
□ Confirmation email désactivée
□ Toutes les tables créées avec SQL
□ RLS activé sur toutes les tables
□ Policies RLS créées et testées
□ Bucket "submissions" créé (privé)
□ Policies Storage créées
□ Seed zones/localités exécuté
□ Compte super_admin créé manuellement
□ URL Vercel configurée dans Supabase Auth

--------------------------------------------
Conseil : Fais toute la configuration Supabase avant de commencer
à coder avec Cursor. Ainsi Cursor peut tester les requêtes
en temps réel contre ta vraie DB. 🎯