import React from "react";
import RowForm from "./RowForm";

const RowEditModal = ({
  show,
  isEditing,
  selectedRow,
  onClose,
  onSubmit,
  formSubmitting,
  error,
  allKeys
}) => {
  return (
    <div
      className={`modal fade ${show ? "show" : ""}`}
      style={{ display: show ? "block" : "none" }}
      tabIndex="-1"
      aria-labelledby="rowModalLabel"
      aria-hidden={!show}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="rowModalLabel">
              {isEditing ? "تعديل البيانات" : "إضافة بيانات جديدة"}
            </h5>
            <button
              type="button"
              className="btn-close me-auto ms-0 fs-5"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          
          <RowForm
            isEditing={isEditing}
            selectedRow={selectedRow}
            onSubmit={onSubmit}
            formSubmitting={formSubmitting}
            onCancel={onClose}
            error={error}
            allKeys={allKeys}
          />
        </div>
      </div>
    </div>
  );
};

export default RowEditModal;