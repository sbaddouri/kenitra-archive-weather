import { getRecentDailyData, getUpdateStatus } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Thermometer, Droplets, Sun, Calendar, CheckCircle, AlertCircle, Clock } from "lucide-react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { NavigationCards } from "@/components/NavigationCards";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export default async function Home() {
  const recentData = await getRecentDailyData(7);
  const latest = recentData[0];
  const updateStatus = await getUpdateStatus();

  // Dynamically get available years from data folder
  const dataPath = path.join(process.cwd(), "data", "daily");
  let availableYears: string[] = [];
  if (fs.existsSync(dataPath)) {
    availableYears = fs.readdirSync(dataPath).sort((a, b) => b.localeCompare(a));
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Kénitra Weather Archive",
    "description": "Archives météorologiques et climatologiques de Kénitra, Maroc.",
    "url": "https://kenitra-weather.vercel.app",
    "applicationCategory": "WeatherService",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kénitra",
      "addressRegion": "Gharb-Chrarda-Béni Hssen",
      "addressCountry": "MA"
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center space-y-4 py-12 bg-gradient-to-b from-primary/10 to-transparent rounded-3xl">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Kénitra <span className="text-primary">Archive</span> Weather
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Découvrez la climatologie détaillée de Kénitra, Gharb-Chrarda-Béni Hssen, Maroc. 
          Archives historiques, graphiques interactifs et statistiques précises.
        </p>
      </section>

      {/* Update Status Section */}
      {updateStatus && (
        <section className="w-full max-w-3xl mx-auto mb-8">
          <Card className={updateStatus.success ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20" : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"}>
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <div className={updateStatus.success ? "text-green-600" : "text-red-600"}>
                {updateStatus.success ? <CheckCircle className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
              </div>
              <div>
                <CardTitle className="text-lg">Statut de mise à jour des données</CardTitle>
                <p className="text-sm text-muted-foreground">Dernière vérification : {format(parseISO(updateStatus.date), "PPpp", { locale: fr })}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">{updateStatus.message}</p>
              {updateStatus.daysUpdated && updateStatus.daysUpdated.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {updateStatus.daysUpdated.length} jour(s) mis à jour, {updateStatus.missingDays?.length || 0} manquant(s)
                </p>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {/* Current Weather Snapshot */}
      {latest && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Température actuelle</CardTitle>
              <Thermometer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latest.temp_mean?.toFixed(1)}°C</div>
              <p className="text-xs text-muted-foreground">
                Min: {latest.temp_min?.toFixed(1)}°C / Max: {latest.temp_max?.toFixed(1)}°C
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Précipitations</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latest.precipitation?.toFixed(1)} mm</div>
              <p className="text-xs text-muted-foreground">Cumul journalier</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ensoleillement</CardTitle>
              <Sun className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latest.sunshine_duration_minutes ? Math.round(latest.sunshine_duration_minutes / 60) + "h" : "N/A"}</div>
              <p className="text-xs text-muted-foreground">Durée d'ensoleillement</p>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Quick Navigation */}
      <section className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Archives par année
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {availableYears.map((year) => (
                <Link
                  key={year}
                  href={`/climatologie/annee/${year}/kenitra`}
                  className="text-center py-2 px-3 bg-muted/50 hover:bg-primary/10 rounded-lg transition-colors text-sm font-medium"
                >
                  {year}
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Links to main sections */}
      <NavigationCards />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}