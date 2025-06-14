import React from "react";
import { useTranslation } from "react-i18next";
import CategoryForm from "./CategoryForm";

const CategoryModal = ({
  show,
  onHide,
  onSubmit,
  category,
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
      aria-labelledby="categoryModalLabel"
      aria-hidden={!show}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="categoryModalLabel">
              {isEditing
                ? t("category_modal.edit_title")
                : t("category_modal.add_title")}
            </h5>
            <button
              type="button"
              className="btn-close me-auto ms-0 fs-5"
              onClick={onHide}
              aria-label={t("aria.close")}
            ></button>
          </div>

          <CategoryForm
            isEditing={isEditing}
            selectedCategory={category}
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

export default CategoryModal;