import "../styles/modal.css";

type Props = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
};

export const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmText = "確認",
  cancelText = "キャンセル",
  onConfirm,
  onCancel,
  isProcessing = false,
}: Props) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>
        <p className="modal-message">※チームは自動で割り当てられます。</p>
        <div className="modal-buttons">
          <button
            className="modal-btn btn-cancel"
            onClick={onCancel}
            disabled={isProcessing}
          >
            {cancelText}
          </button>
          <button
            className="modal-btn btn-confirm"
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? "処理中..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
