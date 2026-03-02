# Tâches — Application Gestion Questionnaires (Rapport)

Tâches dérivées de `docs/BRIEF.md`. Ordre d’exécution aligné sur le périmètre MVP.

## Ordre d’exécution (MVP)

| # | Fichier | Module | Dépendances |
|---|---------|--------|-------------|
| 0 | [00-infrastructure.md](./00-infrastructure.md) | Infra Nuxt, Supabase, Pinia | — |
| 1 | [01-auth.md](./01-auth.md) | Authentification | 00 |
| 2 | [02-referentiels.md](./02-referentiels.md) | Zones & localités | 00, 01 |
| 3 | [03-users.md](./03-users.md) | CRUD utilisateurs | 00, 01 |
| 4 | [04-forms.md](./04-forms.md) | CRUD questionnaires | 00, 01 |
| 5 | [05-filling.md](./05-filling.md) | Remplissage en table | 00, 01, 04 |
| 6 | [06-submissions.md](./06-submissions.md) | Soumissions & renvoi | 00, 01, 04, 05 |
| 7 | [07-analytics.md](./07-analytics.md) | Dashboard & export Excel | 00, 01, 06 |
| 8 | [08-pwa-ui.md](./08-pwa-ui.md) | PWA, UI, RBAC | 00–07 |
| 9 | [09-v2-geo.md](./09-v2-geo.md) | V2 Géoloc (archi) | 00 |

## Conventions

- **Statut** : `À faire` | `En cours` | `Terminé`
- Sous-tâches : case à cocher `- [ ]` / `- [x]`
- Référence BRIEF : section ou ligne du brief quand pertinent

## Stack (rappel)

- Frontend : Nuxt 4 (SPA/SSR hybride), Nuxt UI v3, Tailwind v4
- Backend : Supabase (PostgreSQL, Auth, RLS, Realtime, Storage)
- State : Pinia + pinia-plugin-persistedstate
- Charts : vue-chartjs | Export : SheetJS (xlsx) | Drag : vue-draggable-plus | Photos : browser-image-compression, idb
