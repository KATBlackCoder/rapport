# 02 — Référentiels géographiques

**Statut :** Fait  
**Réf. BRIEF :** Structure DB (zones, localites), Seed initial, Paramètres (gestion zones/localités)

## Objectif

CRUD zones et localités, réservé aux super_admin et admin. Seed initial malien.

---

## 2.1 Zones

- [x] Liste des zones (table `zones`) : nom, created_at
- [x] Création / édition / suppression (admin uniquement)
- [x] Contraintes : `nom` unique, non vide
- [x] RLS : seul super_admin et admin peuvent lire/écrire (ou policy dédiée)

---

## 2.2 Localités

- [x] Liste des localités par zone (table `localites`, `zone_id`)
- [x] CRUD localités : nom, zone_id (unique(nom, zone_id))
- [x] Filtrage par zone dans l’UI (dropdown ou onglets)
- [x] RLS cohérent avec zones (admin uniquement)

---

## 2.3 Seed initial

- [x] Zones : Bamako, Ségou, Sikasso, Mopti, Kayes, Koulikoro, Gao, Tombouctou, Kidal
- [x] Localités Bamako : Lafiabougou, Hamdalaye, Badalabougou, Magnambougou, Quinzambougou, Sotuba, Banconi, Niaréla, Médina-Coura, Hippodrome, ACI 2000, Hamdallaye ACI
- [x] Script ou migration SQL exécutable une fois (idempotent si possible)

---

## 2.4 Store geo

- [x] Store `geo` : charger zones et localités une fois (au login ou au premier accès paramètres)
- [x] Exposer listes pour formulaires (assignation zone/localité) et filtres analytics

---

## 2.5 UI

- [x] Page ou section « Paramètres » > « Zones et localités » visible uniquement pour super_admin et admin (v-if + middleware)
- [x] Table ou cartes zones avec liste des localités, boutons Créer / Modifier / Supprimer

---

## Livrables

- CRUD zones et localités opérationnel (admin)
- Seed géographique malien appliqué
- Store `geo` utilisé ailleurs (utilisateurs, filtres)
