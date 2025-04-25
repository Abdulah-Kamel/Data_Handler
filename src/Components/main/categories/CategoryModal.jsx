import React from "react";
import CategoryForm from "./CategoryForm";

const CategoryModal = ({
  show,
  isEditing,
  selectedCategory,
  onClose,
  onSubmit,
  formSubmitting,
  error
}) => {
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
              {isEditing ? "تعديل الفئة" : "إضافة فئة جديدة"}
            </h5>
            <button
              type="button"
              className="btn-close me-auto ms-0 fs-5"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          
          <CategoryForm
            isEditing={isEditing}
            selectedCategory={selectedCategory}
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

export default CategoryModal;