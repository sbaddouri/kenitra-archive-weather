// Vérifie que le port TypeScript reproduit exactement le module Lua.
import {
  getTemperatureStyle,
  getPrecipitationStyle,
  getSunshineStyle,
  getDaysStyle,
  getHumidityStyle,
  getUvStyle,
  getGreenStyle,
  getPastelStyle,
  getNoneStyle,
} from "@/lib/climate-box-colors";

const values: number[] = [];
for (let v = -100; v <= 100; v += 0.5) values.push(v);
for (const v of [165.6, 165.61, 300, 4.5, 23, 41.5, 60, -42.75, -42.78, -23.3, 37.8, 90, 180, 270, 720, 12, 80, 66.67, 133.33, 39, 51, 3, 6, 8, 11, 200, 300]) values.push(v);

const out: Record<string, unknown>[] = [];
for (const v of values) {
  out.push({
    v,
    t: getTemperatureStyle(v),
    p: getPrecipitationStyle(v),
    s: getSunshineStyle(v),
    d: getDaysStyle(v),
    h: getHumidityStyle(v),
    u: getUvStyle(v),
    g: getGreenStyle(v),
    pastel: getPastelStyle(v),
    none: getNoneStyle(),
  });
}
console.log(JSON.stringify(out));
