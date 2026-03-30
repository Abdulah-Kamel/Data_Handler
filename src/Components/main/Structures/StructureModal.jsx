import React from "react";
import { useTranslation } from "react-i18next";
import StructureForm from "./StructureForm";

const StructureModal = ({
  show,
  onHide,
  onSubmit,
  structure,
  isEditing,
  formSubmitting,
  error,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={`modal fade ${show ? "show" : ""}`}
      style={{ display: show ? "block" : "none" }}
      tabIndex="-1"
      aria-labelledby="structureModalLabel"
      aria-hidden={!show}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="structureModalLabel">
              {isEditing
                ? t("structures.modal.edit_title")
                : t("structures.modal.add_title")}
            </h5>
            <button
              type="button"
              className="btn-close me-auto ms-0 fs-5"
              onClick={onHide}
              aria-label={t("aria.close")}
            ></button>
          </div>

          <StructureForm
            isEditing={isEditing}
            selectedStructure={structure}
            onSubmit={onSubmit}
            formSubmitting={formSubmitting}
            onCancel={onHide}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default StructureModal;
