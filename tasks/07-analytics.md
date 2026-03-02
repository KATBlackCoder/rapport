# 07 — Dashboard & Analytics

**Statut :** À faire  
**Réf. BRIEF :** Analytics & Export, UI conditionnelle (Dashboard, Export)

## Objectif

Graphiques style Google Forms (barres, camembert, courbes), filtres par zone, localité, rôle, date. Export Excel en trois modes : individuel, collectif, groupé.

---

## 7.1 Droits d’accès

- [ ] Dashboard et graphiques : super_admin, admin, manager, et utilisateur avec view_responses (v-if + middleware)
- [ ] Bouton « Exporter » : même règle que dashboard
- [ ] Options « Groupé » et « Collectif » : super_admin et admin uniquement
- [ ] Option « Individuel » : manager, superviseur/employé avec view_responses (leurs données uniquement)

---

## 7.2 Graphiques

- [ ] Vue Chart.js (vue-chartjs) : graphiques en barres, camembert, courbes
- [ ] Données agrégées selon filtres : par question/champ, par date, par zone/localité/rôle selon droits
- [ ] Filtres : date (jour/semaine/mois), utilisateur, rôle, zone, localité
- [ ] Style lisible (contraste, légendes)

---

## 7.3 Export Excel (SheetJS xlsx)

- [ ] Mode Individuel : réponses d’un seul utilisateur (sélection ou utilisateur courant si view_responses)
- [ ] Mode Collectif : toutes les réponses d’un questionnaire (admin/super_admin)
- [ ] Mode Groupé : par rôle, zone, localité, superviseur ou période (jour/semaine/mois) (admin/super_admin)
- [ ] Filtres communs : date, utilisateur, rôle, zone, localité
- [ ] Génération côté client ou API selon volume ; téléchargement fichier .xlsx

---

## 7.4 Page Dashboard

- [ ] Résumé : nombre de soumissions, par statut, par type de formulaire
- [ ] Graphiques principaux selon droits (ex. réponses par jour, par zone, par formulaire)
- [ ] Liens rapides vers soumissions, export

---

## Livrables

- Dashboard avec graphiques et filtres selon rôles
- Export Excel en 3 modes avec droits et filtres cohérents
