import { useTranslation } from "react-i18next";

const FormInput = ({ label, formik, ...props }) => {
    const { i18n } = useTranslation();
    const fieldName = props.name;
    return (
      <section className="mt-3" style={{ textAlign: i18n.dir() === 'rtl' ? 'right' : 'left' }}>
        <label htmlFor={fieldName} className="fs-4 fw-bold">
          {label}
        </label>
        <input
          {...props}
          className="form-control mt-2"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values[fieldName]}
          dir={i18n.dir()}
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