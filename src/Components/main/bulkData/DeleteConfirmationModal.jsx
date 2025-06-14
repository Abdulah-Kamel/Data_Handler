import { useTranslation } from "react-i18next";
import React from "react";

const DeleteConfirmationModal = ({
  show,
  onHide,
  onConfirm,
  itemName,
  loading,
}) => {
  const { t } = useTranslation();
  return (
    <div
      className={`modal fade ${show ? "show" : ""}`}
      style={{ display: show ? "block" : "none" }}
      tabIndex="-1"
      role="dialog"
      aria-hidden={!show}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {t("delete_confirmation_modal.title")}
            </h5>
            <button
              type="button"
              className="btn-close me-auto ms-0"
              onClick={onHide}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            <p>
              {t("delete_confirmation_modal.confirmation_message", {
                itemName,
              })}
            </p>
            <div className="alert alert-warning">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {t("delete_confirmation_modal.warning_message")}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onHide}
              disabled={loading}
            >
              {t("delete_confirmation_modal.cancel_button")}
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading
                ? t("delete_confirmation_modal.deleting_button")
                : t("delete_confirmation_modal.delete_button")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
