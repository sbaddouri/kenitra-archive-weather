# Commandes de Déploiement pour ajout d'années historiques - Kénitra Weather Archive

## Résumé
Ce guide explique comment ajouter des années historiques (1940-1999) pour Kénitra.
- **Coordonnées GPS Kénitra** : `latitude=34.300616413859444`, `longitude=-6.599642231879808`
- **Fuseau horaire** : `Africa/Casablanca` 
- **Modèle** : `best_match` (ERA5 reanalysis)
- **Période** : Janvier 1940 à Décembre 1999 (60 années à ajouter)

## Commandes à exécuter MANUELLEMENT étape par étape

### 1. Vérifier l'état actuel du projet
```powershell
# Se positionner dans le dossier du projet
cd c:\Users\sofia\Desktop\kenitraarchiveweather

# Vérifier les fichiers existants
git status

# Vérifier les années actuellement présentes (devrait être 87 : 1940-2026, mais vides au début)
dir data\daily
dir data\hourly

# Compter le nombre d'années actuelles
(dir data\daily).Count
(dir data\hourly).Count
```

### 2. Installer les dépendances si nécessaire
```powershell
# Vérifier que Node.js est installé
node --version

# Vérifier que les dépendances sont installées
npm list axios date-fns

# Si besoin, installer les dépendances manquantes
npm install axios date-fns
```

### 3. Récupérer les données année par année depuis Open-Meteo
```powershell
# Pour chaque année de 1940 à 1999, exécuter :
# (Remplacez YYYY par l'année souhaitée, ex: 1940, 1941, etc.)

npx tsx scripts/fetch-year-YYYY.ts

# Exemples :
npx tsx scripts/fetch-year-1940.ts
npx tsx scripts/fetch-year-1941.ts
# ... jusqu'à 1999

# VÉRIFIER à chaque fois que le script se termine avec "[SUCCESS]"
# et qu'il mentionne le bon nombre de jours (365 ou 366 selon bissextile)
```

### 4. Vérifier l'intégrité des données pour chaque année
```powershell
# Pour chaque année récupérée :
npx tsx scripts/verify-YYYY-data.ts

# Exemples :
npx tsx scripts/verify-1940-data.ts
# ... jusqu'à 1999

# VÉRIFIER que le script se termine avec "[SUCCESS] ✅"
```

### 5. Vérification de non-régression
```powershell
# Vérifier que les années 2000-2026 sont intactes
Test-Path data\daily\2000
Test-Path data\daily\2026

# Compter le nombre total d'années (devrait être 87 : 1940-2026)
(dir data\daily).Count
```

### 6. Préparation Git (après avoir récupéré plusieurs années)
```powershell
# Ajouter les fichiers des années récupérées
git add data/daily/1940/*
git add data/hourly/1940/*
# ... répéter pour chaque année ajoutée

# Ajouter les scripts si nouveaux
git add scripts/fetch-year-1940.ts scripts/verify-1940-data.ts
# ... pour chaque année

# Vérifier ce qui sera commité
git status
```

### 7. Commit
```powershell
# Créer un commit descriptif (peut regrouper plusieurs années)
git commit -m "feat: ajout années 1940-1999 complètes avec données exactes Open-Meteo Kénitra

- 60 années ajoutées (1940-1999)
- Données exactes sans approximation ni arrondi
- Modèle 'best_match' (ERA5)
- Coordonnées Kénitra : 34.3006, -6.5996
- Préservation années 2000-2026 intactes
- Vérification d'intégrité réussie pour chaque année"
```

### 8. Push sur GitHub
```powershell
# Pousser sur GitHub
git push origin main

# Vérifier que le push a réussi
```

### 9. Déploiement Vercel
```powershell
# Option A : Automatique via GitHub (recommandé)
# Le déploiement se fait automatiquement après le push

# Option B : Manuel
vercel --prod

# Vérifier le site
curl https://kenitraarchiveweather.vercel.app
```

## Années bissextiles à noter (366 jours)
1940, 1944, 1948, 1952, 1956, 1960, 1964, 1968, 1972, 1976, 1980, 1984, 1988, 1992, 1996

## Points de vigilance
- **NE PAS** supprimer les années 2000-2026 existantes
- **VÉRIFIER** que les données sont exactes (pas d'approximations)
- **TESTER** localement avant déploiement : `npm run dev`
- **CONSERVER** une backup avant modifications
- **DOCUMENTER** les problèmes rencontrés

## Métriques de succès final
- 87 années totales dans `data/daily/` (1940-2026)
- 87 années totales dans `data/hourly/` (1940-2026)
- Scripts de vérification avec succès complet pour chaque année
- Commit(s) créés avec messages descriptifs
- Push réussi sur GitHub
- Déploiement Vercel réussi
- Site web accessible avec toutes les années