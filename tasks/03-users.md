# 03 — CRUD Utilisateurs

**Statut :** À faire  
**Réf. BRIEF :** Hiérarchie, Règles création comptes, Privilèges, Module Utilisateurs (UI)

## Objectif

CRUD utilisateurs avec rôles, privilèges et délégation en cascade. Champs : first_name, last_name, phone, email, username, role, zone_id, localite_id, supervisor_id.

---

## 3.1 Règles métier

- [ ] Aucune inscription publique : création de comptes uniquement par utilisateurs ayant le privilège `create_user`
- [ ] Format username : `prenom@telephone.org` (ex. moussa@76543210.org)
- [ ] Mot de passe par défaut : `ML` + numéro de téléphone (ex. ML76543210), stocké via Supabase Auth (bcrypt), jamais en clair en DB
- [ ] On ne peut créer que des comptes de rôle strictement inférieur au sien
- [ ] On ne peut accorder que les privilèges que l’on possède ; pas d’auto-attribution

---

## 3.2 Table users & user_privileges

- [ ] Utiliser le schéma BRIEF : users (id, username, first_name, last_name, phone, email, zone_id, localite_id, role, supervisor_id, must_change_password, is_active, created_by, created_at, updated_at)
- [ ] user_privileges : user_id, privilege (create_user | send_back | view_responses), granted_by
- [ ] RLS : lecture selon hiérarchie (on ne voit que les utilisateurs de rang inférieur) ; création/édition selon privilèges et rôle

---

## 3.3 Création de compte

- [ ] Bouton « Créer un utilisateur » visible si `canCreateUser()` (usePermissions)
- [ ] Formulaire : first_name, last_name, phone, email, role, zone_id, localite_id, supervisor_id (si applicable)
- [ ] Génération automatique username et mot de passe par défaut ; création dans Supabase Auth + enregistrement dans `users` (et `user_privileges` si délégation à la création)
- [ ] Option d’accorder des privilèges à la création (si le créateur les possède)

---

## 3.4 Liste et filtres

- [ ] Liste utilisateurs : uniquement ceux de rang strictement inférieur (usePermissions / canSeeUser)
- [ ] Filtres optionnels : rôle, zone, localité, actif/inactif
- [ ] Colonnes : nom, username, email, rôle, zone, localité, superviseur, statut

---

## 3.5 Édition et privilèges

- [ ] Bouton « Modifier le rôle » : super_admin et admin uniquement
- [ ] Bouton « Accorder un privilège » : visible si on possède ce privilège ; délégation selon règles BRIEF (manager → superviseur, superviseur → employé pour view_responses uniquement)
- [ ] Bouton « Désactiver / Supprimer » : super_admin et admin uniquement (soft delete ou is_active = false selon choix)

---

## 3.6 Navigation

- [ ] Menu « Utilisateurs » visible si : super_admin, admin, ou manager/superviseur avec create_user (v-if)
- [ ] Route protégée par middleware (rôle + privilège)

---

## Livrables

- CRUD utilisateurs complet avec rôles et privilèges
- Délégation en cascade respectée
- UI conditionnelle (v-if) sur tous les boutons et menus
