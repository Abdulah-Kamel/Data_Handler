import React, { useState, useRef } from "react";

const FileUploadModal = ({
  show,
  template,
  onClose,
  onUpload,
  isUploading,
  error
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError("");
    
    if (file) {
      // Check if file is a Word document
      const isWordFile = file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      
      if (!isWordFile) {
        setFileError("يرجى اختيار ملف Word (.docx) فقط");
        setSelectedFile(null);
        setFileName("");
        fileInputRef.current.value = "";
        return;
      }
      
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile && template && !fileError) {
      onUpload(template.id, selectedFile);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div
      className={`modal fade ${show ? "show" : ""}`}
      style={{ display: show ? "block" : "none" }}
      tabIndex="-1"
      aria-labelledby="fileUploadModalLabel"
      aria-hidden={!show}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="fileUploadModalLabel">
              رفع ملف للقالب: {template?.name}
            </h5>
            <button
              type="button"
              className="btn-close me-auto ms-0 fs-5"
              onClick={handleClose}
              aria-label="Close"
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="word_file" className="form-label">
                  ملف القالب (Word)
                </label>
                <input
                  type="file"
                  className={`form-control ${fileError ? 'is-invalid' : ''}`}
                  id="word_file"
                  name="word_file"
                  ref={fileInputRef}
                  accept=".docx"
                  onChange={handleFileChange}
                  required
                />
                <small className="form-text text-muted">
                  يرجى اختيار ملف بصيغة Word (.docx)
                </small>
                {fileError && (
                  <div className="invalid-feedback">
                    {fileError}
                  </div>
                )}
              </div>
              
              {fileName && (
                <div className="alert alert-info">
                  <i className="fas fa-file-word me-2"></i>
                  {fileName}
                </div>
              )}
              
              {/* Display error message if any */}
              {error && (
                <div className="alert alert-danger mt-3">
                  {error}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    جاري الرفع...
                  </>
                ) : (
                  "رفع الملف"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;