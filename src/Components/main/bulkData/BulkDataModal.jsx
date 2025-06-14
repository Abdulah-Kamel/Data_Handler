import { useTranslation } from "react-i18next";
import React from "react";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";

const BulkDataModal = ({
  show,
  onHide,
  onSubmit,
  initialValues,
  isEditing,
  loading,
}) => {
  const { t } = useTranslation();

  const bulkDataSchema = Yup.object().shape({
    name: Yup.string()
      .required(t("bulk_data.modal.validation.name_required"))
      .min(3, t("bulk_data.modal.validation.name_min"))
      .max(50, t("bulk_data.modal.validation.name_max")),
  });

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
            <h5 className="modal-title">
              {isEditing
                ? t("bulk_data.modal.edit_title")
                : t("bulk_data.modal.add_title")}
            </h5>
            <button
              type="button"
              className="btn-close me-auto ms-0"
              onClick={onHide}
              aria-label="Close"
            ></button>
          </div>

          <Formik
            initialValues={initialValues || { name: "" }}
            validationSchema={bulkDataSchema}
            onSubmit={onSubmit}
            enableReinitialize
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <FormikForm onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      {t("bulk_data.modal.data_name_label")}
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        touched.name && (errors.name || errors.non_field_errors)
                          ? "is-invalid"
                          : ""
                      }`}
                      id="name"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading}
                    />
                    {touched.name && errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>

                  {errors.non_field_errors && (
                    <div className="alert alert-danger">
                      {errors.non_field_errors}
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onHide}
                    disabled={loading || isSubmitting}
                  >
                    {t("bulk_data.modal.cancel_button")}
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary primary-btn"
                    disabled={loading || isSubmitting}
                  >
                    {loading || isSubmitting
                      ? t("bulk_data.modal.saving_button")
                      : t("bulk_data.modal.save_button")}
                  </button>
                </div>
              </FormikForm>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default BulkDataModal;
