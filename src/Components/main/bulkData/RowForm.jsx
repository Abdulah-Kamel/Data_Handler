import { useTranslation } from "react-i18next";
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { PulseLoader } from "react-spinners";

const RowForm = ({
  isEditing,
  selectedRow,
  onSubmit,
  formSubmitting,
  onCancel,
  error,
  allKeys,
}) => {
  const { t } = useTranslation();

  const createRowSchema = (allKeys) => {
    const schemaFields = {};

    allKeys.forEach((key) => {
      if (key.toLowerCase().includes("email")) {
        schemaFields[key] = Yup.string().email(
          t("bulk_data.details.errors.invalid_email")
        );
      }
    });

    return Yup.object().shape(schemaFields);
  };

  const initialValues = {};
  allKeys.forEach((key) => {
    initialValues[key] = selectedRow?.data?.[key] || "";
  });

  const RowSchema = createRowSchema(allKeys);

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={RowSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form>
          <div className="modal-body">
            {allKeys.map((key) => (
              <div className="mb-3" key={key}>
                <label htmlFor={key} className="form-label">
                  {key}
                </label>
                <Field
                  type={key.toLowerCase().includes("email") ? "email" : "text"}
                  className={`form-control ${
                    errors[key] && touched[key] ? "is-invalid" : ""
                  }`}
                  id={key}
                  name={key}
                  placeholder={t("row_form.placeholder", { field: key })}
                />
                <ErrorMessage
                  name={key}
                  component="div"
                  className="invalid-feedback"
                />
              </div>
            ))}

            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              {t("row_form.cancel_button")}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || formSubmitting}
            >
              {formSubmitting ? (
                <PulseLoader color="#ffffff" size={8} />
              ) : (
                t(isEditing ? "row_form.update_button" : "row_form.add_button")
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default RowForm;
