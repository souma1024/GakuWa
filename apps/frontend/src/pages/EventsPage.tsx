import { useEvents } from "../hooks/useEvents";
import { EventList } from "../components/EventList";
import "../styles/events.css";

export default function EventsPage() {
  const { events, isLoading, error } = useEvents();

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
            <p className="events-subtitle">スキルアップのためのイベントに参加しよう</p>
          </div>

          <EventList events={events} />
        </main>

        {/* サイドコンテンツ */}
        <aside className="events-sidebar">
          <div className="sidebar-placeholder">
            <p>サイドコンテンツ</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
