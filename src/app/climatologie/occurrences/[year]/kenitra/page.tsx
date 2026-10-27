import { getDailyDataForYear, listAvailableYears } from "@/lib/data";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDaysStyle } from "@/lib/weather-colors";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    year: string;
  }>;
}

interface DayRecord {
  date: string;
  temp_max: number | null;
  temp_min: number | null;
  weather_code: number | null;
  precipitation: number | null;
  wind_speed_max: number | null;
}

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

interface MonthStats {
  name: string;
  countDays: number;
  txGe30: number;
  txGe25: number;
  txGe20: number;
  tnGe20: number;
  txLe0: number;
  tnLe0: number;
  tnLeM5: number;
  tnLeM10: number;
  txLe0MaxConsecutive: number;
  txGe25MaxConsecutive: number;
  rrGe1: number;
  rrGe5: number;
  rrGe10: number;
  rrGe1MaxConsecutive: number;
  rrLe1MaxConsecutive: number;
  orage: number;
  brouillard: number;
  neige: number;
  beauTemps: number;
  gris: number;
  ventGe576: number;
  ventGe1008: number;
}

function maxConsecutive(dates: string[], pred: (d: DayRecord) => boolean, byDate: Record<string, DayRecord>): number {
  let best = 0;
  let cur = 0;
  const sorted = dates.slice().sort((a, b) => a.localeCompare(b));
  for (const d of sorted) {
    if (pred(byDate[d])) {
      cur++;
      if (cur > best) best = cur;
    } else {
      cur = 0;
    }
  }
  return best;
}

export async function generateStaticParams(): Promise<{ year: string }[]> {
  const years = listAvailableYears();
  return years.map(year => ({ year }));
}

export const dynamicParams = true;
export const revalidate = 3600;

export default async function OccurrencesPage({ params }: PageProps) {
  const { year } = await params;
  const available = listAvailableYears();
  if (!available.includes(year)) notFound();

  const data = await getDailyDataForYear(year);
  if (data.length === 0) notFound();

  // Group by calendar month (MM) for this single year
  const byMonth: Record<string, DayRecord[]> = {};
  for (const day of data) {
    const month = format(parseISO(day.date), "MM");
    if (!byMonth[month]) byMonth[month] = [];
    byMonth[month].push({
      date: day.date,
      temp_max: day.temp_max,
      temp_min: day.temp_min,
      weather_code: day.weather_code,
      precipitation: day.precipitation,
      wind_speed_max: day.wind_speed_max,
    });
  }

  const stats: MonthStats[] = [];
  for (let m = 1; m <= 12; m++) {
    const month = String(m).padStart(2, "0");
    const days = byMonth[month] ?? [];
    const byDate: Record<string, DayRecord> = {};
    for (const d of days) byDate[d.date] = d;

    const statsM: MonthStats = {
      name: monthsFr[m - 1],
      countDays: days.length,
      txGe30: 0,
      txGe25: 0,
      txGe20: 0,
      tnGe20: 0,
      txLe0: 0,
      tnLe0: 0,
      tnLeM5: 0,
      tnLeM10: 0,
      txLe0MaxConsecutive: 0,
      txGe25MaxConsecutive: 0,
      rrGe1: 0,
      rrGe5: 0,
      rrGe10: 0,
      rrGe1MaxConsecutive: 0,
      rrLe1MaxConsecutive: 0,
      orage: 0,
      brouillard: 0,
      neige: 0,
      beauTemps: 0,
      gris: 0,
      ventGe576: 0,
      ventGe1008: 0,
    };

    for (const d of days) {
      const tmx = d.temp_max;
      const tmn = d.temp_min;
      const rr = d.precipitation ?? 0;
      const code = d.weather_code;
      const wind = d.wind_speed_max ?? 0;

      if (tmx !== null && tmx >= 30) statsM.txGe30++;
      if (tmx !== null && tmx >= 25) statsM.txGe25++;
      if (tmx !== null && tmx >= 20) statsM.txGe20++;
      if (tmn !== null && tmn >= 20) statsM.tnGe20++;
      if (tmx !== null && tmx <= 0) statsM.txLe0++;
      if (tmn !== null && tmn <= 0) statsM.tnLe0++;
      if (tmn !== null && tmn <= -5) statsM.tnLeM5++;
      if (tmn !== null && tmn <= -10) statsM.tnLeM10++;
      if (rr >= 1) statsM.rrGe1++;
      if (rr >= 5) statsM.rrGe5++;
      if (rr >= 10) statsM.rrGe10++;
      if (phenomeneOrage(code)) statsM.orage++;
      if (phenomeneBrouillard(code)) statsM.brouillard++;
      if (phenomeneNeige(code)) statsM.neige++;
      if (phenomeneBeauTemps(code)) statsM.beauTemps++;
      if (phenomeneGris(code)) statsM.gris++;
      if (wind >= 57.6) statsM.ventGe576++;
      if (wind >= 100.8) statsM.ventGe1008++;
    }

    const dayDates = days.map(d => d.date);
    // Max consecutive runs within this single year-month
    const runTxLe0 = maxConsecutive(dayDates, d => d.temp_max !== null && d.temp_max <= 0, byDate);
    const runTxGe25 = maxConsecutive(dayDates, d => d.temp_max !== null && d.temp_max >= 25, byDate);
    const runRrGe1 = maxConsecutive(dayDates, d => (d.precipitation ?? 0) >= 1, byDate);
    const runRrLe1 = maxConsecutive(dayDates, d => (d.precipitation ?? 0) <= 1, byDate);

    statsM.txLe0MaxConsecutive = runTxLe0;
    statsM.txGe25MaxConsecutive = runTxGe25;
    statsM.rrGe1MaxConsecutive = runRrGe1;
    statsM.rrLe1MaxConsecutive = runRrLe1;

    stats.push(statsM);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Occurrences de phénomènes — Kénitra</h1>
        <p className="text-muted-foreground text-center">
          Année {year}. Statistiques calculées mois par mois sur l&apos;année {year} uniquement.
        </p>
        <p className="text-muted-foreground text-sm text-center">
          &quot;jours&quot; = nombre de jours de l&apos;année satisfaisant le critère ; &quot;max. jours consécutifs&quot; = plus longue suite de jours consécutifs au cours de l&apos;année pour ce mois calendaire.
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-2">
        <Link href={`/climatologie/annee/${year}/kenitra`}>
          <button className="px-3 py-1 text-xs border rounded hover:bg-muted">← Retour à l&apos;année {year}</button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Occurrences mensuelles — {year}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto border rounded-sm">
            <Table className="border-collapse text-[11px] text-center w-full min-w-full">
              <TableHeader>
                <TableRow className="bg-[#f2f2f2] dark:bg-muted/50 border-b">
                  <TableHead className="border font-bold text-black dark:text-white px-2 py-1 h-auto text-left">Paramètre</TableHead>
                  {[...Array(12).keys()].map(m => (
                    <TableHead key={m} className="border font-bold text-black dark:text-white px-1 py-0 h-auto capitalize">
                      {monthsFr[m]}
                    </TableHead>
                  ))}
                  <TableHead className="border font-bold text-black dark:text-white px-1 py-1 h-auto">Année</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { label: "Tx ≥ 30 (jours)", key: "txGe30" as const },
                  { label: "Tx ≥ 25 (jours)", key: "txGe25" as const },
                  { label: "Tx ≥ 20 (jours)", key: "txGe20" as const },
                  { label: "Tn ≥ 20 (jours)", key: "tnGe20" as const },
                  { label: "Tx ≤ 0 (jours)", key: "txLe0" as const },
                  { label: "Tn ≤ 0 (jours)", key: "tnLe0" as const },
                  { label: "Tn ≤ -5 (jours)", key: "tnLeM5" as const },
                  { label: "Tn ≤ -10 (jours)", key: "tnLeM10" as const },
                  { label: "Tx ≤ 0 (max. jours cons.)", key: "txLe0MaxConsecutive" as const },
                  { label: "Tx ≥ 25 (max. jours cons.)", key: "txGe25MaxConsecutive" as const },
                  { label: "RR ≥ 1 (jours)", key: "rrGe1" as const },
                  { label: "RR ≥ 5 (jours)", key: "rrGe5" as const },
                  { label: "RR ≥ 10 (jours)", key: "rrGe10" as const },
                  { label: "RR ≥ 1 (max. jours cons.)", key: "rrGe1MaxConsecutive" as const },
                  { label: "RR ≤ 1 (max. jours cons.)", key: "rrLe1MaxConsecutive" as const },
                  { label: "Orage (jours)", key: "orage" as const },
                  { label: "Brouillard (jours)", key: "brouillard" as const },
                  { label: "Neige (jours)", key: "neige" as const },
                  { label: "Beau temps (jours)", key: "beauTemps" as const },
                  { label: "Gris (jours)", key: "gris" as const },
                  { label: "Vent ≥ 57.6 km/h (jours)", key: "ventGe576" as const },
                  { label: "Vent ≥ 100.8 km/h (jours)", key: "ventGe1008" as const },
                ].map((row) => (
                  <TableRow key={row.label} className="border-b border-border">
                    <TableCell className="border font-medium text-left px-2 py-1">{row.label}</TableCell>
                    {[...Array(12).keys()].map(m => {
                      const s = stats.find(x => x.name === monthsFr[m]);
                      const val = s ? s[row.key] : 0;
                      const color = getDaysStyle(val);
                      return (
                        <TableCell key={m} className="border p-0" style={{ backgroundColor: color.background, color: color.text }}>
                          {val}
                        </TableCell>
                      );
                    })}
                    <TableCell className="border font-bold bg-[#f2f2f2] dark:bg-muted/30">
                      {stats.reduce((acc, s) => acc + s[row.key], 0)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-2 text-[11px] text-muted-foreground italic">
        Source : Open-Meteo Archive (Kénitra). Seuils : Tx/Tn en °C, RR en mm, Vent en km/h. Phénomènes selon codes WMO (Orage, Brouillard, Neige, Beau temps, Gris).
      </div>
    </div>
  );
}
