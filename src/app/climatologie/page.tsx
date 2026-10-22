import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

const headerCols = ['Paramètre', ...months, 'Année', 'OMM 91-20'];

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
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Card className="mb-6">
        <CardHeader className="flex flex-col items-center text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">RAPPORT SCIENTIFIQUE DE CLIMATOLOGIE COMPARÉE MONDIALE</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-center font-semibold text-lg mb-1">Analogues climatiques planétaires de la ville de Kénitra et de la plaine du Gharb</p>
          <p className="text-center text-sm mb-1">Région Rabat-Salé-Kénitra, Royaume du Maroc — Province de Kénitra</p>
          <p className="text-center text-sm mb-3">Étude bioclimatique, agroclimatique, écophysiologique et biogéographique exhaustive</p>
          <div className="grid grid-cols-1 gap-2 text-xs mb-4">
            <p className="mb-0"><strong>Auteur :</strong> Cabinet international de climatologie comparée</p>
            <p className="mb-0"><strong>Objet :</strong> Identification exhaustive des analogues climatiques mondiaux de la station de Kénitra (34°15′ N, 6°35′ O, ~26 m ; station synoptique 34°18′ N, 6°36′ O, 5 m, indicatif OMM 60120 / GMMY)</p>
            <p className="mb-0"><strong>Méthodologie :</strong> Comparaison multi-classificatoire (Köppen-Geiger, Trewartha, Emberger, De Martonne, UNEP, USDA, AHS), analyse multi-paramétrique, correction saisonnière hémisphérique, analyse écophysiologique par espèce indicatrice.</p>
            <p className="mb-0"><strong>Longueur :</strong> Rapport intégral non abrégé.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>TABLEAU CLIMATIQUE DE RÉFÉRENCE — KÉNITRA</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">Normales et extrêmes 1940-2025, ensoleillement 1981-2010, jours de pluie 1961-1990. Colonne de contrôle : normales OMM 1991-2020 (NOAA/NCEI, station KENITRA 60120).</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="text-xs border border-gray-200">
              <TableHeader>
                <TableRow className="border-b border-black">
                  {headerCols.map((h) => (
                    <TableCell key={h} className="bg-gray-100 font-semibold text-center border-r border-black sticky left-0 z-10">{h}</TableCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row[0]} className="border-b border-black">
                    <TableCell className="font-medium border-r border-black">{row[0]}</TableCell>
                    {row.slice(1, -2).map((v, i) => (
                      <TableCell key={i} className="text-center border-r border-black">{v}</TableCell>
                    ))}
                    <TableCell className="text-center font-semibold border-r border-black">{row[13]}</TableCell>
                    <TableCell className="text-center border-r border-black last:border-r-0">{row[14]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
          <CardTitle>Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-5 space-y-1 text-sm">
            <li>Tableau de référence reproduit à partir des normales et extrêmes 1940-2025 de la station de Kénitra, ensoleillement 1981-2010 et jours de pluie 1961-1990.</li>
            <li>Colonne de contrôle : normales OMM 1991-2020, station KENITRA 60120, source NOAA/NCEI.</li>
          </ol>
        </CardContent>
      </Card>

      <div className="text-center">
        <Link href="/archives">
          <Button size="lg">Explorer les données par année</Button>
        </Link>
      </div>
    </div>
  );
}
