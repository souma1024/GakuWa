import { useState } from "react";
import { Event } from "../hooks/useEvents";
import { ConfirmModal } from "./ConfirmModal";

type Props = {
  event: Event;
  onParticipate: (eventId: string) => Promise<void>;
  onCancelParticipate: (eventId: string) => Promise<void>;
};

export const EventCard = ({ event, onParticipate, onCancelParticipate }: Props) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 難易度を星で表示
  const renderDifficulty = (level: number) => {
    return "★".repeat(level) + "☆".repeat(5 - level);
  };

  // ボタンクリック → モーダルを開く
  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  // モーダルで確認 → 実際の処理
  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      if (event.isParticipating) {
        await onCancelParticipate(event.id);
      } else {
        await onParticipate(event.id);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error:", error);
      alert(error instanceof Error ? error.message : "エラーが発生しました");
    } finally {
      setIsProcessing(false);
    }
  };

  // モーダルを閉じる
  const handleCancel = () => {
    if (!isProcessing) {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <div className="event-card">
        <div className="event-thumbnail">
          <img src={event.thumbnailUrl} alt={event.name} />
          {event.isParticipating && (
            <span className="participating-badge">参加中</span>
          )}
        </div>
        <div className="event-content">
          <h3 className="event-title">{event.name}</h3>
          <p className="event-difficulty">
            難易度: <span className="stars">{renderDifficulty(event.difficulty)}</span>
          </p>
          <p className="event-details">{event.details}</p>
          <button
            className={`event-btn ${event.isParticipating ? "btn-cancel" : "btn-participate"}`}
            onClick={handleButtonClick}
          >
            {event.isParticipating ? "参加取り消し" : "参加する"}
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        title={event.isParticipating ? "参加を取り消しますか？" : "イベントに参加しますか？"}
        message={`「${event.name}」${event.isParticipating ? "の参加を取り消します" : "に参加します"}`}
        confirmText={event.isParticipating ? "取り消す" : "参加する"}
        cancelText="キャンセル"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        isProcessing={isProcessing}
      />
    </>
  );
};
