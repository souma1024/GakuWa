import { useEvents } from "../hooks/useEvents";
import { EventList } from "../components/EventList";
import "../styles/events.css";

export default function EventsPage() {
  const { events, isLoading, error, participate, cancelParticipate } = useEvents();

  if (isLoading) {
    return (
      <div className="events-page">
        <div className="events-loading">
          <div className="loading-spinner"></div>
          <p>読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="events-page">
        <div className="events-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="events-page">
      <div className="events-container">
        {/* メインコンテンツ */}
        <main className="events-main">
          <div className="events-header">
            <h1>イベント一覧</h1>
            <p className="events-subtitle">チームでアプリ開発に取り組もう</p>
          </div>

          <EventList
            events={events}
            onParticipate={participate}
            onCancelParticipate={cancelParticipate}
          />
        </main>
      </div>
    </div>
  );
}
