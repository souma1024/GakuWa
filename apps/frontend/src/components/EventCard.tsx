import { useState } from "react";
import { Event, TeamInfo } from "../hooks/useEvents";
import { ConfirmModal } from "./ConfirmModal";
import { ResultModal } from "./ResultModal";

type Props = {
  event: Event;
  onParticipate: (eventId: string) => Promise<TeamInfo>;
  onCancelParticipate: (eventId: string) => Promise<void>;
};

export const EventCard = ({ event, onParticipate, onCancelParticipate }: Props) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [teamInfo, setTeamInfo] = useState<TeamInfo | null>(null);

  // 難易度を星で表示
  const renderDifficulty = (level: number) => {
    return "★".repeat(level) + "☆".repeat(5 - level);
  };

  // ボタンクリック → 確認モーダルを開く
  const handleButtonClick = () => {
    setIsConfirmModalOpen(true);
  };

  // 確認モーダルで確定 → 実際の処理
  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      if (event.isParticipating) {
        await onCancelParticipate(event.id);
        setIsConfirmModalOpen(false);
      } else {
        const result = await onParticipate(event.id);
        setTeamInfo(result);
        setIsConfirmModalOpen(false);
        setIsResultModalOpen(true);  // 結果モーダルを表示
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error instanceof Error ? error.message : "エラーが発生しました");
    } finally {
      setIsProcessing(false);
    }
  };

  // 確認モーダルを閉じる
  const handleCancel = () => {
    if (!isProcessing) {
      setIsConfirmModalOpen(false);
    }
  };

  // 結果モーダルを閉じる
  const handleResultClose = () => {
    setIsResultModalOpen(false);
    setTeamInfo(null);
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

      {/* 確認モーダル */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title={event.isParticipating ? "参加を取り消しますか？" : "イベントに参加しますか？"}
        message={`「${event.name}」${event.isParticipating ? "の参加を取り消します" : "に参加します"}`}
        confirmText={event.isParticipating ? "取り消す" : "参加する"}
        cancelText="キャンセル"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        isProcessing={isProcessing}
      />

      {/* 結果モーダル */}
      {teamInfo && (
        <ResultModal
          isOpen={isResultModalOpen}
          title="参加登録が完了しました！"
          teamName={teamInfo.name}
          role={teamInfo.role}
          onClose={handleResultClose}
        />
      )}
    </>
  );
};
