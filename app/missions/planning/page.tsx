"use client";

import DashboardShell from "@/components/dashboard-shell";
import MapPlanning from "@/components/maps/map-planning";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

type MissionForm = {
  name: string;
  location: string;
  altitude: number;
  pattern: "perimeter" | "crosshatch";
  overlap: number;
  sensors: { rgb: boolean; thermal: boolean; lidar: boolean };
  notes: string;
  polygons: number[][][];
  polylines: number[][][];
};

export default function PlanningPage() {
  const { toast } = useToast();
  const [form, setForm] = useState<MissionForm>({
    name: "",
    location: "",
    altitude: 120,
    pattern: "perimeter",
    overlap: 65,
    sensors: { rgb: true, thermal: false, lidar: false },
    notes: "",
    polygons: [],
    polylines: [],
  });

  const polyCount = form.polygons.length;
  const lineCount = form.polylines.length;

  const canSave =
    form.name.trim().length > 0 &&
    form.location.trim().length > 0 &&
    (polyCount > 0 || lineCount > 0);

  async function planMission() {
    try {
      const response = await fetch("/api/missions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          status: "planned",
          progress: 0,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create mission");
      }

      const mission = await response.json();

      toast({
        title: "Mission planned",
        description:
          "Your mission has been saved with the provided configuration.",
      });

      // Reset form
      setForm({
        name: "",
        location: "",
        altitude: 120,
        pattern: "perimeter",
        overlap: 65,
        sensors: { rgb: true, thermal: false, lidar: false },
        notes: "",
        polygons: [],
        polylines: [],
      });
    } catch (error) {
      console.error("Error creating mission:", error);
      toast({
        title: "Error",
        description: "Failed to create mission. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <DashboardShell title="Mission Planning">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <MapPlanning
            onPolygonsChange={(polys) =>
              setForm((f) => ({ ...f, polygons: polys }))
            }
            onPolylinesChange={(lines) =>
              setForm((f) => ({ ...f, polylines: lines }))
            }
          />
          <div className="mt-2 text-xs text-muted-foreground">
            {polyCount} polygon(s) • {lineCount} path(s)
          </div>
        </div>
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="mission-name">Mission Name</Label>
                <Input
                  id="mission-name"
                  placeholder="e.g., North Mine Survey Q3"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mission-location">Location</Label>
                <Input
                  id="mission-location"
                  placeholder="e.g., Pilbara, AU"
                  value={form.location}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, location: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="altitude">Flight Altitude (m)</Label>
                <Input
                  id="altitude"
                  type="number"
                  min={20}
                  max={500}
                  value={form.altitude}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      altitude: Number(e.target.value || 0),
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Mission Pattern</Label>
                <Select
                  value={form.pattern}
                  onValueChange={(v: "perimeter" | "crosshatch") =>
                    setForm((f) => ({ ...f, pattern: v }))
                  }
                >
                  <SelectTrigger aria-label="Mission pattern">
                    <SelectValue placeholder="Select pattern" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="perimeter">Perimeter</SelectItem>
                    <SelectItem value="crosshatch">Crosshatch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Overlap {form.overlap}%</Label>
                <Slider
                  value={[form.overlap]}
                  min={30}
                  max={95}
                  step={1}
                  onValueChange={([v]) =>
                    setForm((f) => ({ ...f, overlap: v }))
                  }
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Sensors</Label>
                <div className="flex items-center justify-between">
                  <span>RGB Camera</span>
                  <Switch
                    checked={form.sensors.rgb}
                    onCheckedChange={(v) =>
                      setForm((f) => ({
                        ...f,
                        sensors: { ...f.sensors, rgb: v },
                      }))
                    }
                    aria-label="Toggle RGB sensor"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Thermal</span>
                  <Switch
                    checked={form.sensors.thermal}
                    onCheckedChange={(v) =>
                      setForm((f) => ({
                        ...f,
                        sensors: { ...f.sensors, thermal: v },
                      }))
                    }
                    aria-label="Toggle Thermal sensor"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>LiDAR</span>
                  <Switch
                    checked={form.sensors.lidar}
                    onCheckedChange={(v) =>
                      setForm((f) => ({
                        ...f,
                        sensors: { ...f.sensors, lidar: v },
                      }))
                    }
                    aria-label="Toggle LiDAR sensor"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any special instructions..."
                  value={form.notes}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, notes: e.target.value }))
                  }
                />
              </div>
              <Button
                className="w-full"
                disabled={!canSave}
                onClick={planMission}
              >
                Plan Mission
              </Button>
              {!canSave ? (
                <p className="text-xs text-muted-foreground">
                  Enter name, location and draw at least one polygon or path.
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
