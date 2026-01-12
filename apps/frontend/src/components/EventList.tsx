import { Event } from "../hooks/useEvents";
import { EventCard } from "./EventCard";

type Props = {
  events: Event[];
  onParticipate: (eventId: string) => Promise<void>;
  onCancelParticipate: (eventId: string) => Promise<void>;
};

export const EventList = ({ events, onParticipate, onCancelParticipate }: Props) => {
  if (events.length === 0) {
    return <p className="no-events">現在開催中のイベントはありません</p>;
  }

  return (
    <div className="events-grid">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onParticipate={onParticipate}
          onCancelParticipate={onCancelParticipate}
        />
      ))}
    </div>
  );
};
