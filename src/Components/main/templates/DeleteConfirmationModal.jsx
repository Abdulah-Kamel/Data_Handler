import React from "react";

const DeleteConfirmationModal = ({
  show,
  template,
  onClose,
  onConfirm,
  isSubmitting,
  error
}) => {
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
            {error && (
              <div className="alert alert-danger mb-3">
                {error}
              </div>
            )}
            
            <p>هل أنت متأكد من حذف قالب "{template?.title}"؟</p>
            <div className="alert alert-warning">
              <i className="fas fa-exclamation-triangle me-2"></i>
              لا يمكن التراجع عن هذا الإجراء.
            </div>
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
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  جاري الحذف...
                </>
              ) : (
                "تأكيد الحذف"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;