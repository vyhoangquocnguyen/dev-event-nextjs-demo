import { notFound } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_BASE_URL environment variable is not defined");
}
const EventDetails = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const request = await fetch(`${BASE_URL}/api/events/${slug}`);
  const { event } = await request.json();

  if (!event) return notFound();

  return (
    <section id="event">
      <h1>
        Event Details: <br /> {slug}
      </h1>
    </section>
  );
};

export default EventDetails;
