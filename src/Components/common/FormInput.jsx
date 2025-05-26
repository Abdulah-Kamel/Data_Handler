const FormInput = ({ label, formik, ...props }) => {
    const fieldName = props.name;
    return (
      <section className="mt-3">
        <label htmlFor={fieldName} className="fs-4 fw-bold">
          {label}
        </label>
        <input
          {...props}
          className="form-control mt-2"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values[fieldName]}
        />
        {formik.touched[fieldName] && formik.errors[fieldName] ? (
          <section className="alert alert-danger mt-2">
            {formik.errors[fieldName]}
          </section>
        ) : null}
      </section>
    );
  };
  
  export default FormInput;