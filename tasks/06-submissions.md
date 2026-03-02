# 06 — Gestion des soumissions

**Statut :** À faire  
**Réf. BRIEF :** Visibilité des réponses, Correction des réponses, Notifications

## Objectif

Gestion du cycle de vie des soumissions : visibilité selon rôle, renvoi pour correction avec note et historique, notifications in-app (push).

---

## 6.1 Visibilité des réponses

- [ ] Employé soumet → visible par : super_admin, admin, tous les managers, superviseur direct
- [ ] Superviseur soumet → visible par : super_admin, admin, tous les managers
- [ ] Règles générales : super_admin/admin voient tout ; manager voit ses superviseurs et employés ; superviseur/employé ne voient pas les réponses après soumission sauf renvoi correction ou privilège view_responses
- [ ] RLS et requêtes côté API/listes selon ces règles

---

## 6.2 Liste des soumissions

- [ ] Onglet « Toutes les soumissions » : super_admin, admin, manager, et utilisateur avec view_responses
- [ ] Superviseur : uniquement soumissions de ses employés
- [ ] Employé / superviseur : « Mes soumissions » (ses propres envois)
- [ ] Filtres : statut (soumis / renvoyé / corrigé), date, formulaire

---

## 6.3 Renvoi pour correction

- [ ] Bouton « Renvoyer pour correction » visible si `canSendBack()` (usePermissions)
- [ ] Modal/page : saisie d’une note (sent_back_note), enregistrement statut `renvoyé`, version incrémentée, sent_back_by, sent_back_at
- [ ] Historique : table submission_history (version, rows_snapshot, changed_at, changed_by) pour chaque correction
- [ ] L’employé/superviseur concerné peut modifier et resoumettre (statut → corrigé après resoumission)

---

## 6.4 Notifications in-app

- [ ] Table `notifications` : user_id, type (urgent | renvoi | info), message, is_read, submission_id, created_at
- [ ] À la soumission d’un questionnaire urgent : créer notifications pour admin, tous les managers, superviseur direct de l’employé (Web Push / in-app)
- [ ] Au renvoi pour correction : notification à l’employé/superviseur concerné
- [ ] Store `notifications` : liste des non lues, marquer comme lu
- [ ] Pas d’email : uniquement notifications in-app (et PWA push si configuré en 08)

---

## 6.5 Sync offline

- [ ] Soumissions en attente (store submissions + persistedstate) : à la reconnexion, envoi automatique vers Supabase (submissions + submission_rows + upload photos depuis IndexedDB)
- [ ] Indicateur « En attente d’envoi » sur les entrées en file

---

## Livrables

- Visibilité des soumissions selon hiérarchie et privilèges
- Renvoi pour correction avec note et historique des versions
- Notifications in-app (urgent + renvoi) et sync offline
