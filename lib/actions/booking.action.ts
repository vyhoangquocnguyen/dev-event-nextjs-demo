"use server";

import Booking from "@/database/booking.model";

import dbConnect from "@/lib/mongodb";

export const createBooking = async ({
  eventId,
  slug,
  email,
}: {
  eventId: string;
  slug: string;
  email: string;
}): Promise<{ success: boolean }> => {
  try {
    await dbConnect();

    await Booking.create({ eventId, slug, email });

    return { success: true };
  } catch (error) {
    console.error("create booking failed", error);
    return { success: false };
  }
};
