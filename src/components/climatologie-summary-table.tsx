"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ROW_VARIANTS = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 260, damping: 22 },
  },
} as const;

type ClimateRow = {
  variable: string;
  value: string;
  lecture: string;
  color: string;
  darkColor: string;
  icon?: React.ReactNode;
};

const climateData: ClimateRow[] = [
  {
    variable: "Température moyenne annuelle",
    value: "≈ 18,6 °C",
    lecture: "Climat doux à chaud, avec une saison estivale chaude. Valeur issue des données de la station de Kénitra consultées.",
    color: "text-blue-700",
    darkColor: "text-blue-400",
  },
  {
    variable: "Tmax moyenne la plus élevée",
    value: "≈ 28 °C en août",
    lecture: "Le mois le plus chaud a des journées chaudes, mais cette moyenne est bien inférieure aux records extrêmes.",
    color: "text-red-600",
    darkColor: "text-red-400",
  },
  {
    variable: "Tmin moyenne la plus basse",
    value: "≈ 9 °C en janvier",
    lecture: "Hiver frais la nuit, sans que cela signifie des gelées fréquentes.",
    color: "text-blue-600",
    darkColor: "text-blue-400",
  },
  {
    variable: "Record absolu de chaleur",
    value: "47,2 °C, le 1er juin 2003",
    lecture: "Épisode extrême de chaleur. Record rapporté dans les archives consultées de la station.",
    color: "text-red-700",
    darkColor: "text-red-500",
  },
  {
    variable: "Record absolu de froid",
    value: "−3,5 °C, le 1er janvier 1985",
    lecture: "Une gelée est possible lors d’épisodes rares ; ce record ne décrit pas les hivers habituels.",
    color: "text-blue-800",
    darkColor: "text-blue-300",
  },
  {
    variable: "Précipitations annuelles",
    value: "≈ 340,5 mm/an",
    lecture: "Pluviométrie modérée, concentrée surtout pendant la saison fraîche. À prendre avec prudence : la source signale des lacunes et une série insuffisante pour garantir une normale robuste.",
    color: "text-cyan-600",
    darkColor: "text-cyan-400",
  },
  {
    variable: "Jours avec ≥ 1 mm",
    value: "Non établi de façon fiable",
    lecture: "La source consultée ne permet pas de confirmer un total annuel robuste selon ce seuil précis.",
    color: "text-indigo-600",
    darkColor: "text-indigo-400",
  },
  {
    variable: "Humidité relative moyenne annuelle",
    value: "Non établie",
    lecture: "Je n’ai pas trouvé de normale annuelle vérifiable pour cette valeur dans les sources consultées.",
    color: "text-teal-600",
    darkColor: "text-teal-400",
  },
  {
    variable: "Point de rosée moyen annuel",
    value: "Non établi",
    lecture: "Donnée non confirmée ; elle ne doit pas être déduite de l’humidité ponctuelle ou de la température.",
    color: "text-emerald-600",
    darkColor: "text-emerald-400",
  },
  {
    variable: "Ensoleillement annuel",
    value: "≈ 2 138 h/an, valeur indicative",
    lecture: "La station publie ce cumul, mais l’avertissement sur la qualité et la longueur de la série impose de ne pas le présenter comme une normale officielle solide.",
    color: "text-yellow-600",
    darkColor: "text-yellow-400",
  },
  {
    variable: "Pourcentage d’ensoleillement possible",
    value: "Non établi",
    lecture: "Aucun pourcentage fiable n’a été confirmé ; il dépend aussi de la définition et de la période de référence.",
    color: "text-orange-600",
    darkColor: "text-orange-400",
  },
  {
    variable: "Neige moyenne annuelle",
    value: "Non établie",
    lecture: "Je n’ai pas trouvé de mesure climatologique fiable permettant de chiffrer une moyenne annuelle de neige à Kénitra.",
    color: "text-slate-600",
    darkColor: "text-slate-400",
  },
  {
    variable: "Indice UV max",
    value: "Non établi comme normale climatologique locale",
    lecture: "L’indice UV varie selon la date, l’heure et les conditions atmosphériques ; je ne peux pas attribuer un maximum mensuel fiable à Kénitra avec les sources consultées.",
    color: "text-violet-600",
    darkColor: "text-violet-400",
  },
];

export default function ClimatologieSummaryTable() {
  return (
    <Card className="mb-6 shadow-xl border border-border/50 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white rounded-none pb-6">
        <div className="flex flex-col items-start gap-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-xs text-blue-100 uppercase tracking-widest font-semibold">Données climatologiques — Station de Kénitra</span>
          </div>
          <CardTitle className="text-2xl font-heading font-bold tracking-tight text-white mb-1">
            Résumé climatologique de Kénitra
          </CardTitle>
          <p className="text-blue-100/90 text-sm leading-relaxed max-w-2xl">
            Variables de référence et lecture climatologique — valeurs pour Kénitra, issues des données de la station consultées.
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-6 pb-8 px-6">
        <div className="overflow-x-auto">
          <motion.table className="w-full border-collapse text-sm min-w-full">
            <thead>
              <Tr>
                <Th className="sticky top-0 z-20">Variable</Th>
                <Th className="sticky top-0 z-20 text-center w-48">Valeur pour Kénitra</Th>
                <Th className="sticky top-0 z-20">Lecture climatologique</Th>
              </Tr>
            </thead>
            <AnimatePresence mode="wait">
              <motion.tbody
                initial={false}
                animate={{}}
              >
                {climateData.map((row, i) => (
                  <motion.tr
                    key={row.variable}
                    variants={ROW_VARIANTS}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: i * 0.075 }}
                    className="border-b border-border/60 dark:border-slate-700/40 hover:bg-accent/40 dark:hover:bg-accent/20 transition-all duration-200 group"
                  >
                    <Td className="font-medium font-heading text-foreground dark:text-card-foreground group-hover:text-primary transition-colors">
                      {row.variable}
                    </Td>
                    <Td className={`text-center font-bold tabular-nums ${row.color} dark:${row.darkColor}`}>
                      <span className="inline-block relative">
                        {row.value}
                      </span>
                    </Td>
                    <Td className="text-muted-foreground dark:text-muted-foreground/80 text-sm leading-relaxed">
                      {row.lecture}
                    </Td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </AnimatePresence>
          </motion.table>
        </div>
        <p className="mt-6 text-xs text-muted-foreground dark:text-muted-foreground/60 italic max-w-2xl">
          Valeurs indicatives issues des archives de la station de Kénitra. Certaines variables ne disposent pas de normale vérifiable et sont présentées comme non établies.
        </p>
      </CardContent>
    </Card>
  );
}

function Tr({ children }: { children: React.ReactNode }) {
  return <tr className="bg-white dark:bg-card">{children}</tr>;
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/70 dark:text-foreground/50 bg-white/50 dark:bg-slate-900/80 border-b border-border/60 dark:border-slate-700/40 ${className}`}
    >
      {children}
    </th>
  );
}

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={`px-4 py-4 border-b border-border/60 dark:border-slate-700/40 align-top ${className}`}>
      {children}
    </td>
  );
}
