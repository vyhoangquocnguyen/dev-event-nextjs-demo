import EventDetails from "@/components/EventDetails";
import { Suspense } from "react";

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <EventDetails params={params.then((p) => p.slug)} />
      </Suspense>
    </main>
  );
};
export default EventDetailsPage;
