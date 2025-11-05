import { v2 as cloudinary } from "cloudinary";
import { Event } from "@/database";
import dbConnect from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const formData = await req.formData();

    let event;

    try {
      event = Object.fromEntries(formData.entries());
    } catch (e) {
      return NextResponse.json(
        { message: "Invalid JSON data format" },
        { status: 400 }
      );
    }

    const file = formData.get("image");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { message: "Valid image file is required" },
        { status: 400 }
      );
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "image", folder: "DevEvent" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        )
        .end(buffer);
    });

    event.image = (uploadResult as { secure_url: string }).secure_url;

    const createdEvent = await Event.create(event);
    return NextResponse.json(
      {
        message: "Event created sucessfully ",
        event: createdEvent,
      },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        message: "Event creation Fail",
        error: e instanceof Error ? e.message : "unknown",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const events = await Event.find().sort({
      createdAt: -1,
    });
    return NextResponse.json(
      {
        message: "Events Fetched Successfully",
        events,
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      {
        message: "Event creation Fail",
        error: e,
      },
      { status: 500 }
    );
  }
}
