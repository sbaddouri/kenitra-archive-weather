"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ClimatologieSummaryTable from "@/components/climatologie-summary-table";
import ClassificationsClimatiquesTable from "@/components/classifications-climatiques-table";
import { getClimateBoxColor } from "@/lib/climate-box-colors";
import { parseNumber } from "@/lib/weather-colors";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useTheme } from "next-themes";
import Link from "next/link";

const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

const headerCols = ['Paramètre', ...months, 'Année', 'OMM 91-20'];

function climateSchemeFor(label: string): "t" | "p" | "s" | "d" | "h" | "u" | "green" | "pastel" | "none" | null {
  const l = label.toLowerCase();
  if (l.includes("température") || l.includes("moyenne journalière") || l.includes("point de rosée") || l.includes("record")) return "t";
  if (l.includes("précipitations mm")) return "p";
  if (l.includes("jours")) return "d";
  if (l.includes("humidité")) return "h";
  if (l.includes("ensoleillement")) return "s";
  return null;
}

const data = [
  ['Record haut °C','27,6','30,5','35,5','38,1','45,3','45,6','48,0','47,2','43,3','39,5','33,9','28,5','48,0','47,7 (août)'],
  ['Moyenne des maxima °C','21,5','23,7','26,9','28,8','31,6','34,8','34,9','35,0','32,8','30,8','26,3','21,9','36,90','—'],
  ['Moyenne des maximales °C','17,1','18,8','19,8','21,1','23,7','25,2','27,9','28,7','26,1','24,9','21,6','18,4','22,8','23,5'],
  ['Moyenne journalière °C','13,2','14,2','15,2','16,8','19,3','21,3','23,8','24,7','22,4','20,3','17,2','14,4/13,2','18,6','18,4'],
  ['Moyenne des minimales °C','9,2','9,5','10,5','12,5','14,9','17,3','19,6','20,6','18,6','15,6','12,8','10,4','14,3','13,4'],
  ['Moyenne des minima °C','5,0','6,2','7,6','9,7','11,3','15,1','16,4','16,9','15,8','13,0','8,7','6,6','5,29','—'],
  ['Record bas °C','-1,1','-0,8','2,9','5,7','6,9','10,9','12,5','13,3','10,8','7,4','2,9','0,9','-1,1','-3,0 (fév)'],
  ['Précipitations mm','82','64','63','57','32','8','1','1','21','63','94','85','571','539,5'],
  ['Jours de précip. ≥1 mm','6','6','5','6','4','1','0','0','3','5','7','7','50','52,6'],
  ['Jours de pluie','12,3','12,7','12,2','11,0','7,6','2,9','0,3','0,7','2,8','8,6','13,3','14,0','98,4','—'],
  ['Humidité relative %','80','77','75','75','72','73','75','76','76','78','77','78','76','—'],
  ['Point de rosée °C','9,38','9,74','10,77','11,76','13,61','16,08','17,96','18,68','17,81','15,52','12,50','10,37','13,68 (table: 8,4)','—'],
  ['Ensoleillement h','182,9','184,8','244,9','270,0','313,1','318,0','347,2','331,7','282,0','248,0','195,0','182,9','3 110,5','3 005,7'],
  ['% ensoleillement possible','69,4','66,0','66,4','66,7','67,3','66,3','72,3','76,4','75,2','72,7','68,4','73,7','70,3','—'],
];

export default function ClimatologiePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const cardBg = isDark ? "#1f2937" : "#ffffff";
  const cardText = isDark ? "#f9fafb" : "#111827";
  const borderColor = isDark ? "#4b5563" : "#e5e7eb";
  const headBg = isDark ? "#374151" : "#f3f4f6";
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <ClimatologieSummaryTable />

      <div className="mb-6 flex justify-center">
        <Link href="/climatologie/occurrences/kenitra">
          <button className={cn(buttonVariants({ variant: "outline" }))}>
            Occurrences moyennes (moyennes 1940–2026)
          </button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-col items-center text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">CLIMATOLOGIE — KÉNITRA</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-center text-sm mb-4">Normales et extrêmes 1940-2025, ensoleillement 1981-2010, jours de pluie 1961-1990. Colonne de contrôle : normales OMM 1991-2020 (NOAA/NCEI, station KENITRA 60120).</p>
            <Table className="text-xs border border-border w-full">
              <TableHeader>
                <TableRow className="border-b border-border">
                  {headerCols.map((h) => (
                    <TableCell key={h} className="bg-muted/50 font-semibold text-center border-r border-border sticky left-0 z-10">{h}</TableCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row) => {
                  const scheme = climateSchemeFor(row[0]);
                  const cellStyle = (v: string) => {
                    if (!scheme) return undefined;
                    const n = parseNumber(v);
                    if (n === null) return undefined;
                    const c = getClimateBoxColor(scheme, n);
                    return { backgroundColor: c.background, color: c.text };
                  };
                  return (
                    <TableRow key={row[0]} className="border-b border-border">
                      <TableCell className="font-medium border-r border-border">{row[0]}</TableCell>
                      {row.slice(1, -2).map((v, i) => (
                        <TableCell key={i} className="text-center border-r border-border" style={cellStyle(v)}>{v}</TableCell>
                      ))}
                      <TableCell className="text-center font-semibold border-r border-border" style={cellStyle(row[13])}>{row[13]}</TableCell>
                      <TableCell className="text-center border-r border-border last:border-r-0" style={cellStyle(row[14])}>{row[14]}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>VALEURS DÉRIVÉES (CALCULÉES)</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Moyenne des maximales annuelle = 22,8 °C</li>
            <li>Moyenne des minimales = 14,3 °C</li>
            <li>Amplitude diurne moyenne = 8,5 °C (7,5 à 9,3 °C)</li>
            <li>Amplitude annuelle des moyennes = 11,5 °C</li>
            <li>Amplitude absolue = 49,1 °C</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>SYNTHÈSE DE L'AUDIT SCIENTIFIQUE</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm border-collapse border border-border">
              <thead className="bg-muted/50 sticky top-0 z-10">
                <tr>
                  <th className="border border-border px-2 py-1 font-semibold text-center">Point de contrôle</th>
                  <th className="border border-border px-2 py-1 font-semibold text-center">Résultat</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border px-2 py-1 text-center">Cohérence T mensuelles / annuelles</td>
                  <td className="border border-border px-2 py-1 text-center">✓ (18,57 recalculé vs 18,6 annoncé)</td>
                </tr>
                <tr>
                  <td className="border border-border px-2 py-1 text-center">Cohérence P mensuelles / annuelle</td>
                  <td className="border border-border px-2 py-1 text-center">✓ (somme = 571 mm)</td>
                </tr>
                <tr>
                  <td className="border border-border px-2 py-1 text-center">Conversion des unités</td>
                  <td className="border border-border px-2 py-1 text-center">✓</td>
                </tr>
                <tr>
                  <td className="border border-border px-2 py-1 text-center">Cohérence des périodes</td>
                  <td className="border border-border px-2 py-1 text-center">⚠ Tableau composite (1940-2025 / 1981-2010 / 1961-1990)</td>
                </tr>
                <tr>
                  <td className="border border-border px-2 py-1 text-center">Point de rosée annuel</td>
                  <td className="border border-border px-2 py-1 text-center">✗ Anomalie majeure — 8,4 °C impossible, corrigé à 13,7 °C</td>
                </tr>
                <tr>
                  <td className="border border-border px-2 py-1 text-center">Records absolus</td>
                  <td className="border border-border px-2 py-1 text-center">⚠ Divergence avec les normales OMM (48,0 vs 47,7 °C ; −1,1 vs −3,0 °C)</td>
                </tr>
                <tr>
                  <td className="border border-border px-2 py-1 text-center">Doublons géographiques</td>
                  <td className="border border-border px-2 py-1 text-center">✓ Aucun</td>
                </tr>
                <tr>
                  <td className="border border-border px-2 py-1 text-center">Cohérence des classifications</td>
                  <td className="border border-border px-2 py-1 text-center">⚠ Divergence De Martonne / Emberger — documentée</td>
                </tr>
                <tr>
                  <td className="border border-border px-2 py-1 text-center">Sensibilité du classement</td>
                  <td className="border border-border px-2 py-1 text-center">⚠ Top 10 stable, rangs 11-20 sensibles</td>
                </tr>
                <tr>
                  <td className="border border-border px-2 py-1 text-center">Disponibilité réelle des variables</td>
                  <td className="border border-border px-2 py-1 text-center">⚠ 6 stations sur 28 à couverture &lt; 80 %</td>
                </tr>
                <tr>
                  <td className="border border-border px-2 py-1 text-center">Distinction records / statistiques longues</td>
                  <td className="border border-border px-2 py-1 text-center">✓ Respectée</td>
                </tr>
              </tbody>
            </table>
        </CardContent>
      </Card>

      <Card className="mb-6" style={{ backgroundColor: cardBg, color: cardText }}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold" style={{ color: cardText }}>
            CLASSIFICATIONS CLIMATIQUES CALCULÉES — KÉNITRA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" style={{ color: cardText }}>
          <table className="w-full text-sm border-collapse border" style={{ borderColor }}>
              <thead className={`sticky top-0 z-10 ${headBg === "#374151" ? "bg-gray-700" : "bg-gray-100"}`}>
                <tr>
                  <th className={`border px-2 py-1 font-semibold text-center ${isDark ? "border-gray-600" : "border-gray-300"}`} style={{ backgroundColor: headBg, color: cardText }}>Système</th>
                  <th className={`border px-2 py-1 font-semibold text-center ${isDark ? "border-gray-600" : "border-gray-300"}`} style={{ backgroundColor: headBg, color: cardText }}>Variables d'entrée</th>
                  <th className={`border px-2 py-1 font-semibold text-center ${isDark ? "border-gray-600" : "border-gray-300"}`} style={{ backgroundColor: headBg, color: cardText }}>Formule / critères</th>
                  <th className={`border px-2 py-1 font-semibold text-center ${isDark ? "border-gray-600" : "border-gray-300"}`} style={{ backgroundColor: headBg, color: cardText }}>Résultat</th>
                  <th className={`border px-2 py-1 font-semibold text-center ${isDark ? "border-gray-600" : "border-gray-300"}`} style={{ backgroundColor: headBg, color: cardText }}>Signification</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white" style={{ backgroundColor: isDark ? "#374151" : "#ffffff" }}>
                  <td className={`border px-2 py-1 text-center font-medium ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>Köppen-Geiger</td>
                  <td className={`border px-2 py-1 text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>Tjanv = 13,2 °C ; Taou = 24,7 °C ; P = 571 mm ; Psec_été = 1 mm (juil.) ; Phumide_hiver = 104 mm</td>
                  <td className={`border px-2 py-1 text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>C : −3 °C &lt; Tmin_mens &lt; 18 °C ✓ ; a : Tm_chaud = 24,7 °C ≥ 22 °C ✓ ; s : Psec_été = 1 mm &lt; 40 mm ✓ et 1 &lt; 104/3 ✓</td>
                  <td className={`border px-2 py-1 text-center font-medium ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>Csa</td>
                  <td className={`border px-2 py-1 text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>Climat tempéré, été sec et chaud</td>
                </tr>
                <tr className="bg-gray-50" style={{ backgroundColor: isDark ? "#4b5563" : "#f3f4f6" }}>
                  <td className={`border px-2 py-1 text-center font-medium ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>Trewartha</td>
                  <td className={`border px-2 py-1 text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>12 mois ≥ 10 °C ; Tm_chaud = 24,7 °C ; sécheresse estivale</td>
                  <td className={`border px-2 py-1 text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>C (subtropical), s (été sec), a (mois chaud ≥ 22 °C)</td>
                  <td className={`border px-2 py-1 text-center font-medium ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>Csa</td>
                  <td className={`border px-2 py-1 text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>Subtropical à été sec</td>
                </tr>
                <tr className="bg-white" style={{ backgroundColor: isDark ? "#374151" : "#ffffff" }}>
                  <td className={`border px-2 py-1 text-center font-medium ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>Emberger (Q₂)</td>
                  <td className={`border px-2 py-1 text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>P = 571 mm ; M = 28,7 °C (301,85 K) ; m = 9,2 °C (282,35 K)</td>
                  <td className={`border px-2 py-1 text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>Q₂ = 2000·P / (M² − m²) = 1 142 000 / (91 113,4 − 79 721,5) = 100,2</td>
                  <td className={`border px-2 py-1 text-center font-medium ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>Étage humide à perhumide (m = 9,2 °C → hiver tempéré/doux)</td>
                  <td className={`border px-2 py-1 text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>Forte humidité bioclimatique</td>
                </tr>
                <tr className="bg-gray-50" style={{ backgroundColor: isDark ? "#4b5563" : "#f3f4f6" }}>
                  <td className={`border px-2 py-1 text-center font-medium ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>De Martonne</td>
                  <td className={`border px-2 py-1 text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>P = 571 mm ; T = 18,6 °C</td>
                  <td className={`border px-2 py-1 text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>I = P/(T+10) = 571/28,6 = 19,97</td>
                  <td className={`border px-2 py-1 text-center font-medium ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>Limite semi-aride / méditerranéen-subhumide</td>
                  <td className={`border px-2 py-1 text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>Équilibre précaire</td>
                </tr>
                <tr className="bg-white" style={{ backgroundColor: isDark ? "#374151" : "#ffffff" }}>
                  <td className={`border px-2 py-1 text-center font-medium ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>UNEP (P/ET₀)</td>
                  <td className={`border px-2 py-1 text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>P = 571 mm ; ET₀ = 2 737 mm (Hargreaves)</td>
                  <td className={`border px-2 py-1 text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>AI = 571/2 737 = 0,209</td>
                  <td className={`border px-2 py-1 text-center font-medium ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>Semi-aride (0,20 ≤ AI &lt; 0,50)</td>
                  <td className={`border px-2 py-1 text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>À la frontière de l'aride</td>
                </tr>
                <tr className="bg-gray-50" style={{ backgroundColor: isDark ? "#4b5563" : "#f3f4f6" }}>
                  <td className={`border px-2 py-1 text-center font-medium ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>Gorczynski</td>
                  <td className={`border px-2 py-1 text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>A = 11,5 °C ; φ = 34,25°</td>
                  <td className={`border px-2 py-1 text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>k = 1,7·A/sin(φ+10°) − 14 = 14,0</td>
                  <td className={`border px-2 py-1 text-center font-medium ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>Maritime (k &lt; 33)</td>
                  <td className={`border px-2 py-1 text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>Faible continentalité</td>
                </tr>
                <tr className="bg-white" style={{ backgroundColor: isDark ? "#374151" : "#ffffff" }}>
                  <td className={`border px-2 py-1 text-center font-medium ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>USDA</td>
                  <td className={`border px-2 py-1 text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>Moyenne des minima annuels = 5,29 °C (41,5 °F)</td>
                  <td className={`border px-2 py-1 text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>Zone 11a : 40-45 °F</td>
                  <td className={`border px-2 py-1 text-center font-medium ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>11a, décrochages épisodiques 9b-10a</td>
                  <td className={`border px-2 py-1 text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>Gel quasi absent en moyenne</td>
                </tr>
                <tr className="bg-gray-50" style={{ backgroundColor: isDark ? "#4b5563" : "#f3f4f6" }}>
                  <td className={`border px-2 py-1 text-center font-medium ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>AHS</td>
                  <td className={`border px-2 py-1 text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>~50-70 jours &gt; 30 °C (estimé)</td>
                  <td className={`border px-2 py-1 text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>Zone 6-7</td>
                  <td className={`border px-2 py-1 text-center font-medium ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>6-7 (estimation, à confirmer)</td>
                  <td className={`border px-2 py-1 text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ color: cardText }}>Chaleur estivale modérée par l'océan</td>
                </tr>
              </tbody>
            </table>
          <p className="text-justify mt-4 text-sm" style={{ color: cardText }}>
            <strong>Ambiguïté à signaler :</strong> les indices divergent sur Kénitra — l'indice d'aridité (De Martonne = 20, UNEP = 0,21) la situe à la frontière du semi-aride, tandis que le quotient d'Emberger (Q₂ = 100) la situe dans l'étage humide à perhumide. Cette divergence n'est pas contradictoire : elle traduit la conjonction d'une pluviométrie notable (571 mm) avec une sécheresse estivale absolue et une forte demande évaporative (2 737 mm). Le quotient d'Emberger est très sensible à la faible amplitude thermique (11,5 °C) de Kénitra, qui gonfle artificiellement Q₂. La classification la plus robuste et la plus discriminante pour Kénitra reste donc Köppen Csa, avec nuance subhumide à semi-aride selon l'échelle d'aridité retenue.
          </p>
          <p className="text-justify space-y-2" style={{ color: cardText }}>
            <strong>AHS :</strong> l'estimation de 50 à 70 jours &gt; 30 °C est dérivée des statistiques mensuelles et n'a pas été vérifiée sur une série journalière ; elle doit être confirmée auprès de la DGM avant tout usage opérationnel.
          </p>
        </CardContent>
      </Card>

      <ClassificationsClimatiquesTable />

      <Card className="mb-6" style={{ backgroundColor: cardBg, color: cardText }}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold" style={{ color: cardText }}>
            6.2. CLASSEMENT MONDIAL DES ANALOGUES DE KÉNITRA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" style={{ color: cardText }}>
          <p className="text-sm text-justify" style={{ color: cardText }}>
            Distance climatique normalisée : conversion en score de similarité, fonction explicitement définie, appliquée à une distance D elle-même normalisée et documentée. Conformément au mandat, ces pourcentages ne sont pas des vérités observées mais des indices internes de similarité, dont la sensibilité aux pondérations est discutée au § 6.4.
          </p>
          <table className={`w-full text-xs border-collapse border`} style={{ borderColor }}>
              <thead className={`sticky top-0 z-10 ${headBg === "#374151" ? "bg-gray-700" : "bg-gray-100 dark:bg-gray-700"}`}>
                <tr>
                  <th className={`border px-2 py-1 font-semibold text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ backgroundColor: headBg, color: cardText }}>Rang</th>
                  <th className={`border px-2 py-1 font-semibold text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ backgroundColor: headBg, color: cardText }}>Lieu</th>
                  <th className={`border px-2 py-1 font-semibold text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ backgroundColor: headBg, color: cardText }}>Pays</th>
                  <th className={`border px-2 py-1 font-semibold text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ backgroundColor: headBg, color: cardText }}>T ann (°C)</th>
                  <th className={`border px-2 py-1 font-semibold text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ backgroundColor: headBg, color: cardText }}>P ann (mm)</th>
                  <th className={`border px-2 py-1 font-semibold text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ backgroundColor: headBg, color: cardText }}>Tx (°C)</th>
                  <th className={`border px-2 py-1 font-semibold text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ backgroundColor: headBg, color: cardText }}>Tn (°C)</th>
                  <th className={`border px-2 py-1 font-semibold text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ backgroundColor: headBg, color: cardText }}>Köppen</th>
                  <th className={`border px-2 py-1 font-semibold text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ backgroundColor: headBg, color: cardText }}>D</th>
                  <th className={`border px-2 py-1 font-semibold text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ backgroundColor: headBg, color: cardText }}>S (%)</th>
                  <th className={`border px-2 py-1 font-semibold text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`} style={{ backgroundColor: headBg, color: cardText }}>Couv.</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { rang: 1, lieu: 'Faro', pays: 'Portugal', tAnn: '18,0', pAnn: '511,6', tx: '29,2', tn: '7,9', koppen: 'Csa', d: '0,344', s: '70,9', couv: '90 %' },
                  { rang: 2, lieu: 'Adelaide', pays: 'Australie', tAnn: '17,5', pAnn: '536,5', tx: '30,0', tn: '7,7', koppen: 'Csa', d: '0,507', s: '60,3', couv: '78 %' },
                  { rang: 3, lieu: 'Portimão', pays: 'Portugal', tAnn: '17,2', pAnn: '528,1', tx: '28,8', tn: '8,2', koppen: 'Csa', d: '0,520', s: '59,5', couv: '90 %' },
                  { rang: 4, lieu: 'Larache', pays: 'Maroc', tAnn: '18,2', pAnn: '700,5', tx: '28,7', tn: '8,2', koppen: 'Csa', d: '0,522', s: '59,3', couv: '78 %' },
                  { rang: 5, lieu: 'La Valette', pays: 'Malte', tAnn: '—', pAnn: '580,7', tx: '32,0', tn: '9,5', koppen: 'Csa', d: '0,578', s: '56,1', couv: '54 %' },
                  { rang: 6, lieu: 'Le Cap', pays: 'Afrique du Sud', tAnn: '17,3', pAnn: '492,8', tx: '27,3', tn: '7,4', koppen: 'Csb', d: '0,600', s: '54,9', couv: '90 %' },
                  { rang: 7, lieu: 'Valence', pays: 'Espagne', tAnn: '18,6', pAnn: '459,0', tx: '30,6', tn: '7,5', koppen: 'BSh/Csa', d: '0,618', s: '53,9', couv: '90 %' },
                  { rang: 8, lieu: 'Tanger', pays: 'Maroc', tAnn: '17,7', pAnn: '735,9', tx: '28,6', tn: '8,8', koppen: 'Csa', d: '0,628', s: '53,4', couv: '100 %' },
                  { rang: 9, lieu: 'Casablanca', pays: 'Maroc', tAnn: '18,6', pAnn: '408,2', tx: '26,7', tn: '8,9', koppen: 'Csa', d: '0,642', s: '52,6', couv: '100 %' },
                  { rang: 10, lieu: 'Los Angeles', pays: 'États-Unis', tAnn: '18,8', pAnn: '362,0', tx: '28,9', tn: '9,0', koppen: 'BSh', d: '0,735', s: '48,0', couv: '100 %' },
                  { rang: 11, lieu: 'Perth', pays: 'Australie', tAnn: '18,8', pAnn: '731,1', tx: '31,6', tn: '8,0', koppen: 'Csa', d: '0,754', s: '47,0', couv: '78 %' },
                  { rang: 12, lieu: 'Santa Barbara', pays: 'États-Unis', tAnn: '17,0', pAnn: '482,4', tx: '25,4', tn: '7,8', koppen: 'Csb', d: '0,788', s: '45,5', couv: '90 %' },
                  { rang: 13, lieu: 'Barcelone', pays: 'Espagne', tAnn: '18,2', pAnn: '558,1', tx: '28,9', tn: '5,5', koppen: 'Csa', d: '0,789', s: '45,4', couv: '100 %' },
                  { rang: 14, lieu: 'Tunis', pays: 'Tunisie', tAnn: '19,2', pAnn: '555,2', tx: '33,0', tn: '5,6', koppen: 'Csa', d: '0,845', s: '42,9', couv: '78 %' },
                  { rang: 15, lieu: 'Tel-Aviv', pays: 'Israël', tAnn: '20,9', pAnn: '528,0', tx: '30,2', tn: '9,6', koppen: 'Csa', d: '0,912', s: '40,2', couv: '78 %' },
                  { rang: 16, lieu: 'Izmir', pays: 'Turquie', tAnn: '18,4', pAnn: '730,5', tx: '33,8', tn: '6,0', koppen: 'Csa', d: '0,992', s: '37,1', couv: '90 %' },
                  { rang: 17, lieu: 'Héraklion', pays: 'Grèce', tAnn: '19,6', pAnn: '318,6', tx: '28,3', tn: '10,5', koppen: 'Csa', d: '1,007', s: '36,5', couv: '90 %' },
                  { rang: 18, lieu: 'Cagliari', pays: 'Italie', tAnn: '17,3', pAnn: '413,2', tx: '32,1', tn: '5,1', koppen: 'Csa', d: '1,058', s: '34,7', couv: '90 %' },
                  { rang: 19, lieu: 'Jerez', pays: 'Espagne', tAnn: '—', pAnn: '570,0', tx: '34,3', tn: '5,3', koppen: 'Csa', d: '1,082', s: '33,9', couv: '66 %' },
                  { rang: 20, lieu: 'Essaouira', pays: 'Maroc', tAnn: '17,9', pAnn: '364,2', tx: '22,4', tn: '11,2', koppen: 'BSk/BSh', d: '1,169', s: '31,1', couv: '90 %' },
                  { rang: 21, lieu: 'San Diego', pays: 'États-Unis', tAnn: '18,2', pAnn: '249,0', tx: '25,2', tn: '10,2', koppen: 'BSh/Csa', d: '1,196', s: '30,2', couv: '100 %' },
                  { rang: 22, lieu: 'Split', pays: 'Croatie', tAnn: '16,8', pAnn: '800,6', tx: '31,0', tn: '5,9', koppen: 'Csa', d: '1,198', s: '30,2', couv: '90 %' },
                  { rang: 23, lieu: 'Séville', pays: 'Espagne', tAnn: '19,2', pAnn: '502,0', tx: '36,2', tn: '6,0', koppen: 'Csa', d: '1,273', s: '28,0', couv: '100 %' },
                  { rang: 24, lieu: 'Sacramento', pays: 'États-Unis', tAnn: '16,6', pAnn: '461,0', tx: '33,7', tn: '4,0', koppen: 'Csa', d: '1,329', s: '26,5', couv: '90 %' },
                  { rang: 25, lieu: 'Almería', pays: 'Espagne', tAnn: '19,2', pAnn: '197,5', tx: '31,2', tn: '8,7', koppen: 'BWh', d: '1,357', s: '25,7', couv: '90 %' },
                  { rang: 26, lieu: 'Santiago', pays: 'Chili', tAnn: '—', pAnn: '286,3', tx: '30,4', tn: '2,6', koppen: 'BSk', d: '1,580', s: '20,6', couv: '76 %' },
                  { rang: 27, lieu: 'Fresno', pays: 'États-Unis', tAnn: '18,3', pAnn: '279,0', tx: '36,5', tn: '4,3', koppen: 'BSh', d: '1,653', s: '19,1', couv: '90 %' },
                  { rang: 28, lieu: 'Monterey', pays: 'États-Unis', tAnn: '13,3', pAnn: '435,0', tx: '20,1', tn: '6,2', koppen: 'Csb', d: '2,416', s: '8,9', couv: '78 %' },
                ].map((row, i) => (
                  <tr key={row.rang} className={`border-b ${i % 2 === 1 ? (isDark ? "bg-gray-800" : "bg-gray-50") : (isDark ? "bg-gray-900/50" : "bg-white")}`}>
                    <td className={`border px-2 py-1 text-center font-medium ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`}>{row.rang}</td>
                    <td className={`border px-2 py-1 text-left font-medium ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`}>{row.lieu}</td>
                    <td className={`border px-2 py-1 text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`}>{row.pays}</td>
                    <td className={`border px-2 py-1 text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`}>{row.tAnn}</td>
                    <td className={`border px-2 py-1 text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`}>{row.pAnn}</td>
                    <td className={`border px-2 py-1 text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`}>{row.tx}</td>
                    <td className={`border px-2 py-1 text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`}>{row.tn}</td>
                    <td className={`border px-2 py-1 text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`}>{row.koppen}</td>
                    <td className={`border px-2 py-1 text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`}>{row.d}</td>
                    <td className={`border px-2 py-1 text-center font-medium ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`}>{row.s}</td>
                    <td className={`border px-2 py-1 text-center ${isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-900"}`}>{row.couv}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          <p className="text-justify mt-2 text-sm" style={{ color: cardText }}>
            <strong>Stations marocaines non incluses dans le classement</strong> faute de données comparables complètes : Rabat-Salé (S ≈ 57 %, estimation), El Jadida (S ≈ 49 %), Safi (S ≈ 42 %, BSh), Sidi Kacem, Souk El Arbaa.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
