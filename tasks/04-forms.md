# 04 — CRUD Questionnaires

**Statut :** À faire  
**Réf. BRIEF :** Module Questionnaires, Logique conditionnelle des champs, Types (journalier / urgent)

## Objectif

Créateur de questionnaires par super_admin/admin : drag & drop des champs, tous types supportés, logique conditionnelle, assignation par rôle ou utilisateur. Types journalier et urgent.

---

## 4.1 Types de champs

- [ ] Texte court, texte long, nombre, téléphone, date, heure
- [ ] Liste déroulante, choix unique (radio), choix multiple (checkbox)
- [ ] Photo (capture + upload, cf. tâche 05 pour remplissage)
- [ ] Chaque champ : id, label, type, required, options (si select/radio/checkbox)

---

## 4.2 Créateur de formulaires (admin)

- [ ] Interface drag & drop (vue-draggable-plus) pour ordonner les champs
- [ ] Ajout/suppression/édition de champs (label, type, options, required)
- [ ] Métadonnées formulaire : title, description, type (journalier | urgent)
- [ ] Assignation : par rôles et/ou par utilisateurs (assigned_to jsonb)
- [ ] Boutons Créer / Modifier / Supprimer : super_admin et admin uniquement (v-if + RLS)

---

## 4.3 Logique conditionnelle (créateur)

- [ ] Par champ : une ou plusieurs conditions d’affichage
- [ ] Interface : « Afficher ce champ SI [champ source] [opérateur] [valeur] »
- [ ] Opérateurs : est égal à, est différent de, contient, est rempli, est vide
- [ ] Opérateur logique entre conditions : ET / OU
- [ ] Conditions en cascade (2 niveaux max) : ex. SI Réaction = Refus → Raison ; SI Raison = Autre → Préciser
- [ ] Stockage dans `forms.fields` (jsonb) : structure `conditions: { operator, rules: [{ field_id, operator, value }] }`

---

## 4.4 Composable useFormConditions

- [ ] Composable `useFormConditions(fields, formData)` : évalue les règles en temps réel
- [ ] Retourne pour chaque champ si la condition est satisfaite (pour affichage v-if côté remplissage)
- [ ] Si condition non remplie : valeur du champ ignorée / effacée (éviter données fantômes)

---

## 4.5 Liste des questionnaires

- [ ] Chaque utilisateur ne voit que les questionnaires qui lui sont assignés (rôle ou user id dans assigned_to)
- [ ] Filtres optionnels : type (journalier/urgent), actif
- [ ] Store `forms` : chargement des formulaires assignés, cache offline (persistedstate)

---

## 4.6 Règles métier par type

- [ ] Journalier : rempli en fin de journée ; après premier envoi, l’employé peut ajouter des entrées mais pas supprimer les réponses déjà soumises (à gérer en 05/06)
- [ ] Urgent : soumissions multiples par jour ; à chaque soumission → notification push admin, managers, superviseur direct (implémentation notifications en 06)

---

## Livrables

- CRUD questionnaires complet avec drag & drop et logique conditionnelle
- useFormConditions() utilisable dans l’interface de remplissage
- Assignation par rôle/utilisateur et visibilité filtrée
