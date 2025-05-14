import React from "react";
import { PulseLoader } from "react-spinners";

const RowDeleteModal = ({ show, row, onClose, onConfirm, isSubmitting, error }) => {
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
              تأكيد الحذف
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
            <p>هل أنت متأكد من حذف هذا السجل؟</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              إلغاء
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
                "حذف"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RowDeleteModal;