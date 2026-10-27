export type WeatherColor = { background: string; color: string };

function clamp(v: number, min = 0, max = 255) {
  return Math.max(min, Math.min(max, v));
}

function hex(v: number) {
  return clamp(Math.floor(v)).toString(16).toUpperCase().padStart(2, "0");
}

function rangePos(value: number, start: number, stop: number) {
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

function fmt(bg: string, text: string): WeatherColor {
  return { background: `#${bg}`, color: `#${text}` };
}

export function daysColor(val: number | null): WeatherColor {
  if (val === null) return fmt("FFFFFF", "000000");
  const item = hex(rangePos(val, 20, 0) * 255);
  let bg = item + item;
  const item2 = hex(rangePos(val, 40, 20) * 255);
  bg = bg + item2;
  const text = val >= 12 ? "FFFFFF" : "000000";
  return fmt(bg, text);
}

export function temperatureColor(val: number | null): WeatherColor {
  if (val === null) return fmt("FFFFFF", "000000");
  let r: number, g: number, b: number;
  if (val < 4.5) {
    r = rangePos(val, -42.75, 4.5) * 255;
  } else {
    r = rangePos(val, 60, 41.5) * 255;
  }
  if (val <= 4.5) {
    g = rangePos(val, -42.75, 4.5) * 255;
  } else {
    g = rangePos(val, 41.5, 4.5) * 255;
  }
  if (val < -42.78) {
    b = rangePos(val, -90, -42.78) * 255;
  } else {
    b = rangePos(val, 23, 4.5) * 255;
  }
  const bg = hex(r) + hex(g) + hex(b);
  const text = val < -23.3 || val >= 37.8 ? "FFFFFF" : "000000";
  return fmt(bg, text);
}

export function precipitationColor(val: number | null): WeatherColor {
  if (val === null) return fmt("FFFFFF", "000000");
  const item = hex(rangePos(val, 165.6, 0) * 255);
  let bg = item + item;
  const item2 = hex(rangePos(val, 300, 165.61) * 207 + 48);
  bg = bg + item2;
  const text = val > 90 ? "FFFFFF" : "000000";
  return fmt(bg, text);
}

export function humidityColor(val: number | null): WeatherColor {
  if (val === null) return fmt("FFFFFF", "000000");
  const item = hex(rangePos(val, 66.67, 0) * 255);
  let bg = item + item;
  const item2 = hex(rangePos(val, 133.33, 66.667) * 255);
  bg = bg + item2;
  const text = val >= 40 ? "FFFFFF" : "000000";
  return fmt(bg, text);
}

export function sunshineColor(val: number | null): WeatherColor {
  if (val === null) return fmt("FFFFFF", "000000");
  let item: string;
  if (val < 90) item = hex(rangePos(val, 0, 90) * 170);
  else if (val < 180) item = hex(rangePos(val, 90, 180) * 42.5 + 170);
  else item = hex(rangePos(val, 180, 360) * 42.5 + 212.5);
  let bg = item + item;
  if (val < 90) item = hex(rangePos(val, 0, 90) * 170);
  else if (val < 270) item = hex(rangePos(val, 150, 90) * 170);
  else item = hex(rangePos(val, 270, 720) * 255);
  bg = bg + item;
  const text = val < 80 ? "FFFFFF" : "000000";
  return fmt(bg, text);
}

export function pastelColor(val: number | null): WeatherColor {
  if (val === null) return fmt("FFFFFF", "000000");
  const text = val < -15 || val >= 39 ? "FFFFFF" : "000000";
  if (val >= 51) return fmt("EE2200", text);
  const rounded = Math.round((val + 25.5) / 3);
  const map: Record<number, string> = {
    1: "BB00CC", 2: "CC00EE", 3: "CC33EE", 4: "CC55EE", 5: "DD66EE",
    6: "DD77EE", 7: "DD99EE", 8: "DDAAEE", 9: "DDBBEE", 10: "EECCFF",
    11: "FFDDFF", 12: "F1F1F1", 13: "FFEEBB", 14: "FFFFCC", 15: "FFFFBB",
    16: "FFFFAA", 17: "FFFF88", 18: "FFCC33", 19: "FFBB33", 20: "FF9900",
    21: "FF8844", 22: "FF6633", 23: "FF5522", 24: "FF4422", 25: "EE4400",
  };
  const bg = map[rounded] ?? "AA00AA";
  return fmt(bg, text);
}

export function uvColor(val: number | null): WeatherColor {
  if (val === null) return fmt("FFFFFF", "000000");
  let bg: string;
  if (val < 3) bg = "3EA72D";
  else if (val < 6) bg = "FFF300";
  else if (val < 8) bg = "F18B00";
  else if (val < 11) bg = "E53210";
  else bg = "A45693";
  let text: string;
  if (val < 3) text = "FFFFFF";
  else if (val < 8) text = "000000";
  else text = "FFFFFF";
  return fmt(bg, text);
}

export function greenColor(val: number | null): WeatherColor {
  if (val === null) return fmt("FFFFFF", "000000");
  const item1 = hex(rangePos(val, 165.6, 0) * 255);
  const item2 = hex(rangePos(val, 300, 165.61) * 207 + 48);
  const bg = item1 + item2 + item1;
  const text = val >= 200 ? "FFFFFF" : "000000";
  return fmt(bg, text);
}

// Map a row label to a color function
export function colorFor(label: string): ((v: number | null) => WeatherColor) | null {
  const l = label.toLowerCase();
  if (l.includes("température") || l.includes("moyenne journalière") || l.includes("point de rosée") || l.includes("record")) {
    return temperatureColor;
  }
  if (l.includes("précipitations")) {
    return precipitationColor;
  }
  if (l.includes("jours")) {
    return daysColor;
  }
  if (l.includes("humidité")) {
    return humidityColor;
  }
  if (l.includes("ensoleillement")) {
    return sunshineColor;
  }
  if (l.includes("% ensoleillement")) {
    return sunshineColor;
  }
  return null;
}

export function parseNumber(v: string): number | null {
  if (v === "—" || v === "-" || v === "") return null;
  // take first numeric token
  const m = v.replace(/\s/g, "").match(/-?\d+(?:[.,]\d+)?/);
  if (!m) return null;
  return parseFloat(m[0].replace(",", "."));
}

// Re-export climate box style functions and types from climate-box-colors
export {
  getClimateBoxColor,
  getDaysStyle,
  getGreenStyle,
  getHumidityStyle,
  getNoneStyle,
  getPastelStyle,
  getPrecipitationStyle,
  getSunshineStyle,
  getTemperatureStyle,
  getUvStyle,
  SUNSHINE_MONTHLY_EQUIVALENT,
} from "@/lib/climate-box-colors";
export type { ClimateBoxColor, ClimateBoxColorScheme } from "@/lib/climate-box-colors";

// WMO 4677 sunshine factor table (codes 0-99)
const WMO_SUNSHINE_FACTOR: Record<number, number> = {
  0: 1.00, 1: 0.75, 2: 0.50, 3: 0.10,
  10: 0.30, 11: 0.20, 12: 0.10, 13: 0.05, 14: 0.00, 15: 0.00, 16: 0.00, 17: 0.00, 18: 0.20, 19: 0.10,
  20: 0.05, 21: 0.05, 22: 0.05, 23: 0.05, 24: 0.05, 25: 0.05, 26: 0.05, 27: 0.05, 28: 0.05, 29: 0.05,
  30: 0.10, 31: 0.05, 32: 0.00, 33: 0.00, 34: 0.00, 35: 0.00, 36: 0.00, 37: 0.00, 38: 0.00, 39: 0.00,
  40: 0.05, 41: 0.00, 42: 0.00, 43: 0.00, 44: 0.00, 45: 0.00, 46: 0.00, 47: 0.00, 48: 0.00, 49: 0.00,
  50: 0.20, 51: 0.25, 52: 0.15, 53: 0.15, 54: 0.05, 55: 0.05, 56: 0.00, 57: 0.00, 58: 0.00, 59: 0.00,
  60: 0.10, 61: 0.10, 62: 0.05, 63: 0.05, 64: 0.00, 65: 0.00, 66: 0.00, 67: 0.00, 68: 0.00, 69: 0.00,
  70: 0.10, 71: 0.10, 72: 0.05, 73: 0.05, 74: 0.00, 75: 0.00, 76: 0.00, 77: 0.00, 78: 0.00, 79: 0.00,
  80: 0.30, 81: 0.10, 82: 0.05, 83: 0.20, 84: 0.10, 85: 0.10, 86: 0.05, 87: 0.00, 88: 0.00, 89: 0.00,
  90: 0.05, 91: 0.05, 92: 0.05, 93: 0.05, 94: 0.05, 95: 0.05, 96: 0.05, 97: 0.00, 98: 0.00, 99: 0.00,
};

function getTimeMinutes(timeStr: string): number {
  if (!timeStr || !timeStr.includes('T')) return 0;
  const timePart = timeStr.split('T')[1];
  if (!timePart || !timePart.includes(':')) return 0;
  const [hour, minute] = timePart.split(':').map(Number);
  if (isNaN(hour) || isNaN(minute)) return 0;
  return hour * 60 + minute;
}

function getSolarElevationFactor(timeMinutes: number, sunriseMinutes: number, sunsetMinutes: number): number {
  if (timeMinutes < sunriseMinutes || timeMinutes >= sunsetMinutes) return 0;
  const dayLength = sunsetMinutes - sunriseMinutes;
  const progress = (timeMinutes - sunriseMinutes) / dayLength;
  return Math.sin(Math.PI * progress);
}

export function calculateHourlySunshineWithDaylight(
  code: number,
  timeStr: string,
  sunriseStr: string | null | undefined,
  sunsetStr: string | null | undefined
): number {
  if (!sunriseStr || !sunsetStr) {
    return Math.round((WMO_SUNSHINE_FACTOR[code] ?? 0) * 60);
  }
  const timeMinutes = getTimeMinutes(timeStr);
  const sunriseMinutes = getTimeMinutes(sunriseStr);
  const sunsetMinutes = getTimeMinutes(sunsetStr);
  const elevationFactor = getSolarElevationFactor(timeMinutes, sunriseMinutes, sunsetMinutes);
  if (elevationFactor <= 0) return 0;
  const weatherFactor = WMO_SUNSHINE_FACTOR[code] ?? 0;
  return Math.round(60 * weatherFactor * elevationFactor);
}

export function calculateHourlySunshine(code: number): number {
  return Math.round((WMO_SUNSHINE_FACTOR[code] ?? 0) * 60);
}

export function isHourBetweenSunriseAndSunset(
  timeStr: string,
  sunriseStr: string | null | undefined,
  sunsetStr: string | null | undefined
): boolean {
  if (!sunriseStr || !sunsetStr) return false;
  const timeMinutes = getTimeMinutes(timeStr);
  const sunriseMinutes = getTimeMinutes(sunriseStr);
  const sunsetMinutes = getTimeMinutes(sunsetStr);
  return timeMinutes >= sunriseMinutes && timeMinutes < sunsetMinutes;
}

export function calculateDailySunshine(
  hourlyData: { time: string; weather_code: number }[],
  sunrise: string | null | undefined,
  sunset: string | null | undefined
): number | null {
  if (!hourlyData || hourlyData.length === 0) return null;
  return hourlyData.reduce((total, hour) => {
    if (isHourBetweenSunriseAndSunset(hour.time, sunrise, sunset)) {
      return total + calculateHourlySunshine(hour.weather_code);
    }
    return total;
  }, 0);
}

export function calculateMonthlySunshine(dailyMinutes: (number | null)[]): number | null {
  const validDays = dailyMinutes.filter((d): d is number => d !== null);
  if (validDays.length === 0) return null;
  return validDays.reduce((total, minutes) => total + minutes, 0);
}

export function formatSunshineDuration(totalMinutes: number | null): string {
  if (totalMinutes === null) return "Données indisponibles";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours} h ${minutes.toString().padStart(2, '0')} min`;
}

export function calculateSunshineConsistency(
  officialMinutes: number | null,
  estimatedMinutes: number | null
): 'Excellent' | 'Bon' | 'Moyen' | 'Faible' | null {
  if (officialMinutes === null || estimatedMinutes === null) return null;
  const difference = Math.abs(officialMinutes - estimatedMinutes);
  if (difference <= 5) return 'Excellent';
  if (difference <= 15) return 'Bon';
  if (difference <= 30) return 'Moyen';
  return 'Faible';
}

export function convertOfficialSunshineToMinutes(
  sunshineSeconds: number | null | undefined
): number | null {
  if (sunshineSeconds === null || sunshineSeconds === undefined) return null;
  return Math.round(sunshineSeconds / 60);
}

interface WeatherIconInfo {
  icon: string;
  nightIcon?: string;
  description: string;
}

const WMO_DESCRIPTIONS: Record<number, string> = {
  0: "Ciel dégagé", 1: "Principalement dégagé", 2: "Partiellement nuageux", 3: "Couvert",
  10: "Brume légère", 11: "Brume", 12: "Brume épaisse", 13: "Brume givrante", 14: "Brouillard",
  15: "Brouillard givrant", 16: "Brouillard épais", 17: "Brouillard givrant épais", 18: "Précipitations légères intermittentes",
  19: "Précipitations légères continues", 20: "Bruine ou neige en grains", 21: "Pluie",
  22: "Neige", 23: "Pluie et neige mêlées", 24: "Bruine verglaçante", 25: "Averse de pluie",
  26: "Averse de neige", 27: "Averse de grêle", 28: "Brouillard visibilité réduite", 29: "Orage",
  30: "Tempête de poussière légère", 31: "Tempête de poussière", 32: "Tempête de poussière forte",
  33: "Tempête de poussière très forte", 34: "Tempête de poussière intense", 35: "Tempête de poussière extrême",
  36: "Poudrerie faible", 37: "Poudrerie forte", 38: "Chasse-neige élevée", 39: "Chasse-neige très élevée",
  40: "Banc de brouillard", 41: "Brouillard par bancs", 42: "Brouillard s'éclaircissant",
  43: "Brouillard s'éclaircissant ciel invisible", 44: "Brouillard sans changement ciel visible",
  45: "Brouillard sans changement ciel invisible", 46: "Brouillard s'épaississant ciel visible",
  47: "Brouillard s'épaississant ciel invisible", 48: "Brouillard givrant ciel visible",
  49: "Brouillard givrant ciel invisible", 50: "Bruine faible intermittente",
  51: "Bruine faible continue", 52: "Bruine modérée intermittente", 53: "Bruine modérée continue",
  54: "Bruine forte intermittente", 55: "Bruine forte continue", 56: "Bruine verglaçante faible",
  57: "Bruine verglaçante forte", 58: "Bruine et pluie faible", 59: "Bruine et pluie forte",
  60: "Pluie faible intermittente", 61: "Pluie faible continue", 62: "Pluie modérée intermittente",
  63: "Pluie modérée continue", 64: "Pluie forte intermittente", 65: "Pluie forte continue",
  66: "Pluie verglaçante faible", 67: "Pluie verglaçante forte", 68: "Pluie et neige faible",
  69: "Pluie et neige forte", 70: "Chute de neige faible intermittente", 71: "Chute de neige faible continue",
  72: "Chute de neige modérée intermittente", 73: "Chute de neige modérée continue",
  74: "Chute de neige forte intermittente", 75: "Chute de neige forte continue",
  76: "Cristaux de glace", 77: "Neige en grains", 78: "Étoiles de neige isolées", 79: "Granules de glace",
  80: "Averse de pluie faible", 81: "Averse de pluie modérée", 82: "Averse de pluie violente",
  83: "Averse pluie/neige faible", 84: "Averse pluie/neige forte", 85: "Averse de neige faible",
  86: "Averse de neige forte", 87: "Averse de grésil faible", 88: "Averse de grésil forte",
  89: "Averse de grêle faible", 90: "Averse de grêle forte", 91: "Pluie faible orage terminé",
  92: "Pluie forte orage terminé", 93: "Neige légère orage terminé", 94: "Neige forte orage terminé",
  95: "Orage faible ou modéré", 96: "Orage avec grêle", 97: "Orage fort", 98: "Orage avec tempête de poussière",
  99: "Orage violent avec grêle",
};

function getTimeHM(timeStr?: string | null): number {
  if (!timeStr || !timeStr.includes('T')) return 720;
  const timePart = timeStr.split('T')[1];
  if (!timePart || !timePart.includes(':')) return 720;
  const [hour, minute] = timePart.split(':').map(Number);
  if (isNaN(hour) || isNaN(minute)) return 720;
  return hour * 60 + minute;
}

export function getWeatherIcon(
  code: number,
  time?: string,
  sunrise?: string,
  sunset?: string
): { imagePath: string | null; description: string } {
  if (code === null || code === undefined || code < 0 || code > 99) {
    return { imagePath: null, description: "Code invalide" };
  }
  let isNight = false;
  if (time && sunrise && sunset) {
    const hourMinutes = getTimeHM(time);
    const sunriseMinutes = getTimeHM(sunrise);
    const sunsetMinutes = getTimeHM(sunset);
    if (sunriseMinutes < sunsetMinutes) {
      isNight = hourMinutes < sunriseMinutes || hourMinutes > sunsetMinutes;
    } else {
      isNight = false;
    }
  }
  const period = isNight ? "night" : "day";
  const imageName = `${code}.png`;
  const imagePath = `/weather-icons/${period}/${imageName}`;
  const description = WMO_DESCRIPTIONS[code] ?? `Code WMO ${code} - Non défini`;
  return { imagePath, description };
}
