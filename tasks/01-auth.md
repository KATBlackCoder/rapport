# 01 — Authentification

**Statut :** Terminé  
**Réf. BRIEF :** Hiérarchie utilisateurs, Format identifiants, UI conditionnelle

## Objectif

Login username/mot de passe, changement obligatoire au premier login, aucune inscription publique.

---

## 1.1 Login

- [x] Page login : username (format `prenom@telephone.org`) + mot de passe
- [x] Intégration Supabase Auth (email/password) : username utilisé comme email
- [x] Aucun lien « Inscription » ou création de compte depuis la page login (bloquer toute création publique)
- [x] Redirection après login : si `must_change_password` → page changement de mot de passe ; sinon → dashboard ou page d’accueil selon rôle

---

## 1.2 Premier login — Changement de mot de passe

- [x] Détection `must_change_password` depuis le store `auth` (données `users`)
- [x] Page dédiée « Changer le mot de passe » obligatoire avant accès au reste de l’app
- [x] Mise à jour du mot de passe via Supabase Auth + mise à jour `must_change_password` dans la table `users`
- [x] Après succès : redirection vers l’app, flag mis à jour en DB

---

## 1.3 Protection des routes

- [x] Middleware Nuxt global : vérifier session Supabase + `must_change_password`
- [x] Redirection non authentifié → `/login`
- [x] Redirection `must_change_password` → page changement de mot de passe
- [x] Double protection : middleware + UI (v-if sur menus/pages selon rôle)

---

## 1.4 Store auth

- [x] Store `auth` : utilisateur connecté, rôle, `must_change_password`, privilèges (via store `permissions`)
- [x] Synchronisation avec Supabase Auth (onAuthStateChange)
- [x] Chargement du profil `users` (rôle, zone, superviseur, etc.) après login

---

## Livrables

- Login fonctionnel, pas d’inscription publique
- Changement de mot de passe obligatoire au premier login
- Routes protégées par middleware
