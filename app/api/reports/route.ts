import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Report from "@/models/Report";

export async function GET() {
  try {
    await dbConnect();
    const reports = await Report.find({})
      .populate("missionId")
      .sort({ date: -1 });
    return NextResponse.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    const report = new Report(body);
    await report.save();

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 }
    );
  }
}
