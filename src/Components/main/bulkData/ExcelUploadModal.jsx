import { useTranslation } from "react-i18next";
import React, { useState, useEffect, useRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const validFileExtensions = ["xlsx", "xls"];

const ExcelUploadModal = ({ show, onHide, onSubmit, loading }) => {
  const { t } = useTranslation();
  const [fileName, setFileName] = useState("");
  const formikRef = useRef(null);
  const fileInputRef = useRef(null);

  const ExcelUploadSchema = Yup.object().shape({
    file: Yup.mixed()
      .required(t("excel_upload_modal.validation.file_required"))
      .test(
        "fileFormat",
        t("excel_upload_modal.validation.invalid_format"),
        (value) =>
          value &&
          validFileExtensions.includes(
            value.name.split(".").pop().toLowerCase()
          )
      ),
  });

  useEffect(() => {
    if (show) {
      setFileName("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      if (formikRef.current) {
        formikRef.current.resetForm();
      }
    }
  }, [show]);

  const handleHide = () => {
    setFileName("");
    if (formikRef.current) {
      formikRef.current.resetForm();
    }
    onHide();
  };

  return (
    <div
      className={`modal fade ${show ? "show" : ""}`}
      style={{ display: show ? "block" : "none" }}
      tabIndex="-1"
      role="dialog"
      aria-hidden={!show}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{t("excel_upload_modal.title")}</h5>
            <button
              type="button"
              className="btn-close me-auto ms-0"
              onClick={handleHide}
              aria-label="Close"
            ></button>
          </div>

          <Formik
            initialValues={{ file: null }}
            validationSchema={ExcelUploadSchema}
            onSubmit={(values, actions) => {
              onSubmit(values.file, actions);
            }}
            innerRef={formikRef}
          >
            {({
              errors,
              touched,
              setFieldValue,
              handleSubmit,
              isSubmitting,
              resetForm,
            }) => (
              <Form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="file" className="form-label">
                      {t("excel_upload_modal.form_label")}
                    </label>
                    <div className="input-group">
                      <input
                        type="file"
                        className={`form-control ${
                          touched.file && errors.file ? "is-invalid" : ""
                        }`}
                        id="file"
                        accept=".xlsx,.xls"
                        ref={fileInputRef}
                        onChange={(event) => {
                          const file = event.currentTarget.files[0];
                          setFieldValue("file", file);
                          setFileName(file ? file.name : "");
                        }}
                        disabled={loading || isSubmitting}
                        key={show ? "open" : "closed"}
                      />
                      <label className="input-group-text" htmlFor="file">
                        {t("excel_upload_modal.choose_file_button")}
                      </label>
                    </div>
                    {fileName && (
                      <div className="mt-2">
                        {t("excel_upload_modal.selected_file_label")} {fileName}
                      </div>
                    )}
                    {touched.file && errors.file && (
                      <div className="invalid-feedback d-block">
                        {errors.file}
                      </div>
                    )}
                  </div>

                  <div className="alert alert-info">
                    <small>{t("excel_upload_modal.info_alert")}</small>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleHide}
                    disabled={loading || isSubmitting}
                  >
                    {t("excel_upload_modal.cancel_button")}
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || isSubmitting}
                  >
                    {loading || isSubmitting
                      ? t("excel_upload_modal.uploading_button")
                      : t("excel_upload_modal.upload_button")}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ExcelUploadModal;
