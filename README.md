# KIDVERSE - Application de gestion pour garderies

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

Plateforme complète de gestion de garderies bilingue (FR/EN).

---

## 🚀 Démarrage local

### Prérequis

- Node.js >= 18.x
- pnpm >= 8.x (ou npm)
- Docker (optionnel, pour la base de données)

### Installation

```bash
# 1. Cloner le repo
git clone https://github.com/galyle/kidverse.git
cd kidverse

# 2. Installer les dépendances
pnpm install

# 3. Configurer l'environnement
cp env.example .env

# 4. Lancer les services (PostgreSQL, Redis)
docker-compose up -d

# 5. Lancer l'application
pnpm dev
```

### Accès

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000/fr |
| API | http://localhost:3000/api |
| API (direct) | http://localhost:4000 |
| Swagger | http://localhost:4000/api/docs |

### Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@kidverse.app | Admin123! |
| Directeur | director@kidverse.app | Director123! |
| Éducateur | educator@kidverse.app | Educator123! |
| Parent | parent@kidverse.app | Parent123! |

---

## 🌐 Déploiement

L'application est configurée pour Vercel :

| Environnement | URL |
|---------------|-----|
| Production | https://kidverse.app |
| Prévisualisation | https://kidverse-git-[branch].vercel.app |

### Variables d'environnement (Vercel)

```env
NODE_ENV=production
NEXTAUTH_URL=https://kidverse.app
NEXTAUTH_SECRET=your-secret
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
```

---

## 📁 Structure du projet

```
kidverse/
├── apps/
│   ├── web/          # Frontend Next.js
│   └── api/          # Backend NestJS
├── packages/
│   ├── database/     # Prisma schema
│   └── ui/           # Composants partagés
├── docker-compose.yml
└── package.json
```

---

## 📋 Fonctionnalités

- ✅ Gestion des enfants et inscriptions
- ✅ Présences (check-in/check-out)
- ✅ Mode kiosque pour tablettes
- ✅ Portail parent
- ✅ Messagerie interne
- ✅ Gestion du personnel
- ✅ Facturation et paiements
- ✅ Rapports et analytics
- ✅ Multi-centres
- ✅ Bilingue (FR/EN)
- ✅ PWA (mode hors-ligne)

---

## 🛠 Scripts disponibles

```bash
pnpm dev          # Développement
pnpm build        # Build production
pnpm start        # Démarrer en production
pnpm lint         # Linter
pnpm db:studio    # Prisma Studio
pnpm db:push      # Push schema DB
```

---

## 📄 Licence

Propriétaire - GALYLÉ Technologies Inc.
