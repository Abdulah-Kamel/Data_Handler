import React from "react";
import { useTranslation } from "react-i18next";
import TemplateForm from "./TemplateForm";

const TemplateModal = ({
  show,
  isEditing,
  selectedTemplate,
  onClose,
  onSubmit,
  formSubmitting,
  error,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={`modal fade ${show ? "show" : ""}`}
      style={{ display: show ? "block" : "none" }}
      tabIndex="-1"
      aria-labelledby="templateModalLabel"
      aria-hidden={!show}
      aria-modal="true"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="templateModalLabel">
              {isEditing
                ? t("template_modal.edit_title")
                : t("template_modal.add_title")}
            </h5>
            <button
              type="button"
              className="btn-close me-auto ms-0 fs-5"
              onClick={onClose}
              aria-label={t("aria.close")}
            ></button>
          </div>

          <TemplateForm
            isEditing={isEditing}
            selectedTemplate={selectedTemplate}
            onSubmit={onSubmit}
            formSubmitting={formSubmitting}
            onCancel={onClose}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default TemplateModal;