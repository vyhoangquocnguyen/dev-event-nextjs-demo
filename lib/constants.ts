export type EventItem = {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
};

export const events: EventItem[] = [
  {
    title: "React Conf 2025",
    image: "/images/event1.png",
    slug: "react-conf-2025",
    location: "San Francisco, CA",
    date: "2025-09-01",
    time: "9:00 AM - 5:00 PM",
  },
  {
    title: "Node.js Summit 2025",
    image: "/images/event2.png",
    slug: "node-js-summit-2025",
    location: "Seattle, WA",
    date: "2025-11-15",
    time: "10:00 AM - 6:00 PM",
  },
  {
    title: "Hackathon 2026",
    image: "/images/event3.png",
    slug: "hackathon-2026",
    location: "New York, NY",
    date: "2026-03-01",
    time: "9:00 AM - 5:00 PM",
  },
  {
    title: "Angular Summit 2026",
    image: "/images/event4.png",
    slug: "angular-summit-2026",
    location: "Austin, TX",
    date: "2026-05-01",
    time: "10:00 AM - 6:00 PM",
  },
  {
    title: "AI Conference 2026",
    image: "/images/event5.png",
    slug: "ai-conference-2026",
    location: "Silicon Valley, CA",
    date: "2026-08-01",
    time: "9:00 AM - 5:00 PM",
  },
  {
    title: "Web Dev Summit 2026",
    image: "/images/event6.png",
    slug: "web-dev-summit-2026",
    location: "San Diego, CA",
    date: "2026-10-01",
    time: "10:00 AM - 6:00 PM",
  },
];

export default events;
