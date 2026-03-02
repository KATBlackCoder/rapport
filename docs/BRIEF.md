Tu es un expert Nuxt 4, Supabase et développement PWA.
Je veux que tu m'aides à construire une application web
interne de gestion de questionnaires pour une entreprise
basée au Mali dont les employés travaillent sur le terrain
(démarchage clients, animations commerciales).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧱 STACK TECHNIQUE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Frontend : Nuxt 4 (mode SPA/SSR hybride)
- Backend/DB : Supabase (PostgreSQL + Auth + RLS
  + Realtime + Storage)
- State management : Pinia (@pinia/nuxt)
  + pinia-plugin-persistedstate (offline persistence)
- UI : Nuxt UI v3 (Tailwind v4)
- Charts : vue-chartjs (Chart.js)
- Export : SheetJS (xlsx)
- Drag & drop formulaires : vue-draggable-plus
- Compression photos : browser-image-compression
- Stockage offline photos : IndexedDB via idb
- Notifications : PWA Web Push API + Supabase Realtime
  (aucun envoi d'email prévu)
- Hébergement : Vercel (frontend) + Supabase Cloud (DB)
- L'app doit être une PWA (installable sur mobile,
  offline partiel)

Stores Pinia à créer :
  auth.ts          → utilisateur connecté, rôle, privilèges
  permissions.ts   → logique usePermissions() centralisée
  forms.ts         → questionnaires assignés + cache offline
  submissions.ts   → soumissions en cours + file offline
  notifications.ts → notifications non lues
  geo.ts           → zones et localités chargées une fois

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👥 HIÉRARCHIE DES UTILISATEURS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5 rôles dans cet ordre de privilège décroissant :
1. super_admin  – accès total, ne peut pas être modifié
2. admin        – accès quasi-total
3. manager      – accès si privilège accordé
4. superviseur  – supervise les employés terrain
5. employe      – agent terrain

Règles de création de comptes :
- AUCUNE inscription publique via le login
- Seuls les rôles ayant le privilège "create_user"
  peuvent créer des comptes
- Par défaut : super_admin et admin ont ce privilège
- super_admin et admin peuvent accorder le privilège
  "create_user" à un manager
- Un manager ayant le privilège "create_user" peut
  à son tour accorder ce même privilège à un superviseur
- Un superviseur ayant reçu ce privilège peut alors
  créer uniquement des comptes de type "employé"
- Règle importante : on ne peut accorder que les
  privilèges que l'on possède soi-même, et on ne peut
  pas créer un compte de rôle supérieur ou égal au sien

Format des identifiants :
- Username : prenom@telephone.org
  (ex: moussa@76543210.org)
- Mot de passe par défaut : ML+numéro_de_téléphone
  (ex: ML76543210)
- Le mot de passe est géré exclusivement par Supabase Auth,
  stocké en bcrypt hash, jamais en clair dans la DB
- Le mot de passe DOIT être changé à la première connexion,
  contrôlé via le flag must_change_password dans users
- Bloquer toute création de compte depuis la page login

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔑 SYSTÈME DE PRIVILÈGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Privilèges disponibles :
- create_user     : créer des comptes utilisateurs
- send_back       : renvoyer une soumission pour correction
- view_responses  : voir les réponses des questionnaires

Règles de délégation :
- super_admin et admin peuvent accorder n'importe quel
  privilège à un manager
- Un manager ayant un privilège peut le déléguer
  à un superviseur
- Un superviseur ayant un privilège peut le déléguer
  à un employé UNIQUEMENT pour view_responses
- On ne peut déléguer que ce que l'on possède
- On ne peut pas s'auto-attribuer un privilège
- Toute délégation est révocable par super_admin,
  admin, ou celui qui l'a accordée

Table des privilèges par défaut :
┌─────────────────┬─────────────┬───────────┬────────────────┐
│ Rôle            │ create_user │ send_back │ view_responses │
├─────────────────┼─────────────┼───────────┼────────────────┤
│ super_admin     │ ✅ toujours │ ✅ toujours│ ✅ toujours    │
│ admin           │ ✅ toujours │ ✅ toujours│ ✅ toujours    │
│ manager         │ ⚙️ si accordé│ ⚙️ si accordé│ ✅ toujours│
│ superviseur     │ ⚙️ si accordé│ ❌        │ ❌ par défaut  │
│ employe         │ ❌          │ ❌        │ ❌ par défaut  │
└─────────────────┴─────────────┴───────────┴────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🙈 UI CONDITIONNELLE (RBAC visuel)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Toute option, menu, bouton ou page non autorisé
doit être INVISIBLE (pas juste désactivé) selon
le rôle et les privilèges de l'utilisateur connecté.

Règle absolue :
- Utiliser v-if (jamais v-show) pour que les éléments
  non autorisés soient absents du DOM
- Chaque route protégée doit aussi avoir un middleware
  Nuxt côté serveur (double protection : UI + API)

Navigation visible par rôle :
- super_admin  →  tout
- admin        →  tout sauf gestion super_admin
- manager      →  dashboard, questionnaires, soumissions,
                  utilisateurs (si create_user accordé)
- superviseur  →  mes questionnaires, mes soumissions,
                  notifications
- employe      →  mes questionnaires, mes soumissions,
                  notifications

Module Utilisateurs :
- Menu "Utilisateurs" visible si : super_admin, admin,
  ou manager/superviseur avec create_user
- Liste : on ne voit que les utilisateurs de rang
  strictement inférieur au sien
- Bouton "Créer" : visible si create_user accordé
- Bouton "Modifier le rôle" : super_admin et admin
  uniquement
- Bouton "Accorder un privilège" : visible uniquement
  si on possède soi-même ce privilège
- Bouton "Désactiver / Supprimer" : super_admin et
  admin uniquement

Module Questionnaires :
- Bouton "Créer / Modifier / Supprimer" : super_admin
  et admin uniquement
- Liste : chaque utilisateur ne voit que les
  questionnaires qui lui sont assignés

Module Soumissions :
- Bouton "Renvoyer pour correction" : visible si
  send_back accordé
- Onglet "Toutes les soumissions" : super_admin,
  admin, manager, et utilisateur avec view_responses
- Soumissions des autres : superviseur voit celles
  de ses employés uniquement

Module Analytics / Export :
- Dashboard et graphiques : super_admin, admin,
  manager, et utilisateur avec view_responses
- Bouton "Exporter" : même règle que dashboard
- Options "Groupé" et "Collectif" : super_admin
  et admin uniquement
- Option "Individuel" : manager, superviseur/employé
  avec view_responses (leurs données uniquement)

Paramètres :
- Gestion zones/localités : super_admin et admin
- Gestion des privilèges : super_admin, admin,
  et tout utilisateur ayant un privilège à déléguer

Implémentation technique :
Créer un composable usePermissions() alimenté par
le store Pinia permissions.ts, qui expose :
  - canCreateUser()
  - canSendBack()
  - canViewResponses()
  - canManageForms()
  - canExportCollectif()
  - canSeeUser(targetUser)
  - canGrantPrivilege(privilege)

Utiliser ce composable partout via v-if :
  <button v-if="canCreateUser()">
    Créer un utilisateur
  </button>
  <NuxtLink v-if="canViewResponses()" to="/dashboard">
    Dashboard
  </NuxtLink>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 MODULE QUESTIONNAIRES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Deux types de questionnaires :

1. QUESTIONNAIRE JOURNALIER
   - Rempli et soumis en fin de journée
   - Après le premier envoi, l'employé peut encore
     AJOUTER des entrées mais ne peut PAS supprimer
     les réponses déjà soumises
   - Basé sur le travail terrain : démarchage clients
     (remontée numéros clients) ou animation de lieu
     (remontée numéros clients + nom du lieu)

2. QUESTIONNAIRE URGENT
   - Peut être soumis autant de fois dans la journée
   - Utilisé pour signaler des problèmes terrain
   - À chaque soumission : notification push immédiate
     envoyée à admin, tous les managers et le
     superviseur direct de l'employé
     (aucun email, uniquement notifications in-app)

Fonctionnalités communes :
- Interface de remplissage en FORMAT TABLE
  (lignes = entrées, colonnes = champs)
  permettant d'envoyer plusieurs réponses en une fois
- Créateur de questionnaires par super_admin/admin
  avec les types de champs suivants :
  texte court, texte long, nombre, téléphone,
  date, heure, liste déroulante, choix unique (radio),
  choix multiple (checkbox), photo
- Chaque questionnaire assigné à des rôles/utilisateurs

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔀 LOGIQUE CONDITIONNELLE DES CHAMPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Le créateur de questionnaires supporte la logique
conditionnelle sur les champs (skip logic / branching).

Dans le créateur (admin) :
- Chaque champ peut avoir une ou plusieurs
  conditions d'affichage définies visuellement
- Interface : "Afficher ce champ SI
  [champ source ▼] [opérateur ▼] [valeur]"
- Opérateurs disponibles :
  • est égal à
  • est différent de
  • contient
  • est rempli
  • est vide
- Opérateur logique entre plusieurs conditions : ET / OU
- Conditions en cascade supportées (2 niveaux max)
  ex: SI Réaction = Refus → afficher Raison
      SI Raison = Autre   → afficher Préciser

Dans l'interface de remplissage (agent terrain) :
- Les champs conditionnels sont INVISIBLES par défaut
- Apparition instantanée (sans rechargement) dès que
  la condition est remplie, via v-if réactif
- Si la condition n'est plus vraie (changement de choix),
  le champ disparaît et sa valeur est automatiquement
  effacée pour éviter des données fantômes
- L'agent ne voit jamais la logique, juste le résultat

Exemples concrets :
  SI Réaction      = "Refus"      → afficher "Raison du refus"
  SI Réaction      = "Acheté"     → afficher "Quantité achetée"
  SI Réaction      = "À rappeler" → afficher "Date de rappel"
  SI Raison        = "Autre"      → afficher "Préciser (texte)"
  SI Urgence       = "🔴 Haute"   → afficher "Action requise"
  SI Type de lieu  = "Marché"     → afficher "Nombre de stands"

Stockage des conditions :
- Stockées dans le jsonb "fields" de la table forms
- Aucune modification du schéma DB nécessaire
- Structure JSON d'un champ conditionnel :
  {
    "id": "f2",
    "label": "Raison du refus",
    "type": "select",
    "required": true,
    "options": [
      "Prix trop élevé",
      "Pas intéressé",
      "Déjà fournisseur",
      "Pas le bon moment",
      "Autre"
    ],
    "conditions": {
      "operator": "AND",
      "rules": [
        {
          "field_id": "f1",
          "operator": "equals",
          "value": "Refus"
        }
      ]
    }
  }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📸 MODULE PHOTOS (inclus dans le MVP)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Les photos sont un type de champ disponible dans
les questionnaires, au même titre que texte ou nombre.

Capture :
- input type="file" accept="image/*"
  capture="environment" (ouvre caméra arrière directe)
- Maximum 3 photos par ligne de tableau

Compression obligatoire avant upload :
- Utiliser browser-image-compression
- Cible : 400KB max par photo
- Format : JPEG, qualité 0.7
- Redimensionnement max : 1200px de large

Stockage : Supabase Storage
- Bucket "submissions" (privé, accès via RLS)
- Structure :
  submissions/{submission_id}/{row_index}/
  photo_1.jpg, photo_2.jpg, photo_3.jpg
- URLs signées générées à la demande
  (jamais d'URLs publiques permanentes)

Offline :
- Si hors ligne, photo stockée en base64
  dans IndexedDB via la librairie "idb"
- Dès reconnexion : upload automatique vers
  Supabase Storage puis nettoyage IndexedDB
- Indicateur visuel "📸 En attente d'envoi"
  sur les photos en file d'attente offline

Schéma :
- Champ photo_urls jsonb dans submission_rows
  (tableau d'URLs Supabase Storage)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 GÉOLOCALISATION (architecture V2)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ne pas implémenter dans le MVP mais préparer
l'architecture dès maintenant.

Prévoir dans submission_rows dès le MVP
(colonnes nullable) :
- latitude   decimal(10,8)  nullable
- longitude  decimal(11,8)  nullable
- accuracy   decimal        nullable

V2 utilisera :
- Capture : API navigator.geolocation native
- Carte : Leaflet.js + OpenStreetMap (gratuit)
- Usage : vérification présence terrain,
  visualisation zones visitées sur carte,
  détection incohérence zone déclarée vs GPS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👁️ VISIBILITÉ DES RÉPONSES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Quand un EMPLOYÉ soumet :
→ super_admin, admin, tous les managers,
  et son superviseur direct uniquement

Quand un SUPERVISEUR soumet :
→ super_admin, admin, tous les managers

Règle générale :
- super_admin et admin voient TOUT
- Manager voit soumissions de ses superviseurs
  et employés
- Superviseur et employé ne voient pas les réponses
  après soumission (sauf renvoi correction ou
  privilège view_responses accordé)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✏️ CORRECTION DES RÉPONSES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Seuls les utilisateurs avec send_back peuvent
  renvoyer un questionnaire pour correction
- L'employé/superviseur reçoit une notification push
- Il peut modifier et resoumettre
- Historique complet des versions conservé
  (soumission originale + toutes les corrections)
- Aucun email, uniquement notifications in-app

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 ANALYTICS & EXPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Graphiques style Google Forms (barres, camembert,
  courbes) pour super_admin, admin, manager,
  et utilisateur avec view_responses
- Export Excel en 3 modes :
  • Individuel : réponses d'un seul utilisateur
  • Collectif  : toutes les réponses d'un questionnaire
  • Groupé     : par rôle, zone, localité,
                 superviseur ou période
                 (jour / semaine / mois)
- Filtres : par date, utilisateur, rôle, zone, localité

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🗄️ STRUCTURE BASE DE DONNÉES (Supabase)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Référentiels géographiques
zones
  id          uuid  primary key
  nom         text  not null unique
  created_at  timestamp

localites
  id          uuid  primary key
  nom         text  not null
  zone_id     uuid  references zones(id)
  created_at  timestamp
  unique(nom, zone_id)

-- Utilisateurs
users
  id                   uuid  references auth.users
  username             text  unique
  first_name           text  not null
  last_name            text  not null
  phone                text  not null unique
  email                text
  zone_id              uuid  references zones(id)
  localite_id          uuid  references localites(id)
  role                 enum  (super_admin | admin |
                              manager | superviseur | employe)
  supervisor_id        uuid  references users(id)
  must_change_password bool  default true
  is_active            bool  default true
  created_by           uuid  references users(id)
  created_at           timestamp
  updated_at           timestamp

-- Privilèges additionnels
user_privileges
  id           uuid  primary key
  user_id      uuid  references users(id)
  privilege    enum  (create_user | send_back | view_responses)
  granted_by   uuid  references users(id)
  created_at   timestamp
  unique(user_id, privilege)

-- Formulaires
forms
  id           uuid  primary key
  title        text  not null
  description  text
  type         enum  (journalier | urgent)
  fields       jsonb not null
               (définition des colonnes + conditions)
  assigned_to  jsonb
               (rôles et/ou user ids ciblés)
  is_active    bool  default true
  created_by   uuid  references users(id)
  created_at   timestamp
  updated_at   timestamp

-- Soumissions
submissions
  id             uuid  primary key
  form_id        uuid  references forms(id)
  submitted_by   uuid  references users(id)
  submitted_at   timestamp
  status         enum  (soumis | renvoyé | corrigé)
  version        int   default 1
  sent_back_by   uuid  references users(id)
  sent_back_at   timestamp
  sent_back_note text

-- Lignes de réponses (format table)
submission_rows
  id             uuid  primary key
  submission_id  uuid  references submissions(id)
  row_data       jsonb not null
                 (clé = field_id, valeur = réponse)
  row_index      int   not null
  photo_urls     jsonb default '[]'
  -- Colonnes V2 géolocalisation (nullable dès MVP)
  latitude       decimal(10,8)  nullable
  longitude      decimal(11,8)  nullable
  accuracy       decimal        nullable
  created_at     timestamp

-- Historique des corrections
submission_history
  id             uuid  primary key
  submission_id  uuid  references submissions(id)
  version        int   not null
  rows_snapshot  jsonb not null
  changed_at     timestamp
  changed_by     uuid  references users(id)

-- Notifications in-app uniquement
notifications
  id             uuid  primary key
  user_id        uuid  references users(id)
  type           enum  (urgent | renvoi | info)
  message        text
  is_read        bool  default false
  submission_id  uuid  references submissions(id)
  created_at     timestamp

Seed initial :
- Zones : Bamako, Ségou, Sikasso, Mopti, Kayes,
          Koulikoro, Gao, Tombouctou, Kidal
- Localités Bamako : Lafiabougou, Hamdalaye,
  Badalabougou, Magnambougou, Quinzambougou,
  Sotuba, Banconi, Niaréla, Médina-Coura,
  Hippodrome, ACI 2000, Hamdallaye ACI

Activer RLS sur toutes les tables.

Supabase Storage :
- Créer bucket "submissions" (privé)
- Politique RLS Storage :
  • Upload (INSERT) : utilisateur authentifié uniquement
  • Read (SELECT) : selon les mêmes règles de visibilité
    que les soumissions, via URLs signées

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📱 PWA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- @vite-pwa/nuxt pour la configuration
- Installable sur Android et iOS
- Notifications push Web Push API (in-app uniquement)
- Cache offline via Pinia persistedstate :
  formulaires assignés, soumissions en attente,
  photos en attente (IndexedDB via idb)
- Sync automatique à la reconnexion
- Indicateur réseau permanent visible :
  🟢 En ligne / 🟡 Faible / 🔴 Hors ligne
- UI mobile-first : grandes zones tactiles,
  lisible en plein soleil, bottom navigation mobile

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 UI / DESIGN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Style : Dashboard Pro + Mobile Field App
- Mobile-first, grandes zones tactiles
- Lisible en plein soleil (fort contraste)
- Palette :
  Primaire  →  Vert profond  #1B5E20
  Accent    →  Orange vif    #F57C00
  Neutre    →  Gris ardoise  #37474F
  Fond      →  Blanc cassé   #FAFAFA
  Danger    →  Rouge         #C62828
- Composants clés à soigner :
  • Table de remplissage : grandes cellules,
    ajout de ligne facile au doigt
  • Champs conditionnels : apparition fluide
    sans saut de mise en page
  • Cellule photo : bouton caméra intégré dans
    la cellule de la table
  • Bouton "Soumettre" : très grand, toute la
    largeur, couleur frappante
  • Status pills : soumis / renvoyé / corrigé / urgent
  • Badge notifications visible en plein soleil
  • Bottom navigation sur mobile (pas de sidebar)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 PÉRIMÈTRE MVP (ordre de priorité strict)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Authentification
   - Login username/password
   - Changement obligatoire au premier login
   - Aucune inscription publique

2. Référentiels géographiques
   - CRUD zones et localités (admin uniquement)
   - Seed initial malien

3. CRUD utilisateurs
   - Rôles, privilèges, délégation en cascade
   - Champs : first_name, last_name, phone,
     email, username, role, zone_id, localite_id,
     supervisor_id

4. CRUD questionnaires
   - Créateur drag & drop de champs
   - Tous les types de champs supportés
   - Logique conditionnelle entre champs
   - Assignation par rôle ou utilisateur
   - Types journalier et urgent

5. Interface de remplissage en table
   - Multi-lignes, ajout dynamique au doigt
   - Champs conditionnels réactifs (v-if)
   - Valeur effacée si condition désactivée
   - Cellule photo avec capture caméra directe
   - Compression auto avant upload
   - Indicateur offline par photo
   - Logique journalier vs urgent

6. Gestion des soumissions
   - Renvoi pour correction + note + historique
   - Notifications in-app push

7. Dashboard & Analytics
   - Graphiques style Google Forms
   - Filtres par zone, localité, rôle, date
   - Export Excel : individuel, collectif, groupé

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔮 V2 (ne pas implémenter, juste architecturer)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Géolocalisation GPS (colonnes déjà prévues en DB)
- Carte Leaflet visualisation terrain
- Détection incohérence zone déclarée vs GPS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ INSTRUCTIONS POUR TOI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Commence par l'arborescence complète du projet Nuxt 4
- Génère le schéma SQL Supabase complet avec RLS,
  politiques Storage et seed géographique malien
- Implémente module par module dans l'ordre MVP
- Composition API et TypeScript partout
- Chaque store Pinia doit être typé TypeScript
- Commente le code en français
- Respecte strictement rôles et privilèges partout
- Pour la logique conditionnelle, crée un composable
  useFormConditions() dédié qui évalue les règles
  en temps réel depuis le store forms