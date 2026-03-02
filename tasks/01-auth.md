# 01 — Authentification

**Statut :** À faire  
**Réf. BRIEF :** Hiérarchie utilisateurs, Format identifiants, UI conditionnelle

## Objectif

Login username/mot de passe, changement obligatoire au premier login, aucune inscription publique.

---

## 1.1 Login

- [ ] Page login : username (format `prenom@telephone.org`) + mot de passe
- [ ] Intégration Supabase Auth (email/password) : mapper username vers un identifiant utilisable par Supabase si besoin
- [ ] Aucun lien « Inscription » ou création de compte depuis la page login (bloquer toute création publique)
- [ ] Redirection après login : si `must_change_password` → page changement de mot de passe ; sinon → dashboard ou page d’accueil selon rôle

---

## 1.2 Premier login — Changement de mot de passe

- [ ] Détection `must_change_password` depuis le store `auth` (données `users`)
- [ ] Page dédiée « Changer le mot de passe » obligatoire avant accès au reste de l’app
- [ ] Mise à jour du mot de passe via Supabase Auth + mise à jour `must_change_password` dans la table `users` (côté serveur ou RPC)
- [ ] Après succès : redirection vers l’app, flag mis à jour en DB

---

## 1.3 Protection des routes

- [ ] Middleware Nuxt : vérifier session Supabase + éventuellement `must_change_password`
- [ ] Redirection non authentifié → `/login`
- [ ] Redirection `must_change_password` → page changement de mot de passe
- [ ] Double protection : middleware + UI (v-if sur menus/pages selon rôle)

---

## 1.4 Store auth

- [ ] Store `auth` : utilisateur connecté, rôle, `must_change_password`, privilèges (ou lecture depuis `permissions`)
- [ ] Synchronisation avec Supabase Auth (onAuthStateChange)
- [ ] Chargement du profil `users` (rôle, zone, superviseur, etc.) après login

---

## Livrables

- Login fonctionnel, pas d’inscription publique
- Changement de mot de passe obligatoire au premier login
- Routes protégées par middleware
