import fs from 'fs';
import path from 'path';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface Output {
  firstYear: string;
  lastYear: string;
  numYears: number;
  monthsFr: string[];
  indicatorKeys: string[];
  stats: Record<string, Record<string, number | string>>;
  annualAvg: Record<string, number>;
}

const DATA_DIR = path.join(process.cwd(), 'data');

const indicatorRows = [
  { label: "Tx ≥ 30 (jours)", key: "txGe30" },
  { label: "Tx ≥ 25 (jours)", key: "txGe25" },
  { label: "Tx ≥ 20 (jours)", key: "txGe20" },
  { label: "Tn ≥ 20 (jours)", key: "tnGe20" },
  { label: "Tx ≤ 0 (jours)", key: "txLe0" },
  { label: "Tn ≤ 0 (jours)", key: "tnLe0" },
  { label: "Tn ≤ -5 (jours)", key: "tnLeM5" },
  { label: "Tn ≤ -10 (jours)", key: "tnLeM10" },
  { label: "Tx ≤ 0 (max. jours cons.)", key: "txLe0MaxConsecutive" },
  { label: "Tx ≥ 25 (max. jours cons.)", key: "txGe25MaxConsecutive" },
  { label: "RR ≥ 1 (jours)", key: "rrGe1" },
  { label: "RR ≥ 5 (jours)", key: "rrGe5" },
  { label: "RR ≥ 10 (jours)", key: "rrGe10" },
  { label: "RR ≥ 1 (max. jours cons.)", key: "rrGe1MaxConsecutive" },
  { label: "RR ≤ 1 (max. jours cons.)", key: "rrLe1MaxConsecutive" },
  { label: "Orage (jours)", key: "orage" },
  { label: "Brouillard (jours)", key: "brouillard" },
  { label: "Neige (jours)", key: "neige" },
  { label: "Beau temps (jours)", key: "beauTemps" },
  { label: "Gris (jours)", key: "gris" },
  { label: "Vent ≥ 57.6 km/h (jours)", key: "ventGe576" },
  { label: "Vent ≥ 100.8 km/h (jours)", key: "ventGe1008" },
];

export default async function OccurrencesAveragePage() {
  const output: Output = JSON.parse(
    fs.readFileSync(path.join(DATA_DIR, 'occurrences-average.json'), 'utf8')
  );

  const { firstYear, lastYear, numYears, monthsFr, indicatorKeys, stats, annualAvg } = output;

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Occurrences moyennes — Kénitra</h1>
        <p className="text-muted-foreground text-center">
          Période {firstYear}–{lastYear} ({numYears} années). Valeur = moyenne annuelle par mois calendaire (nombre de jours par an, en moyenne).
        </p>
        <p className="text-muted-foreground text-sm text-center">
          Colonnes = mois ; colonne &quot;Année&quot; = moyenne annuelle sur l&apos;ensemble de la période.
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-2">
        <Link href={`/climatologie/annee/${firstYear}/kenitra`}>
          <button className={cn(buttonVariants({ variant: "outline" }))}>
            Voir une année
          </button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Occurrences moyennes mensuelles — {firstYear}–{lastYear}</CardTitle>
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
                {indicatorKeys.map((key) => {
                  const row = indicatorRows.find(r => r.key === key)!;
                  return (
                    <TableRow key={row.label} className="border-b border-border">
                      <TableCell className="border font-medium text-left px-2 py-1">{row.label}</TableCell>
                      {[...Array(12).keys()].map(m => {
                        const month = String(m + 1).padStart(2, "0");
                        const s = stats[month];
                        const val = s ? (s[key] as number) : 0;
                        return (
                          <TableCell key={m} className="border p-0">
                            {val}
                          </TableCell>
                        );
                      })}
                      <TableCell className="border font-bold bg-[#f2f2f2] dark:bg-muted/30">
                        {annualAvg[key]}
                      </TableCell>
                    </TableRow>
                  );
                })}
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
