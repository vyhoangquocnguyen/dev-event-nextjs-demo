"use client";
import { createBooking } from "@/lib/actions/booking.action";
import posthog from "posthog-js";
import { useState } from "react";

// Safe PostHog capture helper
const captureEvent = (eventName: string, properties: Record<string, unknown>) => {
  if (typeof posthog !== "undefined" && typeof posthog.capture === "function") {
    try {
      posthog.capture(eventName, properties);
    } catch (error) {
      console.warn("PostHog capture failed:", error);
    }
  }
};

const BookEvent = ({ eventId, slug }: { eventId: string; slug: string }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate submissions
    if (loading) return;

    try {
      setLoading(true);
      const { success } = await createBooking({ eventId, slug, email });

      if (success) {
        setSubmitted(true);
        captureEvent("event_booked", { eventId, slug, email });
      } else {
        console.error("Booking creation failed:");
        captureEvent("booking_error", {
          eventId,
          slug,
          email,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Booking submission error:", err);
      captureEvent("booking_error", {
        eventId,
        slug,
        email,
        error: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm">Thanks for joining us!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
            />
          </div>
          <button type="submit" className="button-submit" disabled={loading || !email}>
            {loading ? "Booking..." : "Book Now"}
          </button>
        </form>
      )}
    </div>
  );
};

export default BookEvent;
