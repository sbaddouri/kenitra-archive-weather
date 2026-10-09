import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import temperatureSpectrum from "../../../plage et spectre de tempÃ©rature.json";
import WeatherCountdown from "@/components/weather-countdown";
import AnimatedClimateTable from "@/components/animated-climate-table";
import ClimateClassificationTable from "@/components/climate-classification-table";
import WeatherBackgroundEffectsWrapper from "@/components/WeatherBackgroundEffectsWrapper";

type TemperatureEntry = {
  "TempÃ©rature (Â°C)": number;
  "TempÃ©rature (Â°F)": number;
  "Hex fond": string;
  "Hex texte": string;
  "AperÃ§u": string;
  "Style CSS": string;
};

const months = ['Jan', 'FÃ©v', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'AoÃ»t', 'Sep', 'Oct', 'Nov', 'DÃ©c', 'AnnÃ©e'];

const climateData = {
  recordHigh: [27.6, 32.9, 35.6, 39.9, 41.5, 44.6, 46.6, 46.3, 43.8, 38.4, 32.3, 29.8, 46.6],
  meanMax: [21.4, 23.7, 28.8, 31.6, 34.9, 38.7, 42.3, 41.5, 36.6, 32.4, 26.3, 21.6, 42.21],
  meanDailyMax: [15.3, 17.4, 20.3, 22.9, 26.8, 31.8, 36.2, 36.0, 30.8, 25.7, 19.6, 15.9, 24.9],
  dailyMean: [10.0, 11.8, 14.4, 16.9, 20.5, 25.0, 28.8, 28.9, 24.7, 20.1, 14.5, 10.9, 18.9],
  meanDailyMin: [4.6, 6.2, 8.5, 10.8, 14.1, 18.1, 21.4, 21.8, 18.6, 14.4, 9.4, 5.9, 12.8],
  meanMin: [-0.5, 1.8, 3.2, 6.4, 9.4, 14.3, 18.0, 17.9, 13.5, 9.4, 3.5, 0.9, -1.07],
  recordLow: [-8.5, -4.2, -2.0, -0.5, 2.0, 6.0, 10.5, 8.8, 5.3, 0.0, -2.0, -3.5, -8.5],
  avgPrecipitation: [20, 24, 30, 27, 23, 8, 3, 6, 16, 27, 30, 19, 233],
  avgSnowfall: [0.11, 0.07, 0.01, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.08, 0.15, 0.42],
  avgPrecipitationDays: [3, 4, 4, 4, 3, 2, 1, 1, 2, 3, 4, 3, 34],
  avgSnowyDays: [0.005, 0.002, 0.001, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.000, 0.002, 0.01],
  avgRelativeHumidity: [65, 61, 55, 51, 46, 40, 36, 39, 50, 56, 64, 69, 58.7],
  avgDewPoint: [3.8, 4.5, 5.7, 6.8, 8.7, 10.9, 11.9, 13.1, 12.9, 10.5, 7.0, 4.8, 8.4],
  meanMonthlySunshine: [210.8, 198.8, 244.9, 258.0, 300.7, 318.0, 347.2, 322.4, 270.0, 248.0, 207.0, 204.6, 3130.4],
  percentagePossibleSunshine: [68.0, 64.5, 65.8, 66.2, 69.3, 72.1, 77.8, 77.6, 72.6, 70.8, 66.3, 66.0, 70.0],
  avgUvIndex: [3, 5, 8, 9, 11, 12, 11, 10, 9, 7, 5, 4, 8]
};

const getTempStyle = (temp: number) => {
  // Find the closest temperature entry
  let closestEntry: TemperatureEntry | undefined;
  let minDiff = Infinity;

  for (const entry of temperatureSpectrum as TemperatureEntry[]) {
    const diff = Math.abs(entry["TempÃ©rature (Â°C)"] - temp);
    if (diff < minDiff) {
      minDiff = diff;
      closestEntry = entry;
    }
  }

  if (closestEntry) {
    return {
      backgroundColor: closestEntry["Hex fond"],
      color: closestEntry["Hex texte"],
    };
  }
  return {};
};

const getPrecipitationStyle = (mm: number) => {
  // Clamp mm to 0-300 range
  const clampedMm = Math.max(0, Math.min(300, mm));
  
  // Calculate color components based on the pattern from the original data
  let red: number;
  let green: number;
  
  if (clampedMm <= 30) {
    // 0-30mm: From #FFFFFF (255,255) to #D0D0FF (208,208)
    const ratio = clampedMm / 30;
    red = Math.round(255 - ratio * 47); // 255 â†’ 208
    green = red;
  } else {
    // 30-300mm: From #D0D0FF (208,208) to #0000FF (0,0)
    const ratio = (clampedMm - 30) / (300 - 30);
    red = Math.round(208 - ratio * 208); // 208 â†’ 0
    green = red;
  }
  
  // Convert to hex
  const rHex = red.toString(16).padStart(2, '0').toUpperCase();
  const gHex = green.toString(16).padStart(2, '0').toUpperCase();
  const bHex = 'FF';
  
  // Determine text color: white if red/green < 128, black otherwise
  const textColor = red < 128 ? 'FFFFFF' : '000000';
  
  return {
    backgroundColor: `#${rHex}${gHex}${bHex}`,
    color: `#${textColor}`,
  };
};

const getColorClass = (type: string, value: number) => {
  switch (type) {
    case 'temp':
      return ''; // Handled by inline style now
    case 'precipitation':
      if (value === 0) return 'bg-gray-200';
      if (value < 10) return 'bg-cyan-200';
      if (value < 20) return 'bg-cyan-400';
      if (value < 30) return 'bg-green-300';
      return 'bg-green-500 text-white';
    case 'humidity':
      if (value < 40) return 'bg-blue-400 text-white';
      if (value < 50) return 'bg-blue-500 text-white';
      if (value < 60) return 'bg-blue-600 text-white';
      return 'bg-blue-700 text-white';
    case 'sunshine':
      return 'bg-yellow-300';
    case 'uv':
      if (value < 3) return 'bg-yellow-300';
      if (value < 6) return 'bg-yellow-500';
      if (value < 8) return 'bg-orange-500';
      if (value < 10) return 'bg-red-500 text-white';
      return 'bg-purple-600 text-white';
    default:
      return '';
  }
};

export default function ClimatologiePage() {
  return (
    <div className="space-y-8 relative">
      <WeatherBackgroundEffectsWrapper />
      <WeatherCountdown />
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Climatologie de KÃ©nitra</h1>
        <p className="text-muted-foreground">DonnÃ©es climatiques moyennes et records pour la ville de KÃ©nitra (1940â€“present).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Profil Climatique</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <h3 className="mt-6 mb-4"><strong>1. Position de KÃ©nitra dans le systÃ¨me climatique marocain :</strong></h3>
            <p>
              KÃ©nitra appartient au Maroc oriental intÃ©rieur, dans le couloir de la Moulouya et dans le bassin de KÃ©nitra, Ã  lâ€™interface des influences rifaines, atlasiques et sahariennes. Câ€™est prÃ©cisÃ©ment cette position de charniÃ¨re qui donne Ã  son climat sa personnalitÃ© : ni vÃ©ritable mÃ©diterranÃ©en maritime, ni saharien absolu, mais un climat intÃ©rieur trÃ¨s sec, trÃ¨s ensoleillÃ©, fortement continentalisÃ©, Ã  dominante semi-aride Ã  tendance aride, avec une saisonnalitÃ© des pluies de type mÃ©diterranÃ©en dÃ©gradÃ©. Le Maroc est globalement commandÃ© par la latitude, lâ€™effet de continentalitÃ©, lâ€™influence mÃ©diterranÃ©enne, lâ€™Atlantique, le courant froid des Canaries, lâ€™orographie du Rif et de lâ€™Atlas, et les intrusions sahariennes ; dans lâ€™Oriental intÃ©rieur, ces facteurs ne sâ€™annulent pas, ils se superposent.
            </p>
            <p>
              Autrement dit, KÃ©nitra est une ville dâ€™intÃ©rieur, protÃ©gÃ©e des effets rÃ©gulateurs marins les plus francs, mais pas coupÃ©e des grandes circulations atlantiques et mÃ©diterranÃ©ennes. Elle reÃ§oit peu dâ€™eau, beaucoup de soleil, de fortes amplitudes thermiques, et subit des contrastes saisonniers bien plus nets que les faÃ§ades littorales du Maroc. Câ€™est un climat oÃ¹ lâ€™Ã©nergie radiative domine, oÃ¹ lâ€™Ã©vaporation potentielle est trÃ¨s forte, et oÃ¹ lâ€™eau est la variable limitante majeure pendant une grande partie de lâ€™annÃ©e.
            </p>
            
            <h3 className="mt-6 mb-4"><strong>2. Lecture synthÃ©tique de votre tableau climatique :</strong></h3>
            <p>
              Ã€ partir de votre tableau, le signal climatique de fond est trÃ¨s clair :
            </p>
            <AnimatedClimateTable />
            <p>
              Le trait fondamental nâ€™est donc pas seulement â€œÃ©tÃ© chaud / hiver douxâ€, formulation beaucoup trop pauvre ; le trait fondamental est : sÃ©cheresse structurelle + forte continentalitÃ© thermique + insolation remarquable + grande variabilitÃ© interannuelle des pluies + risque simultanÃ© de gel radiatif hivernal et de canicule estivale.
            </p>

            <h3 className="mt-6 mb-4"><strong>3. RÃ©gime thermique : un climat plus continental quâ€™on ne lâ€™imagine :</strong></h3>
            <p>
              Thermiquement, KÃ©nitra prÃ©sente une amplitude annuelle marquÃ©e. La moyenne journaliÃ¨re passe de 10,0 Â°C en janvier Ã  28,9 Â°C en aoÃ»t, soit prÃ¨s de 19 Â°C dâ€™Ã©cart. La moyenne des maximales quotidiennes grimpe de 15,3 Â°C en janvier Ã  36,2 Â°C en juillet ; les minimales moyennes passent de 4,6 Â°C en janvier Ã  21,8 Â°C en aoÃ»t. Cela traduit un climat intÃ©rieur, trÃ¨s Ã©loignÃ© du lissage thermique cÃ´tier.
            </p>
            <p>
              Plus encore, la chaleur nâ€™est pas seulement â€œforteâ€, elle est structurellement durable. DÃ¨s mai, la maximale moyenne atteint 26,8 Â°C, puis 31,8 Â°C en juin, 36,2 Â°C en juillet, 36,0 Â°C en aoÃ»t, et 30,8 Â°C encore en septembre. La saison chaude est donc longue, intense, et Ã©nergÃ©tiquement dominante. Elle ne se limite pas Ã  deux mois, elle sâ€™Ã©tire en pratique de la fin du printemps au dÃ©but de lâ€™automne.
            </p>
            <p>
              Inversement, lâ€™hiver nâ€™est pas rigoureusement froid en moyenne, mais il est suffisamment continental pour permettre des nuits froides et des gelÃ©es. Avec 4,6 Â°C de minimale moyenne en janvier et un record absolu Ã  -8,5 Â°C, on nâ€™est pas du tout dans un climat tropical doux dâ€™hiver. KÃ©nitra possÃ¨de un hiver modeste en durÃ©e, mais rÃ©el en capacitÃ© de refroidissement nocturne. Les nuits calmes, sÃ¨ches, Ã  ciel clair, favorisent des pertes radiatives trÃ¨s efficaces et des inversions thermiques, surtout en contexte de bassin et de drainage dâ€™air froid.
            </p>
            <p>
              Le rÃ©sultat pratique est le suivant : journÃ©es estivales trÃ¨s chaudes, nuits hivernales capables de dÃ©crocher franchement, ce qui est exactement la signature dâ€™un climat intÃ©rieur semi-aride continentalisÃ©.
            </p>

            <h3 className="mt-6 mb-4"><strong>4. Lâ€™Ã©tÃ© de KÃ©nitra : chaleur sÃ¨che, ciel ouvert, rayonnement brutal :</strong></h3>
            <p>
              Lâ€™Ã©tÃ© KÃ©nitrai nâ€™est pas seulement chaud ; il est radiatif. Avec 318 h de soleil en juin, 347,2 h en juillet, 322,4 h en aoÃ»t et un pourcentage dâ€™ensoleillement possible de 72 Ã  78 % sur cette pÃ©riode, lâ€™atmosphÃ¨re estivale est dominÃ©e par la subsidence, la stabilitÃ© et la faiblesse de la nÃ©bulositÃ©. Cela signifie : fort flux solaire, Ã©chauffement rapide des surfaces, tempÃ©ratures de sol Ã©levÃ©es, assÃ¨chement accÃ©lÃ©rÃ© des horizons superficiels, et forte Ã©vapotranspiration potentielle.
            </p>
            <p>
              Lâ€™humiditÃ© relative moyenne tombe Ã  40 % en juin, 36 % en juillet et 39 % en aoÃ»t. Câ€™est une information capitale. Une chaleur Ã  36 Â°C avec 36â€“40 % dâ€™humiditÃ© nâ€™est pas une chaleur maritime lourde ; câ€™est une chaleur sÃ¨che, plus â€œbrÃ»lanteâ€ que moite, avec refroidissement nocturne encore possible hors Ã©pisodes de vent chaud persistant. Le point de rosÃ©e moyen, qui ne dÃ©passe quâ€™environ 13 Â°C au cÅ“ur de lâ€™Ã©tÃ©, confirme que lâ€™air est chaud mais rarement franchement tropical. Câ€™est un Ã©tÃ© dâ€™air sec, pas un Ã©tÃ© de lourdeur humide.
            </p>
            <p>
              Lâ€™indice UV culmine Ã  12 en juin et reste Ã  11 en juillet. Cela situe KÃ©nitra dans un contexte de rayonnement ultraviolet trÃ¨s fort Ã  extrÃªme en saison chaude. En termes biomÃ©tÃ©orologiques, cela implique stress radiatif, dessiccation foliaire accrue, et exposition solaire sÃ©vÃ¨re pour lâ€™humain comme pour les cultures.
            </p>

            <h3 className="mt-6 mb-4"><strong>5. Le rÃ©gime pluviomÃ©trique : peu de pluie, peu de jours de pluie, mais des pluies parfois efficaces et parfois violentes :</strong></h3>
            <p>
              Le cumul annuel de 233 mm est faible. Mais il faut aller plus loin que ce chiffre. Le plus important est la rÃ©partition et la frÃ©quence.
            </p>
            <p>
              Sur vos donnÃ©es, la pluie se concentre surtout entre lâ€™automne, lâ€™hiver et le printemps. De juin Ã  septembre, le total nâ€™est que de 33 mm. Ã€ lâ€™inverse, dâ€™octobre Ã  mai, on recueille environ 200 mm, soit lâ€™essentiel du budget annuel. Cela signe une saison sÃ¨che estivale nette, conforme Ã  un rythme mÃ©diterranÃ©en, mais sur un fond nettement plus sec que le littoral.
            </p>
            <p>
              Cependant, KÃ©nitra ne prÃ©sente pas exactement un simple maximum hivernal ocÃ©anique. Le Maroc oriental intÃ©rieur, dans la Moulouya, est justement connu pour un rÃ©gime Ã  maximum printanier ou printano-hivernal, parfois qualifiÃ© de rÃ©gime â€œmoulouyenâ€, liÃ© Ã  lâ€™Ã©chauffement plus rapide des terres continentales et au dÃ©veloppement de pluies convectives Ã  lâ€™est de lâ€™Atlas. Votre tableau le montre bien : mars et novembre sont Ã  30 mm, avril Ã  27 mm, mai Ã  23 mm ; lâ€™axe marsâ€“mai est trÃ¨s actif par rapport au cÅ“ur de lâ€™hiver.
            </p>
            <p>
              Les pluies sont en outre peu frÃ©quentes : 34 jours par an avec au moins 1 mm. Cela signifie que le climat nâ€™est pas seulement sec en cumul, il lâ€™est aussi en occurrence. Le systÃ¨me hydrique repose donc sur un petit nombre dâ€™Ã©pisodes, parfois modÃ©rÃ©s, parfois concentrÃ©s, parfois convectifs. Câ€™est prÃ©cisÃ©ment ce type de climat qui alterne longues pÃ©riodes de sÃ©cheresse atmosphÃ©rique et Ã©pisodes pluvieux ponctuellement efficaces, voire brutaux.
            </p>
            <p>
              Les travaux sur la Moulouya montrent dâ€™ailleurs une forte irrÃ©gularitÃ© spatio-temporelle des pluies, avec plusieurs Ã©chelles de variabilitÃ©, notamment un mode dominant de 4 Ã  8 ans, et rappellent que les crues de lâ€™oued Moulouya et de ses affluents menacent des villes comme KÃ©nitra. Le paradoxe des climats semi-arides apparaÃ®t ici pleinement : peu de pluie en moyenne, mais un vrai risque dâ€™averses intenses et de crues rapides.
            </p>

            <h3 className="mt-6 mb-4"><strong>6. HygromÃ©trie et point de rosÃ©e : la vraie signature psychromÃ©trique de KÃ©nitra :</strong></h3>
            <p>
              Vos valeurs dâ€™humiditÃ© relative et de point de rosÃ©e sont particuliÃ¨rement instructives, et elles sont trop souvent ignorÃ©es dans les descriptions climatiques banales.
            </p>
            <p>
              En hiver, lâ€™humiditÃ© relative moyenne de 61 Ã  69 % sâ€™accompagne de points de rosÃ©e autour de 4 Ã  5 Â°C. Cela donne une sensation dâ€™air frais mais pas saturÃ©, souvent calme, parfois brumeux ou humide en matinÃ©e si lâ€™inversion se met en place, mais sans lâ€™omniprÃ©sence dâ€™un air littoral humide.
            </p>
            <p>
              Au printemps, lâ€™humiditÃ© recule progressivement de 55 % en mars Ã  46 % en mai. Cela correspond Ã  la mise en rÃ©gime du sÃ©chage atmosphÃ©rique et des surfaces.
            </p>
            <p>
              En Ã©tÃ©, la combinaison 36â€“40 % dâ€™humiditÃ© relative et points de rosÃ©e autour de 11 Ã  13 Â°C indique une chaleur sÃ¨che, Ã  forte capacitÃ© Ã©vaporative. En dâ€™autres termes, la transpiration et lâ€™Ã©vaporation fonctionnent trÃ¨s bien tant que lâ€™eau est disponible ; mais justement, lâ€™eau manque. Pour la vÃ©gÃ©tation, ce couple â€œrayonnement fort + chaleur + faible humiditÃ© + longue saison sÃ¨cheâ€ est beaucoup plus contraignant que la seule valeur de tempÃ©rature.
            </p>
            <p>
              En automne, lâ€™humiditÃ© remonte, signe de la rÃ©activation progressive des circulations perturbÃ©es et dâ€™une baisse de la capacitÃ© dessÃ©chante de lâ€™air.
            </p>

            <h3 className="mt-6 mb-4"><strong>7. Insolation, nÃ©bulositÃ© et bilan radiatif :</strong></h3>
            <p>
              Avec plus de 3 130 heures de soleil par an, KÃ©nitra appartient clairement au domaine trÃ¨s ensoleillÃ© du Maroc intÃ©rieur. Ce nâ€™est pas anecdotique : lâ€™ensoleillement est ici une variable structurante, pas une simple commoditÃ©.
            </p>
            <p>
              Un ensoleillement de cette ampleur signifie :
            </p>
            <ul className="list-none pl-0 space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-xl leading-5 flex-shrink-0">o</span>
                <span>bilan radiatif positif trÃ¨s puissant au printemps et en Ã©tÃ© ;</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-xl leading-5 flex-shrink-0">o</span>
                <span>rÃ©chauffement diurne rapide des sols et des basses couches ;</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-xl leading-5 flex-shrink-0">o</span>
                <span>forte capacitÃ© convective au printemps quand de lâ€™air plus froid dâ€™altitude vient survoler une surface dÃ©jÃ  chauffÃ©e ;</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-xl leading-5 flex-shrink-0">o</span>
                <span>amplitude thermique diurne souvent bien marquÃ©e ;</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-xl leading-5 flex-shrink-0">o</span>
                <span>dessiccation rapide des horizons superficiels ;</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-xl leading-5 flex-shrink-0">o</span>
                <span>charge thermique importante sur les cultures, les bÃ¢timents et les organismes.</span>
              </li>
            </ul>
            <p>
              Quand on met en regard cet ensoleillement avec la faiblesse pluviomÃ©trique, lâ€™interprÃ©tation est sans ambiguÃ¯tÃ© : KÃ©nitra fonctionne comme un climat Ã  surplus dâ€™Ã©nergie mais Ã  dÃ©ficit hydrique.
            </p>

            <h3 className="mt-6 mb-4"><strong>8. Configuration terrestre et effets de site : bassin, couloir, drainage et ombre pluviomÃ©trique :</strong></h3>
            <p>
              La gÃ©ographie rÃ©gionale explique Ã©normÃ©ment. Le climat de KÃ©nitra ne se comprend pas seulement par sa latitude, mais par sa situation de bassin/couloir intÃ©rieur dans lâ€™ensemble de la Moulouya, au contact de reliefs qui filtrent, dÃ©vient et modulent les flux.
            </p>
            <p>
              Lâ€™orographie marocaine joue un rÃ´le majeur dans lâ€™organisation des pluies. Le Rif et les chaÃ®nes atlasiques perturbent la pÃ©nÃ©tration des masses dâ€™air humides, crÃ©ent des contrastes spatiaux trÃ¨s forts, et favorisent Ã  lâ€™est intÃ©rieur des conditions plus sÃ¨ches par continentalitÃ© et effet dâ€™abri relatif. Ã€ lâ€™Ã©chelle du Maroc oriental intÃ©rieur, les terres se rÃ©chauffent rapidement, ce qui favorise au printemps les dÃ©veloppements convectifs, mais lâ€™effet global du relief reste celui dâ€™une rÃ©duction de lâ€™apport humide rÃ©gulier par rapport aux faÃ§ades plus exposÃ©es.
            </p>
            <p>
              Ã€ lâ€™Ã©chelle locale, cette configuration favorise aussi les inversions nocturnes : lâ€™air froid plus dense glisse vers les bas-fonds, sâ€™y accumule, et accentue les minimales au petit matin lors des nuits calmes et dÃ©gagÃ©es. Câ€™est lâ€™une des raisons pour lesquelles une zone horticole moyenne relativement douce peut tout de mÃªme enregistrer des gelÃ©es fortes et des poches froides.
            </p>

            <h3 className="mt-6 mb-4"><strong>9. Dynamiques atmosphÃ©riques Ã  grande Ã©chelle : ce qui fait vraiment le temps Ã  KÃ©nitra :</strong></h3>
            <p>
              Le Maroc est commandÃ© alternativement par des situations anticycloniques subtropicales et par des sÃ©quences perturbÃ©es dâ€™origine atlantique/mÃ©diterranÃ©enne. Quand lâ€™extension de lâ€™anticyclone des AÃ§ores sâ€™Ã©tire vers le Maroc, lâ€™atmosphÃ¨re se stabilise, la subsidence domine, la convection profonde est inhibÃ©e et les perturbations des moyennes latitudes sont refoulÃ©es ou affaiblies. Ce type de configuration entretient les sÃ©quences sÃ¨ches, y compris pendant la saison supposÃ©e humide.
            </p>
            <p>
              Ã€ lâ€™inverse, les Ã©pisodes pluvieux significatifs sont associÃ©s Ã  des circulations cycloniques, Ã  des talwegs dâ€™altitude, et Ã  des dÃ©pressions positionnÃ©es Ã  lâ€™ouest ou au nord-ouest du Maroc, capables dâ€™advecter de lâ€™air humide de secteurs ouest, nord-ouest ou sud-ouest. Ce sont ces situations qui redonnent de lâ€™instabilitÃ©, permettent la cyclogenÃ¨se secondaire ou la convection organisÃ©e, et apportent les pluies utiles.
            </p>
            <p>
              Pour le bassin de KÃ©nitra, des travaux rÃ©cents soulignent Ã©galement le rÃ´le combinÃ© des dÃ©pressions atlantiques, des dÃ©pressions mÃ©diterranÃ©ennes, des riviÃ¨res atmosphÃ©riques comme apporteurs dâ€™humiditÃ©, ainsi que lâ€™influence des rÃ©gimes zonaux, mÃ©ridiens et de blocage. Le relief local module ensuite la rÃ©partition fine des quantitÃ©s.
            </p>

            <h3 className="mt-6 mb-4"><strong>10. Les saisons :</strong></h3>
            <h4 className="mt-4 mb-3"><strong>Hiver :</strong></h4>
            <p>
              Lâ€™hiver KÃ©nitrai est une saison fraÃ®che, modÃ©rÃ©ment humide Ã  lâ€™Ã©chelle locale mais pauvre en pluies Ã  lâ€™Ã©chelle absolue. Les perturbations peuvent circuler, mais elles nâ€™arrosent pas avec la rÃ©gularitÃ© dâ€™un climat ocÃ©anisÃ©. Le ciel clair entre deux Ã©pisodes favorise de fortes pertes radiatives nocturnes ; dâ€™oÃ¹ les gelÃ©es possibles, parfois sÃ©vÃ¨res. Les journÃ©es restent souvent lumineuses et relativement tempÃ©rÃ©es. Câ€™est un hiver dâ€™alternance : passages perturbÃ©s modestes, puis longues accalmies stables.
            </p>
            <h4 className="mt-4 mb-3"><strong>Printemps :</strong></h4>
            <p>
              Le printemps est la saison charniÃ¨re la plus intÃ©ressante. Le rÃ©chauffement des terres devient rapide, lâ€™atmosphÃ¨re peut gagner en instabilitÃ©, et la rÃ©gion de la Moulouya montre volontiers un maximum pluviomÃ©trique relatif Ã  cette saison. Câ€™est la saison des contrastes : belles journÃ©es lumineuses, vent parfois agitÃ©, Ã©pisodes convectifs, averses orageuses, grÃªle ponctuelle possible, et dÃ©marrage franc de la sÃ©cheresse de surface dÃ¨s que les pluies cessent.
            </p>
            <h4 className="mt-4 mb-3"><strong>Ã‰tÃ© :</strong></h4>
            <p>
              Lâ€™Ã©tÃ© est long, trÃ¨s chaud, trÃ¨s sec, trÃ¨s lumineux. La subsidence subtropicale domine, les pluies deviennent anecdotiques, lâ€™humiditÃ© chute, les sols se vident, la vÃ©gÃ©tation non irriguÃ©e entre en stress marquÃ©. Les Ã©pisodes de vent chaud continental peuvent faire bondir les tempÃ©ratures vers les extrÃªmes. Le chergui, vent dâ€™est Ã  sud-est chaud, sec et poussiÃ©reux, est lâ€™une des expressions les plus typiques de cette dynamique maroco-saharienne.
            </p>
            <h4 className="mt-4 mb-3"><strong>Automne :</strong></h4>
            <p>
              Lâ€™automne marque la reprise potentielle de lâ€™activitÃ© pluviogÃ¨ne, mais sur des sols souvent dessÃ©chÃ©s et parfois encroÃ»tÃ©s. Câ€™est une saison mÃ©tÃ©orologiquement dÃ©licate : les premiÃ¨res perturbations peuvent Ãªtre bÃ©nÃ©fiques, mais les Ã©pisodes intenses de courte durÃ©e peuvent produire ruissellement rapide et crues. Dans les rÃ©gions semi-arides, ce nâ€™est pas la quantitÃ© annuelle qui suffit Ã  caractÃ©riser le risque ; câ€™est aussi lâ€™intensitÃ© des Ã©vÃ©nements.
            </p>

            <h3 className="mt-6 mb-4"><strong>11. ExtrÃªmes thermiques :</strong></h3>
            <p>
              Votre sÃ©rie est trÃ¨s parlante : record absolu de 46,6 Â°C et record absolu de -8,5 Â°C. Lâ€™amplitude absolue atteint donc 55,1 Â°C. Câ€™est Ã©norme, et cela signe une continentalitÃ© rÃ©elle.
            </p>
            <p>
              Cette amplitude est rendue possible par quatre facteurs principaux : ciel souvent dÃ©gagÃ©, air souvent sec, Ã©loignement modÃ©rÃ© des influences maritimes rÃ©gulatrices, et topographie favorable Ã  lâ€™accumulation dâ€™air froid en hiver tout en laissant sâ€™exprimer les advections brÃ»lantes en Ã©tÃ©.
            </p>
            <p>
              Climatologiquement, cela veut dire quâ€™il ne faut jamais rÃ©sumer KÃ©nitra par â€œhiver douxâ€. Un hiver de moyenne douce nâ€™empÃªche nullement des dÃ©crochages sÃ©vÃ¨res. De mÃªme, un Ã©tÃ© â€œmoyenâ€ Ã  36 Â°C de maximale nâ€™empÃªche pas des pointes exceptionnellement hautes lors des advections sahariennes.
            </p>

            <h3 className="mt-6 mb-4"><strong>12. Zone de rusticitÃ© USDA :</strong></h3>
            <p>
              La carte USDA repose non pas sur la tempÃ©rature record absolue, mais sur la moyenne des minima extrÃªmes annuels hivernaux. Le systÃ¨me USDA fonctionne par zones de 10 Â°F, subdivisÃ©es en demi-zones de 5 Â°F. La zone 10a correspond Ã  une moyenne annuelle des extrÃªmes minimaux comprise entre 30 et 35 Â°F, soit -1,1 Ã  +1,7 Â°C.
            </p>
            <p>
              Or votre tableau donne une moyenne minimum annuelle de -1,07 Â°C, soit pratiquement la borne infÃ©rieure de 10a. Donc oui : KÃ©nitra peut Ãªtre classÃ© en USDA 10a.
            </p>
            <p>
              Mais le point capital, que beaucoup ratent, est le suivant : USDA 10a ne veut pas dire absence de gel sÃ©vÃ¨re. Cela signifie seulement que la moyenne des minima extrÃªmes annuels se place dans cette tranche. Le record de -8,5 Â°C montre quâ€™en situation exceptionnelle, KÃ©nitra peut sortir trÃ¨s nettement de la â€œdouceur moyenneâ€ de la zone 10a. Le systÃ¨me USDA lui-mÃªme rappelle dâ€™ailleurs que les microclimats, le vent, lâ€™humiditÃ©, la topographie, la durÃ©e du froid et lâ€™exposition modifient fortement le risque rÃ©el.
            </p>
            <p>
              En langage horticole sÃ©rieux, je dirais donc ceci : KÃ©nitra est 10a en moyenne climatologique, mais avec un risque ponctuel de comportement local de type 9b, voire plus froid dans les poches radiatives et lors des dÃ©crochages exceptionnels. Câ€™est une nuance essentielle.
            </p>

            <h3 className="mt-6 mb-4"><strong>13. Le vrai diagnostic climatique :</strong></h3>
            <p>
              KÃ©nitra prÃ©sente un climat intÃ©rieur du Maroc oriental Ã  dominante semi-aride fortement continentalisÃ©e, Ã  nette sÃ©cheresse estivale, pluviomÃ©trie faible et irrÃ©guliÃ¨re, trÃ¨s forte insolation, fortes chaleurs estivales, refroidissements nocturnes hivernaux marquÃ©s, Ã©pisodes de gel possibles, influence synoptique combinÃ©e des dorsales subtropicales, des talwegs atlantiques et mÃ©diterranÃ©ens, et modulation locale importante par le relief et le bassin de la Moulouya.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Records Historiques</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Indicateur</TableHead>
                  <TableHead>Valeur</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>TempÃ©rature Max</TableCell>
                  <TableCell className="text-red-500 font-bold">46.6Â°C</TableCell>
                  <TableCell>10 juillet 2023</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>TempÃ©rature Min</TableCell>
                  <TableCell className="text-blue-500 font-bold">-8.5Â°C</TableCell>
                  <TableCell>8 janvier 1965</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>PrÃ©cipitations (24h)</TableCell>
                  <TableCell className="text-cyan-500 font-bold">85 mm</TableCell>
                  <TableCell>Novembre 2014</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <ClimateClassificationTable />

      <Card className="overflow-x-auto">
        <CardHeader>
          <CardTitle>DonnÃ©es Climatiques DÃ©taillÃ©es (1940â€“2025)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-max border border-black">
              <TableHeader>
                <TableRow className="border-b border-black">
                  <TableHead className="bg-gray-100 dark:bg-gray-800 sticky left-0 z-10 border-r border-black">Mois</TableHead>
                  {months.map((m, i) => (
                    <TableHead key={i} className="bg-gray-100 dark:bg-gray-800 text-center min-w-[80px] border-r border-black last:border-r-0">
                      {m}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Record High */}
                <TableRow className="border-b border-black">
                  <TableCell className="bg-gray-50 dark:bg-gray-900 sticky left-0 z-10 font-semibold border-r border-black">Record haut Â°C (Â°F)</TableCell>
                  {climateData.recordHigh.map((v, i) => (
                    <TableCell key={i} className="text-center border-r border-black last:border-r-0" style={getTempStyle(v)}>
                      {v}Â° ({Math.round(v * 9/5 + 32)}Â°F)
                    </TableCell>
                  ))}
                </TableRow>
                {/* Mean Maximum */}
                <TableRow className="border-b border-black">
                  <TableCell className="bg-gray-50 dark:bg-gray-900 sticky left-0 z-10 font-semibold border-r border-black">Moyenne max Â°C (Â°F)</TableCell>
                  {climateData.meanMax.map((v, i) => (
                    <TableCell key={i} className="text-center border-r border-black last:border-r-0" style={getTempStyle(v)}>
                      {v}Â° ({Math.round(v * 9/5 + 32)}Â°F)
                    </TableCell>
                  ))}
                </TableRow>
                {/* Mean Daily Maximum */}
                <TableRow className="border-b border-black">
                  <TableCell className="bg-gray-50 dark:bg-gray-900 sticky left-0 z-10 font-semibold border-r border-black">Moyenne quotidienne max Â°C (Â°F)</TableCell>
                  {climateData.meanDailyMax.map((v, i) => (
                    <TableCell key={i} className="text-center border-r border-black last:border-r-0" style={getTempStyle(v)}>
                      {v}Â° ({Math.round(v * 9/5 + 32)}Â°F)
                    </TableCell>
                  ))}
                </TableRow>
                {/* Daily Mean */}
                <TableRow className="border-b border-black">
                  <TableCell className="bg-gray-50 dark:bg-gray-900 sticky left-0 z-10 font-semibold border-r border-black">Moyenne quotidienne Â°C (Â°F)</TableCell>
                  {climateData.dailyMean.map((v, i) => (
                    <TableCell key={i} className="text-center border-r border-black last:border-r-0" style={getTempStyle(v)}>
                      {v}Â° ({Math.round(v * 9/5 + 32)}Â°F)
                    </TableCell>
                  ))}
                </TableRow>
                {/* Mean Daily Minimum */}
                <TableRow className="border-b border-black">
                  <TableCell className="bg-gray-50 dark:bg-gray-900 sticky left-0 z-10 font-semibold border-r border-black">Moyenne quotidienne min Â°C (Â°F)</TableCell>
                  {climateData.meanDailyMin.map((v, i) => (
                    <TableCell key={i} className="text-center border-r border-black last:border-r-0" style={getTempStyle(v)}>
                      {v}Â° ({Math.round(v * 9/5 + 32)}Â°F)
                    </TableCell>
                  ))}
                </TableRow>
                {/* Mean Minimum */}
                <TableRow className="border-b border-black">
                  <TableCell className="bg-gray-50 dark:bg-gray-900 sticky left-0 z-10 font-semibold border-r border-black">Moyenne min Â°C (Â°F)</TableCell>
                  {climateData.meanMin.map((v, i) => (
                    <TableCell key={i} className="text-center border-r border-black last:border-r-0" style={getTempStyle(v)}>
                      {v}Â° ({Math.round(v * 9/5 + 32)}Â°F)
                    </TableCell>
                  ))}
                </TableRow>
                {/* Record Low */}
                <TableRow className="border-b border-black">
                  <TableCell className="bg-gray-50 dark:bg-gray-900 sticky left-0 z-10 font-semibold border-r border-black">Record bas Â°C (Â°F)</TableCell>
                  {climateData.recordLow.map((v, i) => (
                    <TableCell key={i} className="text-center border-r border-black last:border-r-0" style={getTempStyle(v)}>
                      {v}Â° ({Math.round(v * 9/5 + 32)}Â°F)
                    </TableCell>
                  ))}
                </TableRow>
                {/* Average Precipitation */}
                <TableRow className="border-b border-black">
                  <TableCell className="bg-gray-50 dark:bg-gray-900 sticky left-0 z-10 font-semibold border-r border-black">PrÃ©cipitations moy. mm (pouces)</TableCell>
                  {climateData.avgPrecipitation.map((v, i) => {
                    // Pour la valeur annuelle, on utilise la moyenne mensuelle pour calculer la couleur
                    const valueForColor = i === 12 ? v / 12 : v;
                    return (
                      <TableCell key={i} className="text-center border-r border-black last:border-r-0" style={getPrecipitationStyle(valueForColor)}>
                        {v} ({(v / 25.4).toFixed(1)}")
                      </TableCell>
                    );
                  })}
                </TableRow>
                {/* Average Snowfall */}
                <TableRow className="border-b border-black">
                  <TableCell className="bg-gray-50 dark:bg-gray-900 sticky left-0 z-10 font-semibold border-r border-black">Chute de neige moy. cm (pouces)</TableCell>
                  {climateData.avgSnowfall.map((v, i) => (
                    <TableCell key={i} className="text-center border-r border-black last:border-r-0">
                      {v} ({(v / 2.54).toFixed(3)}")
                    </TableCell>
                  ))}
                </TableRow>
                {/* Average Precipitation Days */}
                <TableRow className="border-b border-black">
                  <TableCell className="bg-gray-50 dark:bg-gray-900 sticky left-0 z-10 font-semibold border-r border-black">Jours de prÃ©cip. (â‰¥ 1 mm)</TableCell>
                  {climateData.avgPrecipitationDays.map((v, i) => (
                    <TableCell key={i} className="text-center bg-indigo-100 border-r border-black last:border-r-0">
                      {v}
                    </TableCell>
                  ))}
                </TableRow>
                {/* Average Snowy Days */}
                <TableRow className="border-b border-black">
                  <TableCell className="bg-gray-50 dark:bg-gray-900 sticky left-0 z-10 font-semibold border-r border-black">Jours de neige</TableCell>
                  {climateData.avgSnowyDays.map((v, i) => (
                    <TableCell key={i} className="text-center bg-blue-100 border-r border-black last:border-r-0">
                      {v}
                    </TableCell>
                  ))}
                </TableRow>
                {/* Average Relative Humidity */}
                <TableRow className="border-b border-black">
                  <TableCell className="bg-gray-50 dark:bg-gray-900 sticky left-0 z-10 font-semibold border-r border-black">HumiditÃ© relative moy. (%)</TableCell>
                  {climateData.avgRelativeHumidity.map((v, i) => (
                    <TableCell key={i} className={`text-center border-r border-black last:border-r-0 ${getColorClass('humidity', v)}`}>
                      {v}
                    </TableCell>
                  ))}
                </TableRow>
                {/* Average Dew Point */}
                <TableRow className="border-b border-black">
                  <TableCell className="bg-gray-50 dark:bg-gray-900 sticky left-0 z-10 font-semibold border-r border-black">Point de rosÃ©e moy. Â°C (Â°F)</TableCell>
                  {climateData.avgDewPoint.map((v, i) => (
                    <TableCell key={i} className="text-center border-r border-black last:border-r-0" style={getTempStyle(v)}>
                      {v}Â° ({Math.round(v * 9/5 + 32)}Â°F)
                    </TableCell>
                  ))}
                </TableRow>
                {/* Mean Monthly Sunshine */}
                <TableRow className="border-b border-black">
                  <TableCell className="bg-gray-50 dark:bg-gray-900 sticky left-0 z-10 font-semibold border-r border-black">Ensoleillement moy. mensuel (h)</TableCell>
                  {climateData.meanMonthlySunshine.map((v, i) => (
                    <TableCell key={i} className={`text-center border-r border-black last:border-r-0 ${getColorClass('sunshine', v)}`}>
                      {v}
                    </TableCell>
                  ))}
                </TableRow>
                {/* Percentage Possible Sunshine */}
                <TableRow className="border-b border-black">
                  <TableCell className="bg-gray-50 dark:bg-gray-900 sticky left-0 z-10 font-semibold border-r border-black">% d'ensoleillement possible</TableCell>
                  {climateData.percentagePossibleSunshine.map((v, i) => (
                    <TableCell key={i} className={`text-center border-r border-black last:border-r-0 ${getColorClass('sunshine', v)}`}>
                      {v}%
                    </TableCell>
                  ))}
                </TableRow>
                {/* Average UV Index */}
                <TableRow className="border-b-0">
                  <TableCell className="bg-gray-50 dark:bg-gray-900 sticky left-0 z-10 font-semibold border-r border-black">Indice UV moyen</TableCell>
                  {climateData.avgUvIndex.map((v, i) => (
                    <TableCell key={i} className={`text-center border-r border-black last:border-r-0 ${getColorClass('uv', v)} font-bold`}>
                      {v}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="text-sm text-muted-foreground">
        <CardHeader>
          <CardTitle>Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-5 space-y-1">
            <li>DonnÃ©es climatiques basÃ©es sur les records historiques de 1940 Ã  2025, compilÃ©es Ã  partir de diverses sources mÃ©tÃ©orologiques internationales.</li>
            <li>Open-Meteo</li>
            <li>Visual Crossing</li>
            <li>Climate-Data.org</li>
          </ol>
        </CardContent>
      </Card>

      <div className="text-center">
        <Link href="/archives">
          <Button size="lg">Explorer les donnÃ©es par annÃ©e</Button>
        </Link>
      </div>
    </div>
  );
}

