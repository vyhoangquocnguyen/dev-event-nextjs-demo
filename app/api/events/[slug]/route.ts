import { Event } from "@/database";
import dbConnect from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    await dbConnect();

    const { slug } = await params;

    // Validate slug parameter
    if (!slug || typeof slug !== "string" || slug.trim() === "") {
      return NextResponse.json(
        { message: "Valid slug parameter is required" },
        { status: 400 }
      );
    }

    // Sanitize slug
    const sanitizedSlug = slug.trim().toLowerCase();

    // Query event by sanitized slug
    const event = await Event.findOne({ slug: sanitizedSlug }).lean();

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Event fetched successfully",
        event,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error fetching event by slug:", e);
    return NextResponse.json(
      {
        message: "Failed to fetch event",
        error: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
