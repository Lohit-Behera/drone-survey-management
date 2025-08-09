"use client";

import DashboardShell from "@/components/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { useMemo, useState, useEffect } from "react";

type Drone = {
  _id: string;
  id: string;
  name: string;
  status: "idle" | "in-mission" | "charging" | "offline";
  battery: number;
  location: string;
  lastCheckIn: Date | null;
};

export default function FleetPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | Drone["status"]>("all");
  const [drones, setDrones] = useState<Drone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrones();
  }, []);

  const fetchDrones = async () => {
    try {
      const response = await fetch("/api/drones");
      const data = await response.json();
      setDrones(data);
    } catch (error) {
      console.error("Error fetching drones:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatLastCheckIn = (date: Date | null) => {
    if (!date) return "-";
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const filtered = useMemo(() => {
    return drones
      .filter((d) => (status === "all" ? true : d.status === status))
      .filter((d) => (d.name + d.id).toLowerCase().includes(q.toLowerCase()));
  }, [drones, q, status]);

  if (loading) {
    return (
      <DashboardShell title="Fleet Management">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading drones...</div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Fleet Management">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Input
            placeholder="Search by name or ID..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Status</span>
          <Select value={status} onValueChange={(v: any) => setStatus(v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="idle">Idle</SelectItem>
              <SelectItem value="in-mission">In Mission</SelectItem>
              <SelectItem value="charging">Charging</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="cards" className="mt-2">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="cards" className="flex-1">
            Card View
          </TabsTrigger>
          <TabsTrigger value="table" className="flex-1">
            Table View
          </TabsTrigger>
        </TabsList>
        <TabsContent value="cards" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((d) => (
              <Card key={d.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{d.name}</CardTitle>
                    <Badge variant="outline">{d.id}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Status
                    </span>
                    <StatusBadge status={d.status} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Battery</span>
                      <span className="text-muted-foreground">
                        {d.battery}%
                      </span>
                    </div>
                    <Progress value={d.battery} className="mt-2" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Location</span>
                    <span className="text-muted-foreground">{d.location}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Last check-in</span>
                    <span className="text-muted-foreground">
                      {formatLastCheckIn(d.lastCheckIn)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="table" className="mt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Battery</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Last check-in</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-mono">{d.id}</TableCell>
                    <TableCell>{d.name}</TableCell>
                    <TableCell>
                      <StatusBadge status={d.status} />
                    </TableCell>
                    <TableCell className="w-[220px]">
                      <div className="flex items-center gap-2">
                        <Progress value={d.battery} className="w-28" />
                        <span className="text-sm text-muted-foreground">
                          {d.battery}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{d.location}</TableCell>
                    <TableCell>{formatLastCheckIn(d.lastCheckIn)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
