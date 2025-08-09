import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Drone from "@/models/Drone";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const drone = await Drone.findById(params.id);

    if (!drone) {
      return NextResponse.json({ error: "Drone not found" }, { status: 404 });
    }

    return NextResponse.json(drone);
  } catch (error) {
    console.error("Error fetching drone:", error);
    return NextResponse.json(
      { error: "Failed to fetch drone" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const body = await request.json();

    const drone = await Drone.findByIdAndUpdate(
      params.id,
      { ...body, lastCheckIn: new Date() },
      { new: true, runValidators: true }
    );

    if (!drone) {
      return NextResponse.json({ error: "Drone not found" }, { status: 404 });
    }

    return NextResponse.json(drone);
  } catch (error) {
    console.error("Error updating drone:", error);
    return NextResponse.json(
      { error: "Failed to update drone" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const drone = await Drone.findByIdAndDelete(params.id);

    if (!drone) {
      return NextResponse.json({ error: "Drone not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Drone deleted successfully" });
  } catch (error) {
    console.error("Error deleting drone:", error);
    return NextResponse.json(
      { error: "Failed to delete drone" },
      { status: 500 }
    );
  }
}
