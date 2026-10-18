import axios from 'axios';
import fs from 'fs';
import path from 'path';
import {
  calculateHourlySunshineWithDaylight,
  calculateDailySunshine,
  formatSunshineDuration,
  calculateSunshineConsistency,
  convertOfficialSunshineToMinutes
} from '../src/lib/weather-colors';

/**
 * AUDIT D'EXACTITUDE : compare chaque valeur stockée dans data/ avec la valeur
 * renvoyée par l'API Open-Meteo Archive (modèle best_match).
 *
 * - Aucune tolérance : l'égalité est stricte (===). Si une valeur a été arrondie,
 *   réécrite ou inventée, ce script la signale.
 * - Les champs dérivés (sunshine_duration_minutes, estimated_*, etc.) sont
 *   recalculés avec les fonctions partagées du projet et comparés : cela prouve
 *   qu'ils suivent exactement la même règle que les autres années.
 *
 * Le réseau est utilisé uniquement pour relire l'API : aucun fichier n'est modifié.
 */

const LAT = 34.300616413859444;
const LON = -6.599642231879808;
const TIMEZONE = 'Africa/Casablanca';
const MODEL = 'best_match';

const YEARS = [1984, 1983, 1982, 1981, 1980, 1979, 1978, 1977, 1976, 1975];
const DATA_DIR = path.join(process.cwd(), 'data');
const PAUSE_BETWEEN_YEARS_MS = 1500;

type Maybe<T> = T | null;

interface ApiHourRow {
  time: string;
  temperature_2m: Maybe<number>;
  relative_humidity_2m: Maybe<number>;
  dew_point_2m: Maybe<number>;
  precipitation: Maybe<number>;
  weather_code: Maybe<number>;
  pressure_msl: Maybe<number>;
  wind_speed_10m: Maybe<number>;
  wind_gusts_10m: Maybe<number>;
  visibility: Maybe<number>;
  uv_index: Maybe<number>;
  sunshine_duration: Maybe<number>;
}

interface ApiResponse {
  timezone: string;
  daily: {
    time: string[];
    weather_code: Maybe<number>[];
    temperature_2m_max: Maybe<number>[];
    temperature_2m_min: Maybe<number>[];
    temperature_2m_mean: Maybe<number>[];
    precipitation_sum: Maybe<number>[];
    sunshine_duration: Maybe<number>[];
    wind_speed_10m_max: Maybe<number>[];
    sunrise: Maybe<string>[];
    sunset: Maybe<string>[];
  };
  hourly: {
    time: string[];
    temperature_2m: Maybe<number>[];
    relative_humidity_2m: Maybe<number>[];
    dew_point_2m: Maybe<number>[];
    precipitation: Maybe<number>[];
    weather_code: Maybe<number>[];
    pressure_msl: Maybe<number>[];
    wind_speed_10m: Maybe<number>[];
    wind_gusts_10m: Maybe<number>[];
    visibility: Maybe<number>[];
    uv_index: Maybe<number>[];
    sunshine_duration: Maybe<number>[];
  };
}

const REQUIRED_DAILY = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'temperature_2m_mean',
  'precipitation_sum',
  'sunshine_duration',
  'wind_speed_10m_max',
  'sunrise',
  'sunset'
];

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function expectedDaysFor(year: number): number {
  return isLeapYear(year) ? 366 : 365;
}

/** Égalité stricte : aucune tolérance d'arrondi. */
function strictlyEqual(a: unknown, b: unknown): boolean {
  const aMissing = a === null || a === undefined;
  const bMissing = b === null || b === undefined;
  if (aMissing || bMissing) return aMissing && bMissing;
  return a === b;
}

function show(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  return JSON.stringify(value);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchYear(year: number): Promise<ApiResponse> {
  const url =
    `https://archive-api.open-meteo.com/v1/archive?latitude=${LAT}&longitude=${LON}` +
    `&start_date=${year}-01-01&end_date=${year}-12-31` +
    '&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,precipitation,weather_code,pressure_msl,wind_speed_10m,wind_gusts_10m,visibility,uv_index,sunshine_duration' +
    '&daily=weather_code,temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum,sunshine_duration,wind_speed_10m_max,sunrise,sunset' +
    `&timezone=${TIMEZONE}&models=${MODEL}`;

  const response = await axios.get<ApiResponse>(url, { timeout: 180000 });
  const data = response.data;

  if (!data || !data.daily || !data.hourly || !Array.isArray(data.daily.time) || data.daily.time.length === 0) {
    throw new Error(`Réponse invalide de l'API pour ${year}`);
  }
  if (data.daily.time.length !== expectedDaysFor(year)) {
    throw new Error(`L'API a renvoyé ${data.daily.time.length} jours pour ${year} (${expectedDaysFor(year)} attendus)`);
  }
  return data;
}

type AuditCounters = {
  comparedValues: number;
  daysCompared: number;
  hoursCompared: number;
  errors: string[];
  nullFromApi: number;
};

async function auditYear(year: number, counters: AuditCounters): Promise<void> {
  const before = counters.errors.length;
  const daysBefore = counters.daysCompared;
  const data = await fetchYear(year);
  const { daily, hourly } = data;

  // Regroupement des relevés horaires par jour, comme le fait le script d'import
  const hourlyByDate: Record<string, ApiHourRow[]> = {};
  for (let i = 0; i < hourly.time.length; i++) {
    const time = hourly.time[i];
    const date = time.split('T')[0];
    if (!hourlyByDate[date]) hourlyByDate[date] = [];
    hourlyByDate[date].push({
      time,
      temperature_2m: hourly.temperature_2m[i],
      relative_humidity_2m: hourly.relative_humidity_2m[i],
      dew_point_2m: hourly.dew_point_2m[i],
      precipitation: hourly.precipitation[i],
      weather_code: hourly.weather_code[i],
      pressure_msl: hourly.pressure_msl[i],
      wind_speed_10m: hourly.wind_speed_10m[i],
      wind_gusts_10m: hourly.wind_gusts_10m[i],
      visibility: hourly.visibility[i],
      uv_index: hourly.uv_index[i],
      sunshine_duration: hourly.sunshine_duration[i]
    });
  }

  for (let i = 0; i < daily.time.length; i++) {
    const date = daily.time[i];
    const [y, m, d] = date.split('-');

    const hasNull = REQUIRED_DAILY.some((key) => {
      const index = key === 'weather_code' ? 'weather_code' : key;
      const arr = (daily as unknown as Record<string, Maybe<number | string>[]>)[index];
      return arr[i] === null || arr[i] === undefined;
    });

    const dailyFile = path.join(DATA_DIR, 'daily', y, m, `${d}.json`);
    const hourlyFile = path.join(DATA_DIR, 'hourly', y, m, `${d}.json`);

    if (!fs.existsSync(dailyFile)) {
      if (hasNull) {
        counters.nullFromApi++;
        continue;
      }
      counters.errors.push(`${date}: fichier daily absent alors que l'API fournit toutes les valeurs`);
      continue;
    }

    const stored: Record<string, unknown> = JSON.parse(fs.readFileSync(dailyFile, 'utf-8'));

    const check = (label: string, storedValue: unknown, apiValue: unknown): void => {
      counters.comparedValues++;
      if (!strictlyEqual(storedValue, apiValue)) {
        counters.errors.push(`${date} ${label}: stocké=${show(storedValue)} API=${show(apiValue)}`);
      }
    };

    check('date', stored.date, date);
    check('weather_code', stored.weather_code, daily.weather_code[i]);
    check('temp_max', stored.temp_max, daily.temperature_2m_max[i]);
    check('temp_min', stored.temp_min, daily.temperature_2m_min[i]);
    check('temp_mean', stored.temp_mean, daily.temperature_2m_mean[i]);
    check('precipitation', stored.precipitation, daily.precipitation_sum[i]);
    check('sunshine', stored.sunshine, daily.sunshine_duration[i]);
    check('wind_speed_max', stored.wind_speed_max, daily.wind_speed_10m_max[i]);
    check('sunrise', stored.sunrise, daily.sunrise[i]);
    check('sunset', stored.sunset, daily.sunset[i]);
    check('sunshine_duration_seconds', stored.sunshine_duration_seconds, daily.sunshine_duration[i]);

    // Champs dérivés : recalculés avec les fonctions partagées du projet
    const officialMinutes = convertOfficialSunshineToMinutes(daily.sunshine_duration[i]);
    const estimatedMinutes = calculateDailySunshine(
      (hourlyByDate[date] || []).map((h) => ({ time: h.time, weather_code: h.weather_code as number })),
      daily.sunrise[i],
      daily.sunset[i]
    );
    const difference = officialMinutes !== null && estimatedMinutes !== null
      ? Math.abs(officialMinutes - estimatedMinutes)
      : null;

    check('sunshine_duration_minutes', stored.sunshine_duration_minutes, officialMinutes);
    check('estimated_daily_sunshine_minutes', stored.estimated_daily_sunshine_minutes, estimatedMinutes);
    check('estimated_daily_sunshine', stored.estimated_daily_sunshine, formatSunshineDuration(estimatedMinutes));
    check('sunshine_difference_minutes', stored.sunshine_difference_minutes, difference);
    check('sunshine_consistency', stored.sunshine_consistency, calculateSunshineConsistency(officialMinutes, estimatedMinutes));

    counters.daysCompared++;

    // --- Données horaires ---
    if (!fs.existsSync(hourlyFile)) {
      counters.errors.push(`${date}: fichier hourly absent alors que l'API fournit des relevés`);
      continue;
    }

    const storedHourly: Array<Record<string, unknown>> = JSON.parse(fs.readFileSync(hourlyFile, 'utf-8'));
    const apiHourly = hourlyByDate[date] || [];

    if (storedHourly.length !== apiHourly.length) {
      counters.errors.push(`${date}: ${storedHourly.length} relevés stockés vs ${apiHourly.length} renvoyés par l'API`);
    }

    const count = Math.min(storedHourly.length, apiHourly.length);
    for (let h = 0; h < count; h++) {
      const s = storedHourly[h];
      const a = apiHourly[h];
      const label = String(a.time);

      const checkHour = (field: string, storedValue: unknown, apiValue: unknown): void => {
        counters.comparedValues++;
        if (!strictlyEqual(storedValue, apiValue)) {
          counters.errors.push(`${label} ${field}: stocké=${show(storedValue)} API=${show(apiValue)}`);
        }
      };

      checkHour('time', s.time, a.time);
      checkHour('temp', s.temp, a.temperature_2m);
      checkHour('humidity', s.humidity, a.relative_humidity_2m);
      checkHour('dew_point', s.dew_point, a.dew_point_2m);
      checkHour('precipitation', s.precipitation, a.precipitation);
      checkHour('weather_code', s.weather_code, a.weather_code);
      checkHour('pressure', s.pressure, a.pressure_msl);
      checkHour('wind_speed', s.wind_speed, a.wind_speed_10m);
      checkHour('wind_gusts', s.wind_gusts, a.wind_gusts_10m);
      checkHour('visibility', s.visibility, a.visibility);
      checkHour('uv_index', s.uv_index, a.uv_index);
      checkHour('sunshine', s.sunshine, a.sunshine_duration);
      checkHour(
        'estimated_hourly_sunshine_minutes',
        s.estimated_hourly_sunshine_minutes,
        calculateHourlySunshineWithDaylight(
          a.weather_code as number,
          a.time,
          daily.sunrise[i],
          daily.sunset[i]
        )
      );

      counters.hoursCompared++;
    }
  }

  const errorsForYear = counters.errors.length - before;
  const daysForYear = counters.daysCompared - daysBefore;
  const status = errorsForYear === 0 ? 'OK  ' : 'KO  ';
  console.log(`[${status}] ${year}: ${daysForYear} jours audités, ${errorsForYear} écart(s)`);
  if (errorsForYear > 0) {
    counters.errors
      .slice(before, before + 10)
      .forEach((e) => console.log(`        - ${e}`));
    if (errorsForYear > 10) console.log(`        ... et ${errorsForYear - 10} autre(s) écart(s)`);
  }
}

async function auditRange(): Promise<boolean> {
  console.log('[INFO] Audit d\'exactitude 1975-1984 : comparaison stricte avec archive-api.open-meteo.com');
  console.log(`[INFO] Coordonnées: LAT=${LAT}, LON=${LON} | Timezone: ${TIMEZONE} | Modèle: ${MODEL}`);
  console.log('[INFO] Tolerance: AUCUNE (égalité stricte, aucun arrondi accepté)');
  console.log('');

  const counters: AuditCounters = {
    comparedValues: 0,
    daysCompared: 0,
    hoursCompared: 0,
    errors: [],
    nullFromApi: 0
  };

  for (let index = 0; index < YEARS.length; index++) {
    const year = YEARS[index];
    try {
      await auditYear(year, counters);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      counters.errors.push(`${year}: échec de l'appel API (${message})`);
      console.log(`[KO  ] ${year}: échec de l'appel API (${message})`);
    }
    if (index < YEARS.length - 1) await sleep(PAUSE_BETWEEN_YEARS_MS);
  }

  const expectedTotal = YEARS.reduce((sum, y) => sum + expectedDaysFor(y), 0);

  console.log('');
  console.log('[RESUME] ==== Bilan audit 1975-1984 ====');
  console.log(`[RESUME] Jours comparés avec l'API: ${counters.daysCompared} / ${expectedTotal}`);
  console.log(`[RESUME] Relevés horaires comparés: ${counters.hoursCompared}`);
  console.log(`[RESUME] Valeurs comparées au total: ${counters.comparedValues}`);
  console.log(`[RESUME] Jours sans donnée API (ignorés): ${counters.nullFromApi}`);
  console.log(`[RESUME] Écarts détectés: ${counters.errors.length}`);

  if (counters.errors.length === 0 && counters.daysCompared === expectedTotal) {
    console.log('');
    console.log(`[SUCCESS] ✅ Les ${expectedTotal} jours correspondent exactement aux valeurs renvoyées par l'API Open-Meteo.`);
    console.log('[INFO] Aucune valeur arrondie, estimée ou inventée : les fichiers sont deployment-ready.');
    return true;
  }

  console.log('');
  console.log('[FAILURE] ❌ Des écarts ont été détectés. Relancez l\'année concernée puis cet audit.');
  counters.errors.slice(0, 20).forEach((e) => console.log(`     - ${e}`));
  return false;
}

if (require.main === module) {
  auditRange()
    .then((ok) => process.exit(ok ? 0 : 1))
    .catch((error: unknown) => {
      console.error('[FATAL]', error instanceof Error ? error.message : String(error));
      process.exit(1);
    });
}

export { auditRange };