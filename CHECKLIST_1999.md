# Checklist pour l'ajout d'années historiques - Kénitra Weather Archive

## ✅ Préparation
- [ ] Ouvrir PowerShell en tant qu'administrateur si nécessaire
- [ ] Se placer dans le dossier du projet : `cd c:\Users\sofia\Desktop\kenitraarchiveweather`
- [ ] Vérifier que Node.js est installé : `node --version`
- [ ] Vérifier que Git est installé : `git --version`

## ✅ Vérification de l'état actuel
- [ ] Vérifier les fichiers modifiés : `git status`
- [ ] Vérifier les années existantes : `dir data\daily`
- [ ] Compter le nombre d'années : `(dir data\daily).Count` (devrait être 87 : 1940-2026)
- [ ] Vérifier une année spécifique : `Test-Path data\daily\1940`

## ✅ Installation des dépendances
- [ ] Vérifier les dépendances Node.js : `npm list`
- [ ] Installer axios si nécessaire : `npm install axios`
- [ ] Installer date-fns si nécessaire : `npm install date-fns`
- [ ] Installer ts-node/typescript si nécessaire : `npm install -D ts-node typescript`

## ✅ Récupération des données annuelles (ex: 1940)
- [ ] Exécuter le script de récupération : `npx tsx scripts/fetch-year-1940.ts`
- [ ] **VÉRIFIER** que le script se termine avec "[SUCCESS]"
- [ ] **VÉRIFIER** qu'il y a 365/366 jours mentionnés (selon année bissextile)
- [ ] **VÉRIFIER** qu'il n'y a pas d'erreur API

## ✅ Vérification des données récupérées
- [ ] Vérifier que le dossier année existe : `Test-Path data\daily\1940`
- [ ] Vérifier les mois : `dir data\daily\1940` (devrait être 12 dossiers)
- [ ] Vérifier janvier : `dir data\daily\1940\01` (devrait être 31 fichiers)
- [ ] Vérifier décembre : `dir data\daily\1940\12` (devrait être 31 fichiers)

## ✅ Validation d'intégrité
- [ ] Exécuter le script de vérification : `npx tsx scripts/verify-1940-data.ts`
- [ ] **VÉRIFIER** que le script se termine avec "[SUCCESS] ✅"
- [ ] **VÉRIFIER** qu'il y a 365/366 jours valides
- [ ] **VÉRIFIER** qu'il n'y a pas de jours invalides

## ✅ Vérification de non-régression
- [ ] Vérifier que les autres années sont intactes
- [ ] Compter le nombre total d'années : `(dir data\daily).Count` (devrait être 87)

## ✅ Préparation Git
- [ ] Ajouter les fichiers de l'année : `git add data/daily/1940/*`
- [ ] Ajouter les fichiers horaires : `git add data/hourly/1940/*`
- [ ] Ajouter les nouveaux scripts : `git add scripts/fetch-year-1940.ts scripts/verify-1940-data.ts`
- [ ] Vérifier ce qui sera commité : `git status`

## ✅ Commit
- [ ] Créer le commit : `git commit -m "feat: ajout de l'année 1940 complète avec données exactes Open-Meteo"`
- [ ] **VÉRIFIER** que le commit a réussi : `git log --oneline -1`

## ✅ Push sur GitHub
- [ ] Pousser sur GitHub : `git push origin main`
- [ ] Vérifier que le push a réussi

## ✅ Déploiement Vercel
- [ ] Attendre le déploiement automatique (si configuré)
- [ ] **OU** déployer manuellement : `vercel --prod`
- [ ] Vérifier le site : https://kenitraarchiveweather.vercel.app
- [ ] Vérifier que l'année 1940 est accessible

## ✅ Vérification finale
- [ ] Vérifier le statut Git final : `git status`
- [ ] Vérifier tous les dossiers annuels : `1940..2026 | % { "$_ : $(Test-Path data\daily\$_)" }`
- [ ] Documenter toute anomalie

## ⚠️ Points de vigilance
- **NE PAS** supprimer les années existantes
- **VÉRIFIER** que les données sont exactes (pas d'approximations)
- **TESTER** localement avant déploiement
- **CONSERVER** une backup avant modifications
- **DOCUMENTER** les problèmes rencontrés

## 📊 Métriques de succès
- [ ] 365/366 fichiers dans `data/daily/YYYY/`
- [ ] 365/366 fichiers dans `data/hourly/YYYY/`
- [ ] 87 années totales dans `data/daily/` (1940-2026)
- [ ] Script de vérification avec succès complet
- [ ] Commit créé avec message descriptif
- [ ] Push réussi sur GitHub
- [ ] Déploiement Vercel réussi
- [ ] Site web accessible avec l'année ajoutée

## 🔧 Commandes de secours
```powershell
# En cas d'erreur, annuler les changements
git reset --hard HEAD

# Supprimer l'année si problème
Remove-Item -Recurse -Force data\daily\1940
Remove-Item -Recurse -Force data\hourly\1940

# Revenir en arrière
git checkout -- data/
git clean -fd
```

## 📝 Journal de bord
| Date | Étape | Résultat | Problèmes | Actions |
|------|-------|----------|-----------|---------|
| | Initialisation | | | |
| | Vérification état | | | |
| | Récupération données | | | |
| | Validation données | | | |
| | Commit Git | | | |
| | Déploiement | | | |