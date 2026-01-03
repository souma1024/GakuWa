import { Event } from "../hooks/useEvents";
import { EventCard } from "./EventCard";

type Props = {
  events: Event[];
};

export const EventList = ({ events }: Props) => {
  if (events.length === 0) {
    return <p className="no-events">現在開催中のイベントはありません</p>;
  }

  return (
    <div className="events-grid">
      {events.map((event) => (
        <EventCard key={String(event.id)} event={event} />
      ))}
    </div>
  );
};
