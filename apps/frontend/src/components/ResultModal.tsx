import "../styles/modal.css";

type Props = {
  isOpen: boolean;
  title: string;
  teamName: string;
  role: string;
  onClose: () => void;
};

export const ResultModal = ({
  isOpen,
  title,
  teamName,
  role,
  onClose,
}: Props) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content result-modal" onClick={(e) => e.stopPropagation()}>
        <div className="result-icon">🎉</div>
        <h2 className="modal-title">{title}</h2>
        <div className="result-info">
          <p className="team-name">{teamName}</p>
          <p className="team-role">
            あなたの役割: <span className={`role-badge ${role}`}>{role === 'leader' ? 'リーダー' : 'メンバー'}</span>
          </p>
        </div>
        <button className="modal-btn btn-confirm" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};
