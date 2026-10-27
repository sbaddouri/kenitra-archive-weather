"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WeatherCountdown from '@/components/weather-countdown';

export default function RapportScientifiquePage() {
  return (
    <div className="space-y-8">
      <WeatherCountdown />
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">RAPPORT SCIENTIFIQUE DE CLIMATOLOGIE COMPARÉE MONDIALE</h1>
        <div className="space-y-2 text-lg">
          <h2 className="text-xl font-semibold">Analogues climatiques planétaires de la ville de Kénitra et de la plaine du Gharb</h2>
          <p>Région Rabat-Salé-Kénitra, Royaume du Maroc — Province de Kénitra</p>
          <p>Étude bioclimatique, agroclimatique, écophysiologique et biogéographique exhaustive</p>
          <p>Auteur du rapport : Cabinet international de climatologie comparée</p>
          <p>Objet : Identification exhaustive des analogues climatiques mondiaux de la station de Kénitra (34°15′ N, 6°35′ O, ~26 m ; station synoptique 34°18′ N, 6°36′ O, 5 m, indicatif OMM 60120 / GMMY)</p>
          <p>Méthodologie : Comparaison multi-classificatoire (Köppen-Geiger, Trewartha, Emberger, De Martonne, UNEP, USDA, AHS), analyse multi-paramétrique, correction saisonnière hémisphérique, analyse écophysiologique par espèce indicatrice.</p>
          <p>Longueur : Rapport intégral non abrégé.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>PARTIE I — CADRE MÉTHODOLOGIQUE ET DIAGNOSTIC CLIMATIQUE DE RÉFÉRENCE</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-xl font-semibold mb-2">1.1. Identification géographique et positionnement climatique</h3>
            <p className="text-justify space-y-2">
              Kénitra (34°15′ N, 6°35′ O, altitude 26 m ; station synoptique à 5 m) est située sur la rive sud de l'oued Sebou, à 12 km de son embouchure atlantique, au niveau de Mehdia, dans la région administrative de Rabat-Salé-Kénitra. Elle occupe le cœur de la plaine du Gharb, vaste bassin sédimentaire de plus de 6 000 km² drainé par le bas Sebou et le Beht. Le Sebou, qui prend sa source dans le Moyen Atlas à 2 030 m sous le nom d'oued Guigou, parcourt environ 500 km, draine près de 40 000 km² et produit à lui seul près du tiers des eaux de surface du Maroc ; ses apports moyens interannuels atteignent 5 170 Mm³.
            </p>
            <p className="text-justify space-y-2">
              Trois éléments structurants commandent le climat : (i) la proximité immédiate de l'océan Atlantique (5 à 12 km), qui impose une régulation thermique et hygrométrique permanente ; (ii) la faible altitude et la topographie ouverte de la plaine, qui laisse pénétrer librement les flux océaniques de secteur nord à nord-ouest ; (iii) l'anticyclone des Açores, qui, en été, bloque les perturbations atlantiques et provoque la sécheresse estivale, tout en générant les brouillards et stratus côtiers caractéristiques du littoral atlantique marocain.
            </p>
            <p className="text-justify space-y-2">
              Conséquence immédiate : le climat de Kénitra n'est pas celui de l'intérieur du Maroc semi-aride (Guercif, Oujda, Meknès). C'est un climat méditerranéen à très forte influence océanique — une nuance fondamentale que le reste de ce rapport va quantifier.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">1.2. Les sept invariants de la « signature kénitrienne »</h3>
            <p className="text-justify space-y-2">
              L'analyse comparative ne saurait se réduire à l'alignement des moyennes annuelles. La signature climatique de Kénitra procède d'une combinatoire spécifique, qualifiable de « signature kénitrienne », qui repose sur sept invariants :
            </p>
            <ul className="list-disc list-inside space-y-4 ml-4">
              <li className="text-justify">
                Pluviométrie annuelle de 540 à 720 mm, avec un maximum automnal-hivernal très marqué (novembre = 94 mm) et une sécheresse estivale quasi absolue (juin-août ≤ 10 mm). Octobre-mars totalise 451 mm, soit 79,0 % du total annuel ; avril-septembre ne reçoit que 120 mm.
              </li>
              <li className="text-justify">
                Saison sèche estivale sévère de cinq mois : selon le critère de Walter-Lieth (P &lt; 2T), mai, juin, juillet, août et septembre sont secs ; selon l'indice mensuel de De Martonne (I &lt; 10), juin, juillet, août et septembre sont arides.
              </li>
              <li className="text-justify">
                Été chaud mais tempéré par l'océan : mois le plus chaud = août (moyenne 24,7 °C ; moyenne des maximales 28,7 °C). La moyenne des maxima annuelle n'atteint que 36,9 °C — loin des 42,2 °C de Guercif. Aucune torridité structurelle.
              </li>
              <li className="text-justify">
                Hiver doux, pratiquement sans gel : janvier = 13,2 °C de moyenne, 9,2 °C de moyenne des minimales ; la moyenne des minima annuels s'établit à 5,29 °C (USDA 11a), et le gel n'apparaît qu'épisodiquement lors de décrochages radiatifs (record −1,1 °C dans ce tableau, −3,0 °C dans les normales OMM).
              </li>
              <li className="text-justify">
                Ensoleillement annuel de 3 000 à 3 110 heures, soit ~70 % du potentiel héliométrique — élevé, mais nettement inférieur aux 3 400-3 600 h de l'intérieur (Sacramento, Fresno, Séville) à cause des stratus et brouillards côtiers estivaux et des brouillards radiatifs hivernaux.
              </li>
              <li className="text-justify">
                Humidité relative élevée (76 % en moyenne annuelle) et point de rosée élevé (13,7 °C en moyenne ; 18,7 °C en août) : l'été kénitrien est « lourd », et non « sec ». WeatherSpark relève en août 18,9 jours « moites ou pires » et décrit des étés « arides, moites (muggy), majoritairement clairs ». C'est l'invariant le plus discriminant de la signature kénitrienne.
              </li>
              <li className="text-justify">
                Continentalité très faible : amplitude annuelle des moyennes de seulement 11,5 °C, indice de continentalité de Gorczynski k ≈ 14,0 (climat franchement maritime) ; vent dominant de secteur nord, avec un maximum de vitesse en avril (9,4 mph) et un minimum en septembre (7,7 mph).
              </li>
            </ul>
            <p className="text-justify mt-4">
              Toute région du monde ne satisfaisant pas simultanément ces sept invariants doit être exclue de la catégorie des « climats quasi identiques ». Ce filtre exclut d'emblée : (a) les analogues continentaux semi-arides (Guercif, Bakersfield, Madrid, Zaragoza) dont l'amplitude annuelle dépasse 18-20 °C et l'humidité tombe sous 60 % ; (b) les analogues désertiques chauds (Almería, Coachella, Errachidia) ; (c) les analogues océaniques frais sans sécheresse estivale (Monterey, Auckland, Biarritz), dont la sécheresse estivale est absente ou insignifiante.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">1.4. Contrôle qualité et anomalies détectées dans le tableau source</h3>
            <p className="text-justify space-y-2">
              Conformément au mandat d'audit scientifique, six anomalies ou points de vigilance ont été identifiés dans le tableau fourni. Aucune donnée n'a été modifiée silencieusement ; les valeurs litigieuses sont signalées.
            </p>
            <p className="text-justify space-y-2">
              <strong>A1 — Point de rosée annuel incohérent (anomalie majeure).</strong> Le tableau indique un point de rosée annuel de 8,4 °C. Or le minimum mensuel est de 9,38 °C (janvier) : une moyenne annuelle ne peut être inférieure à toutes ses composantes mensuelles. La moyenne arithmétique correcte des douze valeurs mensuelles est 13,68 °C. La valeur 8,4 °C correspond exactement au point de rosée annuel de Guercif figurant dans le rapport-modèle : il s'agit donc, selon toute vraisemblance, d'une erreur de recopie depuis le tableau de Guercif. Valeur retenue dans cette étude : 13,7 °C (recalculée), avec vérification indépendante par la formule de Magnus à partir de T et de HR (moyenne annuelle recalculée = 14,2 °C, soit un écart moyen de +0,56 °C par rapport aux valeurs mensuelles du tableau, acceptable pour des périodes de référence différentes).
            </p>
            <p className="text-justify space-y-2">
              <strong>A2 — Records absolus non sourcés (vigilance).</strong> Le tableau annonce un record de chaleur de 48,0 °C en juillet et un record de froid de −1,1 °C en janvier, sur une période « 1940-2025 ». Les normales OMM 1991-2020 de la même station donnent un record de 47,7 °C en août et un record de froid de −3,0 °C en février. Les deux séries divergent de 0,3 °C sur le maximum et de 1,9 °C sur le minimum. Ces records doivent être confirmés sur les registres de la Direction Générale de la Météorologie (DGM) : les valeurs de 2023-2025 (vagues de chaleur marocaines ayant dépassé 48 °C) peuvent légitimement expliquer le relèvement du record haut, mais aucune source primaire n'a pu être consultée pour le record bas. Ils sont utilisés ici comme valeurs du tableau fourni, avec réserve explicite.
            </p>
            <p className="text-justify space-y-2">
              <strong>A3 — Hétérogénéité des périodes de référence (vigilance méthodologique).</strong> Le tableau est un composite : extrêmes 1940-2025, normales thermiques et pluviométriques sur une période longue non spécifiée, ensoleillement 1981-2010, jours de pluie 1961-1990. La comparaison avec les normales OMM 1991-2020 montre des écarts cohérents avec le réchauffement récent : +0,2 °C sur la température moyenne (18,6 vs 18,4 °C), +31,5 mm sur les précipitations (571 vs 539,5 mm), +104,8 h sur l'ensoleillement (3 110,5 vs 3 005,7 h). Ces écarts sont du même ordre que la variabilité interannuelle et ne remettent pas en cause les conclusions ; ils sont documentés dans les fiches.
            </p>
            <p className="text-justify space-y-2">
              <strong>A4 — Nature des lignes « Moyenne des maxima / minima » (clarification, non anomalie).</strong> Les valeurs annuelles 36,90 °C et 5,29 °C ne sont pas les moyennes des douze valeurs mensuelles (respectivement 28,4 °C et 10,6 °C) : ce sont les moyennes des extrêmes annuels, c'est-à-dire la température maximale moyenne de l'année (36,90 °C) et la température minimale moyenne de l'année (5,29 °C). Elles ne doivent donc jamais être confondues avec des moyennes climatiques mensuelles.
            </p>
            <p className="text-justify space-y-2">
              <strong>A5 — Double comptage des jours de pluie.</strong> Les lignes « jours de précipitation ≥ 1 mm » (50 j) et « jours de pluie » (98,4 j, période 1961-1990) utilisent deux seuils et deux périodes différents. La seconde intègre vraisemblablement les jours à trace (≥ 0,1-0,2 mm). Elles ne sont pas contradictoires mais non directement comparables ; seule la première (50 j ≥ 1 mm) est utilisée dans les calculs de similarité.
            </p>
            <p className="text-justify space-y-2">
              <strong>A6 — Absence totale de neige.</strong> Les précipitations solides sont nulles sur les douze mois — cohérent avec un climat USDA 11a et une altitude de 5-26 m.
            </p>
          </section>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>PARTIE II — ANALOGUES DU MAROC ET DU MAGHREB</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-xl font-semibold mb-4">2.1. Catégorie 1 — Climats quasi identiques (analogie très forte)</h3>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">2.1.1. Larache (Province de Larache, Maroc) — Similarité S = 59,3 % (D = 0,522)</h5>
              <p className="text-justify">
                Larache (35°11′ N, 6°09′ O), à 120 km au nord-nord-est de Kénitra sur la même façade atlantique, constitue l'analogue marocain le plus proche de Kénitra hors du Gharb. Climat Csa, température moyenne annuelle 18,2 °C (contre 18,6 °C), précipitations 700,5 mm (contre 571 mm), moyenne des maximales d'août 28,7 °C (identique à Kénitra), moyenne des minimales de janvier 8,2 °C, record haut 46,4 °C, record bas −3,0 °C. Les différences sont pluviométriques : Larache reçoit environ 130 mm de plus, ce qui s'explique par sa position plus septentrionale, plus directement exposée aux perturbations atlantiques hivernales. Les deux villes partagent : régime pluviométrique à maximum hivernal, sécheresse estivale absolue, hiver sans gel, humidité élevée, vent de secteur nord. Aucune différence agroclimatique significative : la palette culturale (agrumes irrigués, céréales, betterave, maraîchage) est identique, et Larache est même un pôle marocain de la fraise et du maraîchage d'exportation.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">2.1.2. Rabat-Salé (Région Rabat-Salé-Kénitra, Maroc) — Similarité S ≈ 57 % (Salé : D ≈ 0,56)</h5>
              <p className="text-justify">
                Salé (34°02′ N, 6°48′ O) présente une température moyenne annuelle de 17,7 °C, des précipitations de 521,9 mm, une moyenne des maximales d'août de 27,8 °C, une moyenne des minimales de janvier de 7,2 °C, avec des records de 47,2 °C et −3,2 °C ; climat Csa. Rabat-Salé est la ville-jumelle climatique immédiate de Kénitra, à 40 km au sud-ouest : même influence océanique, même régime, même humidité, même absence de gel structurel. L'écart principal est une pluviométrie inférieure d'environ 50 mm et un été légèrement moins chaud. Il faut souligner que Rabat-Salé et Kénitra forment, avec Casablanca, un continuum littoral atlantique marocain dont la signature est remarquablement homogène sur près de 250 km de côte.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">2.1.3. Casablanca (Maroc) — Similarité S = 52,6 % (D = 0,642 ; couverture 100 %)</h5>
              <p className="text-justify">
                Casablanca (33°32′ N, 7°35′ O) : Csa, T = 18,6 °C, P = 408,2 mm, moyenne des maximales d'août 26,7 °C, moyenne des minimales de janvier 8,9 °C, humidité relative 82 %, ensoleillement 3 030 h, records 42,2 °C / 0,3 °C. C'est le seul analogue dont les six variables du modèle sont renseignées (couverture 100 %), ce qui en fait un point d'ancrage statistique solide. La divergence est pluviométrique : 163 mm de moins que Kénitra, ce qui rapproche Casablanca du seuil semi-aride et réduit sa similarité globale. Sur le plan de la température annuelle (18,6 °C, identique) et de l'humidité (82 % vs 76 %), la convergence est en revanche quasi parfaite.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">2.2. Catégorie 2 — Climats extrêmement similaires</h3>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">2.2.1. Tanger (Maroc) — Similarité S = 53,4 % (D = 0,628 ; couverture 100 %)</h5>
              <p className="text-justify">
                Tanger (35°47′ N, 5°48′ O) : Csa, T = 17,7 °C, P = 735,9 mm, moyenne des maximales d'août 28,6 °C, moyenne des minimales de janvier 8,8 °C, humidité relative 76 % (identique à Kénitra), ensoleillement 2 960,7 h. L'écart pluviométrique (+165 mm) pénalise le score, mais la convergence hygrométrique (76 % vs 76 %) et thermique est remarquable. Tanger relève de la même famille « méditerranéen océanique du détroit » que Larache et Kénitra.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">2.2.2. El Jadida (Maroc) — Similarité S ≈ 49 % (D ≈ 0,71)</h5>
              <p className="text-justify">
                El Jadida (33°14′ N, 8°30′ O) : Csa, T = 17,4 °C, P = 372 mm, moyenne des maximales d'août 27,9 °C, moyenne des minimales de janvier 7,6 °C. Même structure thermique et hygrométrique, mais pluviométrie très inférieure (−199 mm), ce qui l'éloigne davantage que Casablanca.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">2.2.3. Sidi Kacem et Souk El Arbaa (Gharb intérieur) — Similarité ≈ 85-90 %</h5>
              <p className="text-justify">
                Sidi Kacem (34°13′ N, 5°42′ O, 194 m) et Souk El Arbaa (34°40′ N, 5°58′ O), toutes deux dans la région de Kénitra, présentent un climat plus continentalisé que Kénitra : étés chauds à très chauds, pointes entre 32 et 36 °C ; hivers relativement frais, les minima passant parfois sous le point de congélation ; précipitations annuelles de 350 à 600 mm. Il s'agit d'analogues intra-régionaux dégradés par la continentalité : le gradient Kénitra → Sidi Kacem → Sidi Slimane illustre le passage du littoral océanique tempéré à l'intérieur semi-aride du Gharb, gradient décrit dans la littérature sous la forme d'un « climat subhumide au nord-ouest, semi-aride au sud et à l'est ».
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">2.2.4. Essaouira (Maroc) — Similarité S = 31,1 % (D = 1,169)</h5>
              <p className="text-justify">
                Essaouira (31°30′ N, 9°46′ O) : BSk/BSh, T = 17,9 °C, P = 364,2 mm, moyenne des maximales de septembre 22,4 °C (remarquablement fraîche, reflet d'un upwelling intense), moyenne des minimales de janvier 11,2 °C, ensoleillement 2 978,5 h. Essaouira constitue un analogue « océanique froid » extrême : la température annuelle est proche, mais l'été y est beaucoup plus frais (22,4 °C contre 28,7 °C de moyenne des maximales). Elle délimite la borne froide de la famille des analogues atlantiques marocains.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">2.3. Analogues algériens et tunisiens</h3>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">2.3.1. Mostaganem (Algérie) — Similarité S ≈ 46 % (D ≈ 0,78)</h5>
              <p className="text-justify">
                Mostaganem (35°56′ N, 0°05′ E, 104 m) : Csa, T = 17,9 °C, P = 347 mm, moyenne des maximales de juillet 31,6 °C, moyenne des minimales de janvier 5,8 °C, records 45,9 °C / −2,2 °C. Convergence thermique annuelle forte, divergence pluviométrique (−224 mm) et continentale hivernale (minima plus bas).
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">2.3.2. Tlemcen (Algérie) — Similarité ≈ 40 %</h5>
              <p className="text-justify">
                Tlemcen (34°53′ N, 1°19′ O, 842 m) : Csa, T = 17,2 °C, P = 444,8 mm, moyenne des maximales d'août 33,6 °C, moyenne des minimales de janvier 5,3 °C. La température annuelle est très proche, mais l'altitude et la continentalité accroissent l'amplitude et les extrêmes hivernaux, ce qui dégrade l'analogie avec le littoral kénitrien.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">2.3.3. Bizerte (Tunisie) — Similarité S ≈ 50 % (D ≈ 0,69)</h5>
              <p className="text-justify">
                Bizerte (37°16′ N, 9°51′ E, 5 m) : Csa, T = 18,6 °C (identique à Kénitra), P = 653,2 mm, moyenne des maximales d'août 33,2 °C, moyenne des minimales de janvier 7,1 °C, ensoleillement 3 026,9 h, records 48,9 °C / −4,2 °C. C'est le meilleur analogue tunisien : même température annuelle, pluviométrie du même ordre, mais été nettement plus chaud (33,2 °C contre 28,7 °C) car Bizerte n'est pas rafraîchie par un upwelling atlantique équivalent.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">2.3.4. Béja et Tunis (Tunisie)</h5>
              <p className="text-justify">
                Béja (36°44′ N, 9°11′ E, 222 m) : Csa, T = 18,3 °C, P = 610,5 mm, moyenne des maximales d'août 36,7 °C, moyenne des minimales de février 4,8 °C, records 48,9 °C / −4,5 °C. Tunis (36°48′ N, 10°10′ E) : Csa, T = 19,2 °C, P = 555,2 mm, moyenne des maximales de juillet 33,0 °C, moyenne des minimales de janvier 5,6 °C, records 49,0 °C / 2,0 °C. Ces deux stations partagent la pluviométrie et la température annuelle de Kénitra mais pas son été tempéré ni son humidité.
              </p>
            </div>
          </section>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>PARTIE III — ANALOGUES DU BASSIN MÉDITERRANÉEN NORD</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-xl font-semibold mb-4">3.1. Analogues ibériques — le cœur de l'analogie européenne</h3>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">3.1.1. Faro (Algarve, Portugal) — Similarité S = 70,9 % (D = 0,344) — ANALOGUE N° 1 MONDIAL</h5>
              <p className="text-justify">
                Faro (37°00′ N, 7°56′ O, 8 m) obtient le meilleur score mondial du modèle. Csa ; T = 17,5-18,5 °C ; P = 511,6 mm ; moyenne des maximales de juillet 29,2 °C ; moyenne des minimales de janvier 7,9 °C ; ensoleillement 3 044,4 h ; records 44,3 °C / 1,2 °C. Les écarts sont minimes : ΔT ≈ −0,6 °C, ΔP ≈ −60 mm, ΔTx ≈ +0,5 °C, ΔTn ≈ −1,3 °C, ΔEnsoleillement ≈ −66 h. Faro est un littoral atlantique méridional à été sec : exactement la même mécanique que Kénitra (océan tempéré + anticyclone subtropical + sécheresse estivale). La végétation y est dominée par le pin pignon, le caroubier, l'olivier, le figuier et l'amandier — une palette quasi superposable à celle du Gharb. La principale différence est l'intensité du refroidissement estival par upwelling : la côte algarienne est plus froide en été que Kénitra, où le plateau continental et l'orientation du trait de côte atténuent cet effet.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">3.1.2. Portimão (Algarve, Portugal) — Similarité S = 59,5 % (D = 0,520)</h5>
              <p className="text-justify">
                Portimão (37°08′ N, 8°32′ O) : Csa, T = 17,2 °C, P = 528,1 mm, moyenne des maximales d'août 28,8 °C, moyenne des minimales de janvier 8,2 °C, ensoleillement 3 018,8 h, records 37,6 °C / −2,0 °C. Convergence quasi parfaite sur la pluviométrie (528 vs 571 mm) et la moyenne des maximales d'août (28,8 vs 28,7 °C). Portimão confirme que l'Algarve occidental est le meilleur analogue européen de Kénitra.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">3.1.3. Huelva et Jerez de la Frontera (Andalousie atlantique, Espagne)</h5>
              <p className="text-justify">
                Huelva (37°15′ N, 6°57′ O, 54 m) : Csa, T = 18,1 °C, P = 525 mm, moyenne des maximales d'août 33,1 °C, moyenne des minimales de janvier 5,9 °C, ensoleillement 2 970 h, records 43,9 °C / −3,2 °C. Jerez (36°40′ N, 6°08′ O, 56 m) : T ≈ 18 °C, P = 570 mm, moyenne des maximales d'août 34,3 °C, moyenne des minimales de janvier 5,3 °C, 2 965 h d'ensoleillement, 53 jours de pluie, 137 jours clairs. La pluviométrie de Jerez (570 mm) est rigoureusement égale à celle de Kénitra (571 mm) — mais l'été andalou est 5,6 °C plus chaud (34,3 vs 28,7 °C) et l'hiver 3,9 °C plus froid : c'est la continentalité andalouse qui crée l'écart.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">3.1.4. Séville (Espagne) — Similarité S = 28,0 %</h5>
              <p className="text-justify">
                Séville (37°23′ N, 5°59′ O, 7 m) : Csa, T = 19,2 °C, P = 502 mm, moyenne des maximales de juillet 36,2 °C, moyenne des minimales de janvier 6,0 °C, humidité relative 59,4 %, ensoleillement 3 279,3 h, records 46,6 °C / −5,5 °C. Séville est l'anti-modèle absolu de Kénitra : à pluviométrie comparable, elle cumule une humidité 17 points plus basse, un été 7,5 °C plus chaud et un hiver 3,2 °C plus froid. L'analogie est hydrique mais nullement hygrothermique.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">3.1.5. Valence et Barcelone (Espagne méditerranéenne)</h5>
              <p className="text-justify">
                Valence (39°28′ N, 0°22′ O, 15 m) : BSh/Csa, T = 18,6 °C (identique à Kénitra), P = 459 mm, moyenne des maximales d'août 30,6 °C, moyenne des minimales de janvier 7,5 °C, 2 733 h d'ensoleillement, records 44,5 °C / −7,2 °C. Barcelone (41°23′ N, 2°11′ E, 12 m) : Csa, T = 18,2 °C (jour 21,2 / nuit 15,1), P = 558,1 mm, moyenne des maximales d'août 28,9 °C, moyenne des minimales de janvier 5,5 °C, HR 68 %, 2 489 h, records 37,4 °C / −8,0 °C. Barcelone est un analogue remarquable par sa pluviométrie (558 mm) et sa moyenne des maximales d'août (28,9 °C) ; elle s'en écarte par un hiver plus froid et un ensoleillement bien moindre.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">3.1.6. Setúbal et Algeciras (péninsule Ibérique méridionale)</h5>
              <p className="text-justify">
                Setúbal (38°31′ N, 8°53′ O) : Csa, T ≈ 16,5-17 °C, P = 703,4 mm, moyenne des maximales d'août 30,7 °C, moyenne des minimales de janvier 5,2 °C, records 45,5 °C / −5,8 °C. Algeciras (36°07′ N, 5°27′ O, 20 m) : Csa, T = 18,3 °C, P = 835,7 mm, moyenne des maximales d'août 27,8 °C, moyenne des minimales de janvier 11,1 °C. Algeciras, avec 27,8 °C de moyenne des maximales d'août et 11,1 °C de minima en janvier, est thermiquement le plus proche de Kénitra — mais sa pluviométrie de 835,7 mm l'en éloigne structurellement.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">3.1.7. Almería et Carthagène (Sud-Est espagnol) — analogues « chauds et secs » dégradés</h5>
              <p className="text-justify">
                Almería (36°50′ N, 2°27′ O, 24 m) : BWh, T = 19,2 °C, P = 197,5 mm, moyenne des maximales d'août 31,2 °C, ensoleillement 3 095 h, records 42,0 °C / 0,1 °C. Carthagène (37°36′ N, 0°59′ O, 10 m) : climat de transition BSh/BWh, T = 19,2 °C, P = 260,2 mm, moyenne des maximales d'août 30,4 °C. Ces stations constituent des analogues « chauds et secs » de Kénitra, décalés vers l'aridité ; elles ne partagent ni la pluviométrie (déficit de 310 à 370 mm) ni l'humidité.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">3.2. Analogues italiens, maltais, croates et grecs</h3>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">3.2.1. Cagliari (Sardaigne, Italie) — Similarité S = 34,7 % (D = 1,058)</h5>
              <p className="text-justify">
                Cagliari (39°13′ N, 9°06′ E, 4 m) : Csa, T = 17,3 °C, P = 413,2 mm, moyenne des maximales d'août 32,1 °C, moyenne des minimales de février 5,1 °C, 2 729,2 h, records 44,6 °C / 4,8 °C. Convergence méditerranéenne classique, dégradée par un été 3,4 °C plus chaud.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">3.2.2. La Valette (Malte) — Similarité S = 56,1 % (D = 0,578 ; couverture 54 %)</h5>
              <p className="text-justify">
                La Valette (35°54′ N, 14°31′ E, 56 m) : Csa, P = 580,7 mm (proche de 571 mm), moyenne des maximales d'août 32,0 °C, moyenne des minimales de février 9,5 °C. Pluviométrie quasi identique, minima hivernaux proches, mais été insulaire nettement plus chaud. La couverture du modèle est faible (3 variables) : le score doit être lu avec prudence.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">3.2.3. Split (Croatie) — Similarité S = 30,2 %</h5>
              <p className="text-justify">
                Split (43°30′ N, 16°26′ E, 0 m) : Csa, T = 16,8 °C, P = 800,6 mm, moyenne des maximales de juillet 31,0 °C, moyenne des minimales de janvier 5,9 °C, 2 698,5 h, records 38,6 °C / −9,0 °C. Trop arrosé (+230 mm) et trop froid en hiver.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">3.2.4. Héraklion (Crète, Grèce) — Similarité S = 36,5 %</h5>
              <p className="text-justify">
                Héraklion (35°20′ N, 25°08′ E) : Csa, T = 19,6 °C, P = 318,6 mm, moyenne des maximales de juillet-août 28,3 °C (très proche de Kénitra), moyenne des minimales de janvier 10,5 °C, 2 778,6 h, records 38,3 °C / 1,4 °C. La température annuelle et les maxima estivaux sont remarquablement proches, mais la pluviométrie est inférieure de 252 mm — l'analogie est thermique et non hydrique.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">3.3. Analogues turcs et levantins</h3>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">3.3.1. Izmir (Turquie) — Similarité S = 37,1 % (D = 0,992)</h5>
              <p className="text-justify">
                Izmir (38°25′ N, 27°08′ E, 2 m) : Csa, T = 18,4 °C, P = 730,5 mm, moyenne des maximales de juillet 33,8 °C, moyenne des minimales de janvier 6,0 °C, 2 938,5 h, records 43,2 °C / −8,2 °C. Température annuelle très proche, mais été 5,1 °C plus chaud et pluviométrie supérieure.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">3.3.2. Tel-Aviv (Israël) — Similarité S = 40,2 %</h5>
              <p className="text-justify">
                Tel-Aviv (32°05′ N, 34°47′ E, 5 m) : Csa, T = 20,9 °C, P = 528 mm, moyenne des maximales d'août 30,2 °C, moyenne des minimales de janvier 9,6 °C, records 46,5 °C / 1,9 °C. Pluviométrie et minima hivernaux très proches, mais température annuelle 2,3 °C plus élevée et climat nettement plus chaud.
              </p>
            </div>
          </section>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>PARTIE IV — ANALOGUES DES AMÉRIQUES</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-xl font-semibold mb-4">4.1. Californie et côte pacifique des États-Unis</h3>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">4.1.1. Los Angeles (États-Unis) — Similarité S = 48,0 % (D = 0,735 ; couverture 100 %)</h5>
              <p className="text-justify">
                Los Angeles (34°03′ N, 118°15′ O, 93 m) : BSh (Csb sur la côte, Csa à l'intérieur), T = 18,8 °C, P = 362 mm, moyenne des maximales d'août 28,9 °C (identique à Kénitra), moyenne des minimales de décembre 9,0 °C, HR 70,8 %, ensoleillement 3 254,2 h, records 45 °C / 2 °C. La structure thermique est superposable (ΔT = +0,2 °C, ΔTx = +0,2 °C, ΔTn = −0,2 °C), mais le déficit pluviométrique de 209 mm réduit fortement la similarité. Los Angeles est le meilleur analogue extra-méditerranéen de Kénitra sur le plan thermique, un analogue médiocre sur le plan hydrique.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">4.1.2. Santa Barbara (Californie) — Similarité S = 45,5 %</h5>
              <p className="text-justify">
                Santa Barbara (34°25′ N, 119°42′ O, 15 m) : Csb, T = 17,0 °C, P = 482,4 mm, moyenne des maximales d'août-septembre 25,4 °C, moyenne des minimales de décembre 7,8 °C, 3 099,8 h, records 42 °C / −7 °C. Pluviométrie proche (482 mm), mais été 3,3 °C plus frais — l'upwelling californien est plus intense qu'à Kénitra.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">4.1.3. San Diego (Californie) — Similarité S = 30,2 %</h5>
              <p className="text-justify">
                San Diego (32°42′ N, 117°09′ O) : BSh/Csa, T = 18,2 °C, P = 249 mm, moyenne des maximales d'août 25,2 °C, moyenne des minimales de janvier 10,2 °C, HR 69 %, 3 054,6 h, records 44 °C / 4 °C. Minima hivernaux très proches (10,2 vs 9,2 °C), mais été plus frais et aridité marquée.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">4.1.4. Sacramento et Fresno (Vallée Centrale) — analogues continentaux rejetés</h5>
              <p className="text-justify">
                Sacramento (38°34′ N, 121°29′ O) : Csa, T = 16,6 °C, P = 461 mm, moyenne des maximales de juillet 33,7 °C, moyenne des minimales de janvier 4,0 °C, 3 607,8 h, records 46,7 °C / −7,8 °C. Fresno : BSh, T = 18,3 °C, P = 279 mm, moyenne des maximales de juillet 36,5 °C, 3 550 h, records 46,1 °C / −8 °C. Ces stations, souvent citées comme analogues des climats marocains, ne le sont PAS pour Kénitra : leur amplitude annuelle dépasse 29 °C (contre 11,5 °C) et leur humidité estivale est très basse. Elles constituent en revanche des analogues pertinents de Guercif.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">4.1.5. Monterey (Californie) — Similarité S = 8,9 % (analogue rejeté)</h5>
              <p className="text-justify">
                Monterey (36°36′ N, 121°53′ O) : Csb, T = 13,3 °C, P = 435 mm, moyenne des maximales de septembre 20,1 °C, moyenne des minimales de janvier 6,2 °C. Trop froid (ΔT = −5,3 °C) : la dérive froide californienne est beaucoup plus intense que l'upwelling marocain.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">4.2. Amérique latine</h3>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">4.2.1. Santiago (Chili) — Similarité S = 20,6 % (D = 1,580 ; avec correction saisonnière)</h5>
              <p className="text-justify">
                Santiago (33°26′ S, 70°39′ O, 570 m) : BSk avec tendances Csb, P = 286,3 mm (Quinta Normal), moyenne des maximales de janvier 30,4 °C, moyenne des minimales de juillet 2,6 °C, HR 64-71 %, ensoleillement 2 888,4 h, records 39,3 °C / −6,8 °C. Après inversion saisonnière (janvier ↔ juillet), la structure thermique devient comparable, mais la pluviométrie (286 mm) est inférieure de 285 mm et les minima hivernaux (2,6 °C) sont 6,6 °C plus froids que ceux de Kénitra. Santiago est un analogue thermique dégradé par l'aridité et la continentalité altitudinale.
              </p>
            </div>

            <p className="text-justify mt-4">
              <strong>Note :</strong> les fiches de Valparaíso, Buenos Aires et Montevideo n'ont pu être établies, les pages sources n'ayant pas été accessibles lors de la collecte. Elles sont signalées comme lacunes de couverture.
            </p>
          </section>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>PARTIE V — ANALOGUES DE L'HÉMISPHÈRE SUD ET CORRECTION SAISONNIÈRE</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-xl font-semibold mb-4">5.1. Méthode de correction</h3>
            <p className="text-justify space-y-2">
              Pour les stations de l'hémisphère sud, la comparaison est conduite selon deux modalités : (i) comparaison calendaire brute (mois civil contre mois civil), qui mesure la ressemblance des états mensuels absolus ; (ii) comparaison après inversion saisonnière stricte (janvier ↔ juillet, février ↔ août, …, juin ↔ décembre), qui mesure la ressemblance des structures saisonnières. Conformément au mandat, le décalage n'est pas appliqué aveuglément aux régimes pluviométriques : la saisonnalité des pluies est comparée séparément, car un régime à maximum hivernal austral correspond, après inversion, à un maximum estival boréal — divergence structurelle majeure.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">5.2. Le Cap (Afrique du Sud) — Similarité S = 54,9 % (D = 0,600 ; couverture 90 %)</h3>
            <p className="text-justify space-y-2">
              Le Cap (33°55′ S, 18°25′ E) : Csb, T = 17,3 °C, P = 492,8 mm, moyenne des maximales de février 27,3 °C (↔ août boréal), moyenne des minimales de juillet 7,4 °C (↔ janvier boréal), ensoleillement 3 115 h, records 45,2 °C / 1,3 °C. Après inversion saisonnière, la convergence est excellente : ΔT = −1,3 °C, ΔP = −78 mm, ΔTx = −1,4 °C, ΔTn = −1,8 °C, ΔEnsoleillement = +5 h. Le Cap partage en outre le même régime pluviométrique à maximum hivernal (pluies d'hiver austral ↔ pluies d'hiver boréal pour Kénitra), ce qui est rare parmi les analogues de l'hémisphère sud et en fait l'un des meilleurs analogues planétaires. Différences : hivers plus frais, été plus court, influence de l'upwelling de Benguela.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">5.3. Adelaide (Australie) — Similarité S = 60,3 % (D = 0,507) — 2ᵉ rang mondial</h3>
            <p className="text-justify space-y-2">
              Adelaide (34°55′ S, 138°36′ E, 50 m) : Csa, T = 17,5 °C, P = 536,5 mm, moyenne des maximales de janvier 30,0 °C, moyenne des minimales de juillet 7,7 °C, records 47,7 °C / 0,4 °C. Après inversion saisonnière : ΔT = −1,1 °C, ΔP = −35 mm, ΔTx = +1,3 °C, ΔTn = −1,5 °C. C'est, avec Le Cap, le meilleur analogue de l'hémisphère sud. Adelaide relève de la même famille « méditerranéen austral tempéré » que Kénitra, avec une pluviométrie quasi identique (536 vs 571 mm).
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">5.4. Perth (Australie) — Similarité S = 47,0 % (D = 0,754)</h3>
            <p className="text-justify space-y-2">
              Perth (31°57′ S, 115°51′ E) : Csa, P = 731,1 mm, moyenne des maximales de février 31,6 °C, moyenne des minimales de juillet 8,0 °C, records 46,2 °C / 0,7 °C. Régime pluviométrique à maximum hivernal austral, comme Le Cap : après inversion, la structure est fidèle, mais l'été est 2,9 °C plus chaud et la pluviométrie supérieure de 160 mm.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">5.5. Autres stations australes</h3>
            <p className="text-justify space-y-2">
              Les fiches de Sydney, Melbourne et Auckland n'ont pu être établies (pages sources inaccessibles). Sur la base des données disponibles, Auckland et la Nouvelle-Zélande ne présentent aucun analogue direct : leur climat océanique tempéré est dépourvu de sécheresse estivale marquée. Le Karoo sud-africain et le bassin de Murray-Darling (Mildura, Renmark), souvent cités comme analogues des climats semi-arides marocains, sont des analogues de Guercif, non de Kénitra : trop continentaux, trop secs en été, trop froids en hiver.
            </p>
          </section>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>PARTIE VI — MÉTHODOLOGIE STATISTIQUE ET SYNTHÈSE COMPARATIVE ORDONNÉE</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-xl font-semibold mb-4">6.1. Méthode de calcul du score de similarité</h3>
            <p className="text-justify space-y-2">
              Variables retenues (6) : température moyenne annuelle (T), moyenne des maximales du mois le plus chaud (Tx), moyenne des minimales du mois le plus froid (Tn), précipitations annuelles (P), humidité relative annuelle (HR), ensoleillement annuel (S).
            </p>
            <p className="text-justify space-y-2">
              Pondérations : T 20 %, Tx 12 %, Tn 12 %, P 20 %, HR 8 %, S 10 % (somme = 82 % ; les poids sont renormalisés sur les variables effectivement disponibles pour chaque station, ce qui explique l'indicateur de couverture).
            </p>
            <p className="text-justify space-y-2">
              Échelles de normalisation (écart-type climatologique de référence) : σT = 1,5 °C ; σTx = 3,0 °C ; σTn = 3,0 °C ; σP = 150 mm ; σHR = 8 % ; σS = 400 h.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">6.3. Catégories d'analogie (conventions descriptives)</h3>
            <p className="text-justify space-y-2">
              <strong>Catégorie 1 — Analogie très forte (S ≥ 59 %) :</strong> Faro, Adelaide, Portimão, Larache.
              <strong>Catégorie 2 — Analogie forte (S 47–58 %) :</strong> La Valette, Le Cap, Valence, Tanger, Casablanca, Los Angeles, Perth.
              <strong>Catégorie 3 — Analogie modérée (S 36–46 %) :</strong> Santa Barbara, Barcelone, Tunis, Tel-Aviv, Izmir, Héraklion.
              <strong>Catégorie 4 — Analogie partielle (S 25–35 %) :</strong> Cagliari, Jerez, Essaouira, San Diego, Split, Séville, Sacramento, Almería.
              <strong>Catégorie 5 — Analogie faible (S &lt; 25 %) :</strong> Santiago, Fresno, Monterey.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">6.4. Analyse de sensibilité</h3>
            <p className="text-justify space-y-2">
              Le classement est robuste au sommet : Faro, Adelaide, Portimão et Larache restent dans les cinq premiers quelle que soit la pondération testée (variantes à ±10 points sur chaque poids). En revanche, il est sensible au milieu du classement : (i) lorsque l'on retire l'humidité relative du modèle (variable indisponible pour 6 stations), Tanger et Casablanca remontent de 3 à 4 rangs, car leur couverture passe à 100 % ; (ii) lorsque l'on double le poids des précipitations, Los Angeles et San Diego chutent de 6 à 8 rangs et Bizerte, Barcelone et Tanger progressent ; (iii) lorsque l'on double le poids de la température, Séville et Fresno remontent fortement (leur ΔT est faible) alors que Monterey et Split reculent. Conclusion : la composition du « top 10 » est stable ; la position exacte des rangs 11 à 20 doit être considérée comme indicative.
            </p>
            <p className="text-justify space-y-2">
              <strong>Limite de couverture :</strong> six des vingt-huit stations classées (La Valette, Larache, Perth, Tunis, Tel-Aviv, Santiago) disposent de moins de 80 % des variables du modèle. Leur score est moins fiable que celui des stations à couverture 100 % (Casablanca, Tanger, Barcelone, Los Angeles, Séville, San Diego).
            </p>
          </section>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>PARTIE VII — FICHES DÉTAILLÉES DES DIX MEILLEURS ANALOGUES</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-xl font-semibold mb-4">Fiche 1 — Faro (Algarve, Portugal) — S = 70,9 %</h3>
            <p className="text-justify space-y-2">
              <strong>Géographie :</strong> 37°00′ N, 7°56′ O, 8 m, sur la Ria Formosa, à 7 km de l'Atlantique.
              <strong>Classification :</strong> Csa.
              <strong>ΔT = −0,6 °C ; ΔTx = +0,5 °C ; ΔTn = −1,3 °C ; ΔP = −59 mm ; ΔEnsoleillement = −66 h.</strong>
              <strong>Facteurs de ressemblance :</strong> même mécanique océanique subtropicale (anticyclone des Açores + courant froid + sécheresse estivale) ; pluviométrie et ensoleillement quasi identiques ; hiver sans gel.
              <strong>Facteurs limitants :</strong> upwelling algarien plus froid en été ; sols sableux et calcaires différents.
              <strong>Conséquences :</strong> palette culturale superposable (agrumes, oliviers, caroubiers, amandiers, figuiers, vignes).
              <strong>Confiance :</strong> élevée.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">Fiche 2 — Adelaide (Australie-Méridionale) — S = 60,3 % (avec correction saisonnière)</h3>
            <p className="text-justify space-y-2">
              <strong>Géographie :</strong> 34°55′ S, 138°36′ E, 50 m, plaine de la rivière Torrens, golfe Saint-Vincent.
              <strong>Classification :</strong> Csa.
              <strong>ΔT = −1,1 °C ; ΔTx = +1,3 °C ; ΔTn = −1,5 °C ; ΔP = −35 mm.</strong>
              <strong>Facteurs de ressemblance :</strong> pluviométrie et température annuelle quasi identiques ; même régime à sécheresse estivale et maximum pluviométrique hivernal.
              <strong>Facteurs limitants :</strong> été austral légèrement plus chaud ; continentalité supérieure.
              <strong>Confiance :</strong> élevée.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">Fiche 3 — Portimão (Algarve, Portugal) — S = 59,5 %</h3>
            <p className="text-justify space-y-2">
              <strong>Géographie :</strong> 37°08′ N, 8°32′ O, embouchure de l'Arade.
              <strong>Classification :</strong> Csa.
              <strong>ΔT = −1,4 °C ; ΔTx = +0,1 °C ; ΔTn = −1,0 °C ; ΔP = −43 mm ; ΔEnsoleillement = −92 h.</strong>
              <strong>Facteurs de ressemblance :</strong> convergence maximale sur la moyenne des maximales d'août (28,8 vs 28,7 °C) et sur la pluviométrie.
              <strong>Facteurs limitants :</strong> hiver un peu plus frais ; records de froid plus marqués (−2,0 °C).
              <strong>Confiance :</strong> élevée.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">Fiche 4 — Larache (Maroc) — S = 59,3 %</h3>
            <p className="text-justify space-y-2">
              <strong>Géographie :</strong> 35°11′ N, 6°09′ O, littoral atlantique, embouchure du Loukkos.
              <strong>Classification :</strong> Csa.
              <strong>ΔT = −0,4 °C ; ΔTx = 0,0 °C ; ΔTn = −1,0 °C ; ΔP = +130 mm.</strong>
              <strong>Facteurs de ressemblance :</strong> proximité géographique immédiate, même façade océanique, même régime, même humidité.
              <strong>Facteur limitant :</strong> pluviométrie supérieure de 130 mm (exposition plus directe aux perturbations atlantiques).
              <strong>Conséquences :</strong> palette culturale identique ; Larache est même le pôle marocain de la fraise et du maraîchage d'exportation.
              <strong>Confiance :</strong> très élevée.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">Fiche 5 — La Valette (Malte) — S = 56,1 % (couverture 54 %)</h3>
            <p className="text-justify space-y-2">
              <strong>Géographie :</strong> 35°54′ N, 14°31′ E, 56 m, île méditerranéenne.
              <strong>Classification :</strong> Csa.
              <strong>ΔP = +10 mm ; ΔTx = +3,3 °C ; ΔTn = +0,3 °C.</strong>
              <strong>Facteurs de ressemblance :</strong> pluviométrie annuelle quasi égale ; minima hivernaux proches.
              <strong>Facteur limitant :</strong> été insulaire plus chaud (32,0 vs 28,7 °C).
              <strong>Confiance :</strong> modérée (données partielles).
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">Fiche 6 — Le Cap (Afrique du Sud) — S = 54,9 % (avec correction saisonnière)</h3>
            <p className="text-justify space-y-2">
              <strong>Géographie :</strong> 33°55′ S, 18°25′ E, entre l'Atlantique et la Montagne de la Table.
              <strong>Classification :</strong> Csb.
              <strong>ΔT = −1,3 °C ; ΔTx = −1,4 °C ; ΔTn = −1,8 °C ; ΔP = −78 mm ; ΔEnsoleillement = +5 h.</strong>
              <strong>Facteurs de ressemblance :</strong> même régime à maximum pluviométrique hivernal ; ensoleillement quasi identique ; hiver sans gel.
              <strong>Facteurs limitants :</strong> upwelling de Benguela plus froid ; été plus court.
              <strong>Confiance :</strong> élevée.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">Fiche 7 — Valence (Espagne) — S = 53,9 %</h3>
            <p className="text-justify space-y-2">
              <strong>Géographie :</strong> 39°28′ N, 0°22′ O, 15 m, plaine littorale méditerranéenne.
              <strong>Classification :</strong> BSh/Csa.
              <strong>ΔT = 0,0 °C ; ΔTx = +1,9 °C ; ΔTn = −1,7 °C ; ΔP = −112 mm ; ΔEnsoleillement = −378 h.</strong>
              <strong>Facteurs de ressemblance :</strong> température annuelle identique ; mécanique méditerranéenne océanisée.
              <strong>Facteur limitant :</strong> déficit pluviométrique et d'ensoleillement marqués (la huerta valencienne est irriguée).
              <strong>Confiance :</strong> élevée.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">Fiche 8 — Tanger (Maroc) — S = 53,4 % (couverture 100 %)</h3>
            <p className="text-justify space-y-2">
              <strong>Géographie :</strong> 35°47′ N, 5°48′ O, détroit de Gibraltar.
              <strong>Classification :</strong> Csa.
              <strong>ΔT = −0,9 °C ; ΔTx = −0,1 °C ; ΔTn = −0,4 °C ; ΔP = +165 mm ; ΔHR = 0,0 % ; ΔEnsoleillement = −150 h.</strong>
              <strong>Facteurs de ressemblance :</strong> humidité relative rigoureusement identique (76 %), même façade atlantique, mêmes minima hivernaux.
              <strong>Facteur limitant :</strong> pluviométrie supérieure.
              <strong>Confiance :</strong> élevée.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">Fiche 9 — Casablanca (Maroc) — S = 52,6 % (couverture 100 %)</h3>
            <p className="text-justify space-y-2">
              <strong>Géographie :</strong> 33°32′ N, 7°35′ O, littoral atlantique.
              <strong>Classification :</strong> Csa.
              <strong>ΔT = 0,0 °C ; ΔTx = −2,0 °C ; ΔTn = −0,3 °C ; ΔP = −163 mm ; ΔHR = +6 % ; ΔEnsoleillement = −80 h.</strong>
              <strong>Facteurs de ressemblance :</strong> température annuelle identique ; forte humidité ; même façade.
              <strong>Facteur limitant :</strong> aridité supérieure (408 mm).
              <strong>Confiance :</strong> élevée.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">Fiche 10 — Los Angeles (États-Unis) — S = 48,0 % (couverture 100 %)</h3>
            <p className="text-justify space-y-2">
              <strong>Géographie :</strong> 34°03′ N, 118°15′ O, 93 m, bassin côtier pacifique.
              <strong>Classification :</strong> BSh (Csb sur la côte, Csa à l'intérieur).
              <strong>ΔT = +0,2 °C ; ΔTx = +0,2 °C ; ΔTn = −0,2 °C ; ΔP = −209 mm ; ΔHR = −5 % ; ΔEnsoleillement = +144 h.</strong>
              <strong>Facteurs de ressemblance :</strong> structure thermique superposable (écarts &lt; 0,3 °C sur les trois variables de température).
              <strong>Facteur limitant :</strong> déficit pluviométrique majeur.
              <strong>Confiance :</strong> élevée (données complètes).
            </p>
            <p className="text-justify mt-2">
              Fiches 11 à 20 (Perth, Santa Barbara, Barcelone, Tunis, Tel-Aviv, Izmir, Héraklion, Cagliari, Jerez, Essaouira) disponibles sur la même base : les écarts chiffrés figurent dans le tableau § 6.2.
            </p>
          </section>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>PARTIE VIII — ANALYSE ÉCOPHYSIOLOGIQUE ET AGRONOMIQUE COMPARÉE PAR ESPÈCE</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-xl font-semibold mb-4">8.1. Agrumes (Citrus spp.) — culture-emblème, faisabilité optimale</h3>
            <p className="text-justify space-y-2">
              Kénitra est au cœur du domaine agrumicole marocain. Les exigences (absence de gel prolongé, hiver doux, été chaud mais non torride, faible amplitude thermique) sont satisfaites de façon quasi optimale : minima de janvier 9,2 °C, moyenne des minima annuels 5,29 °C, record −1,1 à −3,0 °C, été à 28,7 °C de moyenne des maximales. Les analogues les plus agrumicoles sont Faro, Portimão, Le Cap, Valence, Los Angeles et Tel-Aviv.
              <strong>Faisabilité climatique :</strong> excellente.
              <strong>Pédologique :</strong> bonne (sols du Gharb profonds et limoneux).
              <strong>Hydrique :</strong> dépendante de l'irrigation (déficit annuel de 2 166 mm).
              <strong>Agronomique :</strong> établie.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">8.2. Betterave à sucre et canne à sucre — faisabilité très bonne sous irrigation</h3>
            <p className="text-justify space-y-2">
              La betterave exige un été chaud et ensoleillé (3 100 h disponibles) et un hiver doux permettant la reprise ; la canne exige une saison chaude longue et une forte disponibilité en eau. Le Gharb est la région sucrière historique du Maroc. Les analogues les plus sucriers sont Huelva, Jerez, Séville (betterave espagnole) et Adelaide, Perth, Mildura (canne et betterave australiennes).
              <strong>Faisabilité climatique :</strong> très bonne.
              <strong>Hydrique :</strong> dépendante de l'irrigation (Sebou, nappe du Gharb).
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">8.3. Riz (Oryza sativa) — faisabilité climatique très bonne, hydrique exigeante</h3>
            <p className="text-justify space-y-2">
              Le riz requiert une saison chaude (moyenne &gt; 20 °C) et une eau d'irrigation abondante. La période mai-septembre (moyennes de 19,3 à 24,7 °C) est adaptée.
              <strong>Faisabilité climatique :</strong> très bonne.
              <strong>Hydrique :</strong> très exigeante, dépendante du bas Sebou.
              L'analogue rizicole le plus proche est le delta de l'Èbre et la Camargue (non classés faute de données comparables complètes).
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">8.4. Céréales (blé tendre, blé dur, orge) — faisabilité pluviale réelle</h3>
            <p className="text-justify space-y-2">
              Avec 571 mm annuels, le Gharb se situe au-dessus du seuil de 400 mm permettant une céréaliculture pluviale viable — un avantage décisif sur Guercif (233 mm). Les analogues céréaliers les plus proches sont Faro, Barcelone, Le Cap, Adelaide.
              <strong>Faisabilité climatique :</strong> bonne.
              <strong>Risque :</strong> sécheresses saisonnières récurrentes ; la littérature signale dans le Gharb une tendance à la baisse ou à la stagnation des mois secs et une aggravation de la sécheresse saisonnière.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">8.5. Chêne-liège (Quercus suber) — espèce-emblème de la Maâmora</h3>
            <p className="text-justify space-y-2">
              La forêt de la Maâmora, entre Rabat et Kénitra, est la plus vaste subéraie de plaine du monde (~132 000 ha). Elle est rendue possible par exactement les invariants 4 et 6 de la signature kénitrienne : hiver doux sans gel et humidité atmosphérique élevée (76 %). C'est la preuve biogéographique la plus directe de la spécificité du climat de Kénitra par rapport à l'intérieur semi-aride.
              <strong>Les analogues subéricoles sont l'Alentejo et l'Algarve portugais (Faro, Portimão, Setúbal) et la Sardaigne (Cagliari).</strong>
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">8.6. Olivier (Olea europaea) — faisabilité excellente</h3>
            <p className="text-justify space-y-2">
              L'olivier tolère parfaitement l'ensemble des analogues classés. Il constitue l'espèce indicatrice quasi universelle du domaine.
              <strong>Faisabilité :</strong> excellente.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">8.7. Vigne (Vitis vinifera) — faisabilité climatique bonne, faisabilité phytosanitaire limitée</h3>
            <p className="text-justify space-y-2">
              L'insolation (3 110 h) et la chaleur estivale suffisent à une maturation complète. En revanche, l'humidité relative de 76 % et les brouillards favorisent les maladies cryptogamiques (mildiou, oïdium), ce qui pénalise la vigne à Kénitra par rapport à Guercif, Meknès ou Beni Mellal. Les meilleurs analogues viticoles sont Adelaide, Le Cap, Perth, Jerez, Séville — mais tous présentent une humidité inférieure.
              <strong>Faisabilité climatique :</strong> bonne.
              <strong>Agronomique :</strong> dégradée par l'hygrométrie.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">8.8. Palmier dattier (Phoenix dactylifera) — faisabilité marginale, non recommandée</h3>
            <p className="text-justify space-y-2">
              Le dattier exige une saison sèche estivale absolue et une faible humidité pendant la maturation. Or Kénitra présente 18,9 jours « moites ou pires » en août et une humidité relative annuelle de 76 %. L'humidité compromet la maturation et favorise la graphiose (Graphiola phoenicis).
              <strong>Faisabilité climatique :</strong> marginale.
              <strong>Non recommandée à l'échelle commerciale.</strong>
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">8.9. Amandier, figuier, grenadier, caroubier — faisabilité bonne à excellente</h3>
            <p className="text-justify space-y-2">
              Ces espèces méditerranéennes prospèrent dans la totalité des analogues classés en Catégories 1 à 3. Le caroubier, plus sensible au froid, reste limité par le risque de gel épisodique (USDA 11a moyen, mais décrochages en 9b/10a).
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">8.10. Maraîchage d'exportation (tomate, pomme de terre, fraise, haricot) — faisabilité excellente</h3>
            <p className="text-justify space-y-2">
              La douceur hivernale (minima de janvier 9,2 °C), l'insolation hivernale élevée et l'absence de gel structurel font du Gharb la première région marocaine de primeurs d'exportation. Les analogues les plus proches sont Huelva (fraises espagnoles), Almería (maraîchage sous serre), Faro, Larache.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">8.11. Espèces forestières et de reboisement</h3>
            <p className="text-justify space-y-2">
              Pour la Maâmora, la littérature recommande de favoriser le chêne-liège et le pin maritime, et d'éviter l'eucalyptus gommier rouge. Les xérophytes universelles (eucalyptus, Prosopis, Acacia, Tamarix) restent adaptées.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">8.12. Arganier (Argania spinosa) — non faisable</h3>
            <p className="text-justify space-y-2">
              Endémique du Souss-Massa, il exige un climat aride à semi-aride à faible hygrométrie. Le climat humide du Gharb ne lui convient pas. À distinguer nettement des analogues climatiques purs.
            </p>
          </section>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>PARTIE IX — CLASSIFICATIONS CLIMATIQUES, CALCULS DÉTAILLÉS ET AUDIT FINAL</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">9.2. Bilan hydrique et contraintes</h3>
            <p className="text-justify space-y-2">
              ET₀ (Hargreaves-Samani, calculée) : 115,1 ; 148,2 ; 213,5 ; 252,4 ; 313,9 ; 315,1 ; 348,3 ; 323,9 ; 243,1 ; 210,8 ; 141,1 ; 111,3 mm → 2 737 mm/an. Bilan mensuel (P − ET₀) : négatif sur les douze mois ; déficit cumulé 2 166 mm/an, surplus 0 mm. VPD (déficit de pression de vapeur) : 0,39 à 0,94 kPa, moyenne 0,69 kPa — modéré, reflet de la forte humidité relative. Conséquence agronomique : l'irrigation est indispensable pour toute culture d'été ; le Gharb dépend structurellement de l'oued Sebou et de la nappe profonde.
            </p>
            <p className="text-justify space-y-2">
              Environnement écologique : la plaine du Gharb abrite des zones humides d'importance internationale qui attestent de la productivité de ce climat — la Merja Zerga (lagune tidale de 4 500 ha, Ramsar depuis 1980, 70 km au nord de Kénitra, précipitations locales de 600 à 700 mm, plus de 100 espèces d'oiseaux, 15 000 à 30 000 canards hivernants) et la réserve biologique de Sidi Boughaba (150 ha, site Ramsar), entre Mehdia et la Maâmora.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">9.3. Analogues futurs — précaution méthodologique</h3>
            <p className="text-justify space-y-2">
              Aucune projection climatique quantitative n'a été calculée : le mandat exigeait de ne pas présenter de projection comme une prévision certaine, et aucune donnée CMIP6 n'a été effectivement téléchargée. Les éléments disponibles signalent seulement une tendance au réchauffement et à l'aggravation des sécheresses au Maroc, avec un déficit pluviométrique récent d'environ 35 % qualifié de « déficit extrême ». Toute affirmation sur le déplacement des analogues vers le nord ou vers des latitudes plus fraîches serait, en l'état, une hypothèse non quantifiée.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">9.4. Synthèse de l'audit scientifique</h3>
            <p className="text-justify">
              Le tableau de synthèse de l'audit scientifique a été déplacé vers la page Climatologie.
            </p>
          </section>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>PARTIE X — CONCLUSION SCIENTIFIQUE GÉNÉRALE</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <p className="text-justify space-y-2">
              Le climat de Kénitra appartient à une famille climatique mondialement restreinte : celle des climats méditerranéens à très forte influence océanique atlantique, caractérisés simultanément par une pluviométrie annuelle de 500 à 750 mm, un régime à maximum automnal-hivernal et sécheresse estivale absolue, une insolation de 3 000 à 3 100 h, une humidité relative de 70 à 80 %, une amplitude thermique annuelle inférieure à 13 °C et une absence structurelle de gel.
            </p>
            <p className="text-justify space-y-2">
              Cette famille ne compte qu'une vingtaine de régions parfaitement identifiées à l'échelle mondiale, réparties en trois foyers : (i) la façade atlantique ibéro-marocaine (Algarve, golfe de Cadix, littoral marocain de Larache à Casablanca) ; (ii) les façades méditerranéennes occidentales adoucies (Valence, Barcelone, Malte, Bizerte, Tunis) ; (iii) les façades océaniques subtropicales de l'hémisphère sud (Le Cap, Adelaide, Perth) et la côte pacifique californienne (Los Angeles, Santa Barbara, San Diego).
            </p>
            <p className="text-justify space-y-2">
              Les analogues de très haute fidélité de Kénitra sont, par ordre décroissant : Faro et Portimão (Algarve), Larache et Tanger (Maroc atlantique), Le Cap (Afrique du Sud), Adelaide (Australie), Valence et Barcelone (Espagne), La Valette (Malte), Casablanca et Rabat-Salé (Maroc). Les analogues extra-régionaux les plus instructifs sont Le Cap, Adelaide et Los Angeles, qui reproduisent la structure thermique avec une précision remarquable.
            </p>
            <p className="text-justify space-y-2">
              Les quasi-analogues fréquemment cités mais imparfaits incluent Séville, Jerez, Huelva, Cagliari, Izmir et Tunis — tous pénalisés par un été 3 à 8 °C plus chaud et une humidité inférieure — ainsi que Los Angeles et San Diego, pénalisés par un déficit pluviométrique de 200 à 320 mm.
            </p>
            <p className="text-justify space-y-2">
              Il faut souligner le contraste décisif avec Guercif : à seulement 300 km de distance, Guercif relève d'une famille climatique entièrement différente — bassin intérieur semi-aride continental (BSk/BSH, Q₂ ≈ 25, amplitude annuelle 19 °C, humidité estivale 36-40 %, gel sévère jusqu'à −8,5 °C). Les deux villes marocaines ne partagent pratiquement aucun analogue, ce qui démontre que la latitude seule ne détermine pas le climat : c'est la position par rapport à l'océan et aux reliefs qui commande la classification.
            </p>
            <p className="text-justify space-y-2">
              En termes de potentiel agronomique, la palette optimale de Kénitra apparaît clairement définie : agrumes, betterave et canne à sucre, riz, céréales pluviales, maraîchage d'exportation, olivier, amandier, figuier, grenadier et chêne-liège. Le palmier dattier et la vigne y sont, à l'inverse, déconseillés ou dégradés par l'hygrométrie élevée — situation exactement inverse de celle de Guercif.
            </p>
            <p className="text-justify space-y-2">
              En termes de risque climatique, Kénitra se situe à l'interface USDA 11a / 9b-10a, avec une vulnérabilité épisodique aux vagues de froid radiatif, et en AHS Heat Zone 6-7 (estimation), avec une vulnérabilité modérée aux vagues de chaleur — mais une vulnérabilité structurelle et croissante au stress hydrique estival, qui constitue le principal défi d'adaptation du Gharb.
            </p>
          </section>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>NOTA BENE MÉTHODOLOGIQUE</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <p className="text-justify space-y-2">
              Les scores de similarité présentés résultent d'une distance climatique normalisée à six variables, convertie en pourcentage par la fonction S = 100 × e^(−D), avec des pondérations respectives de 20 % (température moyenne annuelle), 20 % (précipitations), 12 % (moyenne des maximales du mois le plus chaud), 12 % (moyenne des minimales du mois le plus froid), 8 % (humidité relative), 10 % (ensoleillement). Les poids sont renormalisés sur les variables effectivement disponibles pour chaque station, ce qui est explicité par l'indicateur de couverture. Les analogies de l'hémisphère sud ont été calculées après correction saisonnière stricte selon la table d'inversion janvier ↔ juillet, février ↔ août, etc., et le régime pluviométrique a été comparé séparément, conformément aux exigences méthodologiques initiales. Ces pourcentages constituent un indice interne de similarité et non une vérité scientifique directement observée.
            </p>
          </section>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>LIMITES EXPLICITES DU PRÉSENT TRAVAIL</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <ul className="list-disc list-inside space-y-3 ml-4">
              <li className="text-justify">
                Le moteur de recherche n'a pas pu être appliqué à l'ensemble des mailles climatiques mondiales : la comparaison porte sur 28 stations documentées, sélectionnées par recherche documentaire et non par balayage systématique d'une grille (WorldClim, CHELSA, ERA5-Land). Les analogues réellement calculés sur grille pourraient inclure des stations non répertoriées.
              </li>
              <li className="text-justify">
                Les records absolus de Kénitra (48,0 °C et −1,1 °C) n'ont pas été vérifiés auprès de la source primaire (DGM Maroc) et divergent des normales OMM.
              </li>
              <li className="text-justify">
                Aucune donnée CMIP6 n'a été téléchargée : la partie « analogues futurs » reste qualitative.
              </li>
              <li className="text-justify">
                L'indice AHS Heat Zone est estimé, non calculé sur série journalière.
              </li>
              <li className="text-justify">
                Six stations sur vingt-huit présentent une couverture de variables inférieure à 80 %.
              </li>
              <li className="text-justify">
                Aucun fichier SIG ni carte interactive n'a été produit : les cartes décrites dans le mandat relèvent d'une étape ultérieure.
              </li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}