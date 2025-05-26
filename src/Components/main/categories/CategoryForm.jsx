import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const CategorySchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "اسم الفئة قصير جدًا")
    .max(50, "اسم الفئة طويل جدًا")
    .required("اسم الفئة مطلوب"),
  description: Yup.string()
    .min(5, "الوصف قصير جدًا")
    .max(200, "الوصف طويل جدًا")
});

const CategoryForm = ({ isEditing, selectedCategory, onSubmit, formSubmitting, onCancel, error }) => {
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
                اسم الفئة
              </label>
              <Field
                type="text"
                className={`form-control ${
                  errors.name && touched.name ? "is-invalid" : ""
                }`}
                id="name"
                name="name"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="invalid-feedback"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                الوصف
              </label>
              <Field
                as="textarea"
                className={`form-control ${
                  errors.description && touched.description
                    ? "is-invalid"
                    : ""
                }`}
                id="description"
                name="description"
                rows="3"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="invalid-feedback"
              />
            </div>
            
            {/* Display error message below the inputs */}
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
              إلغاء
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
                  {isEditing ? "جاري التعديل..." : "جاري الإضافة..."}
                </>
              ) : (
                isEditing ? "تعديل" : "إضافة"
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CategoryForm;