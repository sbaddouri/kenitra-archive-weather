import fs from 'fs';
import path from 'path';
import { format, parseISO } from 'date-fns';
import { getDailyDataForYear, listAvailableYears } from '@/lib/data';

const DATA_DIR = path.join(process.cwd(), 'data');
const OUT_FILE = path.join(DATA_DIR, 'occurrences-average.json');

const monthsFr = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

function phenomeneOrage(code: number | null): boolean {
  if (code === null) return false;
  return [13, 17, 18, 29, 91, 92, 93, 94, 95, 96, 97, 98, 99].includes(code);
}
function phenomeneBrouillard(code: number | null): boolean {
  if (code === null) return false;
  return [10, 11, 12, 13, 14, 15, 16, 17, 28, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 110, 120, 130, 131, 132, 133, 134, 135].includes(code);
}
function phenomeneNeige(code: number | null): boolean {
  if (code === null) return false;
  return [22, 23, 26, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 83, 84, 85, 86, 87, 88, 93, 94, 145, 146, 170, 171, 172, 173, 174, 175, 176, 177, 178].includes(code);
}
function phenomeneBeauTemps(code: number | null): boolean {
  if (code === null) return false;
  return [0, 1, 2].includes(code);
}
function phenomeneGris(code: number | null): boolean {
  if (code === null) return false;
  return code === 3;
}

interface DayRecord {
  date: string; temp_max: number | null; temp_min: number | null;
  weather_code: number | null; precipitation: number | null; wind_speed_max: number | null;
}

function maxConsecutive(dates: string[], pred: (d: DayRecord) => boolean, byDate: Record<string, DayRecord>): number {
  let best = 0, cur = 0;
  const sorted = dates.slice().sort((a, b) => a.localeCompare(b));
  for (const d of sorted) {
    if (pred(byDate[d])) { cur++; if (cur > best) best = cur; } else { cur = 0; }
  }
  return best;
}

function computeMonthStats(days: DayRecord[]) {
  const byDate: Record<string, DayRecord> = {};
  for (const d of days) byDate[d.date] = d;
  const s: Record<string, number> = {
    txGe30: 0, txGe25: 0, txGe20: 0, tnGe20: 0,
    txLe0: 0, tnLe0: 0, tnLeM5: 0, tnLeM10: 0,
    txLe0MaxConsecutive: 0, txGe25MaxConsecutive: 0,
    rrGe1: 0, rrGe5: 0, rrGe10: 0, rrGe1MaxConsecutive: 0, rrLe1MaxConsecutive: 0,
    orage: 0, brouillard: 0, neige: 0, beauTemps: 0, gris: 0,
    ventGe576: 0, ventGe1008: 0,
    countDays: days.length,
  };
  for (const d of days) {
    const tmx = d.temp_max, tmn = d.temp_min, rr = d.precipitation ?? 0,
      code = d.weather_code, wind = d.wind_speed_max ?? 0;
    if (tmx !== null && tmx >= 30) s.txGe30++;
    if (tmx !== null && tmx >= 25) s.txGe25++;
    if (tmx !== null && tmx >= 20) s.txGe20++;
    if (tmn !== null && tmn >= 20) s.tnGe20++;
    if (tmx !== null && tmx <= 0) s.txLe0++;
    if (tmn !== null && tmn <= 0) s.tnLe0++;
    if (tmn !== null && tmn <= -5) s.tnLeM5++;
    if (tmn !== null && tmn <= -10) s.tnLeM10++;
    if (rr >= 1) s.rrGe1++;
    if (rr >= 5) s.rrGe5++;
    if (rr >= 10) s.rrGe10++;
    if (phenomeneOrage(code)) s.orage++;
    if (phenomeneBrouillard(code)) s.brouillard++;
    if (phenomeneNeige(code)) s.neige++;
    if (phenomeneBeauTemps(code)) s.beauTemps++;
    if (phenomeneGris(code)) s.gris++;
    if (wind >= 57.6) s.ventGe576++;
    if (wind >= 100.8) s.ventGe1008++;
  }
  const dates = days.map(d => d.date);
  s.txLe0MaxConsecutive = maxConsecutive(dates, d => d.temp_max !== null && d.temp_max <= 0, byDate);
  s.txGe25MaxConsecutive = maxConsecutive(dates, d => d.temp_max !== null && d.temp_max >= 25, byDate);
  s.rrGe1MaxConsecutive = maxConsecutive(dates, d => (d.precipitation ?? 0) >= 1, byDate);
  s.rrLe1MaxConsecutive = maxConsecutive(dates, d => (d.precipitation ?? 0) <= 1, byDate);
  return s;
}

const indicatorKeys = [
  "txGe30","txGe25","txGe20","tnGe20","txLe0","tnLe0","tnLeM5","tnLeM10",
  "txLe0MaxConsecutive","txGe25MaxConsecutive","rrGe1","rrGe5","rrGe10",
  "rrGe1MaxConsecutive","rrLe1MaxConsecutive","orage","brouillard","neige",
  "beauTemps","gris","ventGe576","ventGe1008",
];

async function main() {
  const years = listAvailableYears().sort((a, b) => a.localeCompare(b));
  if (years.length === 0) process.exit(1);

  // ymStats[year][month] = MonthStats
  const ymStats: Record<string, Record<string, ReturnType<typeof computeMonthStats>>> = {};
  for (const year of years) {
    const data = await getDailyDataForYear(year);
    const byMonth: Record<string, DayRecord[]> = {};
    for (const day of data) {
      const month = format(parseISO(day.date), "MM");
      if (!byMonth[month]) byMonth[month] = [];
      byMonth[month].push({
        date: day.date, temp_max: day.temp_max, temp_min: day.temp_min,
        weather_code: day.weather_code, precipitation: day.precipitation,
        wind_speed_max: day.wind_speed_max,
      });
    }
    ymStats[year] = {};
    for (const month of Object.keys(byMonth)) {
      ymStats[year][month] = computeMonthStats(byMonth[month]);
    }
  }

  // Moyenne annuelle par indicateur (somme sur tous les mois et années / nb années)
  const annualAvg: Record<string, number> = {};
  for (const key of indicatorKeys) {
    let sumAll = 0;
    for (const year of years) {
      for (let mm = 1; mm <= 12; mm++) {
        const month = String(mm).padStart(2, "0");
        const ms = ymStats[year]?.[month];
        if (ms) sumAll += ms[key];
      }
    }
    annualAvg[key] = years.length > 0 ? Math.round(sumAll / years.length) : 0;
  }

  // Moyenne par mois calendaire sur toutes les années
  const stats: Record<string, Record<string, number | string>> = {};
  for (let mm = 1; mm <= 12; mm++) {
    const month = String(mm).padStart(2, "0");
    const nYears = years.filter(y => ymStats[y]?.[month]).length;
    const row: Record<string, number | string> = { name: monthsFr[mm - 1], countYears: nYears };
    for (const key of indicatorKeys) {
      let sum = 0;
      for (const year of years) {
        const ms = ymStats[year]?.[month];
        if (ms) sum += ms[key];
      }
      row[key] = nYears > 0 ? Math.round(sum / nYears) : 0;
    }
    stats[month] = row;
  }

  const output = {
    firstYear: years[0],
    lastYear: years[years.length - 1],
    numYears: years.length,
    monthsFr,
    indicatorKeys,
    stats,
    annualAvg,
  };

  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(output, null, 2));
  console.log(`Occurrences moyennes calculées pour ${years.length} années (${years[0]}–${years[years.length - 1]}).`);
  console.log(`Écrit dans ${OUT_FILE}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
