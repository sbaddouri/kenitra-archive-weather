# Commandes de Déploiement Vercel pour Kénitra Weather Archive

## Résumé du projet
✅ **Kénitra Weather Archive** - Archives climatologiques complètes de Kénitra, Gharb-Chrarda-Béni Hssen, Maroc
- Données de Janvier 1940 à Octobre 2026 (structure vide prête pour récupération)
- Coordonnées GPS : 34.300616413859444, -6.599642231879808
- Modèle utilisé : `best_match` (ERA5 reanalysis via Open-Meteo)
- Timezone : Africa/Casablanca

## Commandes à exécuter pour le déploiement

### 1. Vérifier l'état actuel du projet
```powershell
# Se positionner dans le dossier du projet
cd c:\Users\sofia\Desktop\kenitraarchiveweather

# Vérifier les fichiers modifiés
git status

# Vérifier la structure des données (années 1940-2026, mois 01-12 / 01-10 pour 2026)
dir data\daily
dir data\hourly

# Compter le nombre total d'années (devrait être 87 : 1940-2026)
(dir data\daily).Count
```

### 2. Ajouter les fichiers au git
```powershell
# Ajouter tous les fichiers de structure
git add data/daily/*
git add data/hourly/*
git add data/last-update-status.json

# Ajouter les scripts mis à jour
git add scripts/fetch-weather.ts
git add scripts/fetch-year-*.ts
git add scripts/verify-*.ts

# Ajouter les fichiers de configuration mis à jour
git add package.json
git add next.config.ts
git add src/app/layout.tsx
git add src/app/page.tsx
git add src/app/radar/page.tsx
git add src/app/records-absolus/page.tsx
git add README.md

# Vérifier ce qui sera commité
git status
```

### 3. Créer un commit pour la migration vers Kénitra
```powershell
# Créer un commit descriptif
git commit -m "feat: migration complète vers Kénitra

- Changement de coordonnées GPS : 34.300616, -6.599642 (Kénitra)
- Suppression de toutes les données Open-Meteo Guercif
- Conservation structure vide 1940-2026 pour nouvelles données Kénitra
- Mise à jour routes : /guercif → /kenitra
- Mise à jour package.json, layout, page, radar, records
- Nettoyage Vercel (.vercel, .env.local, .vercelignore)
- Suppression dossier data-backup
- Prêt pour nouveau repo GitHub Kénitra"
```

### 4. Pousser les changements sur GitHub (nouveau repo)
```powershell
# Changer le remote vers le NOUVEAU repo GitHub Kénitra
# (Remplacez par l'URL de votre nouveau repo)
git remote set-url origin https://github.com/sbaddouri/kenitra-archive-weather.git

# Pousser sur la branche main
git push -u origin main
```

### 5. Déployer sur Vercel (nouveau projet)

#### Option A : Déploiement automatique via GitHub (recommandé)
1. Allez sur https://vercel.com/new
2. Importez le nouveau repo `kenitra-archive-weather`
3. Vercel détectera automatiquement Next.js
4. Le site sera déployé à : https://kenitraarchiveweather.vercel.app

#### Option B : Déploiement manuel via CLI Vercel
```powershell
# Installer Vercel CLI si ce n'est pas déjà fait
npm i -g vercel

# Se connecter à Vercel
vercel login

# Déployer en production (créera un nouveau projet)
vercel --prod
```

### 6. Configurer GitHub Actions
Une fois le repo créé sur GitHub :
1. Allez dans Settings > Secrets and variables > Actions
2. Aucune secret n'est requis (utilise GITHUB_TOKEN automatique)
3. Le workflow `.github/workflows/update-weather.yml` s'exécutera automatiquement chaque jour à 8h UTC

### 7. Vérifier le déploiement
```powershell
# Vérifier que le site fonctionne
curl https://kenitraarchiveweather.vercel.app

# Vérifier l'API des données (structure vide)
curl https://kenitraarchiveweather.vercel.app/api/weather/1940
```

## Validation du déploiement

Après déploiement, vérifiez que :
1. **Le site charge correctement** : https://kenitraarchiveweather.vercel.app
2. **Le titre affiche "Kénitra Weather Archive"**
3. **Les routes fonctionnent** : /climatologie, /radar, /rapport-scientifique, /archives
4. **La structure de données est vide** (prête pour récupération Open-Meteo Kénitra)
5. **Le radar pointe vers Kénitra** (coordonnées 34.3006, -6.5996)

## Structure des données (vide, prête pour Kénitra)
```
data/
├── daily/
│   ├── 1940/ ... 2025/  # 12 mois chacun (01-12)
│   └── 2026/            # 10 mois (01-10, jusqu'à Octobre 2026)
└── hourly/
    ├── 1940/ ... 2025/  # 12 mois chacun
    └── 2026/            # 10 mois
```

## Scripts disponibles pour récupération données Kénitra
- `scripts/fetch-weather.ts` : Récupération incrémentale quotidienne (pour GitHub Actions)
- `scripts/fetch-year-YYYY.ts` : Récupération année par année (1940-2026)
- `scripts/verify-YYYY-data.ts` : Vérification d'intégrité par année

## Points importants
- ✅ **Coordonnées Kénitra** : 34.300616413859444, -6.599642231879808
- ✅ **Timezone** : Africa/Casablanca
- ✅ **Modèle Best Match** : ERA5 reanalysis
- ✅ **Structure vide 1940-2026** : Prête pour population via GitHub Actions
- ✅ **Routes mises à jour** : `/kenitra` au lieu de `/guercif`
- ✅ **Vercel dissocié** : Nouveau projet à créer
- ✅ **GitHub remote** : À pointer vers nouveau repo `kenitra-archive-weather`

## Prochaines étapes après déploiement
1. Créer le repo GitHub `kenitra-archive-weather`
2. Pousser le code sur ce nouveau repo
3. Créer le projet Vercel lié à ce repo
4. Laisser GitHub Actions peupler les données jour par jour (démarre à 1940)
5. Ou lancer manuellement les scripts `fetch-year-YYYY.ts` pour remplir plus vite