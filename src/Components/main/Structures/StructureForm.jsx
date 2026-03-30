import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

const StructureForm = ({
  isEditing,
  selectedStructure,
  onSubmit,
  formSubmitting,
  onCancel,
  error,
}) => {
  const { t } = useTranslation();

  const StructureSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, t("structures.form.validation.name_min"))
      .max(50, t("structures.form.validation.name_max"))
      .required(t("structures.form.validation.name_required")),
  });

  return (
    <Formik
      initialValues={
        isEditing && selectedStructure
          ? { name: selectedStructure.name }
          : { name: "" }
      }
      enableReinitialize
      validationSchema={StructureSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                {t("structures.form.labels.name")}
              </label>
              <Field
                type="text"
                className={`form-control ${
                  errors.name && touched.name ? "is-invalid" : ""
                }`}
                id="name"
                name="name"
                placeholder={t("structures.form.placeholders.name")}
              />
              <ErrorMessage
                name="name"
                component="div"
                className="invalid-feedback"
              />
            </div>

            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              {t("structures.form.buttons.cancel")}
            </button>
            <button
              type="submit"
              className="btn primary-btn"
              disabled={isSubmitting || formSubmitting}
            >
              {formSubmitting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  {isEditing
                    ? t("structures.form.buttons.updating")
                    : t("structures.form.buttons.adding")}
                </>
              ) : isEditing ? (
                t("structures.form.buttons.update")
              ) : (
                t("structures.form.buttons.add")
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default StructureForm;
