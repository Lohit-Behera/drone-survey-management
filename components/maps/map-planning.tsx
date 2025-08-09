"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { FeatureGroup as FeatureGroupType } from "leaflet";

// Dynamically import the entire map component with no SSR
const MapComponent = dynamic(
  () => import("../../components/maps/map-component"),
  {
    ssr: false,
    loading: () => (
      <div className="relative h-[420px] w-full overflow-hidden rounded-md border md:h-[600px] flex items-center justify-center">
        <div className="text-muted-foreground">Loading map...</div>
      </div>
    ),
  }
) as React.ComponentType<{
  onPolygonsChange?: (polys: number[][][]) => void;
  onPolylinesChange?: (lines: number[][][]) => void;
}>;

type Props = {
  onPolygonsChange?: (polys: number[][][]) => void;
  onPolylinesChange?: (lines: number[][][]) => void;
};

export default function MapPlanning({
  onPolygonsChange,
  onPolylinesChange,
}: Props) {
  return (
    <MapComponent
      onPolygonsChange={onPolygonsChange}
      onPolylinesChange={onPolylinesChange}
    />
  );
}
