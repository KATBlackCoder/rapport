# 05 — Interface de remplissage en table

**Statut :** À faire  
**Réf. BRIEF :** Module Questionnaires (format table), Logique conditionnelle (côté remplissage), Module Photos

## Objectif

Remplissage des questionnaires en format table (lignes = entrées, colonnes = champs), multi-lignes, champs conditionnels réactifs, cellule photo avec capture et compression, gestion offline.

---

## 5.1 Format table

- [ ] Lignes = entrées (row_index), colonnes = champs du formulaire
- [ ] Ajout de ligne dynamique (bouton « Ajouter une ligne »), grande zone tactile mobile
- [ ] Envoi de plusieurs réponses en une soumission (plusieurs submission_rows par submission)

---

## 5.2 Champs conditionnels (côté remplissage)

- [ ] Champs conditionnels invisibles par défaut (v-if basé sur useFormConditions)
- [ ] Apparition instantanée quand la condition est remplie (réactivité sans rechargement)
- [ ] Si condition non remplie : champ masqué et valeur effacée automatiquement (pas de données fantômes)
- [ ] L’agent ne voit pas la logique, uniquement le résultat (affichage/masquage)

---

## 5.3 Cellule photo

- [ ] Input type file accept="image/*" capture="environment" (caméra arrière directe sur mobile)
- [ ] Max 3 photos par ligne
- [ ] Compression obligatoire : browser-image-compression, cible 400 KB max, JPEG qualité 0.7, largeur max 1200 px
- [ ] Upload Supabase Storage : bucket `submissions`, structure `submissions/{submission_id}/{row_index}/photo_1.jpg` (après création submission)
- [ ] Champ `photo_urls` jsonb dans submission_rows (tableau d’URLs signées)

---

## 5.4 Offline — photos

- [ ] Si hors ligne : stocker photo en base64 dans IndexedDB (idb)
- [ ] À la reconnexion : upload automatique vers Supabase Storage puis nettoyage IndexedDB
- [ ] Indicateur visuel « En attente d’envoi » sur les photos en file d’attente

---

## 5.5 Logique journalier vs urgent

- [ ] Journalier : après premier envoi, l’employé peut uniquement ajouter des lignes (pas supprimer les réponses déjà soumises)
- [ ] Urgent : soumissions multiples possibles dans la journée (une soumission = un envoi)

---

## 5.6 UI remplissage

- [ ] Grandes cellules, bouton « Soumettre » très visible (pleine largeur, couleur d’accent)
- [ ] Indicateur réseau : En ligne / Faible / Hors ligne (réutilisé dans 08)
- [ ] Données en cours stockées dans store submissions (file offline si besoin) + persistedstate

---

## Livrables

- Interface de remplissage en table avec champs conditionnels réactifs
- Capture photo + compression + upload (ou file IndexedDB si offline)
- Comportement journalier (ajout seul après envoi) et urgent (multi-soumissions)
