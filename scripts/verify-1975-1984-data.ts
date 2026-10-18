import fs from 'fs';
import path from 'path';

/**
 * Vérification LOCALE (sans réseau) de l'intégrité des années 1975 à 1984.
 *
 * Contrôle : nombre de jours, présence de tous les champs requis par le schéma
 * du projet, 24 relevés horaires par jour, cohérence des bornes de température,
 * et absence de valeurs négatives impossibles.
 *
 * Pour prouver que les valeurs proviennent EXACTEMENT de l'API Open-Meteo,
 * utiliser scripts/audit-1975-1984-vs-api.ts.
 */

const YEARS = [1984, 1983, 1982, 1981, 1980, 1979, 1978, 1977, 1976, 1975];
const DATA_DIR = path.join(process.cwd(), 'data');

const DAILY_KEYS = [
  'date',
  'weather_code',
  'temp_max',
  'temp_min',
  'temp_mean',
  'precipitation',
  'sunshine',
  'wind_speed_max',
  'sunrise',
  'sunset',
  'sunshine_duration_seconds',
  'sunshine_duration_minutes',
  'estimated_daily_sunshine_minutes',
  'estimated_daily_sunshine',
  'sunshine_difference_minutes',
  'sunshine_consistency'
];

const HOURLY_KEYS = [
  'time',
  'temp',
  'humidity',
  'dew_point',
  'precipitation',
  'weather_code',
  'pressure',
  'wind_speed',
  'wind_gusts',
  'visibility',
  'uv_index',
  'sunshine',
  'estimated_hourly_sunshine_minutes'
];

// Champs qui doivent toujours être renseignés par l'API sur cette période.
const DAILY_REQUIRED = [
  'date',
  'weather_code',
  'temp_max',
  'temp_min',
  'temp_mean',
  'precipitation',
  'sunshine',
  'wind_speed_max',
  'sunrise',
  'sunset'
];

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function expectedDaysFor(year: number): number {
  return isLeapYear(year) ? 366 : 365;
}

type YearReport = {
  year: number;
  expected: number;
  dailyFiles: number;
  hourlyFiles: number;
  errors: string[];
  warnings: string[];
};

function checkYear(year: number): YearReport {
  const errors: string[] = [];
  const warnings: string[] = [];
  const expected = expectedDaysFor(year);

  const dailyYearDir = path.join(DATA_DIR, 'daily', String(year));
  const hourlyYearDir = path.join(DATA_DIR, 'hourly', String(year));

  if (!fs.existsSync(dailyYearDir)) {
    errors.push(`Dossier daily manquant: ${dailyYearDir}`);
    return { year, expected, dailyFiles: 0, hourlyFiles: 0, errors, warnings };
  }
  if (!fs.existsSync(hourlyYearDir)) {
    errors.push(`Dossier hourly manquant: ${hourlyYearDir}`);
    return { year, expected, dailyFiles: 0, hourlyFiles: 0, errors, warnings };
  }

  const months = fs
    .readdirSync(dailyYearDir)
    .filter((name) => /^\d{2}$/.test(name))
    .sort();

  if (months.length !== 12) {
    errors.push(`Nombre de mois = ${months.length} (12 attendus)`);
  }

  let dailyFiles = 0;
  let hourlyFiles = 0;

  for (const month of months) {
    const dailyMonthDir = path.join(dailyYearDir, month);
    const hourlyMonthDir = path.join(hourlyYearDir, month);
    if (!fs.existsSync(hourlyMonthDir)) {
      errors.push(`Dossier hourly manquant: ${hourlyMonthDir}`);
      continue;
    }

    const dayFiles = fs.readdirSync(dailyMonthDir).filter((f) => f.endsWith('.json')).sort();

    for (const dayFile of dayFiles) {
      const day = dayFile.replace('.json', '');
      const expectedDate = `${year}-${month}-${day}`;
      dailyFiles++;

      let daily: Record<string, unknown>;
      try {
        daily = JSON.parse(fs.readFileSync(path.join(dailyMonthDir, dayFile), 'utf-8'));
      } catch (e) {
        errors.push(`${expectedDate}: JSON illisible (${(e as Error).message})`);
        continue;
      }

      const storedKeys = Object.keys(daily);
      const missingKeys = DAILY_KEYS.filter((k) => !storedKeys.includes(k));
      const extraKeys = storedKeys.filter((k) => !DAILY_KEYS.includes(k));
      if (missingKeys.length > 0) {
        errors.push(`${expectedDate}: champ(s) daily manquant(s): ${missingKeys.join(', ')}`);
      }
      if (extraKeys.length > 0) {
        errors.push(`${expectedDate}: champ(s) daily inattendu(s): ${extraKeys.join(', ')}`);
      }

      for (const key of DAILY_REQUIRED) {
        const value = daily[key];
        if (value === undefined || value === null) {
          errors.push(`${expectedDate}: valeur API nulle ou absente pour "${key}"`);
        }
      }

      if (daily.date !== expectedDate) {
        errors.push(`${expectedDate}: date incohérente (${String(daily.date)})`);
      }

      const tempMax = daily.temp_max as number;
      const tempMin = daily.temp_min as number;
      if (typeof tempMax === 'number' && typeof tempMin === 'number' && tempMax < tempMin) {
        errors.push(`${expectedDate}: temp_max (${tempMax}) < temp_min (${tempMin})`);
      }

      const precip = daily.precipitation as number;
      if (typeof precip === 'number' && precip < 0) {
        errors.push(`${expectedDate}: précipitation négative (${precip})`);
      }

      const sunshine = daily.sunshine as number;
      if (typeof sunshine === 'number' && sunshine < 0) {
        errors.push(`${expectedDate}: ensoleillement négatif (${sunshine})`);
      }

      // Fichier horaire du même jour
      const hourlyFile = path.join(hourlyMonthDir, dayFile);
      if (!fs.existsSync(hourlyFile)) {
        errors.push(`${expectedDate}: fichier horaire manquant`);
        continue;
      }
      hourlyFiles++;

      let hourly: Array<Record<string, unknown>>;
      try {
        hourly = JSON.parse(fs.readFileSync(hourlyFile, 'utf-8'));
      } catch (e) {
        errors.push(`${expectedDate}: JSON horaire illisible (${(e as Error).message})`);
        continue;
      }

      if (!Array.isArray(hourly)) {
        errors.push(`${expectedDate}: données horaires inattendues (tableau attendu)`);
        continue;
      }

      if (hourly.length !== 24) {
        errors.push(`${expectedDate}: ${hourly.length} relevés horaires (24 attendus)`);
      }

      hourly.forEach((hour, index) => {
        const hourTime = hour.time as string;
        if (typeof hourTime !== 'string' || !hourTime.startsWith(expectedDate)) {
          errors.push(`${expectedDate}: relevé horaire n°${index} hors date (${String(hourTime)})`);
        }
        const hourKeys = Object.keys(hour);
        const hourMissing = HOURLY_KEYS.filter((k) => !hourKeys.includes(k));
        const hourExtra = hourKeys.filter((k) => !HOURLY_KEYS.includes(k));
        if (hourMissing.length > 0) {
          errors.push(`${hourTime}: champ(s) horaire manquant(s): ${hourMissing.join(', ')}`);
        }
        if (hourExtra.length > 0) {
          errors.push(`${hourTime}: champ(s) horaire inattendu(s): ${hourExtra.join(', ')}`);
        }
      });
    }
  }

  if (dailyFiles !== expected) {
    errors.push(`${dailyFiles} fichiers daily sur ${expected} attendus`);
  }
  if (hourlyFiles !== expected) {
    errors.push(`${hourlyFiles} fichiers hourly sur ${expected} attendus`);
  }

  if (warnings.length === 0 && errors.length === 0) {
    console.log(`[OK] ${year}: ${dailyFiles} jours daily + ${hourlyFiles} jours hourly (${expected} attendus)`);
  } else {
    console.log(`[KO] ${year}: ${dailyFiles}/${expected} daily, ${hourlyFiles}/${expected} hourly, ${errors.length} erreur(s)`);
    for (const err of errors.slice(0, 20)) console.log(`     - ${err}`);
    if (errors.length > 20) console.log(`     ... et ${errors.length - 20} autre(s) erreur(s)`);
    for (const warn of warnings.slice(0, 10)) console.log(`     ~ ${warn}`);
  }

  return { year, expected, dailyFiles, hourlyFiles, errors, warnings };
}

function verifyRange(): boolean {
  console.log('[INFO] Vérification locale des années 1975-1984 (aucun accès réseau)');
  console.log(`[INFO] Dossier de données: ${DATA_DIR}`);
  console.log('');

  const reports = YEARS.map(checkYear);

  const totalErrors = reports.reduce((sum, r) => sum + r.errors.length, 0);
  const totalDays = reports.reduce((sum, r) => sum + r.dailyFiles, 0);
  const expectedTotal = YEARS.reduce((sum, y) => sum + expectedDaysFor(y), 0);

  console.log('');
  console.log('[RESUME] ==== Bilan 1975-1984 ====');
  console.log(`[RESUME] Années vérifiées: ${reports.length}`);
  console.log(`[RESUME] Jours daily présents: ${totalDays} / ${expectedTotal}`);
  console.log(`[RESUME] Erreurs détectées: ${totalErrors}`);

  if (totalErrors === 0 && totalDays === expectedTotal) {
    console.log('');
    console.log(`[SUCCESS] ✅ Les 10 années sont complètes et intègres (${totalDays} jours).`);
    console.log('[INFO] Pour prouver l\'exactitude des valeurs face à l\'API : npx tsx scripts/audit-1975-1984-vs-api.ts');
    return true;
  }

  console.log('');
  console.log('[FAILURE] ❌ Des fichiers manquent ou sont invalides. Relancez les scripts de récupération des années concernées.');
  return false;
}

if (require.main === module) {
  const ok = verifyRange();
  process.exit(ok ? 0 : 1);
}

export { verifyRange };