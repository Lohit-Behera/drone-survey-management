"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Polyline, CircleMarker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type Drone = {
  id: string;
  color: string;
  path: [number, number][];
  idx: number;
};

export default function MonitoringMapComponent() {
  const [drones, setDrones] = useState<Drone[]>(() => {
    const base: [number, number] = [51.505, -0.09]; // London
    const genPath = (dx: number, dy: number): [number, number][] => {
      return Array.from({ length: 50 }).map((_, i) => [
        base[0] + Math.sin(i / 6) * 0.01 + dx,
        base[1] + Math.cos(i / 6) * 0.02 + dy,
      ]);
    };
    return [
      { id: "DR-101", color: "#16a34a", path: genPath(0, 0), idx: 0 },
      { id: "DR-204", color: "#eab308", path: genPath(0.02, -0.01), idx: 0 },
      { id: "DR-330", color: "#ef4444", path: genPath(-0.02, 0.01), idx: 0 },
    ];
  });

  const center = useMemo<[number, number]>(() => [51.505, -0.09], []);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setDrones((prev) =>
        prev.map((d) => ({ ...d, idx: (d.idx + 1) % d.path.length }))
      );
    }, 1000);
    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-md border md:h-[600px]">
      <MapContainer
        center={center}
        zoom={13}
        className="h-full w-full"
        scrollWheelZoom
      >
        <TileLayer
          attribution={"Map data © OpenStreetMap contributors"}
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {drones.map((d) => (
          <div key={d.id}>
            <Polyline
              positions={d.path}
              pathOptions={{ color: d.color, weight: 3, opacity: 0.7 }}
            />
            <CircleMarker
              center={d.path[d.idx]}
              radius={7}
              pathOptions={{
                color: d.color,
                fillColor: d.color,
                fillOpacity: 0.9,
              }}
            />
          </div>
        ))}
      </MapContainer>
    </div>
  );
}
