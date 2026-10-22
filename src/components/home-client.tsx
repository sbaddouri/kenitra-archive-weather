"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const WeatherMap = dynamic(() => import("@/components/weather-map"), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-muted animate-pulse rounded-xl" />,
});

export default function HomeClient() {
  return (
    <section className="mx-auto w-full max-w-4xl">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Localisation de Kénitra
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <WeatherMap />
        </CardContent>
      </Card>
    </section>
  );
}
