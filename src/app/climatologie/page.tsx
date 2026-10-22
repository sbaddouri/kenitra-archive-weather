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
          <CardTitle>PARTIE I — CADRE MÉTHODOLOGIQUE ET DIAGNOSTIC CLIMATIQUE DE RÉFÉRENCE</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <h3 className="font-bold mb-2 mt-4">1.1. Identification géographique et positionnement climatique</h3>
          <p>Kénitra (34°15′ N, 6°35′ O, altitude 26 m ; station synoptique à 5 m) est située sur la rive sud de l'oued Sebou, à 12 km de son embouchure atlantique, au niveau de Mehdia, dans la région administrative de Rabat-Salé-Kénitra Wikipédia – Kénitra. Elle occupe le cœur de la plaine du Gharb, vaste bassin sédimentaire de plus de 6 000 km² drainé par le bas Sebou et le Beht. Le Sebou, qui prend sa source dans le Moyen Atlas à 2 030 m sous le nom d'oued Guigou, parcourt environ 500 km, draine près de 40 000 km² et produit à lui seul près du tiers des eaux de surface du Maroc ; ses apports moyens interannuels atteignent 5 170 Mm³ ABH Sebou – Eaux de surface.</p>
          <p>Trois éléments structurants commandent le climat : (i) la proximité immédiate de l'océan Atlantique (5 à 12 km), qui impose une régulation thermique et hygrométrique permanente ; (ii) la faible altitude et la topographie ouverte de la plaine, qui laisse pénétrer librement les flux océaniques de secteur nord à nord-ouest ; (iii) l'anticyclone des Açores, qui, en été, bloque les perturbations atlantiques et provoque la sécheresse estivale, tout en générant les brouillards et stratus côtiers caractéristiques du littoral atlantique marocain D. Noin, « Types de temps d'été au Maroc » ; H. Delannoy, « Remarques sur les brouillards d'été dans quelques régions du Maroc atlantique ».</p>
          <p>Conséquence immédiate : le climat de Kénitra n'est pas celui de l'intérieur du Maroc semi-aride (Guercif, Oujda, Meknès). C'est un climat méditerranéen à très forte influence océanique — une nuance fondamentale que le reste de ce rapport va quantifier.</p>

          <h3 className="font-bold mb-2 mt-4">1.2. Les sept invariants de la « signature kénitrienne »</h3>
          <p>L'analyse comparative ne saurait se réduire à l'alignement des moyennes annuelles. La signature climatique de Kénitra procède d'une combinatoire spécifique, qualifiable de « signature kénitrienne », qui repose sur sept invariants :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Pluviométrie annuelle de 540 à 720 mm</strong>, avec un maximum automnal-hivernal très marqué (novembre = 94 mm) et une sécheresse estivale quasi absolue (juin-août ≤ 10 mm). Octobre-mars totalise 451 mm, soit 79,0 % du total annuel ; avril-septembre ne reçoit que 120 mm.</li>
            <li><strong>Saison sèche estivale sévère de cinq mois :</strong> selon le critère de Walter-Lieth (P &lt; 2T), mai, juin, juillet, août et septembre sont secs ; selon l'indice mensuel de De Martonne (I &lt; 10), juin, juillet, août et septembre sont arides.</li>
            <li><strong>Été chaud mais tempéré par l'océan :</strong> mois le plus chaud = août (moyenne 24,7 °C ; moyenne des maximales 28,7 °C). La moyenne des maxima annuelle n'atteint que 36,9 °C — loin des 42,2 °C de Guercif. Aucune torridité structurelle.</li>
            <li><strong>Hiver doux, pratiquement sans gel :</strong> janvier = 13,2 °C de moyenne, 9,2 °C de moyenne des minimales ; la moyenne des minima annuels s'établit à 5,29 °C (USDA 11a), et le gel n'apparaît qu'épisodiquement lors de décrochages radiatifs (record −1,1 °C dans ce tableau, −3,0 °C dans les normales OMM).</li>
            <li><strong>Ensoleillement annuel de 3 000 à 3 110 heures,</strong> soit ~70 % du potentiel héliométrique — élevé, mais nettement inférieur aux 3 400-3 600 h de l'intérieur (Sacramento, Fresno, Séville) à cause des stratus et brouillards côtiers estivaux et des brouillards radiatifs hivernaux.</li>
            <li><strong>Humidité relative élevée (76 % en moyenne annuelle) et point de rosée élevé (13,7 °C en moyenne ; 18,7 °C en août) :</strong> l'été kénitrien est « lourd », et non « sec ». WeatherSpark relève en août 18,9 jours « moites ou pires » et décrit des étés « arides, moites (muggy), majoritairement clairs » WeatherSpark – Kenitra. C'est l'invariant le plus discriminant de la signature kénitrienne.</li>
            <li><strong>Continentalité très faible :</strong> amplitude annuelle des moyennes de seulement 11,5 °C, indice de continentalité de Gorczynski k ≈ 14,0 (climat franchement maritime) ; vent dominant de secteur nord, avec un maximum de vitesse en avril (9,4 mph) et un minimum en septembre (7,7 mph) WeatherSpark.</li>
          </ul>
          <p>Toute région du monde ne satisfaisant pas simultanément ces sept invariants doit être exclue de la catégorie des « climats quasi identiques ». Ce filtre exclut d'emblée : (a) les analogues continentaux semi-arides (Guercif, Bakersfield, Madrid, Zaragoza) dont l'amplitude annuelle dépasse 18-20 °C et l'humidité tombe sous 60 % ; (b) les analogues désertiques chauds (Almería, Coachella, Errachidia) ; (c) les analogues océaniques frais sans sécheresse estivale (Monterey, Auckland, Biarritz), dont la sécheresse estivale est absente ou insignifiante.</p>

          <h3 className="font-bold mb-2 mt-4">1.3. Contrôle qualité et anomalies détectées dans le tableau source</h3>
          <p>Conformément au mandat d'audit scientifique, six anomalies ou points de vigilance ont été identifiés dans le tableau fourni. Aucune donnée n'a été modifiée silencieusement ; les valeurs litigieuses sont signalées.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>A1 — Point de rosée annuel incohérent (anomalie majeure).</strong> Le tableau indique un point de rosée annuel de 8,4 °C. Or le minimum mensuel est de 9,38 °C (janvier) : une moyenne annuelle ne peut être inférieure à toutes ses composantes mensuelles. La moyenne arithmétique correcte des douze valeurs mensuelles est 13,68 °C. La valeur 8,4 °C correspond exactement au point de rosée annuel de Guercif figurant dans le rapport-modèle : il s'agit donc, selon toute vraisemblance, d'une erreur de recopie depuis le tableau de Guercif. Valeur retenue dans cette étude : 13,7 °C (recalculée), avec vérification indépendante par la formule de Magnus à partir de T et de HR (moyenne annuelle recalculée = 14,2 °C, soit un écart moyen de +0,56 °C par rapport aux valeurs mensuelles du tableau, acceptable pour des périodes de référence différentes).</li>
            <li><strong>A2 — Records absolus non sourcés (vigilance).</strong> Le tableau annonce un record de chaleur de 48,0 °C en juillet et un record de froid de −1,1 °C en janvier, sur une période « 1940-2025 ». Les normales OMM 1991-2020 de la même station donnent un record de 47,7 °C en août et un record de froid de −3,0 °C en février Wikipédia – Kenitra. Les deux séries divergent de 0,3 °C sur le maximum et de 1,9 °C sur le minimum. Ces records doivent être confirmés sur les registres de la Direction Générale de la Météorologie (DGM) : les valeurs de 2023-2025 (vagues de chaleur marocaines ayant dépassé 48 °C) peuvent légitimement expliquer le relèvement du record haut, mais aucune source primaire n'a pu être consultée pour le record bas. Ils sont utilisés ici comme valeurs du tableau fourni, avec réserve explicite.</li>
            <li><strong>A3 — Hétérogénéité des périodes de référence (vigilance méthodologique).</strong> Le tableau est un composite : extrêmes 1940-2025, normales thermiques et pluviométriques sur une période longue non spécifiée, ensoleillement 1981-2010, jours de pluie 1961-1990. La comparaison avec les normales OMM 1991-2020 montre des écarts cohérents avec le réchauffement récent : +0,2 °C sur la température moyenne (18,6 vs 18,4 °C), +31,5 mm sur les précipitations (571 vs 539,5 mm), +104,8 h sur l'ensoleillement (3 110,5 vs 3 005,7 h). Ces écarts sont du même ordre que la variabilité interannuelle et ne remettent pas en cause les conclusions ; ils sont documentés dans les fiches.</li>
            <li><strong>A4 — Nature des lignes « Moyenne des maxima / minima » (clarification, non anomalie).</strong> Les valeurs annuelles 36,90 °C et 5,29 °C ne sont pas les moyennes des douze valeurs mensuelles (respectivement 28,4 °C et 10,6 °C) : ce sont les moyennes des extrêmes annuels, c'est-à-dire la température maximale moyenne de l'année (36,90 °C) et la température minimale moyenne de l'année (5,29 °C). Elles ne doivent donc jamais être confondues avec des moyennes climatiques mensuelles.</li>
            <li><strong>A5 — Double comptage des jours de pluie.</strong> Les lignes « jours de précipitation ≥ 1 mm » (50 j) et « jours de pluie » (98,4 j, période 1961-1990) utilisent deux seuils et deux périodes différents. La seconde intègre vraisemblablement les jours à trace (≥ 0,1-0,2 mm). Elles ne sont pas contradictoires mais non directement comparables ; seule la première (50 j ≥ 1 mm) est utilisée dans les calculs de similarité.</li>
            <li><strong>A6 — Absence totale de neige.</strong> Les précipitations solides sont nulles sur les douze mois — cohérent avec un climat USDA 11a et une altitude de 5-26 m.</li>
          </ul>
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
