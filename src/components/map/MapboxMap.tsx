import React, { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type MapMarker = { id: string; name: string; lng: number; lat: number };

interface MapboxMapProps {
  markers?: MapMarker[];
  selectedId?: string | null;
}

const MapboxMap: React.FC<MapboxMapProps> = ({ markers = [], selectedId = null }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRefs = useRef<Record<string, mapboxgl.Marker>>({});
  const { theme } = useTheme();
  const [token, setToken] = useState<string>(() => localStorage.getItem("mapbox_token") || "");

  const styleUrl = useMemo(
    () => (theme === "dark" ? "mapbox://styles/mapbox/dark-v11" : "mapbox://styles/mapbox/light-v11"),
    [theme]
  );

  useEffect(() => {
    if (!containerRef.current || !token) return;
    mapboxgl.accessToken = token;

    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: styleUrl,
      center: [-43.2, -22.9], // Brasil (RJ) aproximado
      zoom: 2.8,
      pitch: 35,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");
    mapRef.current.scrollZoom.disable();

    mapRef.current.on("style.load", () => {
      mapRef.current?.setFog({ color: "rgb(255,255,255)", "high-color": "rgb(200,200,225)", "horizon-blend": 0.2 });
    });

    return () => {
      Object.values(markerRefs.current).forEach((m) => m.remove());
      markerRefs.current = {};
      mapRef.current?.remove();
    };
  }, [token, styleUrl]);

  useEffect(() => {
    if (!mapRef.current) return;
    // Sync markers
    const existing = new Set(Object.keys(markerRefs.current));
    const incoming = new Set(markers.map((m) => m.id));

    // Remove stale
    existing.forEach((id) => {
      if (!incoming.has(id)) {
        markerRefs.current[id].remove();
        delete markerRefs.current[id];
      }
    });

    // Add new
    markers.forEach((m) => {
      if (markerRefs.current[m.id]) return;
      const marker = new mapboxgl.Marker({ color: "#6B4EFF" })
        .setLngLat([m.lng, m.lat])
        .setPopup(new mapboxgl.Popup({ offset: 12 }).setText(m.name));
      marker.addTo(mapRef.current!);
      markerRefs.current[m.id] = marker;
    });
  }, [markers]);

  useEffect(() => {
    if (!mapRef.current || !selectedId) return;
    const m = markers.find((x) => x.id === selectedId);
    if (!m) return;
    mapRef.current.flyTo({ center: [m.lng, m.lat], zoom: 12, duration: 1000 });
    markerRefs.current[selectedId]?.togglePopup();
  }, [selectedId, markers]);

  return (
    <div className="relative w-full h-[420px] rounded-lg overflow-hidden border">
      {!token && (
        <div className="absolute inset-0 z-10 grid place-items-center bg-background/90 backdrop-blur">
          <div className="max-w-md w-full p-6 border rounded-lg bg-card shadow-sm animate-enter">
            <h3 className="text-lg font-semibold">Conectar Mapbox</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Insira seu token público do Mapbox para visualizar o mapa. Você pode encontrá-lo em mapbox.com, seção Tokens.
            </p>
            <div className="mt-4 flex gap-2">
              <Input
                placeholder="pk.********************************"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                aria-label="Mapbox public token"
              />
              <Button
                onClick={() => {
                  localStorage.setItem("mapbox_token", token);
                }}
              >Salvar</Button>
            </div>
          </div>
        </div>
      )}
      <div ref={containerRef} className="absolute inset-0" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/10" />
    </div>
  );
};

export default MapboxMap;
