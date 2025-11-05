import { v2 as cloudinary } from "cloudinary";
import { Event } from "@/database";
import dbConnect from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const formData = await req.formData();

    // Validate image file
    const file = formData.get("image");
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { message: "Valid image file is required" },
        { status: 400 }
      );
    }

    // Required fields validation
    const requiredFields = [
      "title",
      "description",
      "overview",
      "venue",
      "location",
      "date",
      "time",
      "mode",
      "audience",
      "organizer",
    ];

    for (const field of requiredFields) {
      const value = formData.get(field);
      if (!value || typeof value !== "string" || value.trim() === "") {
        return NextResponse.json(
          { message: `${field} is required and must be a non-empty string` },
          { status: 400 }
        );
      }
    }

    // Parse and validate nested JSON fields
    let tags: string[];
    let agenda: string[];

    try {
      const tagsValue = formData.get("tags");
      if (!tagsValue || typeof tagsValue !== "string") {
        return NextResponse.json(
          { message: "tags field is required" },
          { status: 400 }
        );
      }
      tags = JSON.parse(tagsValue);
      if (!Array.isArray(tags) || tags.length === 0) {
        return NextResponse.json(
          { message: "tags must be a non-empty array" },
          { status: 400 }
        );
      }
    } catch (e) {
      return NextResponse.json(
        { message: "tags must be valid JSON array" },
        { status: 400 }
      );
    }

    try {
      const agendaValue = formData.get("agenda");
      if (!agendaValue || typeof agendaValue !== "string") {
        return NextResponse.json(
          { message: "agenda field is required" },
          { status: 400 }
        );
      }
      agenda = JSON.parse(agendaValue);
      if (!Array.isArray(agenda) || agenda.length === 0) {
        return NextResponse.json(
          { message: "agenda must be a non-empty array" },
          { status: 400 }
        );
      }
    } catch (e) {
      return NextResponse.json(
        { message: "agenda must be valid JSON array" },
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

    const imageUrl = (uploadResult as { secure_url: string }).secure_url;

    // Build validated event object
    const eventData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      overview: formData.get("overview") as string,
      image: imageUrl,
      venue: formData.get("venue") as string,
      location: formData.get("location") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      mode: formData.get("mode") as string,
      audience: formData.get("audience") as string,
      organizer: formData.get("organizer") as string,
      tags,
      agenda,
    };

    const createdEvent = await Event.create(eventData);
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
