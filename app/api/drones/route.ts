import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Drone from "@/models/Drone";

export async function GET() {
  try {
    await dbConnect();
    const drones = await Drone.find({}).sort({ createdAt: -1 });
    return NextResponse.json(drones);
  } catch (error) {
    console.error("Error fetching drones:", error);
    return NextResponse.json(
      { error: "Failed to fetch drones" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    const drone = new Drone(body);
    await drone.save();

    return NextResponse.json(drone, { status: 201 });
  } catch (error) {
    console.error("Error creating drone:", error);
    return NextResponse.json(
      { error: "Failed to create drone" },
      { status: 500 }
    );
  }
}
