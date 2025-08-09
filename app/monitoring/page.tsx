"use client";

import DashboardShell from "@/components/dashboard-shell";
import MapMonitoring from "@/components/maps/map-monitoring";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useMemo, useState } from "react";

type MissionState =
  | "starting"
  | "in-progress"
  | "paused"
  | "completed"
  | "aborted";

type Telemetry = {
  id: string;
  altitude: number;
  speed: number;
  battery: number;
};

export default function MonitoringPage() {
  const [state, setState] = useState<MissionState>("starting");
  const [progress, setProgress] = useState(0);
  const [etaMin, setEtaMin] = useState(42);
  const [telemetry, setTelemetry] = useState<Telemetry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchTelemetry = async () => {
    try {
      const response = await fetch("/api/telemetry");
      const data = await response.json();
      setTelemetry(
        data.map((drone: any) => ({
          id: drone.id,
          altitude: drone.altitude || 120,
          speed: drone.speed || 12,
          battery: drone.battery || 80,
        }))
      );
    } catch (error) {
      console.error("Error fetching telemetry:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (state === "starting") {
        setProgress((p) => Math.min(10, p + 2));
      } else if (state === "in-progress") {
        setProgress((p) => Math.min(100, p + 3));
        setEtaMin((e) => Math.max(0, e - 1));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [state]);

  useEffect(() => {
    if (progress >= 100 && state !== "aborted") {
      setState("completed");
    } else if (progress >= 10 && state === "starting") {
      setState("in-progress");
    }
  }, [progress, state]);

  const actionCfg = useMemo(() => {
    return {
      canPause: state === "in-progress",
      canResume: state === "paused",
      canAbort:
        state === "starting" || state === "in-progress" || state === "paused",
    };
  }, [state]);

  function pause() {
    if (actionCfg.canPause) setState("paused");
  }
  function resume() {
    if (actionCfg.canResume) setState("in-progress");
  }
  function abort() {
    if (actionCfg.canAbort) setState("aborted");
  }

  if (loading) {
    return (
      <DashboardShell title="Mission Monitoring">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading telemetry data...</div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Mission Monitoring">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MapMonitoring />
        </div>
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Mission: Thames-Line Sweep
                </CardTitle>
                <Badge
                  variant={
                    state === "completed"
                      ? "secondary"
                      : state === "aborted"
                      ? "destructive"
                      : "default"
                  }
                >
                  {state.replace("-", " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span className="text-muted-foreground">
                    {Math.floor(progress)}%
                  </span>
                </div>
                <Progress value={progress} />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>ETA</span>
                <span className="text-muted-foreground">
                  {state === "completed" ? "—" : `${etaMin} min`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!actionCfg.canPause}
                  onClick={pause}
                >
                  Pause
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!actionCfg.canResume}
                  onClick={resume}
                >
                  Resume
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={!actionCfg.canAbort}
                  onClick={abort}
                >
                  Abort
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Drones in Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Altitude (m)</TableHead>
                      <TableHead>Speed (m/s)</TableHead>
                      <TableHead>Battery</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {telemetry.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="font-mono">{t.id}</TableCell>
                        <TableCell>{Math.round(t.altitude)}</TableCell>
                        <TableCell>{Math.round(t.speed)}</TableCell>
                        <TableCell>{Math.round(t.battery)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
