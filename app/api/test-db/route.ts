import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Event } from "@/database";

export async function GET() {
  try {
    await dbConnect();
    const count = await Event.countDocuments();
    
    return NextResponse.json({
      success: true,
      message: "Database connected successfully",
      eventCount: count,
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
