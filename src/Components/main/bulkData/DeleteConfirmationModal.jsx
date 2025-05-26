import React from "react";

const DeleteConfirmationModal = ({ show, onHide, onConfirm, itemName, loading }) => {
  return (
    <div className={`modal fade ${show ? 'show' : ''}`} 
         style={{ display: show ? 'block' : 'none' }} 
         tabIndex="-1" 
         role="dialog"
         aria-hidden={!show}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">تأكيد الحذف</h5>
            <button type="button" className="btn-close me-auto ms-0" onClick={onHide} aria-label="Close"></button>
          </div>
          
          <div className="modal-body">
            <p>هل أنت متأكد من حذف "{itemName}"؟</p>
            <div className="alert alert-warning">
              <i className="fas fa-exclamation-triangle me-2"></i>
              لا يمكن التراجع عن هذا الإجراء.
            </div>
          </div>
          
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onHide} 
              disabled={loading}
            >
              إلغاء
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? "جاري الحذف..." : "حذف"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;