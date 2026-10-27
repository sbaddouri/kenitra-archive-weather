"use client";

import { motion } from "framer-motion";

const classifications = [
  {
    system: "Köppen",
    code: "Csa",
    description: "Climat tempéré à été sec et chaud — climat méditerranéen.",
    gradient: "from-emerald-500 to-teal-600",
    accent: "text-emerald-100",
  },
  {
    system: "Trewartha",
    code: "Cs",
    description: "Climat subtropical à été sec, de type méditerranéen.",
    gradient: "from-sky-500 to-blue-600",
    accent: "text-sky-100",
  },
  {
    system: "Alisov",
    code: "SmSm",
    description: "Climat subtropical continental semi-aride ou subtropical continental sec.",
    gradient: "from-amber-500 to-orange-600",
    accent: "text-amber-100",
  },
  {
    system: "Strahler",
    code: "—",
    description: "Climat méditerranéen des moyennes latitudes.",
    gradient: "from-lime-500 to-green-600",
    accent: "text-lime-100",
  },
  {
    system: "Thornthwaite",
    code: "C₁ B′₂",
    description: "Climat subhumide sec, mésothermique.",
    gradient: "from-violet-500 to-purple-600",
    accent: "text-violet-100",
  },
  {
    system: "Neef",
    code: "—",
    description: "Climat subtropical à pluies hivernales des façades occidentales.",
    gradient: "from-rose-500 to-pink-600",
    accent: "text-rose-100",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function ClassificationsClimatiques() {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={containerVariants}
      className="mb-6"
    >
      <motion.div variants={cardVariants} className="mb-4 text-center">
        <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-500 via-sky-500 to-violet-500 bg-clip-text text-transparent">
          Classifications Climatiques
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Découvrir comment Kénitra est classé selon les principaux systèmes de classification climatique mondiaux
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {classifications.map((c) => (
          <motion.div
            key={c.system}
            variants={cardVariants}
            whileHover={{ scale: 1.04, y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${c.gradient} p-5 text-white shadow-lg hover:shadow-2xl`}
          >
            <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold uppercase tracking-wider ${c.accent}`}>
                  {c.system}
                </span>
                <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold backdrop-blur">
                  {c.code}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/95">{c.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Martonne card */}
      <motion.div
        variants={cardVariants}
        whileHover={{ scale: 1.02 }}
        className="mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 p-6 text-white shadow-lg hover:shadow-2xl"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-orange-100">
              Indice d'aridité de Martonne
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-5xl font-black drop-shadow">19,97</span>
              <span className="text-sm text-orange-100">/ valeur calculée</span>
            </div>
            <p className="mt-2 text-sm text-white/95 max-w-xl">
              Limite supérieure de la classe « semi-aride de type méditerranéen » dans la grille utilisée par l'ECLAC/CEPAL ; valeur très proche du seuil de 20 vers le subhumide.
            </p>
          </div>
          <div className="rounded-xl bg-white/15 backdrop-blur p-4 text-sm">
            <p className="font-semibold mb-1">Formulaire :</p>
            <p className="font-mono">I = P / (T + 10)</p>
            <p className="mt-1 text-white/90">P = 571 mm, T = 18,6 °C</p>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
