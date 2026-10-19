/**
 * Port TypeScript du module Lua « Module:Climate box color schemes » utilisé par
 * les climate boxes de Wikipédia en anglais.
 *
 * Les climate boxes anglaises calculent la couleur de chaque case par
 * interpolation entre plusieurs bornes (fonction `range_pos` du module Lua).
 * Ce fichier reproduit à l'identique les formules d'origine afin que les
 * tableaux du site soient indiscernables de ceux de Wikipédia.
 *
 * Schémas disponibles (identifiants du module Lua) :
 *   t      → température
 *   p      → précipitations
 *   s      → ensoleillement
 *   d      → nombre de jours
 *   h      → humidité
 *   u      → indice UV
 *   green  → variante verte du schéma précipitations
 *   pastel → nuancier pastel
 *   none   → aucune coloration
 */

export type ClimateBoxColor = {
  /** Couleur de fond au format #RRGGBB */
  background: string;
  /** Couleur du texte (noir ou blanc) au format #RRGGBB */
  text: string;
};

export type ClimateBoxColorScheme =
  | "t"
  | "p"
  | "s"
  | "d"
  | "h"
  | "u"
  | "green"
  | "pastel"
  | "none";

/**
 * Facteur de conversion d'une durée journalière (ou horaire) vers son
 * équivalent mensuel. Le schéma « s » de Wikipédia est calibré sur des
 * totaux mensuels (0 à 720 h, soit la durée maximale d'un mois) : une durée
 * plus courte doit donc être ramenée à cette échelle pour rester comparable.
 */
export const SUNSHINE_MONTHLY_EQUIVALENT = 30.44;

/**
 * Équivalent de `string.format("%02X", value)` : convertit une valeur en
 * hexadécimal sur deux caractères (tronquée à l'entier, comme en Lua).
 */
function hex(value: number): string {
  const truncated = Math.trunc(value);
  if (!Number.isFinite(truncated) || truncated <= 0) return "00";
  if (truncated >= 255) return "FF";
  return truncated.toString(16).toUpperCase().padStart(2, "0");
}

/**
 * Équivalent de `range_pos` : position normalisée de `value` sur l'intervalle
 * [start, stop]. Renvoie 0 hors de l'intervalle du côté de `start` et 1 du
 * côté de `stop`.
 */
function rangePos(value: number, start: number, stop: number): number {
  if (start === stop) return 0;
  if (start < stop) {
    if (value < start) return 0;
    if (value > stop) return 1;
    return (value - start) / (stop - start);
  }
  if (value < stop) return 1;
  if (value > start) return 0;
  return (start - value) / (start - stop);
}

/** Équivalent de `format_line` : renvoie le couple fond / texte d'une case. */
function formatLine(background: string, textColor: string): ClimateBoxColor {
  return { background: `#${background}`, text: `#${textColor}` };
}

/**
 * Schéma « température » (code `t`).
 * Du bleu très froid (< -42 °C) au rouge sombre (> 41,5 °C).
 */
export function getTemperatureStyle(value: number): ClimateBoxColor {
  if (value === null || value === undefined) return formatLine("FFFFFF", "000000");

  let background: string;
  if (value < 4.5) {
    background = hex(rangePos(value, -42.75, 4.5) * 255);
  } else {
    background = hex(rangePos(value, 60, 41.5) * 255);
  }

  if (value <= 4.5) {
    background += hex(rangePos(value, -42.75, 4.5) * 255);
  } else {
    background += hex(rangePos(value, 41.5, 4.5) * 255);
  }

  if (value < -42.78) {
    background += hex(rangePos(value, -90, -42.78) * 255);
  } else {
    background += hex(rangePos(value, 23, 4.5) * 255);
  }

  const text = value < -23.3 || value >= 37.8 ? "FFFFFF" : "000000";
  return formatLine(background, text);
}

/**
 * Schéma « précipitations » (code `p`), en millimètres.
 * Du blanc (0 mm) au bleu marine (300 mm et plus).
 */
export function getPrecipitationStyle(value: number): ClimateBoxColor {
  if (value === null || value === undefined) return formatLine("FFFFFF", "000000");

  const item1 = hex(rangePos(value, 165.6, 0) * 255);
  const item2 = hex(rangePos(value, 300, 165.61) * 207 + 48);

  const text = value > 90 ? "FFFFFF" : "000000";
  return formatLine(item1 + item1 + item2, text);
}

/**
 * Schéma « nombre de jours » (code `d`), utilisé pour les jours de pluie.
 * Du blanc (0 jour) au bleu foncé (40 jours et plus).
 */
export function getDaysStyle(value: number): ClimateBoxColor {
  if (value === null || value === undefined) return formatLine("FFFFFF", "000000");

  const item1 = hex(rangePos(value, 20, 0) * 255);
  const item2 = hex(rangePos(value, 40, 20) * 255);

  const text = value >= 12 ? "FFFFFF" : "000000";
  return formatLine(item1 + item1 + item2, text);
}

/**
 * Schéma « humidité » (code `h`), en pourcentage.
 * Du blanc (0 %) au bleu très foncé (133 % et plus).
 */
export function getHumidityStyle(value: number): ClimateBoxColor {
  if (value === null || value === undefined) return formatLine("FFFFFF", "000000");

  const item1 = hex(rangePos(value, 66.67, 0) * 255);
  const item2 = hex(rangePos(value, 133.33, 66.667) * 255);

  const text = value >= 40 ? "FFFFFF" : "000000";
  return formatLine(item1 + item1 + item2, text);
}

/**
 * Schéma « ensoleillement » (code `s`), en heures.
 * Du noir (0 h) à l'orange (150 h) puis au rouge (270 h) et au jaune (720 h).
 */
export function getSunshineStyle(value: number): ClimateBoxColor {
  if (value === null || value === undefined) return formatLine("FFFFFF", "000000");

  let item: number;
  if (value < 90) {
    item = rangePos(value, 0, 90) * 170;
  } else if (value < 180) {
    item = rangePos(value, 90, 180) * 42.5 + 170;
  } else {
    item = rangePos(value, 180, 360) * 42.5 + 212.5;
  }
  let background = hex(item) + hex(item);

  if (value < 90) {
    item = rangePos(value, 0, 90) * 170;
  } else if (value < 270) {
    item = rangePos(value, 150, 90) * 170;
  } else {
    item = rangePos(value, 270, 720) * 255;
  }
  background += hex(item);

  const text = value < 80 ? "FFFFFF" : "000000";
  return formatLine(background, text);
}

/**
 * Schéma « vert » (code `green`) : même interpolation que le schéma
 * précipitations, mais appliquée au canal vert.
 */
export function getGreenStyle(value: number): ClimateBoxColor {
  if (value === null || value === undefined) return formatLine("FFFFFF", "000000");

  const item1 = hex(rangePos(value, 165.6, 0) * 255);
  const item2 = hex(rangePos(value, 300, 165.61) * 207 + 48);

  const text = value >= 200 ? "FFFFFF" : "000000";
  return formatLine(item1 + item2 + item1, text);
}

/** Nuancier pastel du module Lua (valeurs arrondies par pas de 3 °C). */
const PASTEL_SCALE: Record<number, string> = {
  1: "BB00CC",
  2: "CC00EE",
  3: "CC33EE",
  4: "CC55EE",
  5: "DD66EE",
  6: "DD77EE",
  7: "DD99EE",
  8: "DDAAEE",
  9: "DDBBEE",
  10: "EECCFF",
  11: "FFDDFF",
  12: "F1F1F1",
  13: "FFEEBB",
  14: "FFFFCC",
  15: "FFFFBB",
  16: "FFFFAA",
  17: "FFFF88",
  18: "FFCC33",
  19: "FFBB33",
  20: "FF9900",
  21: "FF8844",
  22: "FF6633",
  23: "FF5522",
  24: "FF4422",
  25: "EE4400",
};

/** Schéma « pastel » (code `pastel`). */
export function getPastelStyle(value: number): ClimateBoxColor {
  if (value === null || value === undefined) return formatLine("FFFFFF", "000000");

  const text = value < -15 || value >= 39 ? "FFFFFF" : "000000";
  if (value >= 51) return formatLine("EE2200", text);

  const index = Math.floor((value + 25.5) / 3 + 0.5);
  return formatLine(PASTEL_SCALE[index] ?? "AA00AA", text);
}

/** Schéma « indice UV » (code `u`). */
export function getUvStyle(value: number): ClimateBoxColor {
  if (value === null || value === undefined) return formatLine("FFFFFF", "000000");

  let background: string;
  if (value < 3) {
    background = "3EA72D";
  } else if (value < 6) {
    background = "FFF300";
  } else if (value < 8) {
    background = "F18B00";
  } else if (value < 11) {
    background = "E53210";
  } else {
    background = "A45693";
  }

  const text = value < 3 || value >= 8 ? "FFFFFF" : "000000";
  return formatLine(background, text);
}

/** Schéma « none » : case neutre. */
export function getNoneStyle(): ClimateBoxColor {
  return formatLine("FAFAFA", "000000");
}

/**
 * Renvoie la couleur (fond + texte) correspondant à un schéma du climate box.
 */
export function getClimateBoxColor(
  scheme: ClimateBoxColorScheme,
  value: number
): ClimateBoxColor {
  switch (scheme) {
    case "t":
      return getTemperatureStyle(value);
    case "p":
      return getPrecipitationStyle(value);
    case "s":
      return getSunshineStyle(value);
    case "d":
      return getDaysStyle(value);
    case "h":
      return getHumidityStyle(value);
    case "u":
      return getUvStyle(value);
    case "green":
      return getGreenStyle(value);
    case "pastel":
      return getPastelStyle(value);
    case "none":
      return getNoneStyle();
  }
}
