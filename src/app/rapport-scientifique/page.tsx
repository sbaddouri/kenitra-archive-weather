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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>PARTIE II â€” ANALOGUES CLIMATIQUES DU MAROC ET DU MAGHREB</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-xl font-semibold mb-2">Analogues nationaux et rÃ©gionaux</h3>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">2.1. CatÃ©gorie 1 â€” Climats pratiquement identiques (similaritÃ© 97â€“100 %)</h4>
              
              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">2.1.1. Taourirt (Province de Taourirt, RÃ©gion de lâ€™Oriental, Maroc) â€” SimilaritÃ© climatique â‰ˆ 99 %</h5>
                <p className="text-justify">
                  Taourirt, situÃ©e Ã  environ 55 km Ã  lâ€™est de KÃ©nitra, dans le mÃªme couloir de la basse Moulouya, Ã  une altitude comparable de 415 m, constitue de trÃ¨s loin lâ€™analogue le plus parfait de KÃ©nitra Ã  lâ€™Ã©chelle planÃ©taire. Les tempÃ©ratures moyennes annuelles y sont pratiquement identiques, 18,7 Â°C contre 18,9 Â°C, les prÃ©cipitations avoisinent 240 mm avec le mÃªme rÃ©gime Â« moulouyen Â» Ã  double maximum Ã©quinoxial, lâ€™insolation y dÃ©passe 3 100 h, lâ€™humiditÃ© relative estivale y chute Ã  38â€“40 %, et le chergui y souffle avec une violence comparable. Les rares diffÃ©rences observables tiennent Ã  une trÃ¨s lÃ©gÃ¨re majoration des prÃ©cipitations printaniÃ¨res Ã  Taourirt, du fait dâ€™une proximitÃ© un peu plus sensible des reliefs des Beni-Snassen, ainsi quâ€™Ã  des minimales hivernales lÃ©gÃ¨rement moins basses, sous lâ€™effet de lâ€™ouverture du couloir en direction de la MÃ©diterranÃ©e. Sur les plans botanique et agronomique, la totalitÃ© des espÃ¨ces cultivÃ©es Ã  KÃ©nitra â€” olivier, agrumes en irrigation, palmier dattier en bordure, vigne de cuve, grenadier, figuier, amandier, pistachier â€” y prÃ©sente un comportement rigoureusement identique. Le zonage USDA 10a est Ã©galement partagÃ©. Aucune diffÃ©rence agroclimatique significative nâ€™y est dÃ©celable.
                </p>
              </div>

              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">2.1.2. Missour (Province de Boulemane, plaine de la haute Moulouya) â€” SimilaritÃ© â‰ˆ 96 %</h5>
                <p className="text-justify">
                  Missour, situÃ©e Ã  environ 100 km au sud-sud-ouest de KÃ©nitra, dans la haute Moulouya Ã  900 m dâ€™altitude, prÃ©sente une signature trÃ¨s proche, bien que lÃ©gÃ¨rement plus continentalisÃ©e du fait de lâ€™altitude. Les prÃ©cipitations annuelles y sont sensiblement Ã©quivalentes, de lâ€™ordre de 195 Ã  220 mm, lâ€™insolation y dÃ©passe 3 100 h, mais les hivers y sont notablement plus rigoureux, avec une Tmin de janvier proche de 2 Â°C et des records pouvant descendre jusquâ€™Ã  âˆ’10 Â°C, tandis que les Ã©tÃ©s y sont lÃ©gÃ¨rement moins torrides, la Tmax de juillet se situant aux alentours de 35 Â°C. Les gelÃ©es y sont plus frÃ©quentes, de lâ€™ordre de 25 Ã  40 nuits par an, contre 15 Ã  20 Ã  KÃ©nitra, ce qui entraÃ®ne de vÃ©ritables consÃ©quences horticoles : le palmier dattier y demeure cultivable, mais avec un risque accru de brÃ»lures foliaires hivernales sur les jeunes feuilles ; les agrumes sensibles, tels que le citronnier et la lime, requiÃ¨rent une protection plus stricte. En revanche, la vigne, lâ€™amandier, le pistachier et lâ€™olivier y prospÃ¨rent de maniÃ¨re identique.
                </p>
              </div>

              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">2.1.3. Outat El Haj (Province de Boulemane) â€” SimilaritÃ© â‰ˆ 97 %</h5>
                <p className="text-justify">
                  Outat El Haj, dans la moyenne Moulouya Ã  environ 800 m dâ€™altitude, se rapproche de Missour tout en demeurant plus chaude que cette derniÃ¨re en Ã©tÃ©. Le rÃ©gime pluviomÃ©trique y est extrÃªmement proche de celui de KÃ©nitra, avec environ 220 mm annuels et un maximum printanier prononcÃ©. Les diffÃ©rences sont marginales et se limitent Ã  une insolation trÃ¨s lÃ©gÃ¨rement infÃ©rieure ainsi quâ€™Ã  des minimales hivernales plus basses dâ€™environ 1 Ã  2 Â°C. Le comportement des cultures y est identique Ã  celui observÃ© Ã  KÃ©nitra, avec un trÃ¨s lÃ©ger dÃ©savantage pour les agrumes prÃ©coces.
                </p>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <h4 className="text-lg font-semibold">2.2. CatÃ©gorie 2 â€” Climats extrÃªmement similaires (similaritÃ© 92â€“97 %)</h4>
              
              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">2.2.1. Oujda (chef-lieu de la RÃ©gion de lâ€™Oriental) â€” SimilaritÃ© â‰ˆ 93 %</h5>
                <p className="text-justify">
                  Oujda, Ã  470 m dâ€™altitude, est davantage ouverte aux influences mÃ©diterranÃ©ennes indirectes par le couloir Taourirtâ€“Oujda. La pluviomÃ©trie y est lÃ©gÃ¨rement supÃ©rieure, de lâ€™ordre de 330 mm, les Ã©tÃ©s y sont un peu moins secs et lÃ©gÃ¨rement moins torrides, avec une Tmax de juillet proche de 34 Â°C, mais la structure saisonniÃ¨re demeure trÃ¨s fidÃ¨le Ã  celle de KÃ©nitra. Du point de vue agronomique, Oujda autorise une agriculture pluviale un peu plus assurÃ©e, tout en conservant une palette culturale identique.
                </p>
              </div>

              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">2.2.2. Berkane et la plaine des Triffa â€” SimilaritÃ© â‰ˆ 88 %</h5>
                <p className="text-justify">
                  La plaine des Triffa, rÃ©putÃ©e pour son agrumiculture, est nettement plus arrosÃ©e, avec 350 Ã  400 mm annuels, et sensiblement plus douce en hiver du fait de la proximitÃ© mÃ©diterranÃ©enne. La comparaison nâ€™est vÃ©ritablement pertinente que pour la pÃ©riode estivale, au cours de laquelle les tempÃ©ratures maximales approchent celles de KÃ©nitra. La similaritÃ© globale demeure nÃ©anmoins limitÃ©e par lâ€™influence maritime.
                </p>
              </div>

              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">2.2.3. Midelt (Province de Midelt) â€” SimilaritÃ© â‰ˆ 78 %</h5>
                <p className="text-justify">
                  Midelt, Ã  1 500 m dâ€™altitude, prÃ©sente un climat semi-aride de haute altitude beaucoup plus rigoureux en hiver, avec une Tmin de janvier proche de âˆ’1 Â°C et 60 Ã  80 nuits de gel par an, mais des Ã©tÃ©s comparables en journÃ©e. Lâ€™analogie y demeure partielle et concerne principalement le rÃ©gime hydrique.
                </p>
              </div>

              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">2.2.4. Erfoud, Rissani, Errachidia (vallÃ©e du Ziz, prÃ©sahariens marocains) â€” SimilaritÃ© â‰ˆ 82 %</h5>
                <p className="text-justify">
                  Ces stations prÃ©sahariennes prÃ©sentent une pluviomÃ©trie plus faible encore, de lâ€™ordre de 100 Ã  130 mm, ainsi que des Ã©tÃ©s significativement plus chauds, avec des Tmax de juillet comprises entre 40 et 42 Â°C en moyenne. En revanche, leur rÃ©gime dâ€™ensoleillement, leur humiditÃ© et leur continentalitÃ© sont extrÃªmement voisins de ceux de KÃ©nitra. Il sâ€™agit dâ€™analogues Â« chauds Â» de KÃ©nitra, dÃ©calÃ©s vers lâ€™ariditÃ© dÃ©sertique. Le palmier dattier y trouve son optimum, alors quâ€™Ã  KÃ©nitra il vit Ã  la limite septentrionale de son domaine nord-africain.
                </p>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <h4 className="text-lg font-semibold">2.3. Analogues algÃ©riens (analogies trÃ¨s fortes Ã  parfaites)</h4>
              
              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">2.3.1. Tlemcen (versant sud) et Sebdou â€” SimilaritÃ© â‰ˆ 92 %</h5>
                <p className="text-justify">
                  Sur le versant sud des monts de Tlemcen, Ã  des altitudes comparables de 800 Ã  1 000 m, le climat devient trÃ¨s semblable Ã  celui de KÃ©nitra, avec une pluviomÃ©trie de 300 Ã  350 mm, un maximum Ã©quinoxial marquÃ©, des Ã©tÃ©s secs et chauds, et une continentalitÃ© comparable.
                </p>
              </div>

              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">2.3.2. AÃ¯n Sefra, NaÃ¢ma, MÃ©cheria (Hauts Plateaux occidentaux algÃ©riens) â€” SimilaritÃ© â‰ˆ 90 %</h5>
                <p className="text-justify">
                  Ces stations, situÃ©es entre 900 et 1 100 m sur les Hauts Plateaux algÃ©riens, prÃ©sentent une signature remarquablement proche de celle de KÃ©nitra, avec toutefois une continentalitÃ© accrue du fait de lâ€™altitude : hivers plus froids, avec Tmin de janvier de 0 Ã  2 Â°C et records atteignant âˆ’12 Â°C, Ã©tÃ©s trÃ¨s chauds et secs, avec Tmax de juillet de 35 Ã  37 Â°C, et pluviomÃ©trie de 180 Ã  250 mm Ã  rÃ©partition mars-avril-mai marquÃ©e. Il sâ€™agit de la Â« ceinture steppique Â» nord-africaine, dont KÃ©nitra constitue lâ€™extrÃ©mitÃ© occidentale.
                </p>
              </div>

              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">2.3.3. Djelfa, Laghouat, Bou SaÃ¢da (Hauts Plateaux centraux) â€” SimilaritÃ© â‰ˆ 87â€“91 %</h5>
                <p className="text-justify">
                  Djelfa, Ã  1 130 m, prÃ©sente une continentalitÃ© plus marquÃ©e, avec un record de âˆ’10,7 Â°C, tandis que Laghouat, plus mÃ©ridionale et situÃ©e Ã  750 m, tend davantage vers un climat aride chaud. La transition KÃ©nitra â†’ Djelfa â†’ Laghouat illustre parfaitement le gradient allant du semi-aride tempÃ©rÃ© vers le semi-aride dÃ©sertique.
                </p>
              </div>

              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">2.3.4. Batna, Khenchela, AÃ¯n BeÃ¯da (Hauts Plateaux orientaux) â€” SimilaritÃ© â‰ˆ 86 %</h5>
                <p className="text-justify">
                  Batna, Ã  1 040 m, est lÃ©gÃ¨rement plus fraÃ®che, avec une tempÃ©rature moyenne annuelle dâ€™environ 14 Â°C, et plus arrosÃ©e, avec environ 350 mm. Elle est donc moins analogue sur le plan thermique, mais demeure trÃ¨s analogue du point de vue hygromÃ©trique et de la structure saisonniÃ¨re.
                </p>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <h4 className="text-lg font-semibold">2.4. Analogues tunisiens et libyens</h4>
              
              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">2.4.1. Kasserine, SbeÃ¯tla, Gafsa (centre-ouest tunisien) â€” SimilaritÃ© â‰ˆ 91 %</h5>
                <p className="text-justify">
                  Kasserine, Ã  670 m, prÃ©sente environ 260 mm annuels, un rÃ©gime pluviomÃ©trique Ã  double maximum Ã©quinoxial, des Ã©tÃ©s trÃ¨s chauds, avec une Tmax de juillet de 36 Ã  37 Â°C, une humiditÃ© estivale basse, et une insolation supÃ©rieure Ã  3 000 h. Il sâ€™agit de lâ€™un des meilleurs analogues extra-marocains de KÃ©nitra. SbeÃ¯tla et Gafsa complÃ¨tent cet ensemble, avec une inflexion vers une ariditÃ© plus chaude dans le cas de Gafsa.
                </p>
              </div>

              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">2.4.2. Le Kef, Siliana (dorsale tunisienne intÃ©rieure) â€” SimilaritÃ© â‰ˆ 84 %</h5>
                <p className="text-justify">
                  Ces stations sont lÃ©gÃ¨rement plus arrosÃ©es, mais prÃ©sentent la mÃªme signature thermique.
                </p>
              </div>

              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">2.4.3. Nalut, Yefren (Djebel Nefoussa libyen) â€” SimilaritÃ© â‰ˆ 89 %</h5>
                <p className="text-justify">
                  Le Djebel Nefoussa, entre 700 et 900 m dâ€™altitude, prÃ©sente une combinatoire climatique remarquablement proche de celle de KÃ©nitra : 200 Ã  280 mm annuels, une insolation supÃ©rieure Ã  3 200 h, des Ã©tÃ©s trÃ¨s chauds, et des hivers frais oÃ¹ des gelÃ©es demeurent possibles.
                </p>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>PARTIE III â€” ANALOGUES DU BASSIN MÃ‰DITERRANÃ‰EN NORD</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-xl font-semibold mb-2">3.1. Analogues ibÃ©riques</h3>
            
            <div className="space-y-4">
              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">3.1.1. AlmerÃ­a intÃ©rieure â€” Tabernas, Sorbas, GÃ¡dor, NÃ­jar â€” SimilaritÃ© â‰ˆ 93 %</h5>
                <p className="text-justify">
                  Le dÃ©sert de Tabernas et les bassins intÃ©rieurs dâ€™AlmerÃ­a constituent, Ã  lâ€™Ã©chelle europÃ©enne, lâ€™analogue le plus fidÃ¨le du bassin de KÃ©nitra. Tabernas, Ã  400 m, reÃ§oit environ 235 mm annuels, prÃ©sente un rÃ©gime pluviomÃ©trique Ã  maximum Ã©quinoxial, notamment en octobre-novembre et mars-avril, une insolation supÃ©rieure Ã  3 000 h, des Ã©tÃ©s trÃ¨s chauds, avec une Tmax de juillet proche de 34 Â°C, et des hivers frais marquÃ©s par des gelÃ©es occasionnelles, le record sâ€™Ã©tablissant autour de âˆ’6 Â°C. La diffÃ©rence essentielle rÃ©side dans la proximitÃ© maritime plus immÃ©diate, qui attÃ©nue lÃ©gÃ¨rement les extrÃªmes hivernaux et modÃ¨re les canicules estivales par lâ€™advection des brises. Dâ€™un point de vue botanique, la palette culturale y est rigoureusement identique : olivier, amandier, figuier, grenadier, pistachier, jojoba introduit expÃ©rimentalement, agave, opuntia. Le palmier dattier y fructifie dans les microstations abritÃ©es de la rÃ©gion Elcheâ€“AlmerÃ­a, ce qui correspond Ã©galement Ã  la situation de KÃ©nitra.
                </p>
              </div>

              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">3.1.2. Bassin du Guadix-Baza (Grenade intÃ©rieure) â€” SimilaritÃ© â‰ˆ 91 %</h5>
                <p className="text-justify">
                  Ce bassin intramontagnard, situÃ© Ã  environ 900 m dâ€™altitude, en position dâ€™abri pluviomÃ©trique derriÃ¨re les sierras BÃ©ticas, prÃ©sente 250 Ã  320 mm annuels, une continentalitÃ© marquÃ©e, avec un record de âˆ’14 Â°C Ã  Baza, des Ã©tÃ©s trÃ¨s chauds, et une signature dâ€™inversion thermique hivernale caractÃ©ristique. Il sâ€™agit dâ€™un analogue Â« altitudinal Â» de KÃ©nitra, dotÃ© dâ€™un hiver plus rigoureux.
                </p>
              </div>

              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">3.1.3. Bassin de lâ€™Ãˆbre intÃ©rieur â€” Zaragoza, Bardenas Reales, Monegros â€” SimilaritÃ© â‰ˆ 85 %</h5>
                <p className="text-justify">
                  Ces rÃ©gions prÃ©sentent 280 Ã  350 mm annuels, un climat semi-aride continentalisÃ© de type BSk, mais avec des hivers nettement plus froids, Tmin de janvier proche de 2 Â°C, et 40 Ã  60 nuits de gel par an, une signature pluviomÃ©trique Ã©quinoxiale et des Ã©tÃ©s trÃ¨s chauds. Les Bardenas Reales et les Monegros constituent le dÃ©sert semi-aride ibÃ©rique, avec un rÃ©gime dâ€™inversion thermique hivernale rappelant celui de la VallÃ©e Centrale de Californie.
                </p>
              </div>

              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">3.1.4. Fraga, Lleida, plaine centrale catalane â€” SimilaritÃ© â‰ˆ 79 %</h5>
                <p className="text-justify">
                  Lâ€™analogie y demeure partielle, limitÃ©e par une humiditÃ© hivernale plus forte et par la frÃ©quence de brouillards persistants.
                </p>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <h3 className="text-xl font-semibold mb-2">3.2. Analogues italiens et grecs</h3>
              
              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">3.2.1. Sicile intÃ©rieure â€” Enna, Caltanissetta, Piazza Armerina â€” SimilaritÃ© â‰ˆ 82 %</h5>
                <p className="text-justify">
                  Lâ€™intÃ©rieur sicilien dâ€™altitude prÃ©sente des Ã©tÃ©s trÃ¨s chauds et secs, mais des hivers plus humides, ainsi quâ€™une pluviomÃ©trie annuelle sensiblement plus Ã©levÃ©e, de lâ€™ordre de 500 Ã  700 mm, ce qui rÃ©duit lâ€™analogie hydrique.
                </p>
              </div>

              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">3.2.2. CrÃ¨te intÃ©rieure â€” SimilaritÃ© â‰ˆ 78 %</h5>
                <p className="text-justify">
                  Lâ€™analogie y demeure partielle.
                </p>
              </div>

              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">3.2.3. Chypre intÃ©rieure â€” Nicosie, Athienou â€” SimilaritÃ© â‰ˆ 84 %</h5>
                <p className="text-justify">
                  Nicosie prÃ©sente environ 320 mm annuels, une saison sÃ¨che estivale marquÃ©e, une insolation Ã©levÃ©e, mais des hivers plus doux et plus humides.
                </p>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <h3 className="text-xl font-semibold mb-2">3.3. Analogues turcs</h3>
              
              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">3.3.1. Konya, KarapÄ±nar, Karaman (plateau anatolien central intÃ©rieur) â€” SimilaritÃ© â‰ˆ 83 %</h5>
                <p className="text-justify">
                  Konya, Ã  1 020 m, reÃ§oit environ 320 mm annuels avec un rÃ©gime Ã©quinoxial. La continentalitÃ© y est toutefois beaucoup plus marquÃ©e quâ€™Ã  KÃ©nitra, avec une Tmin de janvier proche de âˆ’4 Â°C et des records atteignant âˆ’26 Â°C, de sorte que lâ€™analogie est surtout estivale et hygromÃ©trique.
                </p>
              </div>

              <div className="space-y-3 ml-4">
                <h5 className="font-semibold">3.3.2. ÅžanlÄ±urfa, Mardin, DiyarbakÄ±r (Anatolie du Sud-Est) â€” SimilaritÃ© â‰ˆ 86 %</h5>
                <p className="text-justify">
                  ÅžanlÄ±urfa, Ã  550 m, reÃ§oit environ 460 mm, mais prÃ©sente des Ã©tÃ©s extrÃªmement chauds, avec une Tmax de juillet voisine de 39 Â°C, et un rÃ©gime pluviomÃ©trique concentrÃ© sur lâ€™hiver et le printemps. Lâ€™analogie estivale y est trÃ¨s forte, lâ€™analogie hivernale sensiblement moins satisfaisante, les hivers Ã©tant plus rigoureux.
                </p>
              </div>
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

