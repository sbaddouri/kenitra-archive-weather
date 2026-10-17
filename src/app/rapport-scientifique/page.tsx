"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WeatherCountdown from '@/components/weather-countdown';
import { useTheme } from 'next-themes';

// ============================================================
// Traduction fid�le des plages de couleurs de
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

// Calcule la couleur de texte optimale (noir ou blanc) selon la luminosit� du fond
// et le th�me actif, pour rester lisible en mode clair comme en mode sombre
function contrastTextColor(hexBg: string, theme: string): string {
  const r = parseInt(hexBg.substring(0, 2), 16);
  const g = parseInt(hexBg.substring(2, 4), 16);
  const b = parseInt(hexBg.substring(4, 6), 16);
  // Luminance relative (formule W3C)
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  // En mode sombre, on abaisse l�g�rement le seuil pour privil�gier le texte clair
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

// Mapping de fonction de couleur par nom de ligne (param�tre)
function colorForRow(param: string, val: number | null): React.CSSProperties {
  const tempRows = [
    'Record haut �C', 'Moyenne des maxima �C', 'Moyenne des maximales �C',
    'Moyenne journali�re �C', 'Moyenne des minimales �C', 'Moyenne des minima �C',
    'Record bas �C', 'Point de ros�e �C',
  ];
  if (tempRows.includes(param)) return temperatureColor(val);
  if (param === 'Pr�cipitations mm') return precipitationColor(val);
  if (param.startsWith('Jours')) return daysColor(val);
  if (param === 'Humidit� relative %') return humidityColor(val);
  if (param.startsWith('Ensoleillement')) return sunshineColor(val);
  return formatLine('FFFFFF', '000000');
}

// Extrait le premier nombre d'une cha�ne (remplace la virgule d�cimale par un point)
// Retourne null si aucun nombre n'est trouvable (ex: "�", "47,7 (ao�t)")
function parseNum(s: string): number | null {
  const normalized = s.replace(/,/g, '.').replace(/-/g, '-');
  const m = normalized.match(/-?\d+(?:\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
}

// Calcule le style de cellule � partir du libell� de ligne et de la valeur texte
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
        <h1 className="text-3xl font-bold">RAPPORT SCIENTIFIQUE DE CLIMATOLOGIE COMPAR�E MONDIALE</h1>
        <div className="space-y-2 text-lg">
          <h2 className="text-xl font-semibold">Analogues climatiques plan�taires de la ville de K�nitra et de la plaine du Gharb</h2>
          <p>R�gion Rabat-Sal�-K�nitra, Royaume du Maroc � Province de K�nitra</p>
          <p>�tude bioclimatique, agroclimatique, �cophysiologique et biog�ographique exhaustive</p>
          <p>Auteur du rapport : Cabinet international de climatologie compar�e</p>
          <p>Objet : Identification exhaustive des analogues climatiques mondiaux de la station de K�nitra (34�15' N, 6�35' O, ~26 m ; station synoptique 34�18' N, 6�36' O, 5 m, indicatif OMM 60120 / GMMY)</p>
          <p>M�thodologie : Comparaison multi-classificatoire (K�ppen-Geiger, Trewartha, Emberger, De Martonne, UNEP, USDA, AHS), analyse multi-param�trique, correction saisonni�re h�misph�rique, analyse �cophysiologique par esp�ce indicatrice.</p>
          <p>Longueur : Rapport int�gral non abr�g�.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>PARTIE I � CADRE M�THODOLOGIQUE ET DIAGNOSTIC CLIMATIQUE DE R�F�RENCE</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-xl font-semibold mb-2">1.1. Identification g�ographique et positionnement climatique</h3>
            <p className="text-justify space-y-2">
              K�nitra (34�15' N, 6�35' O, altitude 26 m ; station synoptique � 5 m) est situ�e sur la rive sud de l'oued Sebou, � 12 km de son embouchure atlantique, au niveau de Mehdia, dans la r�gion administrative de Rabat-Sal�-K�nitra. Elle occupe le c�ur de la plaine du Gharb, vaste bassin s�dimentaire de plus de 6 000 km� drain� par le bas Sebou et le Beht. Le Sebou, qui prend sa source dans le Moyen Atlas � 2 030 m sous le nom d'oued Guigou, parcourt environ 500 km, draine pr�s de 40 000 km� et produit � lui seul pr�s du tiers des eaux de surface du Maroc ; ses apports moyens interannuels atteignent 5 170 Mm�.
            </p>
            <p className="text-justify space-y-2">
              Trois �l�ments structurants commandent le climat : (i) la proximit� imm�diate de l'oc�an Atlantique (5 � 12 km), qui impose une r�gulation thermique et hygrom�trique permanente ; (ii) la faible altitude et la topographie ouverte de la plaine, qui laisse p�n�trer librement les flux oc�aniques de secteur nord � nord-ouest ; (iii) l'anticyclone des A�ores, qui, en �t�, bloque les perturbations atlantiques et provoque la s�cheresse estivale, tout en g�n�rant les brouillards et stratus c�tiers caract�ristiques du littoral atlantique marocain.
            </p>
            <p className="text-justify space-y-2">
              Cons�quence imm�diate : le climat de K�nitra n'est pas celui de l'int�rieur du Maroc semi-aride (Guercif, Oujda, Mekn�s). C'est un climat m�diterran�en � tr�s forte influence oc�anique � une nuance fondamentale que le reste de ce rapport va quantifier.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">1.2. Les sept invariants de la � signature k�nitrienne �</h3>
            <p className="text-justify space-y-2">
              L'analyse comparative ne saurait se r�duire � l'alignement des moyennes annuelles. La signature climatique de K�nitra proc�de d'une combinatoire sp�cifique, qualifiable de � signature k�nitrienne �, qui repose sur sept invariants :
            </p>
            <ul className="list-disc list-inside space-y-4 ml-4">
              <li className="text-justify">
                Pluviom�trie annuelle de 540 � 720 mm, avec un maximum automnal-hivernal tr�s marqu� (novembre = 94 mm) et une s�cheresse estivale quasi absolue (juin-ao�t &le; 10 mm). Octobre-mars totalise 451 mm, soit 79,0 % du total annuel ; avril-septembre ne re�oit que 120 mm.
              </li>
              <li className="text-justify">
                Saison s�che estivale s�v�re de cinq mois : selon le crit�re de Walter-Lieth (P &lt; 2T), mai, juin, juillet, ao�t et septembre sont secs ; selon l'indice mensuel de De Martonne (I &lt; 10), juin, juillet, ao�t et septembre sont arides.
              </li>
              <li className="text-justify">
                �t� chaud mais temp�r� par l'oc�an : mois le plus chaud = ao�t (moyenne 24,7 �C ; moyenne des maximales 28,7 �C). La moyenne des maxima annuelle n'atteint que 36,9 �C � loin des 42,2 �C de Guercif. Aucune torridit� structurelle.
              </li>
              <li className="text-justify">
                Hiver doux, pratiquement sans gel : janvier = 13,2 �C de moyenne, 9,2 �C de moyenne des minimales ; la moyenne des minima annuels s'�tablit � 5,29 �C (USDA 11a), et le gel n'appara�t qu'�pisodiquement lors de d�crochages radiatifs (record -1,1 �C dans ce tableau, -3,0 �C dans les normales OMM).
              </li>
              <li className="text-justify">
                Ensoleillement annuel de 3 000 � 3 110 heures, soit ~70 % du potentiel h�liom�trique � �lev�, mais nettement inf�rieur aux 3 400-3 600 h de l'int�rieur (Sacramento, Fresno, S�ville) � cause des stratus et brouillards c�tiers estivaux et des brouillards radiatifs hivernaux.
              </li>
              <li className="text-justify">
                Humidit� relative �lev�e (76 % en moyenne annuelle) et point de ros�e �lev� (13,7 �C en moyenne ; 18,7 �C en ao�t) : l'�t� k�nitrien est � lourd �, et non � sec �. WeatherSpark rel�ve en ao�t 18,9 jours � moites ou pires � et d�crit des �t�s � arides, moites (muggy), majoritairement clairs �. C'est l'invariant le plus discriminant de la signature k�nitrienne.
              </li>
              <li className="text-justify">
                Continentalit� tr�s faible : amplitude annuelle des moyennes de seulement 11,5 �C, indice de continentalit� de Gorczynski k � 14,0 (climat franchement maritime) ; vent dominant de secteur nord, avec un maximum de vitesse en avril (9,4 mph) et un minimum en septembre (7,7 mph).
              </li>
            </ul>
            <p className="text-justify mt-4">
              Toute r�gion du monde ne satisfaisant pas simultan�ment ces sept invariants doit �tre exclue de la cat�gorie des � climats quasi identiques �. Ce filtre exclut d'embl�e : (a) les analogues continentaux semi-arides (Guercif, Bakersfield, Madrid, Zaragoza) dont l'amplitude annuelle d�passe 18-20 �C et l'humidit� tombe sous 60 % ; (b) les analogues d�sertiques chauds (Almer�a, Coachella, Errachidia) ; (c) les analogues oc�aniques frais sans s�cheresse estivale (Monterey, Auckland, Biarritz), dont la s�cheresse estivale est absente ou insignifiante.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">1.3. Tableau climatique de r�f�rence � K�nitra</h3>
            <p className="text-justify mb-4">
              Le tableau fourni (normales et extr�mes 1940-2025, ensoleillement 1981-2010, jours de pluie 1961-1990) est reproduit ci-dessous, accompagn� d'une colonne de contr�le issue des normales officielles OMM 1991-2020 de la m�me station.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-max text-sm border-collapse border border-gray-300">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    <th className="border border-gray-300 px-2 py-1 font-semibold text-left sticky left-0 bg-gray-100 z-20">Param�tre</th>
                    <th className="border border-gray-300 px-2 py-1 font-semibold text-center">Jan</th>
                    <th className="border border-gray-300 px-2 py-1 font-semibold text-center">F�v</th>
                    <th className="border border-gray-300 px-2 py-1 font-semibold text-center">Mar</th>
                    <th className="border border-gray-300 px-2 py-1 font-semibold text-center">Avr</th>
                    <th className="border border-gray-300 px-2 py-1 font-semibold text-center">Mai</th>
                    <th className="border border-gray-300 px-2 py-1 font-semibold text-center">Jun</th>
                    <th className="border border-gray-300 px-2 py-1 font-semibold text-center">Jul</th>
                    <th className="border border-gray-300 px-2 py-1 font-semibold text-center">Ao�</th>
                    <th className="border border-gray-300 px-2 py-1 font-semibold text-center">Sep</th>
                    <th className="border border-gray-300 px-2 py-1 font-semibold text-center">Oct</th>
                    <th className="border border-gray-300 px-2 py-1 font-semibold text-center">Nov</th>
                    <th className="border border-gray-300 px-2 py-1 font-semibold text-center">D�c</th>
                    <th className="border border-gray-300 px-2 py-1 font-semibold text-center">Ann�e</th>
                    <th className="border border-gray-300 px-2 py-1 font-semibold text-center">OMM 91-20</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="border border-gray-300 px-2 py-1 font-medium sticky left-0 bg-white z-10">Record haut �C</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record haut �C', '27,6')}>27,6</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record haut �C', '30,5')}>30,5</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record haut �C', '35,5')}>35,5</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record haut �C', '38,1')}>38,1</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record haut �C', '45,3')}>45,3</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record haut �C', '45,6')}>45,6</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record haut �C', '48,0')}>48,0</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record haut �C', '47,2')}>47,2</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record haut �C', '43,3')}>43,3</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record haut �C', '39,5')}>39,5</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record haut �C', '33,9')}>33,9</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record haut �C', '28,5')}>28,5</td>
                    <td className="border border-gray-300 px-2 py-1 text-center font-semibold" style={cs('Record haut �C', '48,0')}>48,0</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record haut �C', '47,7 (ao�t)')}>47,7 (ao�t)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-2 py-1 font-medium sticky left-0 bg-gray-50 z-10">Moyenne des maxima �C</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maxima �C', '21,5')}>21,5</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maxima �C', '23,7')}>23,7</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maxima �C', '26,9')}>26,9</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maxima �C', '28,8')}>28,8</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maxima �C', '31,6')}>31,6</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maxima �C', '34,8')}>34,8</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maxima �C', '34,9')}>34,9</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maxima �C', '35,0')}>35,0</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maxima �C', '32,8')}>32,8</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maxima �C', '30,8')}>30,8</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maxima �C', '26,3')}>26,3</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maxima �C', '21,9')}>21,9</td>
                    <td className="border border-gray-300 px-2 py-1 text-center font-semibold" style={cs('Moyenne des maxima �C', '36,90')}>36,90</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maxima �C', '�')}>�</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border border-gray-300 px-2 py-1 font-medium sticky left-0 bg-white z-10">Moyenne des maximales �C</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maximales �C', '17,1')}>17,1</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maximales �C', '18,8')}>18,8</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maximales �C', '19,8')}>19,8</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maximales �C', '21,1')}>21,1</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maximales �C', '23,7')}>23,7</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maximales �C', '25,2')}>25,2</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maximales �C', '27,9')}>27,9</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maximales �C', '28,7')}>28,7</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maximales �C', '26,1')}>26,1</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maximales �C', '24,9')}>24,9</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maximales �C', '21,6')}>21,6</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maximales �C', '18,4')}>18,4</td>
                    <td className="border border-gray-300 px-2 py-1 text-center font-semibold" style={cs('Moyenne des maximales �C', '22,8')}>22,8</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des maximales �C', '23,5')}>23,5</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-2 py-1 font-medium sticky left-0 bg-gray-50 z-10">Moyenne journali�re �C</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne journali�re �C', '13,2')}>13,2</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne journali�re �C', '14,2')}>14,2</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne journali�re �C', '15,2')}>15,2</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne journali�re �C', '16,8')}>16,8</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne journali�re �C', '19,3')}>19,3</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne journali�re �C', '21,3')}>21,3</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne journali�re �C', '23,8')}>23,8</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne journali�re �C', '24,7')}>24,7</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne journali�re �C', '22,4')}>22,4</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne journali�re �C', '20,3')}>20,3</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne journali�re �C', '17,2')}>17,2</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne journali�re �C', '14,4/13,2')}>14,4/13,2</td>
                    <td className="border border-gray-300 px-2 py-1 text-center font-semibold" style={cs('Moyenne journali�re �C', '18,6')}>18,6</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne journali�re �C', '18,4')}>18,4</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border border-gray-300 px-2 py-1 font-medium sticky left-0 bg-white z-10">Moyenne des minimales �C</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minimales �C', '9,2')}>9,2</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minimales �C', '9,5')}>9,5</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minimales �C', '10,5')}>10,5</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minimales �C', '12,5')}>12,5</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minimales �C', '14,9')}>14,9</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minimales �C', '17,3')}>17,3</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minimales �C', '19,6')}>19,6</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minimales �C', '20,6')}>20,6</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minimales �C', '18,6')}>18,6</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minimales �C', '15,6')}>15,6</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minimales �C', '12,8')}>12,8</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minimales �C', '10,4')}>10,4</td>
                    <td className="border border-gray-300 px-2 py-1 text-center font-semibold" style={cs('Moyenne des minimales �C', '14,3')}>14,3</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minimales �C', '13,4')}>13,4</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-2 py-1 font-medium sticky left-0 bg-gray-50 z-10">Moyenne des minima �C</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minima �C', '5,0')}>5,0</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minima �C', '6,2')}>6,2</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minima �C', '7,6')}>7,6</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minima �C', '9,7')}>9,7</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minima �C', '11,3')}>11,3</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minima �C', '15,1')}>15,1</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minima �C', '16,4')}>16,4</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minima �C', '16,9')}>16,9</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minima �C', '15,8')}>15,8</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minima �C', '13,0')}>13,0</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minima �C', '8,7')}>8,7</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minima �C', '6,6')}>6,6</td>
                    <td className="border border-gray-300 px-2 py-1 text-center font-semibold" style={cs('Moyenne des minima �C', '5,29')}>5,29</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Moyenne des minima �C', '�')}>�</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border border-gray-300 px-2 py-1 font-medium sticky left-0 bg-white z-10">Record bas �C</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record bas �C', '-1,1')}>-1,1</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record bas �C', '-0,8')}>-0,8</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record bas �C', '2,9')}>2,9</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record bas �C', '5,7')}>5,7</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record bas �C', '6,9')}>6,9</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record bas �C', '10,9')}>10,9</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record bas �C', '12,5')}>12,5</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record bas �C', '13,3')}>13,3</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record bas �C', '10,8')}>10,8</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record bas �C', '7,4')}>7,4</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record bas �C', '2,9')}>2,9</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record bas �C', '0,9')}>0,9</td>
                    <td className="border border-gray-300 px-2 py-1 text-center font-semibold" style={cs('Record bas �C', '-1,1')}>-1,1</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Record bas �C', '-3,0 (f�v)')}>-3,0 (f�v)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-2 py-1 font-medium sticky left-0 bg-gray-50 z-10">Pr�cipitations mm</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Pr�cipitations mm', '82')}>82</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Pr�cipitations mm', '64')}>64</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Pr�cipitations mm', '63')}>63</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Pr�cipitations mm', '57')}>57</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Pr�cipitations mm', '32')}>32</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Pr�cipitations mm', '8')}>8</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Pr�cipitations mm', '1')}>1</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Pr�cipitations mm', '1')}>1</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Pr�cipitations mm', '21')}>21</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Pr�cipitations mm', '63')}>63</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Pr�cipitations mm', '94')}>94</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Pr�cipitations mm', '85')}>85</td>
                    <td className="border border-gray-300 px-2 py-1 text-center font-semibold" style={cs('Pr�cipitations mm', '571')}>571</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Pr�cipitations mm', '539,5')}>539,5</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border border-gray-300 px-2 py-1 font-medium sticky left-0 bg-white z-10">Jours de pr�cip. =1 mm</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de pr�cip. =1 mm', '6')}>6</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de pr�cip. =1 mm', '6')}>6</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de pr�cip. =1 mm', '5')}>5</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de pr�cip. =1 mm', '6')}>6</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de pr�cip. =1 mm', '4')}>4</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de pr�cip. =1 mm', '1')}>1</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de pr�cip. =1 mm', '0')}>0</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de pr�cip. =1 mm', '0')}>0</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de pr�cip. =1 mm', '3')}>3</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de pr�cip. =1 mm', '5')}>5</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de pr�cip. =1 mm', '7')}>7</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de pr�cip. =1 mm', '7')}>7</td>
                    <td className="border border-gray-300 px-2 py-1 text-center font-semibold" style={cs('Jours de pr�cip. =1 mm', '50')}>50</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de pr�cip. =1 mm', '52,6')}>52,6</td>
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
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Jours de pluie', '�')}>�</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border border-gray-300 px-2 py-1 font-medium sticky left-0 bg-white z-10">Humidit� relative %</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Humidit� relative %', '80')}>80</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Humidit� relative %', '77')}>77</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Humidit� relative %', '75')}>75</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Humidit� relative %', '75')}>75</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Humidit� relative %', '72')}>72</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Humidit� relative %', '73')}>73</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Humidit� relative %', '75')}>75</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Humidit� relative %', '76')}>76</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Humidit� relative %', '76')}>76</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Humidit� relative %', '78')}>78</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Humidit� relative %', '77')}>77</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Humidit� relative %', '78')}>78</td>
                    <td className="border border-gray-300 px-2 py-1 text-center font-semibold" style={cs('Humidit� relative %', '76')}>76</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Humidit� relative %', '�')}>�</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-2 py-1 font-medium sticky left-0 bg-gray-50 z-10">Point de ros�e �C</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Point de ros�e �C', '9,38')}>9,38</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Point de ros�e �C', '9,74')}>9,74</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Point de ros�e �C', '10,77')}>10,77</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Point de ros�e �C', '11,76')}>11,76</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Point de ros�e �C', '13,61')}>13,61</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Point de ros�e �C', '16,08')}>16,08</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Point de ros�e �C', '17,96')}>17,96</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Point de ros�e �C', '18,68')}>18,68</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Point de ros�e �C', '17,81')}>17,81</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Point de ros�e �C', '15,52')}>15,52</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Point de ros�e �C', '12,50')}>12,50</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Point de ros�e �C', '10,37')}>10,37</td>
                    <td className="border border-gray-300 px-2 py-1 text-center font-semibold" style={cs('Point de ros�e �C', '13,68 (table : 8,4)')}>13,68 (table : 8,4)</td>
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('Point de ros�e �C', '�')}>�</td>
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
                    <td className="border border-gray-300 px-2 py-1 text-center" style={cs('% ensoleillement possible', '�')}>�</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-justify mt-4 text-sm">
              <strong>Valeurs d�riv�es (calcul�es) :</strong> moyenne des maximales annuelle = 22,8 �C ; moyenne des minimales = 14,3 �C ; amplitude diurne moyenne = 8,5 �C (7,5 � 9,3 �C) ; amplitude annuelle des moyennes = 11,5 �C ; amplitude absolue = 49,1 �C.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">1.4. Contr�le qualit� et anomalies d�tect�es dans le tableau source</h3>
            <p className="text-justify space-y-2">
              Conform�ment au mandat d'audit scientifique, six anomalies ou points de vigilance ont �t� identifi�s dans le tableau fourni. Aucune donn�e n'a �t� modifi�e silencieusement ; les valeurs litigieuses sont signal�es.
            </p>
            <p className="text-justify space-y-2">
              <strong>A1 � Point de ros�e annuel incoh�rent (anomalie majeure).</strong> Le tableau indique un point de ros�e annuel de 8,4 �C. Or le minimum mensuel est de 9,38 �C (janvier) : une moyenne annuelle ne peut �tre inf�rieure � toutes ses composantes mensuelles. La moyenne arithm�tique correcte des douze valeurs mensuelles est 13,68 �C. La valeur 8,4 �C correspond exactement au point de ros�e annuel de Guercif figurant dans le rapport-mod�le : il s'agit donc, selon toute vraisemblance, d'une erreur de recopie depuis le tableau de Guercif. Valeur retenue dans cette �tude : 13,7 �C (recalcul�e), avec v�rification ind�pendante par la formule de Magnus � partir de T et de HR (moyenne annuelle recalcul�e = 14,2 �C, soit un �cart moyen de +0,56 �C par rapport aux valeurs mensuelles du tableau, acceptable pour des p�riodes de r�f�rence diff�rentes).
            </p>
            <p className="text-justify space-y-2">
              <strong>A2 � Records absolus non sourc�s (vigilance).</strong> Le tableau annonce un record de chaleur de 48,0 �C en juillet et un record de froid de -1,1 �C en janvier, sur une p�riode � 1940-2025 �. Les normales OMM 1991-2020 de la m�me station donnent un record de 47,7 �C en ao�t et un record de froid de -3,0 �C en f�vrier. Les deux s�ries divergent de 0,3 �C sur le maximum et de 1,9 �C sur le minimum. Ces records doivent �tre confirm�s sur les registres de la Direction G�n�rale de la M�t�orologie (DGM) : les valeurs de 2023-2025 (vagues de chaleur marocaines ayant d�pass� 48 �C) peuvent l�gitimement expliquer le rel�vement du record haut, mais aucune source primaire n'a pu �tre consult�e pour le record bas. Ils sont utilis�s ici comme valeurs du tableau fourni, avec r�serve explicite.
            </p>
            <p className="text-justify space-y-2">
              <strong>A3 � H�t�rog�n�it� des p�riodes de r�f�rence (vigilance m�thodologique).</strong> Le tableau est un composite : extr�mes 1940-2025, normales thermiques et pluviom�triques sur une p�riode longue non sp�cifi�e, ensoleillement 1981-2010, jours de pluie 1961-1990. La comparaison avec les normales OMM 1991-2020 montre des �carts coh�rents avec le r�chauffement r�cent : +0,2 �C sur la temp�rature moyenne (18,6 vs 18,4 �C), +31,5 mm sur les pr�cipitations (571 vs 539,5 mm), +104,8 h sur l'ensoleillement (3 110,5 vs 3 005,7 h). Ces �carts sont du m�me ordre que la variabilit� interannuelle et ne remettent pas en cause les conclusions ; ils sont document�s dans les fiches.
            </p>
            <p className="text-justify space-y-2">
              <strong>A4 � Nature des lignes � Moyenne des maxima / minima � (clarification, non anomalie).</strong> Les valeurs annuelles 36,90 �C et 5,29 �C ne sont pas les moyennes des douze valeurs mensuelles (respectivement 28,4 �C et 10,6 �C) : ce sont les moyennes des extr�mes annuels, c'est-�-dire la temp�rature maximale moyenne de l'ann�e (36,90 �C) et la temp�rature minimale moyenne de l'ann�e (5,29 �C). Elles ne doivent donc jamais �tre confondues avec des moyennes climatiques mensuelles.
            </p>
            <p className="text-justify space-y-2">
              <strong>A5 � Double comptage des jours de pluie.</strong> Les lignes � jours de pr�cipitation = 1 mm � (50 j) et � jours de pluie � (98,4 j, p�riode 1961-1990) utilisent deux seuils et deux p�riodes diff�rents. La seconde int�gre vraisemblablement les jours � trace (= 0,1-0,2 mm). Elles ne sont pas contradictoires mais non directement comparables ; seule la premi�re (50 j = 1 mm) est utilis�e dans les calculs de similarit�.
            </p>
            <p className="text-justify space-y-2">
              <strong>A6 � Absence totale de neige.</strong> Les pr�cipitations solides sont nulles sur les douze mois � coh�rent avec un climat USDA 11a et une altitude de 5-26 m.
            </p>
          </section>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>PARTIE II � ANALOGUES DU MAROC ET DU MAGHREB</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-xl font-semibold mb-4">2.1. Cat�gorie 1 � Climats quasi identiques (analogie tr�s forte)</h3>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">2.1.1. Larache (Province de Larache, Maroc) � Similarit� S = 59,3 % (D = 0,522)</h5>
              <p className="text-justify">
                Larache (35�11' N, 6�09' O), � 120 km au nord-nord-est de K�nitra sur la m�me fa�ade atlantique, constitue l'analogue marocain le plus proche de K�nitra hors du Gharb. Climat Csa, temp�rature moyenne annuelle 18,2 �C (contre 18,6 �C), pr�cipitations 700,5 mm (contre 571 mm), moyenne des maximales d'ao�t 28,7 �C (identique � K�nitra), moyenne des minimales de janvier 8,2 �C, record haut 46,4 �C, record bas -3,0 �C. Les diff�rences sont pluviom�triques : Larache re�oit environ 130 mm de plus, ce qui s'explique par sa position plus septentrionale, plus directement expos�e aux perturbations atlantiques hivernales. Les deux villes partagent : r�gime pluviom�trique � maximum hivernal, s�cheresse estivale absolue, hiver sans gel, humidit� �lev�e, vent de secteur nord. Aucune diff�rence agroclimatique significative : la palette culturale (agrumes irrigu�s, c�r�ales, betterave, mara�chage) est identique, et Larache est m�me un p�le marocain de la fraise et du mara�chage d'exportation.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">2.1.2. Rabat-Sal� (R�gion Rabat-Sal�-K�nitra, Maroc) � Similarit� S � 57 % (Sal� : D � 0,56)</h5>
              <p className="text-justify">
                Sal� (34�02' N, 6�48' O) pr�sente une temp�rature moyenne annuelle de 17,7 �C, des pr�cipitations de 521,9 mm, une moyenne des maximales d'ao�t de 27,8 �C, une moyenne des minimales de janvier de 7,2 �C, avec des records de 47,2 �C et -3,2 �C ; climat Csa. Rabat-Sal� est la ville-jumelle climatique imm�diate de K�nitra, � 40 km au sud-ouest : m�me influence oc�anique, m�me r�gime, m�me humidit�, m�me absence de gel structurel. L'�cart principal est une pluviom�trie inf�rieure d'environ 50 mm et un �t� l�g�rement moins chaud. Il faut souligner que Rabat-Sal� et K�nitra forment, avec Casablanca, un continuum littoral atlantique marocain dont la signature est remarquablement homog�ne sur pr�s de 250 km de c�te.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">2.1.3. Casablanca (Maroc) � Similarit� S = 52,6 % (D = 0,642 ; couverture 100 %)</h5>
              <p className="text-justify">
                Casablanca (33�32' N, 7�35' O) : Csa, T = 18,6 �C, P = 408,2 mm, moyenne des maximales d'ao�t 26,7 �C, moyenne des minimales de janvier 8,9 �C, humidit� relative 82 %, ensoleillement 3 030 h, records 42,2 �C / 0,3 �C. C'est le seul analogue dont les six variables du mod�le sont renseign�es (couverture 100 %), ce qui en fait un point d'ancrage statistique solide. La divergence est pluviom�trique : 163 mm de moins que K�nitra, ce qui rapproche Casablanca du seuil semi-aride et r�duit sa similarit� globale. Sur le plan de la temp�rature annuelle (18,6 �C, identique) et de l'humidit� (82 % vs 76 %), la convergence est en revanche quasi parfaite.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">2.2. Cat�gorie 2 � Climats extr�mement similaires</h3>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">2.2.1. Tanger (Maroc) � Similarit� S = 53,4 % (D = 0,628 ; couverture 100 %)</h5>
              <p className="text-justify">
                Tanger (35�47' N, 5�48' O) : Csa, T = 17,7 �C, P = 735,9 mm, moyenne des maximales d'ao�t 28,6 �C, moyenne des minimales de janvier 8,8 �C, humidit� relative 76 % (identique � K�nitra), ensoleillement 2 960,7 h. L'�cart pluviom�trique (+165 mm) p�nalise le score, mais la convergence hygrom�trique (76 % vs 76 %) et thermique est remarquable. Tanger rel�ve de la m�me famille � m�diterran�en oc�anique du d�troit � que Larache et K�nitra.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">2.2.2. El Jadida (Maroc) � Similarit� S � 49 % (D � 0,71)</h5>
              <p className="text-justify">
                El Jadida (33�14' N, 8�30' O) : Csa, T = 17,4 �C, P = 372 mm, moyenne des maximales d'ao�t 27,9 �C, moyenne des minimales de janvier 7,6 �C. M�me structure thermique et hygrom�trique, mais pluviom�trie tr�s inf�rieure (-199 mm), ce qui l'�loigne davantage que Casablanca.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">2.2.3. Sidi Kacem et Souk El Arbaa (Gharb int�rieur) � Similarit� � 85-90 %</h5>
              <p className="text-justify">
                Sidi Kacem (34�13' N, 5�42' O, 194 m) et Souk El Arbaa (34�40' N, 5�58' O), toutes deux dans la r�gion de K�nitra, pr�sentent un climat plus continentalis� que K�nitra : � �t�s chauds � tr�s chauds, pointes entre 32 et 36 �C ; hivers relativement frais, les minima passant parfois sous le point de cong�lation ; pr�cipitations annuelles de 350 � 600 mm �. Il s'agit d'analogues intra-r�gionaux d�grad�s par la continentalit� : le gradient K�nitra ? Sidi Kacem ? Sidi Slimane illustre le passage du littoral oc�anique temp�r� � l'int�rieur semi-aride du Gharb, gradient d�crit dans la litt�rature sous la forme d'un � climat subhumide au nord-ouest, semi-aride au sud et � l'est �.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">2.2.4. Essaouira (Maroc) � Similarit� S = 31,1 % (D = 1,169)</h5>
              <p className="text-justify">
                Essaouira (31�30' N, 9�46' O) : BSk/BSh, T = 17,9 �C, P = 364,2 mm, moyenne des maximales de septembre 22,4 �C (remarquablement fra�che, reflet d'un upwelling intense), moyenne des minimales de janvier 11,2 �C, ensoleillement 2 978,5 h. Essaouira constitue un analogue � oc�anique froid � extr�me : la temp�rature annuelle est proche, mais l'�t� y est beaucoup plus frais (22,4 �C contre 28,7 �C de moyenne des maximales). Elle d�limite la borne froide de la famille des analogues atlantiques marocains.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">2.3. Analogues alg�riens et tunisiens</h3>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">2.3.1. Mostaganem (Alg�rie) � Similarit� S � 46 % (D � 0,78)</h5>
              <p className="text-justify">
                Mostaganem (35�56' N, 0�05' E, 104 m) : Csa, T = 17,9 �C, P = 347 mm, moyenne des maximales de juillet 31,6 �C, moyenne des minimales de janvier 5,8 �C, records 45,9 �C / -2,2 �C. Convergence thermique annuelle forte, divergence pluviom�trique (-224 mm) et continentale hivernale (minima plus bas).
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">2.3.2. Tlemcen (Alg�rie) � Similarit� � 40 %</h5>
              <p className="text-justify">
                Tlemcen (34�53' N, 1�19' O, 842 m) : Csa, T = 17,2 �C, P = 444,8 mm, moyenne des maximales d'ao�t 33,6 �C, moyenne des minimales de janvier 5,3 �C. La temp�rature annuelle est tr�s proche, mais l'altitude et la continentalit� accroissent l'amplitude et les extr�mes hivernaux, ce qui d�grade l'analogie avec le littoral k�nitrien.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">2.3.3. Bizerte (Tunisie) � Similarit� S � 50 % (D � 0,69)</h5>
              <p className="text-justify">
                Bizerte (37�16' N, 9�51' E, 5 m) : Csa, T = 18,6 �C (identique � K�nitra), P = 653,2 mm, moyenne des maximales d'ao�t 33,2 �C, moyenne des minimales de janvier 7,1 �C, ensoleillement 3 026,9 h, records 48,9 �C / -4,2 �C. C'est le meilleur analogue tunisien : m�me temp�rature annuelle, pluviom�trie du m�me ordre, mais �t� nettement plus chaud (33,2 �C contre 28,7 �C) car Bizerte n'est pas rafra�chie par un upwelling atlantique �quivalent.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">2.3.4. B�ja et Tunis (Tunisie)</h5>
              <p className="text-justify">
                B�ja (36�44' N, 9�11' E, 222 m) : Csa, T = 18,3 �C, P = 610,5 mm, moyenne des maximales d'ao�t 36,7 �C, moyenne des minimales de f�vrier 4,8 �C, records 48,9 �C / -4,5 �C. Tunis (36�48' N, 10�10' E) : Csa, T = 19,2 �C, P = 555,2 mm, moyenne des maximales de juillet 33,0 �C, moyenne des minimales de janvier 5,6 �C, records 49,0 �C / 2,0 �C. Ces deux stations partagent la pluviom�trie et la temp�rature annuelle de K�nitra mais pas son �t� temp�r� ni son humidit�.
              </p>
            </div>
          </section>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>PARTIE III � ANALOGUES DU BASSIN M�DITERRAN�EN NORD</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-xl font-semibold mb-4">3.1. Analogues ib�riques � le c�ur de l'analogie europ�enne</h3>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">3.1.1. Faro (Algarve, Portugal) � Similarit� S = 70,9 % (D = 0,344) � ANALOGUE N� 1 MONDIAL</h5>
              <p className="text-justify">
                Faro (37�00' N, 7�56' O, 8 m) obtient le meilleur score mondial du mod�le. Csa ; T = 17,5-18,5 �C ; P = 511,6 mm ; moyenne des maximales de juillet 29,2 �C ; moyenne des minimales de janvier 7,9 �C ; ensoleillement 3 044,4 h ; records 44,3 �C / 1,2 �C. Les �carts sont minimes : ?T � -0,6 �C, ?P � -60 mm, ?Tx � +0,5 �C, ?Tn � -1,3 �C, ?Ensoleillement � -66 h. Faro est un littoral atlantique m�ridional � �t� sec : exactement la m�me m�canique que K�nitra (oc�an temp�r� + anticyclone subtropical + s�cheresse estivale). La v�g�tation y est domin�e par le pin pignon, le caroubier, l'olivier, le figuier et l'amandier � une palette quasi superposable � celle du Gharb. La principale diff�rence est l'intensit� du refroidissement estival par upwelling : la c�te algarienne est plus froide en �t� que K�nitra, o� le plateau continental et l'orientation du trait de c�te att�nuent cet effet.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">3.1.2. Portim�o (Algarve, Portugal) � Similarit� S = 59,5 % (D = 0,520)</h5>
              <p className="text-justify">
                Portim�o (37�08' N, 8�32' O) : Csa, T = 17,2 �C, P = 528,1 mm, moyenne des maximales d'ao�t 28,8 �C, moyenne des minimales de janvier 8,2 �C, ensoleillement 3 018,8 h, records 37,6 �C / -2,0 �C. Convergence quasi parfaite sur la pluviom�trie (528 vs 571 mm) et la moyenne des maximales d'ao�t (28,8 vs 28,7 �C). Portim�o confirme que l'Algarve occidental est le meilleur analogue europ�en de K�nitra.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">3.1.3. Huelva et Jerez de la Frontera (Andalousie atlantique, Espagne)</h5>
              <p className="text-justify">
                Huelva (37�15' N, 6�57' O, 54 m) : Csa, T = 18,1 �C, P = 525 mm, moyenne des maximales d'ao�t 33,1 �C, moyenne des minimales de janvier 5,9 �C, ensoleillement 2 970 h, records 43,9 �C / -3,2 �C. Jerez (36�40' N, 6�08' O, 56 m) : T � 18 �C, P = 570 mm, moyenne des maximales d'ao�t 34,3 �C, moyenne des minimales de janvier 5,3 �C, 2 965 h d'ensoleillement, 53 jours de pluie, 137 jours clairs. La pluviom�trie de Jerez (570 mm) est rigoureusement �gale � celle de K�nitra (571 mm) � mais l'�t� andalou est 5,6 �C plus chaud (34,3 vs 28,7 �C) et l'hiver 3,9 �C plus froid : c'est la continentalit� andalouse qui cr�e l'�cart.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">3.1.4. S�ville (Espagne) � Similarit� S = 28,0 %</h5>
              <p className="text-justify">
                S�ville (37�23' N, 5�59' O, 7 m) : Csa, T = 19,2 �C, P = 502 mm, moyenne des maximales de juillet 36,2 �C, moyenne des minimales de janvier 6,0 �C, humidit� relative 59,4 %, ensoleillement 3 279,3 h, records 46,6 �C / -5,5 �C. S�ville est l'anti-mod�le absolu de K�nitra : � pluviom�trie comparable, elle cumule une humidit� 17 points plus basse, un �t� 7,5 �C plus chaud et un hiver 3,2 �C plus froid. L'analogie est hydrique mais nullement hygrothermique.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">3.1.5. Valence et Barcelone (Espagne m�diterran�enne)</h5>
              <p className="text-justify">
                Valence (39�28' N, 0�22' O, 15 m) : BSh/Csa, T = 18,6 �C (identique � K�nitra), P = 459 mm, moyenne des maximales d'ao�t 30,6 �C, moyenne des minimales de janvier 7,5 �C, 2 733 h d'ensoleillement, records 44,5 �C / -7,2 �C. Barcelone (41�23' N, 2�11' E, 12 m) : Csa, T = 18,2 �C (jour 21,2 / nuit 15,1), P = 558,1 mm, moyenne des maximales d'ao�t 28,9 �C, moyenne des minimales de janvier 5,5 �C, HR 68 %, 2 489 h, records 37,4 �C / -8,0 �C. Barcelone est un analogue remarquable par sa pluviom�trie (558 mm) et sa moyenne des maximales d'ao�t (28,9 �C) ; elle s'en �carte par un hiver plus froid et un ensoleillement bien moindre.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">3.1.6. Set�bal et Algeciras (p�ninsule Ib�rique m�ridionale)</h5>
              <p className="text-justify">
                Set�bal (38�31' N, 8�53' O) : Csa, T � 16,5-17 �C, P = 703,4 mm, moyenne des maximales d'ao�t 30,7 �C, moyenne des minimales de janvier 5,2 �C, records 45,5 �C / -5,8 �C. Algeciras (36�07' N, 5�27' O, 20 m) : Csa, T = 18,3 �C, P = 835,7 mm, moyenne des maximales d'ao�t 27,8 �C, moyenne des minimales de janvier 11,1 �C. Algeciras, avec 27,8 �C de moyenne des maximales d'ao�t et 11,1 �C de minima en janvier, est thermiquement le plus proche de K�nitra � mais sa pluviom�trie de 835,7 mm l'en �loigne structurellement.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">3.1.7. Almer�a et Carthag�ne (Sud-Est espagnol) � analogues � chauds et secs � d�grad�s</h5>
              <p className="text-justify">
                Almer�a (36�50' N, 2�27' O, 24 m) : BWh, T = 19,2 �C, P = 197,5 mm, moyenne des maximales d'ao�t 31,2 �C, ensoleillement 3 095 h, records 42,0 �C / 0,1 �C. Carthag�ne (37�36' N, 0�59' O, 10 m) : climat de transition BSh/BWh, T = 19,2 �C, P = 260,2 mm, moyenne des maximales d'ao�t 30,4 �C. Ces stations constituent des analogues � chauds et secs � de K�nitra, d�cal�s vers l'aridit� ; elles ne partagent ni la pluviom�trie (d�ficit de 310 � 370 mm) ni l'humidit�.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">3.2. Analogues italiens, maltais, croates et grecs</h3>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">3.2.1. Cagliari (Sardaigne, Italie) � Similarit� S = 34,7 % (D = 1,058)</h5>
              <p className="text-justify">
                Cagliari (39�13' N, 9�06' E, 4 m) : Csa, T = 17,3 �C, P = 413,2 mm, moyenne des maximales d'ao�t 32,1 �C, moyenne des minimales de f�vrier 5,1 �C, 2 729,2 h, records 44,6 �C / 4,8 �C. Convergence m�diterran�enne classique, d�grad�e par un �t� 3,4 �C plus chaud.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">3.2.2. La Valette (Malte) � Similarit� S = 56,1 % (D = 0,578 ; couverture 54 %)</h5>
              <p className="text-justify">
                La Valette (35�54' N, 14�31' E, 56 m) : Csa, P = 580,7 mm (proche de 571 mm), moyenne des maximales d'ao�t 32,0 �C, moyenne des minimales de f�vrier 9,5 �C. Pluviom�trie quasi identique, minima hivernaux proches, mais �t� insulaire nettement plus chaud. La couverture du mod�le est faible (3 variables) : le score doit �tre lu avec prudence.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">3.2.3. Split (Croatie) � Similarit� S = 30,2 %</h5>
              <p className="text-justify">
                Split (43�30' N, 16�26' E, 0 m) : Csa, T = 16,8 �C, P = 800,6 mm, moyenne des maximales de juillet 31,0 �C, moyenne des minimales de janvier 5,9 �C, 2 698,5 h, records 38,6 �C / -9,0 �C. Trop arros� (+230 mm) et trop froid en hiver.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">3.2.4. H�raklion (Cr�te, Gr�ce) � Similarit� S = 36,5 %</h5>
              <p className="text-justify">
                H�raklion (35�20' N, 25�08' E) : Csa, T = 19,6 �C, P = 318,6 mm, moyenne des maximales de juillet-ao�t 28,3 �C (tr�s proche de K�nitra), moyenne des minimales de janvier 10,5 �C, 2 778,6 h, records 38,3 �C / 1,4 �C. La temp�rature annuelle et les maxima estivaux sont remarquablement proches, mais la pluviom�trie est inf�rieure de 252 mm � l'analogie est thermique et non hydrique.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">3.3. Analogues turcs et levantins</h3>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">3.3.1. Izmir (Turquie) � Similarit� S = 37,1 % (D = 0,992)</h5>
              <p className="text-justify">
                Izmir (38�25' N, 27�08' E, 2 m) : Csa, T = 18,4 �C, P = 730,5 mm, moyenne des maximales de juillet 33,8 �C, moyenne des minimales de janvier 6,0 �C, 2 938,5 h, records 43,2 �C / -8,2 �C. Temp�rature annuelle tr�s proche, mais �t� 5,1 �C plus chaud et pluviom�trie sup�rieure.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">3.3.2. Tel-Aviv (Isra�l) � Similarit� S = 40,2 %</h5>
              <p className="text-justify">
                Tel-Aviv (32�05' N, 34�47' E, 5 m) : Csa, T = 20,9 �C, P = 528 mm, moyenne des maximales d'ao�t 30,2 �C, moyenne des minimales de janvier 9,6 �C, records 46,5 �C / 1,9 �C. Pluviom�trie et minima hivernaux tr�s proches, mais temp�rature annuelle 2,3 �C plus �lev�e et climat nettement plus chaud.
              </p>
            </div>
          </section>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>PARTIE IV � ANALOGUES DES AM�RIQUES</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-xl font-semibold mb-4">4.1. Californie et c�te pacifique des �tats-Unis</h3>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">4.1.1. Los Angeles (�tats-Unis) � Similarit� S = 48,0 % (D = 0,735 ; couverture 100 %)</h5>
              <p className="text-justify">
                Los Angeles (34�03' N, 118�15' O, 93 m) : BSh (Csb sur la c�te, Csa � l'int�rieur), T = 18,8 �C, P = 362 mm, moyenne des maximales d'ao�t 28,9 �C (identique � K�nitra), moyenne des minimales de d�cembre 9,0 �C, HR 70,8 %, ensoleillement 3 254,2 h, records 45 �C / 2 �C. La structure thermique est superposable (?T = +0,2 �C, ?Tx = +0,2 �C, ?Tn = -0,2 �C), mais le d�ficit pluviom�trique de 209 mm r�duit fortement la similarit�. Los Angeles est le meilleur analogue extra-m�diterran�en de K�nitra sur le plan thermique, un analogue m�diocre sur le plan hydrique.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">4.1.2. Santa Barbara (Californie) � Similarit� S = 45,5 %</h5>
              <p className="text-justify">
                Santa Barbara (34�25' N, 119�42' O, 15 m) : Csb, T = 17,0 �C, P = 482,4 mm, moyenne des maximales d'ao�t-septembre 25,4 �C, moyenne des minimales de d�cembre 7,8 �C, 3 099,8 h, records 42 �C / -7 �C. Pluviom�trie proche (482 mm), mais �t� 3,3 �C plus frais � l'upwelling californien est plus intense qu'� K�nitra.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">4.1.3. San Diego (Californie) � Similarit� S = 30,2 %</h5>
              <p className="text-justify">
                San Diego (32�42' N, 117�09' O) : BSh/Csa, T = 18,2 �C, P = 249 mm, moyenne des maximales d'ao�t 25,2 �C, moyenne des minimales de janvier 10,2 �C, HR 69 %, 3 054,6 h, records 44 �C / 4 �C. Minima hivernaux tr�s proches (10,2 vs 9,2 �C), mais �t� plus frais et aridit� marqu�e.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">4.1.4. Sacramento et Fresno (Vall�e Centrale) � analogues continentaux rejet�s</h5>
              <p className="text-justify">
                Sacramento (38�34' N, 121�29' O) : Csa, T = 16,6 �C, P = 461 mm, moyenne des maximales de juillet 33,7 �C, moyenne des minimales de janvier 4,0 �C, 3 607,8 h, records 46,7 �C / -7,8 �C. Fresno : BSh, T = 18,3 �C, P = 279 mm, moyenne des maximales de juillet 36,5 �C, 3 550 h, records 46,1 �C / -8 �C. Ces stations, souvent cit�es comme analogues des climats marocains, ne le sont PAS pour K�nitra : leur amplitude annuelle d�passe 29 �C (contre 11,5 �C) et leur humidit� estivale est tr�s basse. Elles constituent en revanche des analogues pertinents de Guercif.
              </p>
            </div>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">4.1.5. Monterey (Californie) � Similarit� S = 8,9 % (analogue rejet�)</h5>
              <p className="text-justify">
                Monterey (36�36' N, 121�53' O) : Csb, T = 13,3 �C, P = 435 mm, moyenne des maximales de septembre 20,1 �C, moyenne des minimales de janvier 6,2 �C. Trop froid (?T = -5,3 �C) : la d�rive froide californienne est beaucoup plus intense que l'upwelling marocain.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">4.2. Am�rique latine</h3>

            <div className="space-y-3 ml-4">
              <h5 className="font-semibold">4.2.1. Santiago (Chili) � Similarit� S = 20,6 % (D = 1,580 ; avec correction saisonni�re)</h5>
              <p className="text-justify">
                Santiago (33�26' S, 70�39' O, 570 m) : BSk avec tendances Csb, P = 286,3 mm (Quinta Normal), moyenne des maximales de janvier 30,4 �C, moyenne des minimales de juillet 2,6 �C, HR 64-71 %, ensoleillement 2 888,4 h, records 39,3 �C / -6,8 �C. Apr�s inversion saisonni�re (janvier ? juillet), la structure thermique devient comparable, mais la pluviom�trie (286 mm) est inf�rieure de 285 mm et les minima hivernaux (2,6 �C) sont 6,6 �C plus froids que ceux de K�nitra. Santiago est un analogue thermique d�grad� par l'aridit� et la continentalit� altitudinale.
              </p>
            </div>

            <p className="text-justify mt-4">
              <strong>Note :</strong> les fiches de Valpara�so, Buenos Aires et Montevideo n'ont pu �tre �tablies, les pages sources n'ayant pas �t� accessibles lors de la collecte. Elles sont signal�es comme lacunes de couverture.
            </p>
          </section>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>PARTIE V � ANALOGUES DE L'H�MISPH�RE SUD ET CORRECTION SAISONNI�RE</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-xl font-semibold mb-4">5.1. M�thode de correction</h3>
            <p className="text-justify space-y-2">
              Pour les stations de l'h�misph�re sud, la comparaison est conduite selon deux modalit�s : (i) comparaison calendaire brute (mois civil contre mois civil), qui mesure la ressemblance des �tats mensuels absolus ; (ii) comparaison apr�s inversion saisonni�re stricte (janvier ? juillet, f�vrier ? ao�t, �, juin ? d�cembre), qui mesure la ressemblance des structures saisonni�res. Conform�ment au mandat, le d�calage n'est pas appliqu� aveugl�ment aux r�gimes pluviom�triques : la saisonnalit� des pluies est compar�e s�par�ment, car un r�gime � maximum hivernal austral correspond, apr�s inversion, � un maximum estival bor�al � divergence structurelle majeure.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">5.2. Le Cap (Afrique du Sud) � Similarit� S = 54,9 % (D = 0,600 ; couverture 90 %)</h3>
            <p className="text-justify space-y-2">
              Le Cap (33�55' S, 18�25' E) : Csb, T = 17,3 �C, P = 492,8 mm, moyenne des maximales de f�vrier 27,3 �C (? ao�t bor�al), moyenne des minimales de juillet 7,4 �C (? janvier bor�al), ensoleillement 3 115 h, records 45,2 �C / 1,3 �C. Apr�s inversion saisonni�re, la convergence est excellente : ?T = -1,3 �C, ?P = -78 mm, ?Tx = -1,4 �C, ?Tn = -1,8 �C, ?Ensoleillement = +5 h. Le Cap partage en outre le m�me r�gime pluviom�trique � maximum hivernal (pluies d'hiver austral ? pluies d'hiver bor�al pour K�nitra), ce qui est rare parmi les analogues de l'h�misph�re sud et en fait l'un des meilleurs analogues plan�taires. Diff�rences : hivers plus frais, �t� plus court, influence de l'upwelling de Benguela.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">5.3. Adelaide (Australie) � Similarit� S = 60,3 % (D = 0,507) � 2? rang mondial</h3>
            <p className="text-justify space-y-2">
              Adelaide (34�55' S, 138�36' E, 50 m) : Csa, T = 17,5 �C, P = 536,5 mm, moyenne des maximales de janvier 30,0 �C, moyenne des minimales de juillet 7,7 �C, records 47,7 �C / 0,4 �C. Apr�s inversion saisonni�re : ?T = -1,1 �C, ?P = -35 mm, ?Tx = +1,3 �C, ?Tn = -1,5 �C. C'est, avec Le Cap, le meilleur analogue de l'h�misph�re sud. Adelaide rel�ve de la m�me famille � m�diterran�en austral temp�r� � que K�nitra, avec une pluviom�trie quasi identique (536 vs 571 mm).
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">5.4. Perth (Australie) � Similarit� S = 47,0 % (D = 0,754)</h3>
            <p className="text-justify space-y-2">
              Perth (31�57' S, 115�51' E) : Csa, P = 731,1 mm, moyenne des maximales de f�vrier 31,6 �C, moyenne des minimales de juillet 8,0 �C, records 46,2 �C / 0,7 �C. R�gime pluviom�trique � maximum hivernal austral, comme Le Cap : apr�s inversion, la structure est fid�le, mais l'�t� est 2,9 �C plus chaud et la pluviom�trie sup�rieure de 160 mm.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 mt-6">5.5. Autres stations australes</h3>
            <p className="text-justify space-y-2">
              Les fiches de Sydney, Melbourne et Auckland n'ont pu �tre �tablies (pages sources inaccessibles). Sur la base des donn�es disponibles, Auckland et la Nouvelle-Z�lande ne pr�sentent aucun analogue direct : leur climat oc�anique temp�r� est d�pourvu de s�cheresse estivale marqu�e. Le Karoo sud-africain et le bassin de Murray-Darling (Mildura, Renmark), souvent cit�s comme analogues des climats semi-arides marocains, sont des analogues de Guercif, non de K�nitra : trop continentaux, trop secs en �t�, trop froids en hiver.
            </p>
          </section>
        </CardContent>
      </Card>

    </div>
  );
}

