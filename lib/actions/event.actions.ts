"use server";

import Event from "@/database/event.model";
import dbConnect from "@/lib/mongodb";
import { cacheLife } from "next/cache";

export const getSimilarEventBySlug = async (slug: string) => {
  "use cache";
  cacheLife("hours");
  
  try {
    await dbConnect();
    const event = await Event.findOne({ slug });

    if (!event) {
      return [];
    }

    // Find events with matching tags, excluding the current event    // .lean() returns plain JavaScript objects instead of Mongoose documents
    return await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags },
    })
      .limit(3)
      .lean();
  } catch (error) {
    console.error("Error fetching similar events:", error);
    return [];
  }
};
