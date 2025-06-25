import React from 'react';
import { ErrorMessage, useField } from 'formik';

const FormField = ({
  name,
  label,
  type = 'text',
  selectOptions,
  className = '',
  ...props
}) => {
  const [field, meta] = useField(name);
  const hasError = (meta.touched && meta.error) || props.apiErrors?.[name];
  const fieldId = `${name}-field`;

  return (
    <div className={`mb-3 ${className}`}>
      {label && type !== "checkbox" && type !== "radio" && (
        <label htmlFor={fieldId} className="form-label">
          {label}
        </label>
      )}

      {type === "select" ? (
        <select
          id={fieldId}
          className={`form-select ${hasError ? "is-invalid" : ""}`}
          {...field}
          {...props}
        >
          {selectOptions?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === "checkbox" ? (
        <div className="form-check">
          <input
            id={fieldId}
            type="checkbox"
            className={`form-check-input ${hasError ? "is-invalid" : ""}`}
            checked={field.value}
            {...field}
            {...props}
          />
          {label && (
            <label className="form-check-label" htmlFor={fieldId}>
              {label}
            </label>
          )}
        </div>
      ) : type === "radio" ? (
        <div className="form-check">
          <input
            type="radio"
            className={`form-check-input ${hasError ? "is-invalid" : ""}`}
            {...field}
            {...props}
            checked={field.value === props.value}
          />
          {label && (
            <label className="form-check-label" htmlFor={props.id}>
              {label}
            </label>
          )}
        </div>
      ) : (
        <input
          id={fieldId}
          type={type}
          className={`form-control ${hasError ? "is-invalid" : ""}`}
          {...field}
          {...props}
        />
      )}

      <ErrorMessage name={name}>
        {(msg) => <div className="invalid-feedback">{msg}</div>}
      </ErrorMessage>
      {props.apiErrors?.[name] && (
        <div className="invalid-feedback d-block">{props.apiErrors[name]}</div>
      )}
    </div>
  );
};

export default FormField;
