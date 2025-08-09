import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Drone from "@/models/Drone";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    const { droneId, altitude, speed, battery, coordinates } = body;

    const drone = await Drone.findOneAndUpdate(
      { id: droneId },
      {
        altitude,
        speed,
        battery,
        coordinates,
        lastCheckIn: new Date(),
      },
      { new: true }
    );

    if (!drone) {
      return NextResponse.json({ error: "Drone not found" }, { status: 404 });
    }

    return NextResponse.json(drone);
  } catch (error) {
    console.error("Error updating telemetry:", error);
    return NextResponse.json(
      { error: "Failed to update telemetry" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const drones = await Drone.find({
      status: { $in: ["in-mission", "starting"] },
    }).select("id altitude speed battery coordinates");

    return NextResponse.json(drones);
  } catch (error) {
    console.error("Error fetching telemetry:", error);
    return NextResponse.json(
      { error: "Failed to fetch telemetry" },
      { status: 500 }
    );
  }
}
