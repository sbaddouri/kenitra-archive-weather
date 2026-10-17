"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Sun, Thermometer, Droplets } from "lucide-react";

export function NavigationCards() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
      <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = "/climatologie"}>
        <CardContent className="text-center py-6">
          <Sun className="h-10 w-10 mx-auto text-primary mb-3" />
          <h3 className="font-semibold text-lg">Climatologie</h3>
          <p className="text-sm text-muted-foreground mt-1">Analyse climatique complète par mois et jour</p>
        </CardContent>
      </Card>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = "/rapport-scientifique"}>
        <CardContent className="text-center py-6">
          <Thermometer className="h-10 w-10 mx-auto text-primary mb-3" />
          <h3 className="font-semibold text-lg">Rapport Scientifique</h3>
          <p className="text-sm text-muted-foreground mt-1">Étude comparative et classification climatique</p>
        </CardContent>
      </Card>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = "/radar"}>
        <CardContent className="text-center py-6">
          <Droplets className="h-10 w-10 mx-auto text-primary mb-3" />
          <h3 className="font-semibold text-lg">Radar Météo</h3>
          <p className="text-sm text-muted-foreground mt-1">Radar temps réel de la région</p>
        </CardContent>
      </Card>
    </section>
  );
}