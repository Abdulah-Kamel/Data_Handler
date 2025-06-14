import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

const CategoryForm = ({
  isEditing,
  selectedCategory,
  onSubmit,
  formSubmitting,
  onCancel,
  error,
}) => {
  const { t } = useTranslation();

  const CategorySchema = Yup.object().shape({
    name: Yup.string()
      .min(2, t("category_form.validation.name_min"))
      .max(50, t("category_form.validation.name_max"))
      .required(t("category_form.validation.name_required")),
    description: Yup.string()
      .min(5, t("category_form.validation.desc_min"))
      .max(200, t("category_form.validation.desc_max")),
  });

  return (
    <Formik
      initialValues={
        isEditing && selectedCategory
          ? {
              name: selectedCategory.name,
              description: selectedCategory.description,
            }
          : { name: "", description: "" }
      }
      enableReinitialize
      validationSchema={CategorySchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                {t("category_form.labels.name")}
              </label>
              <Field
                type="text"
                className={`form-control ${
                  errors.name && touched.name ? "is-invalid" : ""
                }`}
                id="name"
                name="name"
                placeholder={t("category_form.placeholders.name")}
              />
              <ErrorMessage
                name="name"
                component="div"
                className="invalid-feedback"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                {t("category_form.labels.description")}
              </label>
              <Field
                as="textarea"
                className={`form-control ${
                  errors.description && touched.description ? "is-invalid" : ""
                }`}
                id="description"
                name="description"
                rows="3"
                placeholder={t("category_form.placeholders.description")}
              />
              <ErrorMessage
                name="description"
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
              {t("category_form.buttons.cancel")}
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
                    ? t("category_form.buttons.updating")
                    : t("category_form.buttons.adding")}
                </>
              ) : isEditing ? (
                t("category_form.buttons.update")
              ) : (
                t("category_form.buttons.add")
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CategoryForm;