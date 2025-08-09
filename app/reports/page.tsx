"use client";

import DashboardShell from "@/components/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";

type Report = {
  _id: string;
  name: string;
  date: Date;
  durationMin: number;
  areaHa: number;
  distanceKm: number;
  drones: number;
  site: string;
};

export default function ReportsPage() {
  const [site, setSite] = useState<"all" | string>("all");
  const [droneCount, setDroneCount] = useState<"all" | "1" | "2-3" | "4-5">(
    "all"
  );
  const [q, setQ] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/reports");
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return reports
      .filter((r) => (site === "all" ? true : r.site === site))
      .filter((r) => {
        if (droneCount === "all") return true;
        if (droneCount === "1") return r.drones === 1;
        if (droneCount === "2-3") return r.drones >= 2 && r.drones <= 3;
        if (droneCount === "4-5") return r.drones >= 4 && r.drones <= 5;
        return true;
      })
      .filter((r) => (r.name + r._id).toLowerCase().includes(q.toLowerCase()));
  }, [reports, site, droneCount, q]);

  const summary = useMemo(() => {
    const totalMissions = filtered.length;
    const avgDuration = Math.round(
      filtered.reduce((a, b) => a + b.durationMin, 0) /
        Math.max(1, totalMissions)
    );
    const totalDistance = Math.round(
      filtered.reduce((a, b) => a + b.distanceKm, 0)
    );
    return { totalMissions, avgDuration, totalDistance };
  }, [filtered]);

  if (loading) {
    return (
      <DashboardShell title="Survey Reports">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading reports...</div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Survey Reports">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total Missions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {summary.totalMissions}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Average Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {summary.avgDuration} min
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total Distance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {summary.totalDistance} km
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Coverage Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-hidden rounded-md border">
            <Image
              src="/placeholder-dofpn.png"
              width={1200}
              height={400}
              alt="Coverage heatmap placeholder"
              className="h-64 w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Input
            placeholder="Search reports..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Site</span>
          <Select value={site} onValueChange={(v) => setSite(v as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter site" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Nevada Test Range">
                Nevada Test Range
              </SelectItem>
              <SelectItem value="Pilbara, AU">Pilbara, AU</SelectItem>
              <SelectItem value="Qatar Field">Qatar Field</SelectItem>
              <SelectItem value="Berlin Yard">Berlin Yard</SelectItem>
              <SelectItem value="Gobi Site">Gobi Site</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Drones</span>
          <Select
            value={droneCount}
            onValueChange={(v) => setDroneCount(v as any)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter drones" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2-3">2-3</SelectItem>
              <SelectItem value="4-5">4-5</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-3 rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Mission Name</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="hidden md:table-cell">Area (ha)</TableHead>
              <TableHead>Distance (km)</TableHead>
              <TableHead className="hidden lg:table-cell">Drones</TableHead>
              <TableHead>Site</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r._id}>
                <TableCell className="font-mono">{r._id}</TableCell>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {new Date(r.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{r.durationMin} min</TableCell>
                <TableCell className="hidden md:table-cell">
                  {r.areaHa}
                </TableCell>
                <TableCell>{r.distanceKm}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  {r.drones}
                </TableCell>
                <TableCell>{r.site}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardShell>
  );
}
