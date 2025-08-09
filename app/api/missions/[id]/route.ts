import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Mission from "@/models/Mission";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const mission = await Mission.findById(params.id).populate(
      "assignedDrones"
    );

    if (!mission) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 });
    }

    return NextResponse.json(mission);
  } catch (error) {
    console.error("Error fetching mission:", error);
    return NextResponse.json(
      { error: "Failed to fetch mission" },
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

    const mission = await Mission.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    }).populate("assignedDrones");

    if (!mission) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 });
    }

    return NextResponse.json(mission);
  } catch (error) {
    console.error("Error updating mission:", error);
    return NextResponse.json(
      { error: "Failed to update mission" },
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
    const mission = await Mission.findByIdAndDelete(params.id);

    if (!mission) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Mission deleted successfully" });
  } catch (error) {
    console.error("Error deleting mission:", error);
    return NextResponse.json(
      { error: "Failed to delete mission" },
      { status: 500 }
    );
  }
}
