import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const ExcelUploadModal = ({
  show,
  onHide,
  onSubmit,
  loading,
  structures = [],
  selectedStructureId,
  onStructureSelect,
}) => {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ];
      const validExtensions = [".xlsx", ".xls"];
      const fileExtension = selectedFile.name ? selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase() : "";

      if (!validTypes.includes(selectedFile.type) && !validExtensions.includes(fileExtension)) {
        setFileError(t("structures.excel_modal.validation.invalid_format"));
        setFile(null);
        return;
      }
      setFileError("");
      setFile(selectedFile);
    }
  };

  const handleSubmit = () => {
    if (!file) {
      setFileError(t("structures.excel_modal.validation.file_required"));
      return;
    }
    if (!selectedStructureId && structures.length > 0) {
      return;
    }
    onSubmit(file, {
      setSubmitting: () => {},
      resetForm: () => {
        setFile(null);
        setFileError("");
      },
    });
  };

  const handleClose = () => {
    setFile(null);
    setFileError("");
    onHide();
  };

  return (
    <div
      className={`modal fade ${show ? "show" : ""}`}
      style={{ display: show ? "block" : "none" }}
      tabIndex="-1"
      aria-hidden={!show}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {t("structures.excel_modal.title")}
            </h5>
            <button
              type="button"
              className="btn-close me-auto ms-0 fs-5"
              onClick={handleClose}
              aria-label={t("aria.close")}
            ></button>
          </div>
          <div className="modal-body">
            {/* Structure selector when not pre-selected */}
            {!selectedStructureId && structures.length > 0 && (
              <div className="mb-3">
                <label className="form-label">
                  {t("structures.excel_modal.select_structure")}
                </label>
                <select
                  className="form-select"
                  onChange={(e) => onStructureSelect(e.target.value)}
                  value={selectedStructureId || ""}
                >
                  <option value="">
                    {t("structures.excel_modal.select_structure_placeholder")}
                  </option>
                  {structures.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">
                {t("structures.excel_modal.file_label")}
              </label>
              <input
                type="file"
                className={`form-control ${fileError ? "is-invalid" : ""}`}
                accept=".xlsx,.xls"
                onChange={handleFileChange}
              />
              {fileError && (
                <div className="invalid-feedback">{fileError}</div>
              )}
            </div>

            {file && (
              <div className="alert alert-info small">
                {t("structures.excel_modal.selected_file")}: {file.name}
              </div>
            )}

            <div className="alert alert-secondary small">
              {t("structures.excel_modal.info")}
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
            >
              {t("structures.excel_modal.cancel")}
            </button>
            <button
              type="button"
              className="btn primary-btn"
              onClick={handleSubmit}
              disabled={loading || !file}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  {t("structures.excel_modal.uploading")}
                </>
              ) : (
                t("structures.excel_modal.upload")
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcelUploadModal;
