"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ThermometerSun,
  Droplets,
  Wind,
  Sun,
  CloudFog,
  Sparkles,
  Leaf,
  ShieldAlert,
  Info,
  Code,
  AlertTriangle,
} from "lucide-react";

type ClassificationRow = {
  system: string;
  code: string;
  type: string;
  description: string;
  note: string;
  icon: React.ReactNode;
  gradient: string;
  textColor: string;
  darkTextColor: string;
  accent: string;
  darkAccent: string;
  borderColor: string;
  darkBorderColor: string;
};

const classifications: ClassificationRow[] = [
  {
    system: "Köppen–Geiger",
    code: "Csa",
    type: "Climat tempéré à été sec et chaud — méditerranéen",
    description: "Déduit des moyennes mensuelles : mois le plus froid à 13,2 °C, mois le plus chaud à 24,7 °C et été très sec.",
    note: "Précipitations annuelles (571 mm) dépassant le seuil d’aridité calculé selon la répartition saisonnière des pluies.",
    icon: <ThermometerSun className="w-7 h-7 text-emerald-500 dark:text-emerald-400" />,
    gradient: "from-emerald-50 via-teal-50 to-emerald-100 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-emerald-900/30",
    textColor: "text-emerald-800 dark:text-emerald-300",
    darkTextColor: "text-emerald-700 dark:text-emerald-400",
    accent: "text-emerald-600 dark:text-emerald-400",
    darkAccent: "text-emerald-500 dark:text-emerald-300",
    borderColor: "border-emerald-200 dark:border-emerald-800/50",
    darkBorderColor: "border-emerald-300 dark:border-emerald-700",
  },
  {
    system: "Trewartha",
    code: "Cs",
    type: "Climat subtropical à été sec — méditerranéen",
    description: "Les 12 températures moyennes mensuelles dépassent 10 °C ; le régime des pluies présente une sécheresse estivale marquée.",
    note: "Classification à deux lettres pour les climats subtropicaux à saison sèche d’été.",
    icon: <Sun className="w-7 h-7 text-sky-500 dark:text-sky-400" />,
    gradient: "from-sky-50 via-blue-50 to-sky-100 dark:from-sky-900/20 dark:via-blue-900/20 dark:to-sky-900/30",
    textColor: "text-sky-800 dark:text-sky-300",
    darkTextColor: "text-sky-700 dark:text-sky-400",
    accent: "text-sky-600 dark:text-sky-400",
    darkAccent: "text-sky-500 dark:text-sky-300",
    borderColor: "border-sky-200 dark:border-sky-800/50",
    darkBorderColor: "border-sky-300 dark:border-sky-700",
  },
  {
    system: "Alisov (révisé 2023)",
    code: "SmSm",
    type: "Région subtropicale méditerranéenne",
    description: "Masses d’air subtropicales humides en hiver et en été. Table de correspondance : types méditerranéens Csa/Csb.",
    note: "Code de la version révisée 2023. Ne pas présenter comme un code universel de la classification classique d’Alisov.",
    icon: <Wind className="w-7 h-7 text-amber-500 dark:text-amber-400" />,
    gradient: "from-amber-50 via-orange-50 to-amber-100 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-amber-900/30",
    textColor: "text-amber-800 dark:text-amber-300",
    darkTextColor: "text-amber-700 dark:text-amber-400",
    accent: "text-amber-600 dark:text-amber-400",
    darkAccent: "text-amber-500 dark:text-amber-300",
    borderColor: "border-amber-200 dark:border-amber-800/50",
    darkBorderColor: "border-amber-300 dark:border-amber-700",
  },
  {
    system: "Strahler",
    code: "—",
    type: "Climat subtropical à été sec, de type méditerranéen",
    description: "Aucun code alphanumérique standard vérifié pour Kénitra. Type descriptif basé sur les masses d’air régionales.",
    note: "Ne pas utiliser « BS midlat » comme code Strahler ; les références consultées n’en fournissent pas de vérifié.",
    icon: <CloudFog className="w-7 h-7 text-gray-500 dark:text-gray-400" />,
    gradient: "from-gray-50 via-slate-50 to-gray-100 dark:from-gray-900/20 dark:via-slate-900/20 dark:to-gray-900/30",
    textColor: "text-gray-800 dark:text-gray-300",
    darkTextColor: "text-gray-700 dark:text-gray-400",
    accent: "text-gray-600 dark:text-gray-400",
    darkAccent: "text-gray-500 dark:text-gray-300",
    borderColor: "border-gray-200 dark:border-gray-800/50",
    darkBorderColor: "border-gray-300 dark:border-gray-700",
  },
  {
    system: "Thornthwaite",
    code: "C₁ B′₂",
    type: "Climat subhumide sec, mésothermique (estimation)",
    description: "Estimation calculée à partir des températures et précipitations mensuelles, réserve utile du sol supposée de 100 mm.",
    note: "ETP estimée ≈ 885 mm/an, proche du seuil B′₂/B′₃. À présenter comme une estimation, non comme une classe indépendante des hypothèses.",
    icon: <Droplets className="w-7 h-7 text-violet-500 dark:text-violet-400" />,
    gradient: "from-violet-50 via-purple-50 to-violet-100 dark:from-violet-900/20 dark:via-purple-900/20 dark:to-violet-900/30",
    textColor: "text-violet-800 dark:text-violet-300",
    darkTextColor: "text-violet-700 dark:text-violet-400",
    accent: "text-violet-600 dark:text-violet-400",
    darkAccent: "text-violet-500 dark:text-violet-300",
    borderColor: "border-violet-200 dark:border-violet-800/50",
    darkBorderColor: "border-violet-300 dark:border-violet-700",
  },
  {
    system: "Neef — Ernst Neef",
    code: "—",
    type: "Zone subtropicale : pluies hivernales des façades occidentales",
    description: "Type méditerranéen à hiver pluvieux et été sec. Libellé sans code alphanumérique vérifié pour Kénitra.",
    note: "Source consultée donnant ce type sous forme de libellé uniquement.",
    icon: <Leaf className="w-7 h-7 text-rose-500 dark:text-rose-400" />,
    gradient: "from-rose-50 via-pink-50 to-rose-100 dark:from-rose-900/20 dark:via-pink-900/20 dark:to-rose-900/30",
    textColor: "text-rose-800 dark:text-rose-300",
    darkTextColor: "text-rose-700 dark:text-rose-400",
    accent: "text-rose-600 dark:text-rose-400",
    darkAccent: "text-rose-500 dark:text-rose-300",
    borderColor: "border-rose-200 dark:border-rose-800/50",
    darkBorderColor: "border-rose-300 dark:border-rose-700",
  },
];

const martonne = {
  name: "Indice d’aridité de De Martonne",
  value: "19,97",
  type: "Climat semi-aride de type méditerranéen (limite supérieure)",
  description: "I = P / (T + 10) = 571 / (18,6 + 10) = 19,97 — P = 571 mm/an ; T = 18,6 °C.",
  note: "Limite supérieure de la classe « semi-aride de type méditerranéen » selon la grille ECLAC/CEPAL consultée ; valeur très proche du seuil de 20 vers la classe subhumide.",
  icon: <Droplets className="w-7 h-7 text-orange-500 dark:text-orange-400" />,
  gradient: "from-orange-50 via-amber-50 to-orange-100 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-orange-900/30",
  textColor: "text-orange-800 dark:text-orange-300",
  darkTextColor: "text-orange-700 dark:text-orange-400",
  accent: "text-orange-600 dark:text-orange-400",
  darkAccent: "text-orange-500 dark:text-orange-300",
  borderColor: "border-orange-200 dark:border-orange-800/50",
  darkBorderColor: "border-orange-300 dark:border-orange-700",
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 22 },
  },
} as const;

export default function ClassificationsClimatiquesTable() {
  return (
    <Card className="mb-8 overflow-hidden border border-border/50 shadow-xl relative bg-white dark:bg-slate-950">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <CardHeader className="bg-gradient-to-br from-emerald-600 via-teal-700 to-indigo-800 text-white rounded-none pb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex flex-col items-start gap-2"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span className="text-xs text-emerald-100 uppercase tracking-widest font-semibold">
              Classifications climatiques — Kénitra
            </span>
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight text-white mb-1">
            Classifications climatiques de Kénitra
          </CardTitle>
          <p className="text-emerald-100/90 text-sm leading-relaxed max-w-xl">
            Comment Kénitra est classé selon les principaux systèmes de classification climatique mondiaux.
            Chaque ligne inclut son code, son type, sa description et ses notes d’interprétation.
          </p>
        </motion.div>
      </CardHeader>

      <CardContent className="p-0 pt-6 pb-8 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="border-b border-border/40 pb-4 mb-6"
        >
          <Table className="border-collapse text-sm">
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-emerald-600 via-teal-700 to-indigo-800 sticky top-0 z-20">
                <TableHead className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white border-b border-white/20">
                  Système
                </TableHead>
                <TableHead className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-white border-b border-white/20">
                  Code
                </TableHead>
                <TableHead className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white border-b border-white/20">
                  Type / Libellé
                </TableHead>
                <TableHead className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white border-b border-white/20">
                  Description
                </TableHead>
                <TableHead className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white border-b border-white/20">
                  Notes d’interprétation
                </TableHead>
              </TableRow>
            </TableHeader>
            <AnimatePresence mode="wait">
              <motion.tbody initial={false} animate={{}}>
                {classifications.map((row, i) => (
                  <motion.tr
                    key={row.system}
                    variants={rowVariants}
                    initial="hidden"
                    animate="show"
                    transition={{ delay: i * 0.06 }}
                    className="border-b border-border/40 dark:border-slate-700/30 hover:bg-accent/50 dark:hover:bg-accent/10 transition-all duration-300 group relative"
                  >
                    <TableCell className="px-4 py-5 font-medium">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${row.gradient}`}>
                          {row.icon}
                        </div>
                        <div>
                          <div className={`font-bold ${row.textColor} dark:${row.darkTextColor}`}>
                            {row.system}
                          </div>
                          <div className={`text-xs ${row.accent} dark:${row.darkAccent} font-semibold uppercase tracking-wider`}>
                            {row.type}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-5 text-center font-mono text-xl font-bold">
                      <span
                        className={`inline-block px-3 py-1.5 rounded-xl border ${row.borderColor} dark:${row.darkBorderColor} bg-white/40 dark:bg-slate-900/30`}
                      >
                        {row.code}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-5 text-sm">
                      <p className={`font-semibold ${row.textColor} dark:${row.darkTextColor}`}>
                        {row.description}
                      </p>
                    </TableCell>
                    <TableCell className="px-4 py-5 text-sm text-muted-foreground dark:text-muted-foreground/70 leading-relaxed">
                      {row.description.length > 0 ? row.note : ""}
                    </TableCell>
                    <TableCell className="px-4 py-5 text-xs text-muted-foreground dark:text-muted-foreground/60 leading-relaxed italic">
                      {row.note}
                    </TableCell>
                  </motion.tr>
                ))}
                <motion.tr
                  key="martonne"
                  variants={rowVariants}
                  initial="hidden"
                  animate="show"
                  transition={{ delay: classifications.length * 0.06 }}
                  className={`border-b border-border/40 dark:border-slate-700/30 hover:bg-accent/50 dark:hover:bg-accent/10 transition-all duration-300 group bg-gradient-to-r ${martonne.gradient} dark:from-orange-900/20 dark:via-amber-900/20 dark:to-orange-900/30`}
                >
                  <TableCell className="px-4 py-5 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                        {martonne.icon}
                      </div>
                      <div>
                        <div className={`font-bold ${martonne.textColor} dark:${martonne.darkTextColor}`}>
                          {martonne.name}
                        </div>
                        <div className="text-xs text-orange-600 dark:text-orange-400 font-semibold uppercase tracking-wider">
                          Indice d’aridité
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-5 text-center font-mono text-3xl font-black">
                    <span className={`inline-block ${martonne.accent} dark:${martonne.darkAccent} drop-shadow`}>
                      {martonne.value}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-5 text-sm">
                    <p className={`font-semibold ${martonne.textColor} dark:${martonne.darkTextColor}`}>
                      {martonne.type}
                    </p>
                  </TableCell>
                  <TableCell className="px-4 py-5 text-sm text-muted-foreground dark:text-muted-foreground/70 leading-relaxed">
                    {martonne.description}
                  </TableCell>
                  <TableCell className="px-4 py-5 text-xs text-muted-foreground dark:text-muted-foreground/60 leading-relaxed italic">
                    {martonne.note}
                  </TableCell>
                </motion.tr>
              </motion.tbody>
            </AnimatePresence>
          </Table>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
        >
          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-900/80 p-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
              <Info className="w-3 h-3" /> Méthode De Martonne
            </h3>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-border/50">
              <div className="font-mono text-sm text-slate-700 dark:text-slate-300 mb-2">
                I = P / (T + 10)
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                P = 571 mm/an · T = 18,6 °C
              </div>
              <div className="mt-3 pt-3 border-t border-border/40 text-sm font-semibold text-slate-800 dark:text-slate-200">
                Résultat : <span className="text-orange-600 dark:text-orange-400">19,97</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900/50 dark:to-slate-900/80 p-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
              <ShieldAlert className="w-3 h-3" /> Réserve d’interprétation
            </h3>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 dark:text-blue-400">▸</span>
                Thornthwaite est une estimation dépendant de la réserve utile du sol (100 mm supposée).
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 dark:text-blue-400">▸</span>
                Strahler et Neef n’ont pas de code alphanumérique vérifié pour Kénitra.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 dark:text-blue-400">▸</span>
                Alisov SmSm appartient à la version révisée 2023, non à la classification classique.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 dark:text-blue-400">▸</span>
                De Martonne 19,97 est à la limite supérieure du semi-aride méditerranéen, proche du seuil de 20.
              </li>
            </ul>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
