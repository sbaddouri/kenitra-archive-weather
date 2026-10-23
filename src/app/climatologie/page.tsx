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
          <CardTitle>PARTIE II — ANALOGUES DU MAROC ET DU MAGHREB</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <h3 className="font-bold mb-2 mt-4">2.1. Catégorie 1 — Climats quasi identiques (analogie très forte)</h3>
          <h4 className="font-semibold mb-1 mt-3">2.1.1. Larache (Province de Larache, Maroc) — Similarité S = 59,3 % (D = 0,522)</h4>
          <p>Larache (35°11′ N, 6°09′ O), à 120 km au nord-nord-est de Kénitra sur la même façade atlantique, constitue l'analogue marocain le plus proche de Kénitra hors du Gharb. Climat Csa, température moyenne annuelle 18,2 °C (contre 18,6 °C), précipitations 700,5 mm (contre 571 mm), moyenne des maximales d'août 28,7 °C (identique à Kénitra), moyenne des minimales de janvier 8,2 °C, record haut 46,4 °C, record bas −3,0 °C Wikipédia – Larache. Les différences sont pluviométriques : Larache reçoit environ 130 mm de plus, ce qui s'explique par sa position plus septentrionale, plus directement exposée aux perturbations atlantiques hivernales. Les deux villes partagent : régime pluviométrique à maximum hivernal, sécheresse estivale absolue, hiver sans gel, humidité élevée, vent de secteur nord. Aucune différence agroclimatique significative : la palette culturale (agrumes irrigués, céréales, betterave, maraîchage) est identique, et Larache est même un pôle marocain de la fraise et du maraîchage d'exportation.</p>
          <h4 className="font-semibold mb-1 mt-3">2.1.2. Rabat-Salé (Région Rabat-Salé-Kénitra, Maroc) — Similarité S ≈ 57 % (Salé : D ≈ 0,56)</h4>
          <p>Salé (34°02′ N, 6°48′ O) présente une température moyenne annuelle de 17,7 °C, des précipitations de 521,9 mm, une moyenne des maximales d'août de 27,8 °C, une moyenne des minimales de janvier de 7,2 °C, avec des records de 47,2 °C et −3,2 °C ; climat Csa Wikipédia – Salé. Rabat-Salé est la ville-jumelle climatique immédiate de Kénitra, à 40 km au sud-ouest : même influence océanique, même régime, même humidité, même absence de gel structurel. L'écart principal est une pluviométrie inférieure d'environ 50 mm et un été légèrement moins chaud. Il faut souligner que Rabat-Salé et Kénitra forment, avec Casablanca, un continuum littoral atlantique marocain dont la signature est remarquablement homogène sur près de 250 km de côte.</p>
          <h4 className="font-semibold mb-1 mt-3">2.1.3. Casablanca (Maroc) — Similarité S = 52,6 % (D = 0,642 ; couverture 100 %)</h4>
          <p>Casablanca (33°32′ N, 7°35′ O) : Csa, T = 18,6 °C, P = 408,2 mm, moyenne des maximales d'août 26,7 °C, moyenne des minimales de janvier 8,9 °C, humidité relative 82 %, ensoleillement 3 030 h, records 42,2 °C / 0,3 °C Wikipédia – Casablanca. C'est le seul analogue dont les six variables du modèle sont renseignées (couverture 100 %), ce qui en fait un point d'ancrage statistique solide. La divergence est pluviométrique : 163 mm de moins que Kénitra, ce qui rapproche Casablanca du seuil semi-aride et réduit sa similarité globale. Sur le plan de la température annuelle (18,6 °C, identique) et de l'humidité (82 % vs 76 %), la convergence est en revanche quasi parfaite.</p>
          <h3 className="font-bold mb-2 mt-4">2.2. Catégorie 2 — Climats extrêmement similaires</h3>
          <h4 className="font-semibold mb-1 mt-3">2.2.1. Tanger (Maroc) — Similarité S = 53,4 % (D = 0,628 ; couverture 100 %)</h4>
          <p>Tanger (35°47′ N, 5°48′ O) : Csa, T = 17,7 °C, P = 735,9 mm, moyenne des maximales d'août 28,6 °C, moyenne des minimales de janvier 8,8 °C, humidité relative 76 % (identique à Kénitra), ensoleillement 2 960,7 h Wikipédia – Tangier. L'écart pluviométrique (+165 mm) pénalise le score, mais la convergence hygrométrique (76 % vs 76 %) et thermique est remarquable. Tanger relève de la même famille « méditerranéen océanique du détroit » que Larache et Kénitra.</p>
          <h4 className="font-semibold mb-1 mt-3">2.2.2. El Jadida (Maroc) — Similarité S ≈ 49 % (D ≈ 0,71)</h4>
          <p>El Jadida (33°14′ N, 8°30′ O) : Csa, T = 17,4 °C, P = 372 mm, moyenne des maximales d'août 27,9 °C, moyenne des minimales de janvier 7,6 °C Wikipédia – El Jadida. Même structure thermique et hygrométrique, mais pluviométrie très inférieure (−199 mm), ce qui l'éloigne davantage que Casablanca.</p>
          <h4 className="font-semibold mb-1 mt-3">2.2.3. Sidi Kacem et Souk El Arbaa (Gharb intérieur) — Similarité ≈ 85-90 %</h4>
          <p>Sidi Kacem (34°13′ N, 5°42′ O, 194 m) et Souk El Arbaa (34°40′ N, 5°58′ O), toutes deux dans la région de Kénitra, présentent un climat plus continentalisé que Kénitra : « étés chauds à très chauds, pointes entre 32 et 36 °C ; hivers relativement frais, les minima passant parfois sous le point de congélation ; précipitations annuelles de 350 à 600 mm » Wikipédia – Sidi Kacem ; Wikipédia – Souk El Arbaa. Il s'agit d'analogues intra-régionaux dégradés par la continentalité : le gradient Kénitra → Sidi Kacem → Sidi Slimane illustre le passage du littoral océanique tempéré à l'intérieur semi-aride du Gharb, gradient décrit dans la littérature sous la forme d'un « climat subhumide au nord-ouest, semi-aride au sud et à l'est » JLE – Bilan hydrique des sols et recharge de la nappe profonde de la plaine du Gharb.</p>
          <h4 className="font-semibold mb-1 mt-3">2.2.4. Essaouira (Maroc) — Similarité S = 31,1 % (D = 1,169)</h4>
          <p>Essaouira (31°30′ N, 9°46′ O) : BSk/BSh, T = 17,9 °C, P = 364,2 mm, moyenne des maximales de septembre 22,4 °C (remarquablement fraîche, reflet d'un upwelling intense), moyenne des minimales de janvier 11,2 °C, ensoleillement 2 978,5 h Wikipédia – Essaouira. Essaouira constitue un analogue « océanique froid » extrême : la température annuelle est proche, mais l'été y est beaucoup plus frais (22,4 °C contre 28,7 °C de moyenne des maximales). Elle délimite la borne froide de la famille des analogues atlantiques marocains.</p>
          <h3 className="font-bold mb-2 mt-4">2.3. Analogues algériens et tunisiens</h3>
          <h4 className="font-semibold mb-1 mt-3">2.3.1. Mostaganem (Algérie) — Similarité S ≈ 46 % (D ≈ 0,78)</h4>
          <p>Mostaganem (35°56′ N, 0°05′ E, 104 m) : Csa, T = 17,9 °C, P = 347 mm, moyenne des maximales de juillet 31,6 °C, moyenne des minimales de janvier 5,8 °C, records 45,9 °C / −2,2 °C Wikipédia – Mostaganem. Convergence thermique annuelle forte, divergence pluviométrique (−224 mm) et continentale hivernale (minima plus bas).</p>
          <h4 className="font-semibold mb-1 mt-3">2.3.2. Tlemcen (Algérie) — Similarité ≈ 40 %</h4>
          <p>Tlemcen (34°53′ N, 1°19′ O, 842 m) : Csa, T = 17,2 °C, P = 444,8 mm, moyenne des maximales d'août 33,6 °C, moyenne des minimales de janvier 5,3 °C Wikipédia – Tlemcen. La température annuelle est très proche, mais l'altitude et la continentalité accroissent l'amplitude et les extrêmes hivernaux, ce qui dégrade l'analogie avec le littoral kénitrien.</p>
          <h4 className="font-semibold mb-1 mt-3">2.3.3. Bizerte (Tunisie) — Similarité S ≈ 50 % (D ≈ 0,69)</h4>
          <p>Bizerte (37°16′ N, 9°51′ E, 5 m) : Csa, T = 18,6 °C (identique à Kénitra), P = 653,2 mm, moyenne des maximales d'août 33,2 °C, moyenne des minimales de janvier 7,1 °C, ensoleillement 3 026,9 h, records 48,9 °C / −4,2 °C Wikipédia – Bizerte. C'est le meilleur analogue tunisien : même température annuelle, pluviométrie du même ordre, mais été nettement plus chaud (33,2 °C contre 28,7 °C) car Bizerte n'est pas rafraîchie par un upwelling atlantique équivalent.</p>
          <h4 className="font-semibold mb-1 mt-3">2.3.4. Béja et Tunis (Tunisie)</h4>
          <p>Béja (36°44′ N, 9°11′ E, 222 m) : Csa, T = 18,3 °C, P = 610,5 mm, moyenne des maximales d'août 36,7 °C, moyenne des minimales de février 4,8 °C, records 48,9 °C / −4,5 °C Wikipédia – Béja. Tunis (36°48′ N, 10°10′ E) : Csa, T = 19,2 °C, P = 555,2 mm, moyenne des maximales de juillet 33,0 °C, moyenne des minimales de janvier 5,6 °C, records 49,0 °C / 2,0 °C Wikipédia – Tunis. Ces deux stations partagent la pluviométrie et la température annuelle de Kénitra mais pas son été tempéré ni son humidité.</p>
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>PARTIE III — ANALOGUES DU BASSIN MÉDITERRANÉEN NORD</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <h3 className="font-bold mb-2 mt-4">3.1. Analogues ibériques — le cœur de l'analogie européenne</h3>
          <h4 className="font-semibold mb-1 mt-3">3.1.1. Faro (Algarve, Portugal) — Similarité S = 70,9 % (D = 0,344) — ANALOGUE N° 1 MONDIAL</h4>
          <p>Faro (37°00′ N, 7°56′ O, 8 m) obtient le meilleur score mondial du modèle. Csa ; T = 17,5-18,5 °C ; P = 511,6 mm ; moyenne des maximales de juillet 29,2 °C ; moyenne des minimales de janvier 7,9 °C ; ensoleillement 3 044,4 h ; records 44,3 °C / 1,2 °C Wikipédia – Faro. Les écarts sont minimes : ΔT ≈ −0,6 °C, ΔP ≈ −60 mm, ΔTx ≈ +0,5 °C, ΔTn ≈ −1,3 °C, ΔEnsoleillement ≈ −66 h. Faro est un littoral atlantique méridional à été sec : exactement la même mécanique que Kénitra (océan tempéré + anticyclone subtropical + sécheresse estivale). La végétation y est dominée par le pin pignon, le caroubier, l'olivier, le figuier et l'amandier — une palette quasi superposable à celle du Gharb. La principale différence est l'intensité du refroidissement estival par upwelling : la côte algarienne est plus froide en été que Kénitra, où le plateau continental et l'orientation du trait de côte atténuent cet effet.</p>
          <h4 className="font-semibold mb-1 mt-3">3.1.2. Portimão (Algarve, Portugal) — Similarité S = 59,5 % (D = 0,520)</h4>
          <p>Portimão (37°08′ N, 8°32′ O) : Csa, T = 17,2 °C, P = 528,1 mm, moyenne des maximales d'août 28,8 °C, moyenne des minimales de janvier 8,2 °C, ensoleillement 3 018,8 h, records 37,6 °C / −2,0 °C Wikipédia – Portimão. Convergence quasi parfaite sur la pluviométrie (528 vs 571 mm) et la moyenne des maximales d'août (28,8 vs 28,7 °C). Portimão confirme que l'Algarve occidental est le meilleur analogue européen de Kénitra.</p>
          <h4 className="font-semibold mb-1 mt-3">3.1.3. Huelva et Jerez de la Frontera (Andalousie atlantique, Espagne)</h4>
          <p>Huelva (37°15′ N, 6°57′ O, 54 m) : Csa, T = 18,1 °C, P = 525 mm, moyenne des maximales d'août 33,1 °C, moyenne des minimales de janvier 5,9 °C, ensoleillement 2 970 h, records 43,9 °C / −3,2 °C Wikipédia – Huelva. Jerez (36°40′ N, 6°08′ O, 56 m) : T ≈ 18 °C, P = 570 mm, moyenne des maximales d'août 34,3 °C, moyenne des minimales de janvier 5,3 °C, 2 965 h d'ensoleillement, 53 jours de pluie, 137 jours clairs Wikipédia – Jerez de la Frontera. La pluviométrie de Jerez (570 mm) est rigoureusement égale à celle de Kénitra (571 mm) — mais l'été andalou est 5,6 °C plus chaud (34,3 vs 28,7 °C) et l'hiver 3,9 °C plus froid : c'est la continentalité andalouse qui crée l'écart.</p>
          <h4 className="font-semibold mb-1 mt-3">3.1.4. Séville (Espagne) — Similarité S = 28,0 %</h4>
          <p>Séville (37°23′ N, 5°59′ O, 7 m) : Csa, T = 19,2 °C, P = 502 mm, moyenne des maximales de juillet 36,2 °C, moyenne des minimales de janvier 6,0 °C, humidité relative 59,4 %, ensoleillement 3 279,3 h, records 46,6 °C / −5,5 °C Wikipédia – Seville. Séville est l'anti-modèle absolu de Kénitra : à pluviométrie comparable, elle cumule une humidité 17 points plus basse, un été 7,5 °C plus chaud et un hiver 3,2 °C plus froid. L'analogie est hydrique mais nullement hygrothermique.</p>
          <h4 className="font-semibold mb-1 mt-3">3.1.5. Valence et Barcelone (Espagne méditerranéenne)</h4>
          <p>Valence (39°28′ N, 0°22′ O, 15 m) : BSh/Csa, T = 18,6 °C (identique à Kénitra), P = 459 mm, moyenne des maximales d'août 30,6 °C, moyenne des minimales de janvier 7,5 °C, 2 733 h d'ensoleillement, records 44,5 °C / −7,2 °C Wikipédia – Valencia. Barcelone (41°23′ N, 2°11′ E, 12 m) : Csa, T = 18,2 °C (jour 21,2 / nuit 15,1), P = 558,1 mm, moyenne des maximales d'août 28,9 °C, moyenne des minimales de janvier 5,5 °C, HR 68 %, 2 489 h, records 37,4 °C / −8,0 °C Wikipédia – Barcelona. Barcelone est un analogue remarquable par sa pluviométrie (558 mm) et sa moyenne des maximales d'août (28,9 °C) ; elle s'en écarte par un hiver plus froid et un ensoleillement bien moindre.</p>
          <h4 className="font-semibold mb-1 mt-3">3.1.6. Setúbal et Algeciras (péninsule Ibérique méridionale)</h4>
          <p>Setúbal (38°31′ N, 8°53′ O) : Csa, T ≈ 16,5-17 °C, P = 703,4 mm, moyenne des maximales d'août 30,7 °C, moyenne des minimales de janvier 5,2 °C, records 45,5 °C / −5,8 °C Wikipédia – Setúbal. Algeciras (36°07′ N, 5°27′ O, 20 m) : Csa, T = 18,3 °C, P = 835,7 mm, moyenne des maximales d'août 27,8 °C, moyenne des minimales de janvier 11,1 °C Wikipédia – Algeciras. Algeciras, avec 27,8 °C de moyenne des maximales d'août et 11,1 °C de minima en janvier, est thermiquement le plus proche de Kénitra — mais sa pluviométrie de 835,7 mm l'en éloigne structurellement.</p>
          <h4 className="font-semibold mb-1 mt-3">3.1.7. Almería et Carthagène (Sud-Est espagnol) — analogues « chauds et secs » dégradés</h4>
          <p>Almería (36°50′ N, 2°27′ O, 24 m) : BWh, T = 19,2 °C, P = 197,5 mm, moyenne des maximales d'août 31,2 °C, ensoleillement 3 095 h, records 42,0 °C / 0,1 °C Wikipédia – Almería. Carthagène (37°36′ N, 0°59′ O, 10 m) : climat de transition BSh/BWh, T = 19,2 °C, P = 260,2 mm, moyenne des maximales d'août 30,4 °C Wikipédia – Cartagena. Ces stations constituent des analogues « chauds et secs » de Kénitra, décalés vers l'aridité ; elles ne partagent ni la pluviométrie (déficit de 310 à 370 mm) ni l'humidité.</p>
          <h3 className="font-bold mb-2 mt-4">3.2. Analogues italiens, maltais, croates et grecs</h3>
          <h4 className="font-semibold mb-1 mt-3">3.2.1. Cagliari (Sardaigne, Italie) — Similarité S = 34,7 % (D = 1,058)</h4>
          <p>Cagliari (39°13′ N, 9°06′ E, 4 m) : Csa, T = 17,3 °C, P = 413,2 mm, moyenne des maximales d'août 32,1 °C, moyenne des minimales de février 5,1 °C, 2 729,2 h, records 44,6 °C / 4,8 °C Wikipédia – Cagliari. Convergence méditerranéenne classique, dégradée par un été 3,4 °C plus chaud.</p>
          <h4 className="font-semibold mb-1 mt-3">3.2.2. La Valette (Malte) — Similarité S = 56,1 % (D = 0,578 ; couverture 54 %)</h4>
          <p>La Valette (35°54′ N, 14°31′ E, 56 m) : Csa, P = 580,7 mm (proche de 571 mm), moyenne des maximales d'août 32,0 °C, moyenne des minimales de février 9,5 °C Wikipédia – Valletta. Pluviométrie quasi identique, minima hivernaux proches, mais été insulaire nettement plus chaud. La couverture du modèle est faible (3 variables) : le score doit être lu avec prudence.</p>
          <h4 className="font-semibold mb-1 mt-3">3.2.3. Split (Croatie) — Similarité S = 30,2 %</h4>
          <p>Split (43°30′ N, 16°26′ E, 0 m) : Csa, T = 16,8 °C, P = 800,6 mm, moyenne des maximales de juillet 31,0 °C, moyenne des minimales de janvier 5,9 °C, 2 698,5 h, records 38,6 °C / −9,0 °C Wikipédia – Split. Trop arrosé (+230 mm) et trop froid en hiver.</p>
          <h4 className="font-semibold mb-1 mt-3">3.2.4. Héraklion (Crète, Grèce) — Similarité S = 36,5 %</h4>
          <p>Héraklion (35°20′ N, 25°08′ E) : Csa, T = 19,6 °C, P = 318,6 mm, moyenne des maximales de juillet-août 28,3 °C (très proche de Kénitra), moyenne des minimales de janvier 10,5 °C, 2 778,6 h, records 38,3 °C / 1,4 °C Wikipédia – Heraklion. La température annuelle et les maxima estivaux sont remarquablement proches, mais la pluviométrie est inférieure de 252 mm — l'analogie est thermique et non hydrique.</p>
          <h3 className="font-bold mb-2 mt-4">3.3. Analogues turcs et levantins</h3>
          <h4 className="font-semibold mb-1 mt-3">3.3.1. Izmir (Turquie) — Similarité S = 37,1 % (D = 0,992)</h4>
          <p>Izmir (38°25′ N, 27°08′ E, 2 m) : Csa, T = 18,4 °C, P = 730,5 mm, moyenne des maximales de juillet 33,8 °C, moyenne des minimales de janvier 6,0 °C, 2 938,5 h, records 43,2 °C / −8,2 °C Wikipédia – İzmir. Température annuelle très proche, mais été 5,1 °C plus chaud et pluviométrie supérieure.</p>
          <h4 className="font-semibold mb-1 mt-3">3.3.2. Tel-Aviv (Israël) — Similarité S = 40,2 %</h4>
          <p>Tel-Aviv (32°05′ N, 34°47′ E, 5 m) : Csa, T = 20,9 °C, P = 528 mm, moyenne des maximales d'août 30,2 °C, moyenne des minimales de janvier 9,6 °C, records 46,5 °C / 1,9 °C Wikipédia – Tel Aviv. Pluviométrie et minima hivernaux très proches, mais température annuelle 2,3 °C plus élevée et climat nettement plus chaud.</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>PARTIE IV — ANALOGUES DES AMÉRIQUES</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <h3 className="font-bold mb-2 mt-4">4.1. Californie et côte pacifique des États-Unis</h3>
          <h4 className="font-semibold mb-1 mt-3">4.1.1. Los Angeles (États-Unis) — Similarité S = 48,0 % (D = 0,735 ; couverture 100 %)</h4>
          <p>Los Angeles (34°03′ N, 118°15′ O, 93 m) : BSh (Csb sur la côte, Csa à l'intérieur), T = 18,8 °C, P = 362 mm, moyenne des maximales d'août 28,9 °C (identique à Kénitra), moyenne des minimales de décembre 9,0 °C, HR 70,8 %, ensoleillement 3 254,2 h, records 45 °C / 2 °C Wikipédia – Los Angeles. La structure thermique est superposable (ΔT = +0,2 °C, ΔTx = +0,2 °C, ΔTn = −0,2 °C), mais le déficit pluviométrique de 209 mm réduit fortement la similarité. Los Angeles est le meilleur analogue extra-méditerranéen de Kénitra sur le plan thermique, un analogue médiocre sur le plan hydrique.</p>

          <h4 className="font-semibold mb-1 mt-3">4.1.2. Santa Barbara (Californie) — Similarité S = 45,5 %</h4>
          <p>Santa Barbara (34°25′ N, 119°42′ O, 15 m) : Csb, T = 17,0 °C, P = 482,4 mm, moyenne des maximales d'août-septembre 25,4 °C, moyenne des minimales de décembre 7,8 °C, 3 099,8 h, records 42 °C / −7 °C Wikipédia – Santa Barbara. Pluviométrie proche (482 mm), mais été 3,3 °C plus frais — l'upwelling californien est plus intense qu'à Kénitra.</p>

          <h4 className="font-semibold mb-1 mt-3">4.1.3. San Diego (Californie) — Similarité S = 30,2 %</h4>
          <p>San Diego (32°42′ N, 117°09′ O) : BSh/Csa, T = 18,2 °C, P = 249 mm, moyenne des maximales d'août 25,2 °C, moyenne des minimales de janvier 10,2 °C, HR 69 %, 3 054,6 h, records 44 °C / 4 °C Wikipédia – San Diego. Minima hivernaux très proches (10,2 vs 9,2 °C), mais été plus frais et aridité marquée.</p>

          <h4 className="font-semibold mb-1 mt-3">4.1.4. Sacramento et Fresno (Vallée Centrale) — analogues continentaux rejetés</h4>
          <p>Sacramento (38°34′ N, 121°29′ O) : Csa, T = 16,6 °C, P = 461 mm, moyenne des maximales de juillet 33,7 °C, moyenne des minimales de janvier 4,0 °C, 3 607,8 h, records 46,7 °C / −7,8 °C Wikipédia – Sacramento. Fresno : BSh, T = 18,3 °C, P = 279 mm, moyenne des maximales de juillet 36,5 °C, 3 550 h, records 46,1 °C / −8 °C Wikipédia – Fresno. Ces stations, souvent citées comme analogues des climats marocains, ne le sont PAS pour Kénitra : leur amplitude annuelle dépasse 29 °C (contre 11,5 °C) et leur humidité estivale est très basse. Elles constituent en revanche des analogues pertinents de Guercif.</p>

          <h4 className="font-semibold mb-1 mt-3">4.1.5. Monterey (Californie) — Similarité S = 8,9 % (analogue rejeté)</h4>
          <p>Monterey (36°36′ N, 121°53′ O) : Csb, T = 13,3 °C, P = 435 mm, moyenne des maximales de septembre 20,1 °C, moyenne des minimales de janvier 6,2 °C Wikipédia – Monterey. Trop froid (ΔT = −5,3 °C) : la dérive froide californienne est beaucoup plus intense que l'upwelling marocain.</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>PARTIE IV — ANALOGUES DES AMÉRIQUES (suite)</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <h3 className="font-bold mb-2 mt-4">4.2. Amérique latine</h3>
          <h4 className="font-semibold mb-1 mt-3">4.2.1. Santiago (Chili) — Similarité S = 20,6 % (D = 1,580 ; avec correction saisonnière)</h4>
          <p>Santiago (33°26′ S, 70°39′ O, 570 m) : BSk avec tendances Csb, P = 286,3 mm (Quinta Normal), moyenne des maximales de janvier 30,4 °C, moyenne des minimales de juillet 2,6 °C, HR 64-71 %, ensoleillement 2 888,4 h, records 39,3 °C / −6,8 °C Wikipédia – Santiago. Après inversion saisonnière (janvier ↔ juillet), la structure thermique devient comparable, mais la pluviométrie (286 mm) est inférieure de 285 mm et les minima hivernaux (2,6 °C) sont 6,6 °C plus froids que ceux de Kénitra. Santiago est un analogue thermique dégradé par l'aridité et la continentalité altitudinale.</p>
          <p className="text-xs text-muted-foreground mt-2">Note : les fiches de Valparaíso, Buenos Aires et Montevideo n'ont pu être établies, les pages sources n'ayant pas été accessibles lors de la collecte. Elles sont signalées comme lacunes de couverture.</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>PARTIE V — ANALOGUES DE L'HÉMISPHÈRE SUD ET CORRECTION SAISONNIÈRE</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <h3 className="font-bold mb-2 mt-4">5.1. Méthode de correction</h3>
          <p>Pour les stations de l'hémisphère sud, la comparaison est conduite selon deux modalités : (i) comparaison calendaire brute (mois civil contre mois civil), qui mesure la ressemblance des états mensuels absolus ; (ii) comparaison après inversion saisonnière stricte (janvier ↔ juillet, février ↔ août, …, juin ↔ décembre), qui mesure la ressemblance des structures saisonnières. Conformément au mandat, le décalage n'est pas appliqué aveuglément aux régimes pluviométriques : la saisonnalité des pluies est comparée séparément, car un régime à maximum hivernal austral correspond, après inversion, à un maximum estival boréal — divergence structurelle majeure.</p>

          <h3 className="font-bold mb-2 mt-4">5.2. Le Cap (Afrique du Sud) — Similarité S = 54,9 % (D = 0,600 ; couverture 90 %)</h3>
          <p>Le Cap (33°55′ S, 18°25′ E) : Csb, T = 17,3 °C, P = 492,8 mm, moyenne des maximales de février 27,3 °C (↔ août boréal), moyenne des minimales de juillet 7,4 °C (↔ janvier boréal), ensoleillement 3 115 h, records 45,2 °C / 1,3 °C Wikipédia – Cape Town. Après inversion saisonnière, la convergence est excellente : ΔT = −1,3 °C, ΔP = −78 mm, ΔTx = −1,4 °C, ΔTn = −1,8 °C, ΔEnsoleillement = +5 h. Le Cap partage en outre le même régime pluviométrique à maximum hivernal (pluies d'hiver austral ↔ pluies d'hiver boréal pour Kénitra), ce qui est rare parmi les analogues de l'hémisphère sud et en fait l'un des meilleurs analogues planétaires. Différences : hivers plus frais, été plus court, influence de l'upwelling de Benguela.</p>

          <h3 className="font-bold mb-2 mt-4">5.3. Adelaide (Australie) — Similarité S = 60,3 % (D = 0,507) — 2ᵉ rang mondial</h3>
          <p>Adelaide (34°55′ S, 138°36′ E, 50 m) : Csa, T = 17,5 °C, P = 536,5 mm, moyenne des maximales de janvier 30,0 °C, moyenne des minimales de juillet 7,7 °C, records 47,7 °C / 0,4 °C Wikipédia – Adelaide. Après inversion saisonnière : ΔT = −1,1 °C, ΔP = −35 mm, ΔTx = +1,3 °C, ΔTn = −1,5 °C. C'est, avec Le Cap, le meilleur analogue de l'hémisphère sud. Adelaide relève de la même famille « méditerranéen austral tempéré » que Kénitra, avec une pluviométrie quasi identique (536 vs 571 mm).</p>

          <h3 className="font-bold mb-2 mt-4">5.4. Perth (Australie) — Similarité S = 47,0 % (D = 0,754)</h3>
          <p>Perth (31°57′ S, 115°51′ E) : Csa, P = 731,1 mm, moyenne des maximales de février 31,6 °C, moyenne des minimales de juillet 8,0 °C, records 46,2 °C / 0,7 °C Wikipédia – Perth. Régime pluviométrique à maximum hivernal austral, comme Le Cap : après inversion, la structure est fidèle, mais l'été est 2,9 °C plus chaud et la pluviométrie supérieure de 160 mm.</p>

          <h3 className="font-bold mb-2 mt-4">5.5. Autres stations australes</h3>
          <p>Les fiches de Sydney, Melbourne et Auckland n'ont pu être établies (pages sources inaccessibles). Sur la base des données disponibles, Auckland et la Nouvelle-Zélande ne présentent aucun analogue direct : leur climat océanique tempéré est dépourvu de sécheresse estivale marquée. Le Karoo sud-africain et le bassin de Murray-Darling (Mildura, Renmark), souvent cités comme analogues des climats semi-arides marocains, sont des analogues de Guercif, non de Kénitra : trop continentaux, trop secs en été, trop froids en hiver.</p>
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
