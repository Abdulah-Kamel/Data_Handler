import React from "react";
import { useTranslation } from "react-i18next";

const ConfirmationModal = ({
  show,
  onHide,
  onConfirm,
  title,
  message,
  confirmText,
  confirmVariant = "danger",
  cancelText,
  loading = false,
}) => {
  const { t } = useTranslation();

  if (!show) return null;

  const modalTitle = title || t('confirmation_modal.default_title');
  const modalMessage = message || t('confirmation_modal.default_message');
  const modalConfirmText = confirmText || t('confirmation_modal.default_confirm_text');
  const modalCancelText = cancelText || t('confirmation_modal.default_cancel_text');

  return (
    <div
      className="modal"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1050,
      }}
    >
      <div
        className="modal-content"
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "500px",
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div
          className={`modal-header bg-${confirmVariant} text-white`}
          style={{
            padding: "1rem",
            borderBottom: "1px solid #dee2e6",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h5
            className="modal-title"
            style={{ margin: 0, fontSize: "1.25rem" }}
          >
            {modalTitle}
          </h5>
          <button
            type="button"
            className="btn-close btn-close-white me-auto ms-0"
            onClick={onHide}
          >
            &times;
          </button>
        </div>
        <div className="modal-body" style={{ padding: "1.5rem" }}>
          <p style={{ margin: 0, textAlign: "center" }}>{modalMessage}</p>
        </div>
        <div
          className="modal-footer"
          style={{
            padding: "1rem",
            borderTop: "1px solid #dee2e6",
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <button
            type="button"
            onClick={onHide}
            disabled={loading}
            style={{
              padding: "0.375rem 1.5rem",
              backgroundColor: "#6c757d",
              color: "#fff",
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer",
              opacity: loading ? 0.65 : 1,
            }}
          >
            {modalCancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding: "0.375rem 1.5rem",
              backgroundColor:
                confirmVariant === "danger" ? "#dc3545" : "#0d6efd",
              color: "#fff",
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer",
              opacity: loading ? 0.65 : 1,
            }}
          >
            {loading ? (
              <span
                style={{
                  display: "inline-block",
                  width: "1rem",
                  height: "1rem",
                  border: "0.2em solid rgba(255, 255, 255, 0.3)",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                  marginRight: "0.5rem",
                  animation: "spinner 0.6s linear infinite",
                  verticalAlign: "middle",
                }}
              ></span>
            ) : null}
            {modalConfirmText}
          </button>
        </div>
      </div>
      <style jsx global>{`
        @keyframes spinner {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default ConfirmationModal;
