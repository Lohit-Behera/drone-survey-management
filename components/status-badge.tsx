"use client"

import { Badge } from "@/components/ui/badge"

type Status = "idle" | "in-mission" | "charging" | "offline"

export function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    "idle": { label: "Idle", variant: "secondary" },
    "in-mission": { label: "In Mission", variant: "default" },
    "charging": { label: "Charging", variant: "outline" },
    "offline": { label: "Offline", variant: "destructive" },
  }
  const cfg = map[status]
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>
}
