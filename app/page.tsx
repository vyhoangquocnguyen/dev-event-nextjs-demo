import EventCard from "@/components/EventCard";
import ExoloreBtn from "@/components/ExploreBtn";
import { IEvent } from "@/database";
import { cacheLife } from "next/cache";

const Page = async () => {
  "use cache";
  cacheLife("hours");
  
  // Ensure BASE_URL has protocol
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.startsWith('http') 
    ? process.env.NEXT_PUBLIC_BASE_URL 
    : `https://${process.env.NEXT_PUBLIC_BASE_URL}`;
  
  const response = await fetch(`${baseUrl}/api/events`);

  if (!response.ok) {
    throw new Error(`Failed to fetch events: ${response.status}`);
  }

  const { events } = await response.json();

  return (
    <section>
      <h1 className="text-center">
        The Hub for every Dev <br /> You Cannot Miss
      </h1>
      <p className="text-center mt-5">Hackathons, Meetups, and Conferences all in one place</p>
      <ExoloreBtn />
      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>{" "}
        <ul className="events">
          {events &&
            events.length > 0 &&
            events.map((event: IEvent) => (
              <li key={event.title} className="list-none">
                <EventCard {...event} />
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default Page;
