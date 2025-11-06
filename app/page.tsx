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
  
  let events = [];
  
  try {
    const response = await fetch(`${baseUrl}/api/events`);
    if (response.ok) {
      const data = await response.json();
      events = data.events || [];
    }
  } catch (error) {
    console.log('Unable to fetch events during build, will be generated on first request');
  }

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
