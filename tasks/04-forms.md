# 04 — CRUD Questionnaires

**Statut :** Fait  
**Réf. BRIEF :** Module Questionnaires, Logique conditionnelle des champs, Types (journalier / urgent)

## Objectif

Créateur de questionnaires par super_admin/admin : drag & drop des champs, tous types supportés, logique conditionnelle, assignation par rôle ou utilisateur. Types journalier et urgent.

---

## 4.1 Types de champs

- [x] Texte court, texte long, nombre, téléphone, date, heure
- [x] Liste déroulante, choix unique (radio), choix multiple (checkbox)
- [x] Photo (capture + upload, cf. tâche 05 pour remplissage)
- [x] Chaque champ : id, label, type, required, options (si select/radio/checkbox)

---

## 4.2 Créateur de formulaires (admin)

- [x] Interface drag & drop (vue-draggable-plus) pour ordonner les champs
- [x] Ajout/suppression/édition de champs (label, type, options, required)
- [x] Métadonnées formulaire : title, description, type (journalier | urgent)
- [x] Assignation : par rôles et/ou par utilisateurs (assigned_to jsonb)
- [x] Boutons Créer / Modifier / Supprimer : super_admin et admin uniquement (v-if + RLS)

---

## 4.3 Logique conditionnelle (créateur)

- [x] Par champ : une ou plusieurs conditions d'affichage
- [x] Interface : « Afficher ce champ SI [champ source] [opérateur] [valeur] »
- [x] Opérateurs : est égal à, est différent de, contient, est rempli, est vide
- [x] Opérateur logique entre conditions : ET / OU
- [x] Conditions en cascade (2 niveaux max) : ex. SI Réaction = Refus → Raison ; SI Raison = Autre → Préciser
- [x] Stockage dans `forms.fields` (jsonb) : structure `conditions: { operator, rules: [{ field_id, operator, value }] }`

---

## 4.4 Composable useFormConditions

- [x] Composable `useFormConditions(fields, formData)` : évalue les règles en temps réel
- [x] Retourne pour chaque champ si la condition est satisfaite (pour affichage v-if côté remplissage)
- [x] Si condition non remplie : valeur du champ ignorée / effacée (éviter données fantômes)

---

## 4.5 Liste des questionnaires

- [x] Chaque utilisateur ne voit que les questionnaires qui lui sont assignés (rôle ou user id dans assigned_to)
- [x] Filtres optionnels : type (journalier/urgent), actif
- [x] Store `forms` : chargement des formulaires assignés, cache offline (persistedstate)

---

## 4.6 Règles métier par type

- [ ] Journalier : rempli en fin de journée ; après premier envoi, l'employé peut ajouter des entrées mais pas supprimer les réponses déjà soumises (à gérer en 05/06)
- [ ] Urgent : soumissions multiples par jour ; à chaque soumission → notification push admin, managers, superviseur direct (implémentation notifications en 06)

---

## Livrables

- CRUD questionnaires complet avec drag & drop et logique conditionnelle
- useFormConditions() utilisable dans l'interface de remplissage
- Assignation par rôle/utilisateur et visibilité filtrée
