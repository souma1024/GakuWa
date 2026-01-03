import { useState, useEffect } from "react";

export type Event = {
  id: bigint;
  name: string;
  thumbnailUrl: string;
  details: string;
  difficulty: number;
  isParticipating: boolean;
};

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);  // 初期値は空配列
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
      console.log("API response:", result);  // ← デバッグ用に追加

      if (result.success && Array.isArray(result.data?.events)) {
        setEvents(result.data.events);
      } else if (result.success && Array.isArray(result.data)) {
        // result.data が直接配列の場合
        setEvents(result.data);
      } else {
        setEvents([]);  // 想定外の形式なら空配列
      }
      setIsLoading(false);
    } catch (err) {
      console.error("fetch error:", err);
      setError("通信エラーが発生しました");
      setIsLoading(false);
    }
  };

  return { events, isLoading, error };
};
