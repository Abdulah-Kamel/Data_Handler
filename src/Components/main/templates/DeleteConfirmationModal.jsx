import React from "react";
import { useTranslation } from "react-i18next";

const DeleteConfirmationModal = ({
  show,
  template,
  onClose,
  onConfirm,
  isSubmitting,
  error,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={`modal fade ${show ? "show" : ""}`}
      style={{ display: show ? "block" : "none" }}
      tabIndex="-1"
      aria-labelledby="deleteModalLabel"
      aria-hidden={!show}
      aria-modal="true"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="deleteModalLabel">
              {t("template_delete_confirmation_modal.title")}
            </h5>
            <button
              type="button"
              className="btn-close me-auto ms-0 fs-5"
              onClick={onClose}
              aria-label={t("aria.close")}
            ></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger mb-3">{error}</div>}

            <p>
              {t("template_delete_confirmation_modal.confirmation_message", {
                templateName: template?.name,
              })}
            </p>
            <div className="alert alert-warning">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {t("template_delete_confirmation_modal.warning")}
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              {t("template_delete_confirmation_modal.cancel_button")}
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  {t("template_delete_confirmation_modal.deleting_button")}
                </>
              ) : (
                t("template_delete_confirmation_modal.confirm_button")
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;