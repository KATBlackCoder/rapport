# 09 — V2 Géolocalisation (architecture uniquement)

**Statut :** À faire (après MVP)  
**Réf. BRIEF :** Géolocalisation (architecture V2)

## Objectif

Ne pas implémenter dans le MVP. Préparer l’architecture : colonnes DB déjà prévues en 00 ; documenter l’usage futur.

---

## 9.1 DB (déjà prévu en 00)

- [ ] Colonnes dans `submission_rows` : `latitude`, `longitude`, `accuracy` (nullable) — déjà incluses dans le schéma 00-infrastructure

---

## 9.2 Documentation architecture V2

- [ ] Documenter dans `docs/ARCHITECTURE.md` (ou équivalent) :
  - Capture : API `navigator.geolocation`
  - Carte : Leaflet.js + OpenStreetMap
  - Usage prévu : vérification présence terrain, visualisation zones visitées, détection incohérence zone déclarée vs GPS
- [ ] Aucune implémentation code avant validation produit

---

## Livrables

- Schéma DB prêt pour la géoloc
- Doc d’architecture V2 pour implémentation future
