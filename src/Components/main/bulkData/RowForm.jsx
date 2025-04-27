import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { PulseLoader } from "react-spinners";

// Dynamic validation schema for row data
const createRowSchema = (allKeys) => {
  const schemaFields = {};
  
  allKeys.forEach(key => {
    // You can customize validation rules based on field names
    if (key.toLowerCase().includes('email')) {
      schemaFields[key] = Yup.string()
        .email("بريد إلكتروني غير صالح")
    } 
  });
  
  return Yup.object().shape(schemaFields);
};

const RowForm = ({ isEditing, selectedRow, onSubmit, formSubmitting, onCancel, error, allKeys }) => {
  // Create initial values from selected row or empty object
  const initialValues = {};
  allKeys.forEach(key => {
    initialValues[key] = selectedRow?.data?.[key] || "";
  });

  // Create validation schema based on available fields
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
            {allKeys.map(key => (
              <div className="mb-3" key={key}>
                <label htmlFor={key} className="form-label">
                  {key}
                </label>
                <Field
                  type={key.toLowerCase().includes('email') ? "email" : "text"}
                  className={`form-control ${
                    errors[key] && touched[key] ? "is-invalid" : ""
                  }`}
                  id={key}
                  name={key}
                  placeholder={`أدخل ${key}`}
                />
                <ErrorMessage
                  name={key}
                  component="div"
                  className="invalid-feedback"
                />
              </div>
            ))}
            
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
                <PulseLoader color="#ffffff" size={8} />
              ) : (
                isEditing ? "تحديث" : "إضافة"
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default RowForm;