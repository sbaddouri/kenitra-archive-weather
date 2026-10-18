# Commandes d'ajout d'une plage d'années (Open-Meteo, best_match)

## Procédure générique (toute plage d'années)

Les commandes ci-dessous s'appliquent à n'importe quelle plage, pas seulement 1975-1984.

```powershell
Set-Location "C:\Users\sofia\Desktop\kenitraarchiveweather"

# 1. Récupérer les années une par une (une requête API par année)
@(1974,1973,1972,1971,1970,1969,1968,1967,1966,1965) | ForEach-Object {
    npx tsx scripts/fetch-year-$_.ts
    if ($LASTEXITCODE -ne 0) { Write-Host "Échec $_" -ForegroundColor Red; break }
    Start-Sleep -Seconds 5
}

# 2. Vérification locale (fichiers, schéma, 24 relevés/jour)
npx tsx scripts/verify-years-data.ts 1965 1974

# 3. Audit : chaque valeur stockée comparée à l'API, égalité stricte
npx tsx scripts/audit-years-vs-api.ts 1965 1974

# 4. Mise en ligne
git add data/daily/1965 data/daily/1966 data/daily/1967 data/daily/1968 data/daily/1969
git add data/daily/1970 data/daily/1971 data/daily/1972 data/daily/1973 data/daily/1974
git add data/hourly/1965 data/hourly/1966 data/hourly/1967 data/hourly/1968 data/hourly/1969
git add data/hourly/1970 data/hourly/1971 data/hourly/1972 data/hourly/1973 data/hourly/1974
git status --porcelain | Measure-Object | ForEach-Object { "Fichiers : $($_.Count)" }
git commit -m "data: add complete 1965-1974 daily+hourly records (3652 days, 10 years, Open-Meteo best_match)"
git push origin main
```

**Avant de lancer l'import d'une nouvelle plage**, appliquer la correction de la règle
d'ensoleillement aux scripts concernés (voir « Correction appliquée » plus bas) :
`calculateHourlySunshine()` → `calculateHourlySunshineWithDaylight()`.

Plages déjà en ligne et vérifiées :

| Plage | Jours | Bissextiles | Audit (valeurs comparées) |
|---|---|---|---|
| 1945 → 1954 | 3 652 | 1948, 1952 | 1 197 856 — 0 écart |
| 1955 → 1964 | 3 653 | 1956, 1960, 1964 | 1 198 184 — 0 écart |
| 1965 → 1974 | 3 652 | 1968, 1972 | 1 197 856 — 0 écart |
| 1975 → 1984 | 3 653 | 1976, 1980, 1984 | 1 198 184 — 0 écart |

> `audit-years-vs-api.ts` réessaie automatiquement en cas de limitation de débit Open-Meteo
> (HTTP 429) avec un délai exponentiel, et attend 6 s entre deux années. Sur les longues séries,
> un premier passage peut renvoyer des 429 : c'est transitoire, relancer le script suffit.

---

## Référence : années 1975 → 1984

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

> **Correction appliquée (18/10/2026)** : les scripts 1965-1984 utilisaient la fonction dépréciée
> `calculateHourlySunshine()`, qui attribue de l'ensoleillement **la nuit** (45 à 60 min/h). Elle a été
> remplacée par `calculateHourlySunshineWithDaylight()` (lever/coucher du soleil + élévation solaire),
> qui est la fonction employée par `fetch-weather.ts` et par les données 1985-2026. Sans cette
> correction, ces années auraient été incohérentes avec leurs voisines et auraient faussé les
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
npx tsx scripts/verify-years-data.ts 1975 1984
```

Attendu : `[SUCCESS] ✅ Les 10 années sont complètes et intègres (3653 jours).`

---

## Étape 3 — Audit d'exactitude contre l'API

Relit l'API Open-Meteo et compare **chaque valeur stockée** à la valeur renvoyée,
en égalité stricte (aucune tolérance d'arrondi). Aucun fichier n'est modifié.

```powershell
npx tsx scripts/audit-years-vs-api.ts 1975 1984
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
git add scripts/verify-years-data.ts scripts/audit-years-vs-api.ts

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
npx tsx scripts/verify-years-data.ts 1975 1984
npx tsx scripts/audit-years-vs-api.ts 1975 1984
```