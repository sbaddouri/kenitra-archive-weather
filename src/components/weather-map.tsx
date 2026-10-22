"use client";

import { useEffect, useRef, type RefObject } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/**
 * Coordonnées exactes de Kénitra (Rabat-Salé-Kénitra, Maroc).
 * Format Leaflet : [latitude, longitude].
 */
const KENITRA_POSITION: [number, number] = [34.300611, -6.599639];

/** Coordonnées au format sexagésimal (DMS) affichées dans la fenêtre du marqueur. */
const KENITRA_DMS = `34°18'02.2"N 6°35'58.7"W`;

// Fix for leaflet icon issue in Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -36],
});

/**
 * Ouvre automatiquement la fenêtre d'information du marqueur une fois la carte
 * initialisée. Ce composant doit être enfant de <MapContainer> : il accède ainsi
 * au contexte Leaflet et s'exécute après l'ajout du marqueur sur la carte.
 */
function AutoOpenPopup({
  markerRef,
}: {
  markerRef: RefObject<L.Marker | null>;
}) {
  const map = useMap();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      markerRef.current?.openPopup();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [map, markerRef]);

  return null;
}

export default function WeatherMap() {
  const markerRef = useRef<L.Marker | null>(null);

  return (
    <div className="h-[400px] w-full overflow-hidden rounded-xl border shadow-sm">
      <MapContainer
        center={KENITRA_POSITION}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        {/* Use OpenStreetMap standard tile server - free, no API key required */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={KENITRA_POSITION} icon={icon} ref={markerRef}>
          <Popup>
            <div className="min-w-[220px]">
              <p className="mb-2 text-base font-semibold text-slate-900">
                Localisation
              </p>
              <dl className="space-y-1 text-sm text-slate-700">
                <div className="flex gap-1">
                  <dt className="font-semibold">Ville:</dt>
                  <dd>Kénitra</dd>
                </div>
                <div className="flex gap-1">
                  <dt className="font-semibold">Région:</dt>
                  <dd>Rabat-Salé-Kénitra</dd>
                </div>
                <div className="flex gap-1">
                  <dt className="font-semibold">Pays:</dt>
                  <dd>Maroc</dd>
                </div>
                <div className="flex gap-1">
                  <dt className="font-semibold">Coordonnées:</dt>
                  <dd>{KENITRA_DMS}</dd>
                </div>
              </dl>
            </div>
          </Popup>
        </Marker>
        <AutoOpenPopup markerRef={markerRef} />
      </MapContainer>
    </div>
  );
}
