"use client"

import dynamic from "next/dynamic"

// Dynamically import the monitoring map component with no SSR
const MonitoringMapComponent = dynamic(
  () => import("./monitoring-map-component"),
  { 
    ssr: false,
    loading: () => (
      <div className="relative h-[360px] w-full overflow-hidden rounded-md border md:h-[600px] flex items-center justify-center">
        <div className="text-muted-foreground">Loading map...</div>
      </div>
    )
  }
)

export default function MapMonitoring() {
  return <MonitoringMapComponent />
}
