"use client"

import { useEffect, useMemo, useRef, useState, Suspense } from "react"
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet"
import { EditControl } from "react-leaflet-draw"
import type { FeatureGroup as FeatureGroupType } from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-draw/dist/leaflet.draw.css"

type Props = {
  onPolygonsChange?: (polys: number[][][]) => void
  onPolylinesChange?: (lines: number[][][]) => void
}

export default function MapComponent({ onPolygonsChange, onPolylinesChange }: Props) {
  const featureGroupRef = useRef<FeatureGroupType | null>(null)
  const [center] = useState<[number, number]>([37.7749, -122.4194]) // SF default
  const [zoom] = useState(12)

  const drawOptions = useMemo(() => {
    return {
      position: "topright" as const,
      draw: {
        polygon: {
          showArea: true,
          allowIntersection: false,
          shapeOptions: { color: "#16a34a" },
        },
        polyline: {
          shapeOptions: { color: "#0ea5e9" },
        },
        rectangle: false,
        circle: false,
        circlemarker: false,
        marker: false,
      },
      edit: {
        edit: true,
        remove: true,
      },
    }
  }, [])

  function collectGeometries() {
    const fg = featureGroupRef.current
    if (!fg) return
    const polys: number[][][] = []
    const lines: number[][][] = []
    fg.eachLayer((layer: any) => {
      const type = layer?.toGeoJSON?.().geometry?.type
      if (type === "Polygon") {
        const coords = layer.getLatLngs?.()[0]?.map((ll: any) => [ll.lat, ll.lng]) ?? []
        if (coords.length) polys.push(coords)
      }
      if (type === "LineString") {
        const coords = layer.getLatLngs?.().map((ll: any) => [ll.lat, ll.lng]) ?? []
        if (coords.length) lines.push(coords)
      }
    })
    onPolygonsChange?.(polys)
    onPolylinesChange?.(lines)
  }

  useEffect(() => {
    collectGeometries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-md border md:h-[600px]">
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution={'Map data © OpenStreetMap contributors'}
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Suspense fallback={null}>
          <FeatureGroup ref={featureGroupRef}>
            <EditControl
              position={drawOptions.position}
              draw={drawOptions.draw}
              edit={drawOptions.edit}
              onCreated={collectGeometries}
              onEdited={collectGeometries}
              onDeleted={collectGeometries}
            />
          </FeatureGroup>
        </Suspense>
      </MapContainer>
    </div>
  )
}
