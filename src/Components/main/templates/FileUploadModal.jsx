import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";

const FileUploadModal = ({
  show,
  template,
  onClose,
  onUpload,
  isUploading,
  error,
}) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError("");

    if (file) {
      const isWordFile =
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

      if (!isWordFile) {
        setFileError(t("file_upload_modal.validation.file_type_error"));
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
    setFileError("");
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
      aria-modal="true"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="fileUploadModalLabel">
              {t("file_upload_modal.title", { templateName: template?.name })}
            </h5>
            <button
              type="button"
              className="btn-close me-auto ms-0 fs-5"
              onClick={handleClose}
              aria-label={t("aria.close")}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="word_file" className="form-label">
                  {t("file_upload_modal.file_label")}
                </label>
                <input
                  type="file"
                  className={`form-control ${fileError ? "is-invalid" : ""}`}
                  id="word_file"
                  name="word_file"
                  ref={fileInputRef}
                  accept=".docx"
                  onChange={handleFileChange}
                  required
                />
                <small className="form-text text-muted">
                  {t("file_upload_modal.file_hint")}
                </small>
                {fileError && (
                  <div className="invalid-feedback">{fileError}</div>
                )}
              </div>

              {fileName && (
                <div className="alert alert-info">
                  <i className="fas fa-file-word me-2"></i>
                  {fileName}
                </div>
              )}

              {error && (
                <div className="alert alert-danger mt-3">{error}</div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
              >
                {t("file_upload_modal.cancel_button")}
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
                    {t("file_upload_modal.uploading_button")}
                  </>
                ) : (
                  t("file_upload_modal.upload_button")
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