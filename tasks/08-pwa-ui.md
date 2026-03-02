# 08 — PWA, UI & RBAC

**Statut :** À faire  
**Réf. BRIEF :** PWA, UI/Design, RBAC visuel (navigation, modules)

## Objectif

PWA installable (offline partiel), UI mobile-first avec palette et composants définis, RBAC visuel complet (v-if sur tout élément non autorisé).

---

## 8.1 PWA

- [ ] @vite-pwa/nuxt : configuration manifest, installable Android/iOS
- [ ] Cache offline : formulaires assignés, soumissions en attente, photos en attente (déjà prévus via Pinia persistedstate + idb)
- [ ] Sync automatique à la reconnexion (soumissions, photos)
- [ ] Notifications push : Web Push API (in-app uniquement, pas d’email)
- [ ] Indicateur réseau permanent : En ligne / Faible / Hors ligne (visible sur toutes les pages concernées)

---

## 8.2 Design system

- [ ] Palette : Primaire #1B5E20, Accent #F57C00, Neutre #37474F, Fond #FAFAFA, Danger #C62828
- [ ] Nuxt UI v3 + Tailwind v4 : thème aligné sur la palette
- [ ] Mobile-first : grandes zones tactiles, lisible en plein soleil (fort contraste)
- [ ] Bottom navigation sur mobile (pas de sidebar) ; desktop : navigation adaptée

---

## 8.3 Composants clés

- [ ] Table de remplissage : grandes cellules, ajout de ligne facile au doigt
- [ ] Champs conditionnels : apparition fluide sans saut de mise en page
- [ ] Cellule photo : bouton caméra intégré dans la cellule
- [ ] Bouton « Soumettre » : très grand, pleine largeur, couleur frappante
- [ ] Status pills : soumis / renvoyé / corrigé / urgent
- [ ] Badge notifications visible (contraste plein soleil)

---

## 8.4 RBAC visuel complet

- [ ] Navigation par rôle (BRIEF) :
  - super_admin → tout
  - admin → tout sauf gestion super_admin
  - manager → dashboard, questionnaires, soumissions, utilisateurs (si create_user)
  - superviseur → mes questionnaires, mes soumissions, notifications
  - employe → mes questionnaires, mes soumissions, notifications
- [ ] Chaque route protégée : middleware Nuxt côté serveur + v-if sur les liens/boutons
- [ ] usePermissions() utilisé partout pour : canCreateUser, canSendBack, canViewResponses, canManageForms, canExportCollectif, canSeeUser, canGrantPrivilege
- [ ] v-if uniquement (jamais v-show) pour les éléments non autorisés (absents du DOM)

---

## 8.5 Paramètres & privilèges

- [ ] Gestion zones/localités : super_admin et admin (déjà en 02)
- [ ] Gestion des privilèges (accorder/révoquer) : super_admin, admin, et tout utilisateur ayant le privilège à déléguer (via canGrantPrivilege)

---

## Livrables

- PWA installable avec offline partiel et indicateur réseau
- UI cohérente (palette, composants, mobile-first)
- RBAC visuel complet (navigation + boutons + pages) avec v-if et middleware
