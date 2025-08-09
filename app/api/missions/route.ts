import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Mission from "@/models/Mission";

export async function GET() {
  try {
    await dbConnect();
    const missions = await Mission.find({})
      .populate("assignedDrones")
      .sort({ createdAt: -1 });
    return NextResponse.json(missions);
  } catch (error) {
    console.error("Error fetching missions:", error);
    return NextResponse.json(
      { error: "Failed to fetch missions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    const mission = new Mission(body);
    await mission.save();

    return NextResponse.json(mission, { status: 201 });
  } catch (error) {
    console.error("Error creating mission:", error);
    return NextResponse.json(
      { error: "Failed to create mission" },
      { status: 500 }
    );
  }
}
