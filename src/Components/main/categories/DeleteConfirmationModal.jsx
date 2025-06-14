import React from "react";
import { useTranslation } from "react-i18next";

const DeleteConfirmationModal = ({
  show,
  onHide,
  onConfirm,
  category,
  isSubmitting,
  error,
}) => {
  const { t } = useTranslation();
  const templatesCount = category?.templates?.length || 0;

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
              {t("category_delete_confirmation_modal.title")}
            </h5>
            <button
              type="button"
              className="btn-close me-auto ms-0 fs-5"
              onClick={onHide}
              aria-label={t("aria.close")}
            ></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger mb-3">{error}</div>}

            <p>
              {t("category_delete_confirmation_modal.confirmation_message", {
                name: category?.name,
              })}
            </p>
            {templatesCount > 0 && (
              <div className="alert alert-warning">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {t("category_delete_confirmation_modal.warning_message", {
                  count: templatesCount,
                })}
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onHide}
            >
              {t("category_delete_confirmation_modal.buttons.cancel")}
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
                  {t("category_delete_confirmation_modal.buttons.deleting")}
                </>
              ) : (
                t("category_delete_confirmation_modal.buttons.confirm")
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;