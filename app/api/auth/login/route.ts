import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { username, password } = await request.json();

    // In a real application, you would hash the password and use proper authentication
    // For demo purposes, we'll use simple comparison
    const user = await User.findOne({ username, password });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // In a real app, you would create a JWT token here
    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      organization: user.organization,
    };

    return NextResponse.json({
      user: userData,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
