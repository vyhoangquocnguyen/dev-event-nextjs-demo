"use server";

import Event from "@/database/event.model";
import dbConnect from "@/lib/mongodb";

export const getSimilarEventBySlug = async (slug: string) => {
  try {
    await dbConnect();
    const event = await Event.findOne({ slug });

    if (!event) {
      return [];
    }

    // Find events with matching tags, excluding the current event
    return await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags },
    }).lean();
  } catch (error) {
    console.error("Error fetching similar events:", error);
    return [];
  }
};
