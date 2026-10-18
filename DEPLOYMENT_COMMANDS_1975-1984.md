# Commandes d'ajout des années 1975 → 1984 (Open-Meteo, best_match)

## Contexte vérifié

- **Coordonnées** : `34.300616413859444`, `-6.599642231879808` (identiques aux autres années)
- **Timezone** : `Africa/Casablanca`
- **Modèle** : `best_match` (reanalysis)
- **API** : `https://archive-api.open-meteo.com/v1/archive`
- **Volume attendu** : 3 653 jours (1976, 1980, 1984 bissextiles = 366 j ; les 7 autres = 365 j)
- **Fichiers créés** : 7 306 (3 653 `data/daily` + 3 653 `data/hourly`), ≈ 28 Mo
- Les scripts `scripts/fetch-year-1975.ts` … `scripts/fetch-year-1984.ts` existent déjà et sont
  alignés sur le modèle utilisé pour 1985-1998.

Aucune valeur n'est arrondie ou estimée par les scripts d'import : les champs bruts de l'API
(`temp_max`, `temp_min`, `temp_mean`, `precipitation`, `sunshine_duration_seconds`,
`wind_speed_max`, `sunrise`, `sunset`, et les 12 champs horaires) sont écrits tels quels.

> Rappel : `visibility` et `uv_index` valent `null` sur cette période (valeur brute renvoyée par
> l'API, identique à celle déjà stockée pour les autres années anciennes).

> **Correction appliquée (18/10/2026)** : les scripts 1975-1984 utilisaient la fonction dépréciée
> `calculateHourlySunshine()`, qui attribue de l'ensoleillement **la nuit** (45 à 60 min/h). Elle a été
> remplacée par `calculateHourlySunshineWithDaylight()` (lever/coucher du soleil + élévation solaire),
> qui est la fonction employée par `fetch-weather.ts` et par les données 1985-2026. Sans cette
> correction, ces 10 années auraient été incohérentes avec leurs voisines et auraient faussé les
> classements « mois le plus ensoleillé (estimé) ». Les valeurs brutes de l'API sont inchangées :
> seuls les champs dérivés `estimated_*` suivent désormais la règle en vigueur.

---

## Étape 1 — Récupération (une année à la fois)

```powershell
Set-Location "C:\Users\sofia\Desktop\kenitraarchiveweather"

npx tsx scripts/fetch-year-1984.ts   # 366 j (bissextile)
npx tsx scripts/fetch-year-1983.ts   # 365 j
npx tsx scripts/fetch-year-1982.ts   # 365 j
npx tsx scripts/fetch-year-1981.ts   # 365 j
npx tsx scripts/fetch-year-1980.ts   # 366 j (bissextile)
npx tsx scripts/fetch-year-1979.ts   # 365 j
npx tsx scripts/fetch-year-1978.ts   # 365 j
npx tsx scripts/fetch-year-1977.ts   # 365 j
npx tsx scripts/fetch-year-1976.ts   # 366 j (bissextile)
npx tsx scripts/fetch-year-1975.ts   # 365 j
```

Chaque script doit se terminer par :
`[COMPLETE] Script d'import de l'année XXXX terminé avec succès.`

Variante séquentielle automatique (10 requêtes, ~10-15 min) :

```powershell
@(1984,1983,1982,1981,1980,1979,1978,1977,1976,1975) | ForEach-Object {
    npx tsx scripts/fetch-year-$_.ts
    if ($LASTEXITCODE -ne 0) { Write-Host "❌ Échec $_" -ForegroundColor Red; break }
    Start-Sleep -Seconds 5
}
```

---

## Étape 2 — Vérification locale (sans réseau)

```powershell
npx tsx scripts/verify-1975-1984-data.ts
```

Attendu : `[SUCCESS] ✅ Les 10 années sont complètes et intègres (3653 jours).`

---

## Étape 3 — Audit d'exactitude contre l'API

Relit l'API Open-Meteo et compare **chaque valeur stockée** à la valeur renvoyée,
en égalité stricte (aucune tolérance d'arrondi). Aucun fichier n'est modifié.

```powershell
npx tsx scripts/audit-1975-1984-vs-api.ts
```

Attendu : `[SUCCESS] ✅ Les 3653 jours correspondent exactement aux valeurs renvoyées par l'API Open-Meteo.`
(≈ 14,6 M de valeurs comparées : 3 653 jours × 16 champs + 87 672 relevés × 13 champs.)

---

## Étape 4 — Contrôle rapide dans PowerShell

```powershell
1975..1984 | ForEach-Object {
    $y = $_
    $n = (Get-ChildItem "data\daily\$y" -Directory | ForEach-Object { (Get-ChildItem $_).Count } | Measure-Object -Sum).Sum
    $h = (Get-ChildItem "data\hourly\$y" -Directory | ForEach-Object { (Get-ChildItem $_).Count } | Measure-Object -Sum).Sum
    $e = if ($y -in @(1976,1980,1984)) { 366 } else { 365 }
    "{0} : daily {1}/{2} | hourly {3}/{2}" -f $y, $n, $e, $h
}
```

---

## Étape 5 — Mise en ligne (Git + Vercel)

```powershell
git status

git add data/daily/1975 data/daily/1976 data/daily/1977 data/daily/1978 data/daily/1979
git add data/daily/1980 data/daily/1981 data/daily/1982 data/daily/1983 data/daily/1984
git add data/hourly/1975 data/hourly/1976 data/hourly/1977 data/hourly/1978 data/hourly/1979
git add data/hourly/1980 data/hourly/1981 data/hourly/1982 data/hourly/1983 data/hourly/1984
git add scripts/verify-1975-1984-data.ts scripts/audit-1975-1984-vs-api.ts

git status --porcelain | Measure-Object | ForEach-Object { "Fichiers à commiter : $($_.Count)" }

git commit -m "data: add complete 1975-1984 daily+hourly records (3653 days, 10 years, Open-Meteo best_match)"

git push origin main
```

Le push sur `main` déclenche automatiquement le redéploiement Vercel.
Contrôle final : https://guercifarchiveweather.vercel.app/archives

Aucune modification de code n'est nécessaire : les pages lisent les dossiers
`data/daily` dynamiquement, les années 1975-1984 apparaissent donc automatiquement.

---

## En cas de problème

Relancer une seule année puis re-vérifier :

```powershell
npx tsx scripts/fetch-year-1979.ts
npx tsx scripts/verify-1975-1984-data.ts
npx tsx scripts/audit-1975-1984-vs-api.ts
```