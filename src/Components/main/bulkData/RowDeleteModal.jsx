import { useTranslation } from "react-i18next";
import React from "react";
import { PulseLoader } from "react-spinners";

const RowDeleteModal = ({
  show,
  row,
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
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="deleteModalLabel">
              {t("row_delete_modal.title")}
            </h5>
            <button
              type="button"
              className="btn-close me-auto ms-0 fs-5"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <p>{t("row_delete_modal.confirmation_message")}</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              {t("row_delete_modal.cancel_button")}
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <PulseLoader color="#05755c" size={8} />
              ) : (
                t("row_delete_modal.delete_button")
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RowDeleteModal;
