# Changelog

## [Unreleased]

### Added

- **CRUD Questionnaires (04)** — Création, édition et suppression de questionnaires avec builder drag & drop (vue-draggable-plus). Types de champs : texte court/long, nombre, téléphone, date, heure, select, radio, checkbox, photo. Métadonnées : title, description, type (journalier/urgent), is_active. Assignation par rôles et utilisateurs (assigned_to). Logique conditionnelle par champ (Afficher SI champ source opérateur valeur, ET/OU). Composable `useFormConditions(fields, formData)` et `useFormConditionsCleanData()` pour l’évaluation et le nettoyage des valeurs masquées. Store forms : fetchForms, fetchFormById, createForm, updateForm, deleteForm, filtres type et actif. Pages `/forms`, `/forms/create`, `/forms/[formId]`. RLS forms (migration 20260304000001). Lien Questionnaires visible pour tous les utilisateurs authentifiés ; Créer/Modifier/Supprimer réservés aux admins.
