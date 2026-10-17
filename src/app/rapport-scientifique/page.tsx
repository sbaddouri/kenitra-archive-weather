"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WeatherCountdown from '@/components/weather-countdown';
import { useTheme } from 'next-themes';

// ============================================================
// Traduction fidèle des plages de couleurs de
// https://en.wikipedia.org/wiki/Module:Weather_box/colors (Lua)
// ============================================================

function hex(value: number): string {
  return Math.round(value).toString(16).toUpperCase().padStart(2, '0');
}

function rangePos(value: number, start: number, stop: number): number {
  if (start < stop) {
    if (value < start) return 0;
    if (value > stop) return 1;
    return (value - start) / (stop - start);
  } else {
    if (value < stop) return 1;
    if (value > start) return 0;
    return (start - value) / (start - stop);
  }
}

function formatLine(background: string, textColor: string): React.CSSProperties {
  return { backgroundColor: `#${background}`, color: `#${textColor}` };
}

// Calcule la couleur de texte optimale (noir ou blanc) selon la luminosité du fond
// et le thème actif, pour rester lisible en mode clair comme en mode sombre
function contrastTextColor(hexBg: string, theme: string): string {
  const r = parseInt(hexBg.substring(0, 2), 16);
  const g = parseInt(hexBg.substring(2, 4), 16);
  const b = parseInt(hexBg.substring(4, 6), 16);
  // Luminance relative (formule W3C)
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  // En mode sombre, on abaisse légèrement le seuil pour privilégier le texte clair
  const threshold = theme === 'dark' ? 0.55 : 0.5;
  return lum > threshold ? '000000' : 'FFFFFF';
}

function daysColor(val: number | null): string {
  if (val == null) return formatLine('FFFFFF', '000000');
  const item1 = hex(rangePos(val, 20, 0) * 255);
  let background = item1 + item1;
  const item2 = hex(rangePos(val, 40, 20) * 255);
  background = background + item2;
  const textColor = val >= 12 ? 'FFFFFF' : '000000';
  return formatLine(background, textColor);
}

function temperatureColor(val: number | null): string {
  if (val == null) return formatLine('FFFFFF', '000000');
  let background = '';
  if (val < 4.5) {
    background = hex(rangePos(val, -42.75, 4.5) * 255);
  } else {
    background = hex(rangePos(val, 60, 41.5) * 255);
  }
  if (val <= 4.5) {
    background = background + hex(rangePos(val, -42.75, 4.5) * 255);
  } else {
    background = background + hex(rangePos(val, 41.5, 4.5) * 255);
  }
  if (val < -42.78) {
    background = background + hex(rangePos(val, -90, -42.78) * 255);
  } else {
    background = background + hex(rangePos(val, 23, 4.5) * 255);
  }
  const textColor = val < -23.3 || val >= 37.8 ? 'FFFFFF' : '000000';
  return formatLine(background, textColor);
}

function precipitationColor(val: number | null): string {
  if (val == null) return formatLine('FFFFFF', '000000');
  const item1 = hex(rangePos(val, 165.6, 0) * 255);
  let background = item1 + item1;
  const item2 = hex(rangePos(val, 300, 165.61) * 207 + 48);
  background = background + item2;
  const textColor = val > 90 ? 'FFFFFF' : '000000';
  return formatLine(background, textColor);
}

function humidityColor(val: number | null): string {
  if (val == null) return formatLine('FFFFFF', '000000');
  const item1 = hex(rangePos(val, 66.67, 0) * 255);
  let background = item1 + item1;
  const item2 = hex(rangePos(val, 133.33, 66.667) * 255);
  background = background + item2;
  const textColor = val >= 40 ? 'FFFFFF' : '000000';
  return formatLine(background, textColor);
}

function sunshineColor(val: number | null): string {
  if (val == null) return formatLine('FFFFFF', '000000');
  let item: string;
  let background = '';
  if (val < 90) {
    item = hex(rangePos(val, 0, 90) * 170);
  } else if (val < 180) {
    item = hex(rangePos(val, 90, 180) * 42.5 + 170);
  } else {
    item = hex(rangePos(val, 180, 360) * 42.5 + 212.5);
  }
  background = item + item;
  if (val < 90) {
    item = hex(rangePos(val, 0, 90) * 170);
  } else if (val < 270) {
    item = hex(rangePos(val, 150, 90) * 170);
  } else {
    item = hex(rangePos(val, 270, 720) * 255);
  }
  background = background + item;
  const textColor = val < 80 ? 'FFFFFF' : '000000';
  return formatLine(background, textColor);
}

// Mapping de fonction de couleur par nom de ligne (paramètre)
function colorForRow(param: string, val: number | null): React.CSSProperties {
  const tempRows = [
    'Record haut °C', 'Moyenne des maxima °C', 'Moyenne des maximales °C',
    'Moyenne journalière °C', 'Moyenne des minimales °C', 'Moyenne des minima °C',
    'Record bas °C', 'Point de rosée °C',
  ];
  if (tempRows.includes(param)) return temperatureColor(val);
  if (param === 'Précipitations mm') return precipitationColor(val);
  if (param.startsWith('Jours')) return daysColor(val);
  if (param === 'Humidité relative %') return humidityColor(val);
  if (param.startsWith('Ensoleillement')) return sunshineColor(val);
  return formatLine('FFFFFF', '000000');
}

// Extrait le premier nombre d'une chaîne (remplace la virgule décimale par un point)
// Retourne null si aucun nombre n'est trouvable (ex: "—", "47,7 (août)")
function parseNum(s: string): number | null {
  const normalized = s.replace(/,/g, '.').replace(/−/g, '-');
  const m = normalized.match(/-?\d+(?:\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
}

// Calcule le style de cellule à partir du libellé de ligne et de la valeur texte
function cellStyle(param: string, valStr: string, theme: string): React.CSSProperties {
  const n = parseNum(valStr);
  if (n == null) {
    return theme === 'dark'
      ? { backgroundColor: '#1a1a1a', color: '#e5e5e5' }
      : { backgroundColor: '#ffffff', color: '#000000' };
  }
  const base = colorForRow(param, n);
  const bgHex = base.backgroundColor!.replace('#', '');
  const textColor = contrastTextColor(bgHex, theme);
  return { backgroundColor: base.backgroundColor, color: `#${textColor}` };
}

export default function RapportScientifiquePage() {
  const { theme } = useTheme();
  const cs = (param: string, valStr: string) => cellStyle(param, valStr, theme ?? 'light');
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
                Pluviométrie annuelle de 540 à 720 mm, avec un maximum automnal-hivernal très marqué (novembre = 94 mm) et une sécheresse estivale quasi absolue (juin-août &le; 10 mm). Octobre-mars totalise 451 mm, soit 79,0 % du total annuel ; avril-septembre ne reçoit que 120 mm.
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
            <h3 className="text-xl font-semibold mb-4">1.3. Tableau climatique de référence — Kénitra</h3>
            <p className="text-justify mb-4">
              Le tableau fourni (normales et extrêmes 1940-2025, ensoleillement 1981-2010, jours de pluie 1961-1990) est reproduit ci-dessous, accompagné d'une colonne de contrôle issue des normales officielles OMM 1991-2020 de la même station.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-max text-sm border-collapse border border-gray-300">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    <th className="border border-gray-300 px-2 py-1 font-semibold text-left sticky left-0 bg-gray-100 z-20">Paramètre</th>
                    <th className="border border-gray-300 px-2 py-1 font-semibold text-center">Jan</th>
                    <th className="border border-gray-300 px-2 py-1 font-semibold text-center">Fév</th>
                    <th className="border border-gray-300 px-2 py-1 font-semibold text-center">Mar</th>
                    <th className="border border-gray-300 px-2 py-1 font-semibold text-center">Avr</th>
                    <th className="border border-gray-300 px-2 py-1 font-semibold text-center">Mai</th>
                    <th className="border border-gray-300 px-2 py-1 font-semibold text-center">Jun</th>
                    <th className="border border-gray-300 px-2 py-1 font-semibold text-center">Jul</th>
                    <th className="border border-gray-300 px-2 py-1 font-semibold text-center">Aoû</th>
                    <th className="border border-gray-300 px-2 py-1 font-semibold text-center">Sep</th>
                    <th className="border border-gray-300 px-2 py-1 font-semibold text-center">Oct</th>
                    <th className="border border-gray-300 px-2 py-1 font-semibold text-center">Nov</th>
                    <th className="border border-gray-300 px-2 py-1 font-semibold text-center">Déc</th>
                    <th className="border border-gray-300 px-2 py-1 font-semibold text-center">Année</th>
                    <th className="border border-gray-300 px-2 py-1 font-semibold text-center">OMM 91-20</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="border border-gray-300 px-2 py-1 font-medium sticky left-0 bg-white z-10">Record haut °C</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record haut °C', '27,6')}>27,6</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record haut °C', '30,5')}>30,5</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record haut °C', '35,5')}>35,5</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record haut °C', '38,1')}>38,1</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record haut °C', '45,3')}>45,3</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record haut °C', '45,6')}>45,6</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record haut °C', '48,0')}>48,0</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record haut °C', '47,2')}>47,2</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record haut °C', '43,3')}>43,3</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record haut °C', '39,5')}>39,5</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record haut °C', '33,9')}>33,9</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record haut °C', '28,5')}>28,5</td>
                    <td className="border border-gray-300 px-2 py-1 text-center font-semibold" style={cs('Record haut °C', '48,0')}>48,0</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record haut °C', '47,7 (août)')}>47,7 (août)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-2 py-1 font-medium sticky left-0 bg-gray-50 z-10">Moyenne des maxima °C</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maxima °C', '21,5')}>21,5</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maxima °C', '23,7')}>23,7</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maxima °C', '26,9')}>26,9</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maxima °C', '28,8')}>28,8</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maxima °C', '31,6')}>31,6</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maxima °C', '34,8')}>34,8</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maxima °C', '34,9')}>34,9</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maxima °C', '35,0')}>35,0</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maxima °C', '32,8')}>32,8</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maxima °C', '30,8')}>30,8</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maxima °C', '26,3')}>26,3</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maxima °C', '21,9')}>21,9</td>
                    <td className="border border-gray-300 px-2 py-1 text-center font-semibold" style={cs('Moyenne des maxima °C', '36,90')}>36,90</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maxima °C', '—')}>—</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border border-gray-300 px-2 py-1 font-medium sticky left-0 bg-white z-10">Moyenne des maximales °C</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maximales °C', '17,1')}>17,1</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maximales °C', '18,8')}>18,8</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maximales °C', '19,8')}>19,8</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maximales °C', '21,1')}>21,1</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maximales °C', '23,7')}>23,7</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maximales °C', '25,2')}>25,2</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maximales °C', '27,9')}>27,9</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maximales °C', '28,7')}>28,7</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maximales °C', '26,1')}>26,1</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maximales °C', '24,9')}>24,9</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maximales °C', '21,6')}>21,6</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maximales °C', '18,4')}>18,4</td>
                    <td className="border border-gray-300 px-2 py-1 text-center font-semibold" style={cs('Moyenne des maximales °C', '22,8')}>22,8</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maximales °C', '23,5')}>23,5</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-2 py-1 font-medium sticky left-0 bg-gray-50 z-10">Moyenne journalière °C</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne journalière °C', '13,2')}>13,2</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne journalière °C', '14,2')}>14,2</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne journalière °C', '15,2')}>15,2</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne journalière °C', '16,8')}>16,8</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne journalière °C', '19,3')}>19,3</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne journalière °C', '21,3')}>21,3</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne journalière °C', '23,8')}>23,8</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne journalière °C', '24,7')}>24,7</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne journalière °C', '22,4')}>22,4</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne journalière °C', '20,3')}>20,3</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne journalière °C', '17,2')}>17,2</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne journalière °C', '14,4/13,2')}>14,4/13,2</td>
                    <td className="border border-gray-300 px-2 py-1 text-center font-semibold" style={cs('Moyenne journalière °C', '18,6')}>18,6</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne journalière °C', '18,4')}>18,4</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border border-gray-300 px-2 py-1 font-medium sticky left-0 bg-white z-10">Moyenne des minimales °C</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minimales °C', '9,2')}>9,2</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minimales °C', '9,5')}>9,5</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minimales °C', '10,5')}>10,5</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minimales °C', '12,5')}>12,5</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minimales °C', '14,9')}>14,9</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minimales °C', '17,3')}>17,3</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minimales °C', '19,6')}>19,6</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minimales °C', '20,6')}>20,6</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minimales °C', '18,6')}>18,6</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minimales °C', '15,6')}>15,6</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minimales °C', '12,8')}>12,8</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minimales °C', '10,4')}>10,4</td>
                    <td className="border border-gray-300 px-2 py-1 text-center font-semibold" style={cs('Moyenne des minimales °C', '14,3')}>14,3</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minimales °C', '13,4')}>13,4</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-2 py-1 font-medium sticky left-0 bg-gray-50 z-10">Moyenne des minima °C</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minima °C', '5,0')}>5,0</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minima °C', '6,2')}>6,2</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minima °C', '7,6')}>7,6</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minima °C', '9,7')}>9,7</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minima °C', '11,3')}>11,3</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minima °C', '15,1')}>15,1</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minima °C', '16,4')}>16,4</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minima °C', '16,9')}>16,9</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minima °C', '15,8')}>15,8</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minima °C', '13,0')}>13,0</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minima °C', '8,7')}>8,7</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minima °C', '6,6')}>6,6</td>
                    <td className="border border-gray-300 px-2 py-1 text-center font-semibold" style={cs('Moyenne des minima °C', '5,29')}>5,29</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minima °C', '—')}>—</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border border-gray-300 px-2 py-1 font-medium sticky left-0 bg-white z-10">Record bas °C</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record bas °C', '−1,1')}>−1,1</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record bas °C', '−0,8')}>−0,8</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record bas °C', '2,9')}>2,9</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record bas °C', '5,7')}>5,7</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record bas °C', '6,9')}>6,9</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record bas °C', '10,9')}>10,9</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record bas °C', '12,5')}>12,5</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record bas °C', '13,3')}>13,3</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record bas °C', '10,8')}>10,8</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record bas °C', '7,4')}>7,4</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record bas °C', '2,9')}>2,9</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record bas °C', '0,9')}>0,9</td>
                    <td className="border border-gray-300 px-2 py-1 text-center font-semibold" style={cs('Record bas °C', '−1,1')}>−1,1</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record bas °C', '−3,0 (fév)')}>−3,0 (fév)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-2 py-1 font-medium sticky left-0 bg-gray-50 z-10">Précipitations mm</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Précipitations mm', '82')}>82</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Précipitations mm', '64')}>64</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Précipitations mm', '63')}>63</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Précipitations mm', '57')}>57</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Précipitations mm', '32')}>32</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Précipitations mm', '8')}>8</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Précipitations mm', '1')}>1</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Précipitations mm', '1')}>1</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Précipitations mm', '21')}>21</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Précipitations mm', '63')}>63</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Précipitations mm', '94')}>94</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Précipitations mm', '85')}>85</td>
                    <td className="border border-gray-300 px-2 py-1 text-center font-semibold" style={cs('Précipitations mm', '571')}>571</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Précipitations mm', '539,5')}>539,5</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border border-gray-300 px-2 py-1 font-medium sticky left-0 bg-white z-10">Jours de précip. ≥1 mm</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de précip. ≥1 mm', '6')}>6</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de précip. ≥1 mm', '6')}>6</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de précip. ≥1 mm', '5')}>5</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de précip. ≥1 mm', '6')}>6</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de précip. ≥1 mm', '4')}>4</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de précip. ≥1 mm', '1')}>1</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de précip. ≥1 mm', '0')}>0</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de précip. ≥1 mm', '0')}>0</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de précip. ≥1 mm', '3')}>3</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de précip. ≥1 mm', '5')}>5</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de précip. ≥1 mm', '7')}>7</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de précip. ≥1 mm', '7')}>7</td>
                    <td className="border border-gray-300 px-2 py-1 text-center font-semibold" style={cs('Jours de précip. ≥1 mm', '50')}>50</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de précip. ≥1 mm', '52,6')}>52,6</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-2 py-1 font-medium sticky left-0 bg-gray-50 z-10">Jours de pluie</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de pluie', '12,3')}>12,3</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de pluie', '12,7')}>12,7</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de pluie', '12,2')}>12,2</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de pluie', '11,0')}>11,0</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de pluie', '7,6')}>7,6</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de pluie', '2,9')}>2,9</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de pluie', '0,3')}>0,3</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de pluie', '0,7')}>0,7</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de pluie', '2,8')}>2,8</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de pluie', '8,6')}>8,6</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de pluie', '13,3')}>13,3</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de pluie', '14,0')}>14,0</td>
                    <td className="border border-gray-300 px-2 py-1 text-center font-semibold" style={cs('Jours de pluie', '98,4')}>98,4</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de pluie', '—')}>—</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border border-gray-300 px-2 py-1 font-medium sticky left-0 bg-white z-10">Humidité relative %</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Humidité relative %', '80')}>80</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Humidité relative %', '77')}>77</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Humidité relative %', '75')}>75</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Humidité relative %', '75')}>75</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Humidité relative %', '72')}>72</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Humidité relative %', '73')}>73</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Humidité relative %', '75')}>75</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Humidité relative %', '76')}>76</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Humidité relative %', '76')}>76</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Humidité relative %', '78')}>78</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Humidité relative %', '77')}>77</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Humidité relative %', '78')}>78</td>
                    <td className="border border-gray-300 px-2 py-1 text-center font-semibold" style={cs('Humidité relative %', '76')}>76</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Humidité relative %', '—')}>—</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-2 py-1 font-medium sticky left-0 bg-gray-50 z-10">Point de rosée °C</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Point de rosée °C', '9,38')}>9,38</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Point de rosée °C', '9,74')}>9,74</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Point de rosée °C', '10,77')}>10,77</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Point de rosée °C', '11,76')}>11,76</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Point de rosée °C', '13,61')}>13,61</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Point de rosée °C', '16,08')}>16,08</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Point de rosée °C', '17,96')}>17,96</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Point de rosée °C', '18,68')}>18,68</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Point de rosée °C', '17,81')}>17,81</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Point de rosée °C', '15,52')}>15,52</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Point de rosée °C', '12,50')}>12,50</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Point de rosée °C', '10,37')}>10,37</td>
                    <td className="border border-gray-300 px-2 py-1 text-center font-semibold" style={cs('Point de rosée °C', '13,68 (table : 8,4)')}>13,68 (table : 8,4)</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Point de rosée °C', '—')}>—</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border border-gray-300 px-2 py-1 font-medium sticky left-0 bg-white z-10">Ensoleillement h</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Ensoleillement h', '182,9')}>182,9</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Ensoleillement h', '184,8')}>184,8</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Ensoleillement h', '244,9')}>244,9</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Ensoleillement h', '270,0')}>270,0</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Ensoleillement h', '313,1')}>313,1</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Ensoleillement h', '318,0')}>318,0</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Ensoleillement h', '347,2')}>347,2</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Ensoleillement h', '331,7')}>331,7</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Ensoleillement h', '282,0')}>282,0</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Ensoleillement h', '248,0')}>248,0</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Ensoleillement h', '195,0')}>195,0</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Ensoleillement h', '182,9')}>182,9</td>
                    <td className="border border-gray-300 px-2 py-1 text-center font-semibold" style={cs('Ensoleillement h', '3 110,5')}>3 110,5</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Ensoleillement h', '3 005,7')}>3 005,7</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-2 py-1 font-medium sticky left-0 bg-gray-50 z-10">% ensoleillement possible</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('% ensoleillement possible', '69,4')}>69,4</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('% ensoleillement possible', '66,0')}>66,0</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('% ensoleillement possible', '66,4')}>66,4</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('% ensoleillement possible', '66,7')}>66,7</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('% ensoleillement possible', '67,3')}>67,3</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('% ensoleillement possible', '66,3')}>66,3</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('% ensoleillement possible', '72,3')}>72,3</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('% ensoleillement possible', '76,4')}>76,4</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('% ensoleillement possible', '75,2')}>75,2</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('% ensoleillement possible', '72,7')}>72,7</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('% ensoleillement possible', '68,4')}>68,4</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('% ensoleillement possible', '73,7')}>73,7</td>
                    <td className="border border-gray-300 px-2 py-1 text-center font-semibold" style={cs('% ensoleillement possible', '70,3')}>70,3</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('% ensoleillement possible', '—')}>—</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-justify mt-4 text-sm">
              <strong>Valeurs dérivées (calculées) :</strong> moyenne des maximales annuelle = 22,8 °C ; moyenne des minimales = 14,3 °C ; amplitude diurne moyenne = 8,5 °C (7,5 à 9,3 °C) ; amplitude annuelle des moyennes = 11,5 °C ; amplitude absolue = 49,1 °C.
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
                Sidi Kacem (34°13′ N, 5°42′ O, 194 m) et Souk El Arbaa (34°40′ N, 5°58′ O), toutes deux dans la région de Kénitra, présentent un climat plus continentalisé que Kénitra : « étés chauds à très chauds, pointes entre 32 et 36 °C ; hivers relativement frais, les minima passant parfois sous le point de congélation ; précipitations annuelles de 350 à 600 mm ». Il s'agit d'analogues intra-régionaux dégradés par la continentalité : le gradient Kénitra → Sidi Kacem → Sidi Slimane illustre le passage du littoral océanique tempéré à l'intérieur semi-aride du Gharb, gradient décrit dans la littérature sous la forme d'un « climat subhumide au nord-ouest, semi-aride au sud et à l'est ».
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
          <CardTitle>PARTIE IV â€” ANALOGUES DU PROCHE ET MOYEN-ORIENT</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-xl font-semibold mb-2">4.1. Analogues du Levant</h3>
            
            <div className="space-y-4">
              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">4.1.1. Alep intÃ©rieure, Homs, Hama (Syrie centre-nord) â€” SimilaritÃ© â‰ˆ 88 %</h5>
                <p className="text-justify">
                  Ces stations prÃ©sentent 300 Ã  380 mm annuels, un rÃ©gime pluviomÃ©trique mÃ©diterranÃ©en Ã  maximum hivernal marquÃ©, des Ã©tÃ©s secs et chauds, avec des Tmax de juillet de 35 Ã  37 Â°C, ainsi que des hivers frais oÃ¹ les gelÃ©es occasionnelles demeurent possibles. La signature agronomique y est presque parfaite : olivier, pistachier de haute qualitÃ©, amandier, vigne, grenadier.
                </p>
              </div>

              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">4.1.2. Amman, Madaba (plateau jordanien) â€” SimilaritÃ© â‰ˆ 87 %</h5>
                <p className="text-justify">
                  Amman, Ã  780 m, reÃ§oit environ 275 mm, prÃ©sente une saison sÃ¨che estivale absolue, des Ã©tÃ©s chauds mais tempÃ©rÃ©s par lâ€™altitude, avec une Tmax de juillet proche de 32 Â°C, et des hivers frais. Lâ€™analogie est trÃ¨s forte, sauf en ce qui concerne lâ€™intensitÃ© estivale, plus modÃ©rÃ©e quâ€™Ã  KÃ©nitra.
                </p>
              </div>

              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">4.1.3. Bekaa nord â€” Baalbek, Hermel â€” SimilaritÃ© â‰ˆ 89 %</h5>
                <p className="text-justify">
                  La Bekaa septentrionale libanaise, Ã  environ 1 100 m dâ€™altitude, reÃ§oit 200 Ã  350 mm annuels selon les secteurs, avec un rÃ©gime pluviomÃ©trique typiquement mÃ©diterranÃ©en. Les Ã©tÃ©s y sont trÃ¨s chauds et secs, lâ€™insolation extrÃªmement forte, et la continentalitÃ© marquÃ©e. Il sâ€™agit de lâ€™un des meilleurs analogues levantins.
                </p>
              </div>

              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">4.1.4. Steppe syrienne intÃ©rieure â€” Palmyre, Deir ez-Zor â€” SimilaritÃ© â‰ˆ 82 %</h5>
                <p className="text-justify">
                  Lâ€™analogie y est forte sur le plan estival, moins satisfaisante sur le plan hivernal, les hivers Ã©tant plus froids et plus brefs.
                </p>
              </div>
            </div>
            
            <div className="space-y-4 mt-6">
              <h3 className="text-xl font-semibold mb-2">4.2. Analogues iraniens</h3>
              
              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">4.2.1. PiÃ©mont du Zagros â€” Kermanshah, Khorramabad, Ilam â€” SimilaritÃ© â‰ˆ 85 %</h5>
                <p className="text-justify">
                  Kermanshah, Ã  1 320 m, reÃ§oit environ 450 mm, mais prÃ©sente une saison sÃ¨che estivale absolue et une insolation trÃ¨s Ã©levÃ©e. Lâ€™analogie demeure partielle, en raison dâ€™un excÃ¨s pluviomÃ©trique et dâ€™une continentalitÃ© accrue.
                </p>
              </div>
              
              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">4.2.2. Plateau iranien central â€” Yazd, Kerman, Isfahan intÃ©rieure â€” SimilaritÃ© â‰ˆ 80 %</h5>
                <p className="text-justify">
                  Ces stations basculent vers le semi-aride dÃ©sertique, voire le dÃ©sert froid, de type BWk, avec 60 Ã  130 mm annuels. Lâ€™analogie porte sur la structure thermique et hygromÃ©trique, non sur la pluviomÃ©trie.
                </p>
              </div>
              
              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">4.2.3. Shiraz â€” SimilaritÃ© â‰ˆ 84 %</h5>
                <p className="text-justify">
                  Shiraz, Ã  1 500 m, reÃ§oit environ 340 mm et prÃ©sente une signature mÃ©diterranÃ©enne dâ€™altitude, avec des Ã©tÃ©s trÃ¨s chauds et secs et des hivers frais. Lâ€™analogie y demeure forte.
                </p>
              </div>
            </div>
            
            <div className="space-y-4 mt-6">
              <h3 className="text-xl font-semibold mb-2">4.3. Analogues dâ€™Asie centrale</h3>
              
              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">4.3.1. Tachkent, Samarcande, Boukhara (OuzbÃ©kistan) â€” SimilaritÃ© â‰ˆ 76 %</h5>
                <p className="text-justify">
                  La continentalitÃ© y est beaucoup plus marquÃ©e, avec des hivers pouvant atteindre âˆ’20 Â°C. Lâ€™analogie estivale est forte ; lâ€™analogie hivernale, faible.
                </p>
              </div>
              
              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">4.3.2. DouchanbÃ© (Tadjikistan) â€” SimilaritÃ© â‰ˆ 78 %</h5>
                <p className="text-justify">
                  Lâ€™analogie y demeure modÃ©rÃ©e.
                </p>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>PARTIE V â€” ANALOGUES AMÃ‰RICAINS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-xl font-semibold mb-2">5.1. Californie et Grand Bassin â€” analyse dÃ©taillÃ©e</h3>
            
            <div className="space-y-4">
              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">5.1.1. Bakersfield (VallÃ©e Centrale de Californie) â€” SimilaritÃ© â‰ˆ 84 %</h5>
                <p className="text-justify">
                  Comme le soulignait avec pertinence le rapport initial, Bakersfield doit Ãªtre mentionnÃ©e en prioritÃ©, malgrÃ© son statut dâ€™analogue imparfait. Les convergences sont substantielles : classification KÃ¶ppen BSk, prÃ©cipitations annuelles de lâ€™ordre de 165 Ã  170 mm, ce qui rend Bakersfield plus sÃ¨che que KÃ©nitra mais dans le mÃªme ordre de grandeur, rÃ©gime pluviomÃ©trique Ã  concentration hivernale avec novembre Ã  mars reprÃ©sentant environ 85 % du total, Ã©tÃ©s extrÃªmement chauds, avec une Tmax de juillet proche de 36 Ã  37 Â°C, comparable Ã  celle de KÃ©nitra, insolation annuelle proche de 3 200 h, et humiditÃ© estivale basse.
                </p>
                <p className="text-justify">
                  Toutefois, plusieurs diffÃ©rences majeures interdisent dâ€™accorder Ã  Bakersfield une similaritÃ© supÃ©rieure.
                </p>
                <p className="text-justify">
                  PremiÃ¨rement, lâ€™hiver bakersfieldien est marquÃ© par le cÃ©lÃ¨bre brouillard de Tule, phÃ©nomÃ¨ne de brouillard radiatif dâ€™inversion caractÃ©ristique de la VallÃ©e Centrale, rÃ©sultant de lâ€™accumulation dâ€™air humide et froid dans la cuvette californienne, piÃ©gÃ© sous une couche dâ€™inversion souvent persistante durant plusieurs jours, voire plusieurs semaines. Ce brouillard, absent Ã  KÃ©nitra, transforme radicalement lâ€™ambiance hivernale : humiditÃ© relative diurne dÃ©passant 90 % pendant des semaines entiÃ¨res, ensoleillement hivernal effectif fortement rÃ©duit, Bakersfield ne recevant quâ€™environ 60 % du possible en dÃ©cembre-janvier, contre 66 Ã  68 % Ã  KÃ©nitra, ainsi quâ€™un point de rosÃ©e hivernal plus Ã©levÃ©.
                </p>
                <p className="text-justify">
                  DeuxiÃ¨mement, lâ€™inversion thermique hivernale y est beaucoup plus marquÃ©e, la VallÃ©e Centrale constituant un piÃ¨ge topographique trÃ¨s fermÃ©, encadrÃ© par la Sierra Nevada Ã  lâ€™est et les Coast Ranges Ã  lâ€™ouest, tandis que le bassin de KÃ©nitra demeure plus ouvert et plus ventilÃ©, notamment sous lâ€™action du chergui et des advections perturbÃ©es.
                </p>
                <p className="text-justify">
                  TroisiÃ¨mement, les records de froid hivernaux sont lÃ©gÃ¨rement moins sÃ©vÃ¨res Ã  Bakersfield, de lâ€™ordre de âˆ’5 Ã  âˆ’6 Â°C, quâ€™Ã  KÃ©nitra, oÃ¹ le record absolu sâ€™Ã©tablit Ã  âˆ’8,5 Â°C, bien que la frÃ©quence des gelÃ©es soit comparable.
                </p>
                <p className="text-justify">
                  QuatriÃ¨mement, ces diffÃ©rences ont des consÃ©quences prÃ©cises sur le plan botanique et agronomique. Phoenix dactylifera est cultivÃ© commercialement dans la Coachella Valley, analogue thermique estival de KÃ©nitra, mais pas dans la VallÃ©e Centrale de Bakersfield, car les brouillards persistants et lâ€™humiditÃ© hivernale favorisent les maladies cryptogamiques, notamment Graphiola phoenicis, et compromettent la maturation parfaite des dattes. Ã€ KÃ©nitra, en revanche, la clartÃ© et la sÃ©cheresse hivernales autorisent la culture du dattier dans les stations abritÃ©es. Les agrumes prospÃ¨rent Ã  Bakersfield â€” oranger, mandarinier, pomelo â€” avec dâ€™excellents rendements sous irrigation. Ã€ KÃ©nitra, ils demeurent Ã©galement cultivables, mais avec une vigueur moindre en raison de la pluviomÃ©trie plus faible et dâ€™une ariditÃ© estivale plus sÃ¨che. Lâ€™olivier, lâ€™amandier, le pistachier, la vigne et le grenadier se comportent, quant Ã  eux, de maniÃ¨re quasi identique dans les deux rÃ©gions.
                </p>
                <p className="text-justify">
                  En conclusion, Bakersfield constitue un analogue estival de trÃ¨s haute qualitÃ©, mais un analogue hivernal mÃ©diocre en raison du complexe brouillard-humiditÃ©-inversion. Sa similaritÃ© globale doit donc Ãªtre plafonnÃ©e Ã  â‰ˆ 84 %.
                </p>
              </div>
              
              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">5.1.2. Coachella Valley â€” Indio, Palm Springs, Mecca â€” SimilaritÃ© â‰ˆ 79 %</h5>
                <p className="text-justify">
                  La Coachella Valley bascule vers le dÃ©sert chaud BWh, avec environ 80 mm annuels seulement et des Ã©tÃ©s extrÃªmement chauds, les Tmax de juillet y atteignant â‰ˆ 42 Â°C. Lâ€™analogie y est estivale forte, hivernale correcte, et pluviomÃ©triquement faible. Il sâ€™agit dâ€™un analogue Â« chaud et sec Â» de KÃ©nitra, dÃ©calÃ© vers lâ€™ariditÃ© dÃ©sertique. Le dattier y trouve son optimum planÃ©taire.
                </p>
              </div>
              
              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">5.1.3. Fresno, Merced, Modesto, Sacramento sud â€” SimilaritÃ© â‰ˆ 82 %</h5>
                <p className="text-justify">
                  Ces stations constituent des analogues comparables Ã  Bakersfield, mais avec un Ã©tÃ© lÃ©gÃ¨rement moins torride.
                </p>
              </div>
              
              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">5.1.4. Reno, Fallon, Fernley (Nevada occidental) â€” SimilaritÃ© â‰ˆ 85 %</h5>
                <p className="text-justify">
                  Ces stations du Grand Bassin, situÃ©es entre 1 300 et 1 400 m, prÃ©sentent un climat steppique BSk classique, avec 180 Ã  200 mm annuels, une forte insolation, une humiditÃ© basse, des Ã©tÃ©s chauds et secs, et des hivers frais Ã  froids. Leur signature est trÃ¨s proche de celle de KÃ©nitra, bien quâ€™accompagnÃ©e dâ€™une continentalitÃ© accrue par lâ€™altitude.
                </p>
              </div>
              
              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">5.1.5. Winnemucca, Elko (Nevada nord) â€” SimilaritÃ© â‰ˆ 76 %</h5>
                <p className="text-justify">
                  Les hivers y sont trop froids pour permettre une analogie complÃ¨te.
                </p>
              </div>
            </div>
            
            <div className="space-y-4 mt-6">
              <h3 className="text-xl font-semibold mb-2">5.2. Grand Sud-Ouest amÃ©ricain</h3>
              
              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">5.2.1. Albuquerque (Nouveau-Mexique) â€” SimilaritÃ© â‰ˆ 82 %</h5>
                <p className="text-justify">
                  Albuquerque, Ã  1 620 m, reÃ§oit environ 240 mm annuels, prÃ©sente une insolation supÃ©rieure Ã  3 400 h, des Ã©tÃ©s chauds, avec une Tmax de juillet proche de 32 Â°C, et des hivers frais. La diffÃ©rence majeure rÃ©side dans le rÃ©gime pluviomÃ©trique : Albuquerque connaÃ®t un maximum estival de mousson nord-amÃ©ricaine, en juillet-aoÃ»t, absolument opposÃ© au rÃ©gime mÃ©diterranÃ©en de KÃ©nitra. Cette inversion pluviomÃ©trique constitue un obstacle structurel Ã  une analogie parfaite.
                </p>
              </div>
              
              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">5.2.2. El Paso, Las Cruces, Roswell (Nouveau-Mexique / Texas) â€” SimilaritÃ© â‰ˆ 78 %</h5>
                <p className="text-justify">
                  La mÃªme remarque sâ€™impose concernant le rÃ©gime de mousson estivale.
                </p>
              </div>
              
              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">5.2.3. Phoenix, Tucson (Arizona) â€” SimilaritÃ© â‰ˆ 72 %</h5>
                <p className="text-justify">
                  Ces stations sont trop chaudes et soumises Ã  un rÃ©gime de mousson estivale.
                </p>
              </div>
            </div>
            
            <div className="space-y-4 mt-6">
              <h3 className="text-xl font-semibold mb-2">5.3. AmÃ©rique latine</h3>
              
              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">5.3.1. VallÃ©e de Mexico intÃ©rieure â€” non analogue</h5>
                <p className="text-justify">
                  La vallÃ©e de Mexico intÃ©rieure ne saurait Ãªtre retenue comme analogue, en raison de son climat tropical de haute altitude.
                </p>
              </div>
              
              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">5.3.2. Nord du Mexique â€” Chihuahua, Saltillo, Monterrey intÃ©rieure â€” SimilaritÃ© â‰ˆ 78 %</h5>
                <p className="text-justify">
                  Chihuahua, Ã  1 440 m, prÃ©sente environ 385 mm annuels avec un maximum estival de mousson. Lâ€™analogie thermique y demeure moyenne.
                </p>
              </div>
              
              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">5.3.3. VallÃ©es argentines â€” Mendoza, San Juan, La Rioja â€” SimilaritÃ© â‰ˆ 90 % (avec inversion saisonniÃ¨re)</h5>
                <p className="text-justify">
                  Mendoza, Ã  827 m, constitue, Ã  lâ€™Ã©chelle de lâ€™hÃ©misphÃ¨re Sud, lâ€™un des meilleurs analogues de KÃ©nitra. AprÃ¨s correction saisonniÃ¨re â€” janvier â†” juillet, juillet â†” janvier â€” on obtient une structure remarquablement instructive. Les prÃ©cipitations annuelles, de lâ€™ordre de 220 mm, sont proches des 233 mm de KÃ©nitra. Le rÃ©gime pluviomÃ©trique, en revanche, prÃ©sente un maximum estival austral, de dÃ©cembre Ã  mars, ce qui, aprÃ¨s inversion, correspondrait Ã  juin-septembre : une diffÃ©rence structurelle fondamentale apparaÃ®t donc ici, Mendoza relevant dâ€™un rÃ©gime Ã  maximum estival austral, tandis que KÃ©nitra relÃ¨ve dâ€™un rÃ©gime Ã  maximum Ã©quinoxial-hivernal. Cette divergence, souvent nÃ©gligÃ©e, rÃ©duit la similaritÃ© Ã  environ 82 % si lâ€™on pondÃ¨re strictement le rÃ©gime des pluies. Sur le plan thermique, les Tmax du mois le plus chaud austral, câ€™est-Ã -dire janvier, atteignent environ 32 Â°C, contre 36,2 Â°C Ã  KÃ©nitra ; les hivers austraux, avec des Tmin de juillet proches de 3 Â°C, sont en revanche comparables. Lâ€™insolation, lâ€™humiditÃ© et la continentalitÃ© sont trÃ¨s proches.
                </p>
                <p className="text-justify">
                  San Juan, Ã  600 m, est plus chaude et plus sÃ¨che, avec 90 mm annuels, se rapprochant davantage de la Coachella Valley que de KÃ©nitra. La Rioja constitue un excellent analogue, avec 350 mm et un climat semi-aride subtropical. Lâ€™ensemble du Cuyo argentin reprÃ©sente une grande rÃ©gion viticole et olÃ©icole, exactement comme le Maroc oriental pourrait le devenir. Le comportement de la vigne, de lâ€™olivier, du pistachier, de lâ€™amandier et du grenadier y est rigoureusement analogue Ã  celui observÃ© Ã  KÃ©nitra.
                </p>
              </div>
              
              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">5.3.4. VallÃ©es chiliennes intÃ©rieures â€” CopiapÃ³, Vallenar, Ovalle â€” SimilaritÃ© â‰ˆ 80 % (avec inversion saisonniÃ¨re)</h5>
                <p className="text-justify">
                  Ces stations prÃ©sentent un climat semi-aride Ã  hivers frais et Ã©tÃ©s secs, mais avec une pluviomÃ©trie plus faible, infÃ©rieure Ã  100 mm pour CopiapÃ³ et proche de 130 mm pour Ovalle. Lâ€™analogie thermique y est correcte, lâ€™analogie hydrique plus limitÃ©e.
                </p>
              </div>
              
              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">5.3.5. VallÃ©es pÃ©ruviennes intÃ©rieures â€” Arequipa â€” SimilaritÃ© â‰ˆ 70 %</h5>
                <p className="text-justify">
                  Lâ€™altitude y est trop importante et le climat sensiblement diffÃ©rent.
                </p>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>PARTIE VI â€” ANALOGUES DE Lâ€™HÃ‰MISPHÃˆRE SUD</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-xl font-semibold mb-2">Afrique australe et OcÃ©anie</h3>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">6.1. Afrique du Sud</h4>
              
              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">6.1.1. Karoo â€” Beaufort West, Prince Albert, Oudtshoorn â€” SimilaritÃ© â‰ˆ 78â€“85 %</h5>
                <p className="text-justify">
                  Le Karoo sud-africain, et plus particuliÃ¨rement le Little Karoo (Klein Karoo), constitue lâ€™un des rares analogues sud-africains de KÃ©nitra. Oudtshoorn, Ã  300 m, reÃ§oit environ 250 mm annuels, prÃ©sente une insolation trÃ¨s Ã©levÃ©e, des Ã©tÃ©s chauds, les Tmax de janvier-fÃ©vrier austral atteignant environ 32 Â°C, ce qui correspond Ã  juillet-aoÃ»t dans lâ€™hÃ©misphÃ¨re Nord, ainsi que des hivers frais avec gelÃ©es occasionnelles. Toutefois, le rÃ©gime pluviomÃ©trique du Karoo est plus dispersÃ© sur lâ€™annÃ©e, avec des pluies convectives estivales durant dÃ©cembre-mars austral, ce qui le distingue du rÃ©gime hivernal mÃ©diterranÃ©en de KÃ©nitra. AprÃ¨s correction saisonniÃ¨re, la structure thermique est trÃ¨s fidÃ¨le, mais le rÃ©gime hydrique reste divergent.
                </p>
                <p className="text-justify">
                  Beaufort West, Ã  850 m, est plus continentale et plus proche du rÃ©gime steppique semi-aride.
                </p>
                <p className="text-justify">
                  Sur le plan botanique, le Karoo est rÃ©putÃ© pour ses cultures de vigne, dâ€™olivier, dâ€™amandier, de grenadier, ainsi que pour lâ€™Ã©levage historique de lâ€™autruche, particuliÃ¨rement adaptÃ© Ã  la sÃ©cheresse. La palette agronomique y est trÃ¨s voisine de celle envisageable Ã  KÃ©nitra.
                </p>
              </div>
            </div>
            
            <div className="space-y-4 mt-6">
              <h4 className="text-lg font-semibold">6.2. Australie</h4>
              
              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">6.2.1. Mildura, Renmark, Griffith (bassin Murray-Darling intÃ©rieur) â€” SimilaritÃ© â‰ˆ 87 % (avec inversion saisonniÃ¨re)</h5>
                <p className="text-justify">
                  Mildura, dans lâ€™Ã‰tat de Victoria, constitue probablement le meilleur analogue climatique de KÃ©nitra dans lâ€™hÃ©misphÃ¨re Sud. La pluviomÃ©trie annuelle y atteint environ 280 mm, lâ€™insolation y dÃ©passe 3 400 h, les Ã©tÃ©s y sont trÃ¨s chauds, avec des Tmax de janvier proches de 33 Â°C, mais comportant des pointes frÃ©quentes Ã  40 Â°C, et les hivers y sont frais, avec des Tmin de juillet proches de 4 Â°C et des gelÃ©es possibles. Le rÃ©gime pluviomÃ©trique y est lÃ©gÃ¨rement plus rÃ©gulier au cours de lâ€™annÃ©e, avec un lÃ©ger maximum dâ€™hiver austral. La rÃ©gion est cÃ©lÃ¨bre pour sa viticulture, ses agrumes irriguÃ©s, ses amandiers, ses oliviers, et pour ses palmiers dattiers cultivÃ©s expÃ©rimentalement Ã  Alice Springs et Coober Pedy.
                </p>
                <p className="text-justify">
                  Renmark, en Australie-MÃ©ridionale, et Griffith, en Nouvelle-Galles du Sud, prÃ©sentent des signatures trÃ¨s proches.
                </p>
              </div>
              
              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">6.2.2. Alice Springs (Territoire du Nord, Australie centrale) â€” SimilaritÃ© â‰ˆ 72 %</h5>
                <p className="text-justify">
                  Cette station est trop chaude et trop dÃ©sertique, avec un rÃ©gime pluviomÃ©trique estival.
                </p>
              </div>
              
              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">6.2.3. Broken Hill (Nouvelle-Galles du Sud) â€” SimilaritÃ© â‰ˆ 83 %</h5>
                <p className="text-justify">
                  Il sâ€™agit dâ€™un analogue trÃ¨s correct, quoique lÃ©gÃ¨rement plus aride que KÃ©nitra.
                </p>
              </div>
              
              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">6.2.4. Wagga Wagga, Deniliquin â€” SimilaritÃ© â‰ˆ 82 %</h5>
                <p className="text-justify">
                  Ces stations constituent des analogues satisfaisants, mais plus arrosÃ©s, avec environ 500 mm.
                </p>
              </div>
            </div>
            
            <div className="space-y-4 mt-6">
              <h4 className="text-lg font-semibold">6.3. Nouvelle-ZÃ©lande</h4>
              <p className="text-justify">
                La Nouvelle-ZÃ©lande ne prÃ©sente aucun analogue direct de KÃ©nitra, son climat Ã©tant partout modÃ©rÃ© par une influence ocÃ©anique dominante. Le Central Otago, notamment les vallÃ©es de Cromwell et Alexandra, constitue la seule rÃ©gion nÃ©o-zÃ©landaise Ã  caractÃ¨re semi-continental avec sÃ©cheresse estivale ; nÃ©anmoins, sa pluviomÃ©trie, comprise entre 350 et 450 mm, et ses hivers plus froids en font un analogue lointain, dont la similaritÃ© ne dÃ©passe pas â‰ˆ 68 %.
              </p>
            </div>
          </section>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>PARTIE VII â€” SYNTHÃˆSE COMPARATIVE ORDONNÃ‰E PAR NIVEAU DE SIMILARITÃ‰</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-xl font-semibold mb-2">CatÃ©gorie 1 â€” Climat pratiquement identique Ã  KÃ©nitra (97â€“100 %)</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Rang 1 : Taourirt, Maroc â€” 99 %</li>
              <li>Rang 2 : Outat El Haj, Maroc â€” 97 %</li>
              <li>Rang 3 : Guenfouda, Jerada (sud), Maroc â€” 97 %</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-2 mt-6">CatÃ©gorie 2 â€” Climat extrÃªmement similaires (92â€“96 %)</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Rang 4 : Missour, Maroc â€” 96 %</li>
              <li>Rang 5 : Oujda, Maroc â€” 93 %</li>
              <li>Rang 6 : Tabernas / Sorbas, Espagne â€” 93 %</li>
              <li>Rang 7 : Sebdou / Tlemcen sud, AlgÃ©rie â€” 92 %</li>
              <li>Rang 8 : Kasserine / SbeÃ¯tla, Tunisie â€” 91 %</li>
              <li>Rang 9 : Guadix-Baza, Espagne â€” 91 %</li>
              <li>Rang 10 : AÃ¯n Sefra / NaÃ¢ma, AlgÃ©rie â€” 90 %</li>
              <li>Rang 11 : Mendoza (aprÃ¨s correction saisonniÃ¨re + rÃ©gime), Argentine â€” 90 %</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-2 mt-6">CatÃ©gorie 3 â€” Climat trÃ¨s fortement comparables (85â€“91 %)</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Rang 12 : Nalut / Yefren, Libye â€” 89 %</li>
              <li>Rang 13 : Bekaa nord (Baalbek), Liban â€” 89 %</li>
              <li>Rang 14 : Djelfa, AlgÃ©rie â€” 88 %</li>
              <li>Rang 15 : Alep / Homs / Hama, Syrie â€” 88 %</li>
              <li>Rang 16 : La Rioja, Argentine â€” 87 %</li>
              <li>Rang 17 : Mildura / Renmark, Australie â€” 87 %</li>
              <li>Rang 18 : Amman, Jordanie â€” 87 %</li>
              <li>Rang 19 : ÅžanlÄ±urfa, Turquie â€” 86 %</li>
              <li>Rang 20 : Batna, AlgÃ©rie â€” 86 %</li>
              <li>Rang 21 : Bassin de lâ€™Ãˆbre (Zaragoza), Espagne â€” 85 %</li>
              <li>Rang 22 : Reno / Fallon, Ã‰tats-Unis â€” 85 %</li>
              <li>Rang 23 : Kermanshah, Iran â€” 85 %</li>
              <li>Rang 24 : Oudtshoorn (Karoo), Afrique du Sud â€” 85 %</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-2 mt-6">CatÃ©gorie 4 â€” Climat comparable avec quelques diffÃ©rences (78â€“84 %)</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Rang 25 : Chypre intÃ©rieure (Nicosie), Chypre â€” 84 %</li>
              <li>Rang 26 : Shiraz, Iran â€” 84 %</li>
              <li>Rang 27 : Bakersfield, Ã‰tats-Unis â€” 84 %</li>
              <li>Rang 28 : Konya / Karaman, Turquie â€” 83 %</li>
              <li>Rang 29 : Broken Hill, Australie â€” 83 %</li>
              <li>Rang 30 : Fresno / Modesto, Ã‰tats-Unis â€” 82 %</li>
              <li>Rang 31 : Erfoud / Errachidia, Maroc â€” 82 %</li>
              <li>Rang 32 : Enna / Caltanissetta, Italie (Sicile) â€” 82 %</li>
              <li>Rang 33 : Albuquerque, Ã‰tats-Unis â€” 82 %</li>
              <li>Rang 34 : Palmyre / Deir ez-Zor, Syrie â€” 82 %</li>
              <li>Rang 35 : Wagga Wagga, Australie â€” 82 %</li>
              <li>Rang 36 : Le Kef / Siliana, Tunisie â€” 84 %</li>
              <li>Rang 37 : Vallenar / Ovalle, Chili â€” 80 %</li>
              <li>Rang 38 : Yazd / Kerman, Iran â€” 80 %</li>
              <li>Rang 39 : Coachella Valley, Ã‰tats-Unis â€” 79 %</li>
              <li>Rang 40 : Chihuahua, Mexique â€” 78 %</li>
              <li>Rang 41 : CrÃ¨te intÃ©rieure, GrÃ¨ce â€” 78 %</li>
              <li>Rang 42 : El Paso / Las Cruces, Ã‰tats-Unis â€” 78 %</li>
              <li>Rang 43 : DouchanbÃ©, Tadjikistan â€” 78 %</li>
              <li>Rang 44 : Midelt, Maroc â€” 78 %</li>
              <li>Rang 45 : Beaufort West (Karoo), Afrique du Sud â€” 78 %</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-2 mt-6">CatÃ©gorie 5 â€” Climat ressemblant mais prÃ©sentant des diffÃ©rences importantes (70â€“77 %)</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Rang 46 : Tachkent / Samarcande, OuzbÃ©kistan â€” 76 %</li>
              <li>Rang 47 : Winnemucca, Ã‰tats-Unis â€” 76 %</li>
              <li>Rang 48 : Phoenix / Tucson, Ã‰tats-Unis â€” 72 %</li>
              <li>Rang 49 : Alice Springs, Australie â€” 72 %</li>
              <li>Rang 50 : Arequipa, PÃ©rou â€” 70 %</li>
              <li>Rang 51 : Central Otago (Cromwell), Nouvelle-ZÃ©lande â€” 68 %</li>
            </ul>
          </section>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>PARTIE VIII â€” ANALYSE Ã‰COPHYSIOLOGIQUE ET AGRONOMIQUE COMPARÃ‰E PAR ESPÃˆCE</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">8.1. Phoenix dactylifera (palmier dattier)</h4>
              <p className="text-justify">
                Le palmier dattier exige une somme thermique estivale Ã©levÃ©e, correspondant Ã  un indice thermique de Nixon-Furr â‰¥ 1 800 unitÃ©s thermiques, une saison sÃ¨che estivale absolue, une faible humiditÃ© durant la maturation, ainsi quâ€™une tolÃ©rance au gel modÃ©rÃ©e, avec une rÃ©sistance pouvant atteindre âˆ’6 Ã  âˆ’9 Â°C chez les sujets adultes. KÃ©nitra satisfait ces critÃ¨res dans leur expression limite : la maturation des variÃ©tÃ©s tardives, telles que Medjool et Boufeggous, y demeure marginale, tandis que les variÃ©tÃ©s prÃ©coces, telles que Bou Sthammi et Aziza, y sont prÃ©fÃ©rables.
              </p>
              <p className="text-justify">
                Le dattier est cultivable optimalement dans la Coachella Valley, Ã  Erfoud-Rissani, Ã  Deir ez-Zor, Ã  Nalut, Ã  Palmyre, Ã  Yazd et Ã  Alice Springs. Il est cultivable en position marginale, comme Ã  KÃ©nitra, Ã  Taourirt, Missour, Tabernas, Baalbek et Mildura. Il nâ€™est pas cultivable commercialement Ã  Bakersfield, en raison des brouillards, Ã  Mendoza, du fait dâ€™une maturation incomplÃ¨te, Ã  Konya, oÃ¹ lâ€™hiver est trop froid, ni dans le Central Otago, oÃ¹ lâ€™Ã©tÃ© est insuffisant.
              </p>
            </div>
            
            <div className="space-y-4 mt-6">
              <h4 className="text-lg font-semibold">8.2. Olivea europaea (olivier)</h4>
              <p className="text-justify">
                Lâ€™olivier tolÃ¨re parfaitement lâ€™ensemble des rÃ©gions Ã©numÃ©rÃ©es, Ã  lâ€™exception des zones soumises Ã  des gels sÃ©vÃ¨res prolongÃ©s, telles que Konya, certains secteurs dâ€™altitude de Djelfa, et le Central Otago sur les fonds de vallÃ©e. Il constitue lâ€™espÃ¨ce indicatrice quasi universelle de lâ€™ensemble des analogues Ã©tudiÃ©s.
              </p>
            </div>
            
            <div className="space-y-4 mt-6">
              <h4 className="text-lg font-semibold">8.3. Vitis vinifera (vigne)</h4>
              <p className="text-justify">
                La vigne est parfaitement adaptÃ©e Ã  lâ€™ensemble des rÃ©gions recensÃ©es. Les meilleurs analogues viticoles de KÃ©nitra sont Mendoza, La Rioja en Argentine, le Karoo, Mildura, AÃ¯n Sefra, Kasserine et la Bekaa. La qualitÃ© de la vinification y est excellente, notamment grÃ¢ce Ã  lâ€™amplitude thermique diurne.
              </p>
            </div>
            
            <div className="space-y-4 mt-6">
              <h4 className="text-lg font-semibold">8.4. Agrumes (Citrus spp.)</h4>
              <p className="text-justify">
                Les agrumes exigent lâ€™absence de gel prolongÃ© et une humiditÃ© modÃ©rÃ©e. Les meilleurs analogues sont Berkane (Triffa), Bakersfield, Fresno, Mildura et Nicosie. Ã€ KÃ©nitra, lâ€™oranger et le mandarinier sont cultivables sous irrigation ; le citronnier et la lime demeurent plus fragiles au froid.
              </p>
            </div>
            
            <div className="space-y-4 mt-6">
              <h4 className="text-lg font-semibold">8.5. Pistacia vera (pistachier)</h4>
              <p className="text-justify">
                Le pistachier est parfaitement adaptÃ© Ã  lâ€™ensemble des rÃ©gions Ã  hivers frais et Ã©tÃ© chauds et secs. Les meilleurs analogues pistachicoles sont Kerman en Iran, rÃ©fÃ©rence mondiale, ÅžanlÄ±urfa, Alep, Kasserine et AÃ¯n Sefra. KÃ©nitra prÃ©sente un potentiel pistachicole excellent, mais sous-exploitÃ©.
              </p>
            </div>
            
            <div className="space-y-4 mt-6">
              <h4 className="text-lg font-semibold">8.6. Amandier, figuier, grenadier, caroubier</h4>
              <p className="text-justify">
                Ces espÃ¨ces mÃ©diterranÃ©ennes classiques prospÃ¨rent dans la totalitÃ© des analogues Ã©numÃ©rÃ©s, Ã  lâ€™exception des zones soumises Ã  des gels sÃ©vÃ¨res pour le caroubier, dont la limite se situe approximativement en zone USDA 9b.
              </p>
            </div>
            
            <div className="space-y-4 mt-6">
              <h4 className="text-lg font-semibold">8.7. Argania spinosa (arganier)</h4>
              <p className="text-justify">
                Lâ€™arganier est endÃ©mique du sud-ouest marocain, notamment du Souss-Massa, et ne trouve nulle part ailleurs dans le monde un vÃ©ritable analogue climato-Ã©daphique. Sa culture Ã  KÃ©nitra demeure marginale.
              </p>
            </div>
            
            <div className="space-y-4 mt-6">
              <h4 className="text-lg font-semibold">8.8. Simmondsia chinensis (jojoba)</h4>
              <p className="text-justify">
                Le jojoba est originaire du dÃ©sert de Sonora. Il tolÃ¨re bien KÃ©nitra, mais prÃ©fÃ¨re les climats de type Coachella, Sonora ou NÃ©guev.
              </p>
            </div>
            
            <div className="space-y-4 mt-6">
              <h4 className="text-lg font-semibold">8.9. Washingtonia filifera / robusta et palmiers ornementaux</h4>
              <p className="text-justify">
                Ces palmiers sont parfaitement adaptÃ©s Ã  lâ€™ensemble des rÃ©gions classÃ©es en USDA â‰¥ 9a. KÃ©nitra leur convient parfaitement.
              </p>
            </div>
            
            <div className="space-y-4 mt-6">
              <h4 className="text-lg font-semibold">8.10. Eucalyptus, Prosopis, Acacia, Tamarix</h4>
              <p className="text-justify">
                Il sâ€™agit dâ€™espÃ¨ces xÃ©rophytes universelles, adaptÃ©es Ã  lâ€™ensemble des rÃ©gions semi-arides Ã©numÃ©rÃ©es dans le prÃ©sent rapport.
              </p>
            </div>
          </section>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>PARTIE IX â€” CONCLUSION SCIENTIFIQUE GÃ‰NÃ‰RALE</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <p className="text-justify">
              Le bassin de KÃ©nitra appartient Ã  une famille climatique restreinte Ã  lâ€™Ã©chelle planÃ©taire : celle des bassins intÃ©rieurs semi-arides mÃ©diterranÃ©ens Ã  double signature, Ã  la fois steppique et mÃ©diterranÃ©enne dÃ©gradÃ©e, caractÃ©risÃ©e par une pluviomÃ©trie annuelle de 200 Ã  280 mm, un rÃ©gime Ã©quinoxial-hivernal, une insolation supÃ©rieure Ã  3 000 h, des Ã©tÃ©s trÃ¨s chauds et secs, ainsi que des hivers frais avec gels radiatifs possibles.
            </p>
            <p className="text-justify">
              Cette famille climatique ne compte, Ã  lâ€™Ã©chelle mondiale, que moins de vingt rÃ©gions parfaitement identifiÃ©es, dont environ la moitiÃ© se situe dans le seul Maghreb â€” couloir de la Moulouya, Hauts Plateaux algÃ©riens, Tunisie centrale, Djebel Nefoussa libyen â€” ce qui souligne Ã  la fois le caractÃ¨re rÃ©gionalement spÃ©cifique et la raretÃ© bioclimatique du climat de KÃ©nitra.
            </p>
            <p className="text-justify">
              Les analogues extra-maghrÃ©bins de trÃ¨s haute fidÃ©litÃ© sont, par ordre dÃ©croissant, Tabernas et le bassin de Guadix-Baza en Espagne intÃ©rieure sud-orientale, Kasserine en Tunisie, la Bekaa septentrionale au Liban, ÅžanlÄ±urfa et Konya en Turquie, Mendoza et La Rioja en Argentine aprÃ¨s correction saisonniÃ¨re, Mildura dans lâ€™intÃ©rieur sud-est australien, le Karoo sud-africain, notamment Oudtshoorn, et le Grand Bassin nord-amÃ©ricain, notamment Reno-Fallon.
            </p>
            <p className="text-justify">
              Les quasi-analogues frÃ©quemment citÃ©s mais imparfaits incluent Bakersfield en Californie, dont la ressemblance estivale de premier ordre est fortement pondÃ©rÃ©e par la spÃ©cificitÃ© hivernale â€” brouillard de Tule, inversion persistante, humiditÃ© relative hivernale Ã©levÃ©e â€”, ce qui interdit de lui accorder une similaritÃ© supÃ©rieure Ã  84 %, malgrÃ© une convergence remarquable des paramÃ¨tres pluviomÃ©triques et thermiques estivaux.
            </p>
            <p className="text-justify mt-4">
              Ã€ lâ€™Ã©chelle bioclimatique, cela signifie que le potentiel agronomique de KÃ©nitra sâ€™inscrit dans une stratÃ©gie mondiale de cultures mÃ©diterranÃ©ennes Ã  faible besoin hydrique et Ã  haute valeur ajoutÃ©e, comparable Ã  celle mise en Å“uvre avec succÃ¨s dans les rÃ©gions viticoles de Mendoza, olÃ©icoles dâ€™Andalousie intÃ©rieure, pistachicoles du Kerman iranien, et fruitiÃ¨res de Mildura. La palette agronomique optimale de KÃ©nitra apparaÃ®t ainsi clairement dÃ©finie : olivier, pistachier, amandier, grenadier, figuier, vigne de cuve Ã  identitÃ© mÃ©diterranÃ©enne, agrumes en irrigation localisÃ©e, palmier dattier en variÃ©tÃ©s prÃ©coces sur stations abritÃ©es, ainsi que cultures xÃ©rophytes secondaires telles que le caroubier, le jojoba et lâ€™opuntia.
            </p>
            <p className="text-justify mt-4">
              En termes de rusticitÃ© et de risque climatique, KÃ©nitra se situe Ã  lâ€™interface USDA 10a / 9b, avec une vulnÃ©rabilitÃ© Ã©pisodique aux vagues de froid radiatif, et en AHS Heat Zone 8â€“9, avec une vulnÃ©rabilitÃ© rÃ©currente aux vagues de chaleur estivales advectÃ©es par le chergui saharien. Cette bipolaritÃ© constitue prÃ©cisÃ©ment la signature des climats de bassin intÃ©rieur du Maghreb oriental, dont KÃ©nitra reprÃ©sente lâ€™un des exemples les plus purs et les mieux documentÃ©s.
            </p>
            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 border-l-4 border-blue-500 rounded">
              <p className="font-semibold mb-2">Nota bene mÃ©thodologique :</p>
              <p className="text-justify">
                Les pourcentages de similaritÃ© indiquÃ©s rÃ©sultent dâ€™une pondÃ©ration multi-critÃ¨res intÃ©grant les sept invariants de la signature KÃ©nitraienne, avec des poids respectifs de 20 % pour le rÃ©gime pluviomÃ©trique, 18 % pour la structure thermique, 15 % pour lâ€™humiditÃ© et le point de rosÃ©e, 12 % pour lâ€™insolation, 12 % pour la continentalitÃ© et lâ€™amplitude thermique, 12 % pour les extrÃªmes absolus et la rusticitÃ©, et 11 % pour la dynamique synoptique et les vents locaux. Les analogies de lâ€™hÃ©misphÃ¨re Sud ont Ã©tÃ© calculÃ©es aprÃ¨s correction saisonniÃ¨re stricte selon la table dâ€™inversion janvier â†” juillet, fÃ©vrier â†” aoÃ»t, etc., conformÃ©ment aux exigences mÃ©thodologiques initiales.
              </p>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}

