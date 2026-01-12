import { useState, useEffect } from "react";

export type Event = {
  id: string;
  name: string;
  thumbnailUrl: string;
  details: string;
  difficulty: number;
  isParticipating: boolean;
};

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/events", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        setError(errorBody?.error?.message || "イベントの取得に失敗しました");
        setIsLoading(false);
        return;
      }

      const result = await response.json();
      console.log("API response:", result);

      if (result.success && Array.isArray(result.data?.events)) {
        setEvents(result.data.events);
      } else if (result.success && Array.isArray(result.data)) {
        setEvents(result.data);
      } else {
        setEvents([]);
      }
      setIsLoading(false);
    } catch (err) {
      console.error("fetch error:", err);
      setError("通信エラーが発生しました");
      setIsLoading(false);
    }
  };

  // 参加登録
  const participate = async (eventId: string) => {
    const response = await fetch(`http://localhost:8080/api/events/${eventId}/participate`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      throw new Error(errorBody?.error?.message || "参加登録に失敗しました");
    }

    // 成功したらeventsの状態を更新
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId
          ? { ...event, isParticipating: true }
          : event
      )
    );
  };

  // 参加取り消し
  const cancelParticipate = async (eventId: string) => {
    const response = await fetch(`http://localhost:8080/api/events/${eventId}/participate`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      throw new Error(errorBody?.error?.message || "参加取り消しに失敗しました");
    }

    // 成功したらeventsの状態を更新
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId
          ? { ...event, isParticipating: false }
          : event
      )
    );
  };

  return { events, isLoading, error, participate, cancelParticipate };
};
