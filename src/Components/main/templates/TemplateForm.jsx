import React from "react";
import { useTranslation } from "react-i18next";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const TemplateForm = ({
  isEditing,
  selectedTemplate,
  onSubmit,
  formSubmitting,
  onCancel,
  error,
}) => {
  const { t } = useTranslation();

  const TemplateSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, t("template_form.validation.name_min"))
      .max(100, t("template_form.validation.name_max"))
      .required(t("template_form.validation.name_required")),
    description: Yup.string()
      .min(5, t("template_form.validation.desc_min"))
      .max(200, t("template_form.validation.desc_max")),
  });

  return (
    <Formik
      initialValues={{
        name: selectedTemplate?.name || "",
        description: selectedTemplate?.description || "",
      }}
      enableReinitialize
      validationSchema={TemplateSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                {t("template_form.name_label")}
              </label>
              <Field
                type="text"
                className={`form-control ${
                  errors.name && touched.name ? "is-invalid" : ""
                }`}
                id="name"
                name="name"
                placeholder={t("template_form.name_placeholder")}
              />
              <ErrorMessage
                name="name"
                component="div"
                className="invalid-feedback"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                {t("template_form.description_label")}
              </label>
              <Field
                as="textarea"
                className={`form-control ${
                  errors.description && touched.description ? "is-invalid" : ""
                }`}
                id="description"
                name="description"
                rows="3"
                placeholder={t("template_form.description_placeholder")}
              />
              <ErrorMessage
                name="description"
                component="div"
                className="invalid-feedback"
              />
            </div>

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
              onClick={onCancel}
            >
              {t("template_form.cancel_button")}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
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
                    ? t("template_form.saving_button")
                    : t("template_form.adding_button")}
                </>
              ) : isEditing ? (
                t("template_form.save_button")
              ) : (
                t("template_form.add_button")
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default TemplateForm;