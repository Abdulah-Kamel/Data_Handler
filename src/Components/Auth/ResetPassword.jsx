import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PulseLoader } from "react-spinners";
import NavBar from "../NavBar/NavBar";
import { authService } from "../../services/authService";
import FormInput from "../common/FormInput";

const ResetPassword = () => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const uid = searchParams.get('uid');

  async function resetPassword(values) {
    setSubmitLoading(true);
    try {
      const resetData = {
        password: values.password,
        token: token,
        uid: uid
      };
      let data = await authService.resetPassword(resetData);
      if (data.status === 200) {
        navigate('/reset-code', { state: { message: t('reset_password.success_message') } });
      } else {
        setError(data.error || 'Failed to reset password. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  }
  
  const validationSchema = Yup.object({
    password: Yup.string().required(t('reset_password.password_required')),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    onSubmit: (values) => {
      resetPassword(values);
    },
    validationSchema: validationSchema,
  });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  return (
    <>
      <title>{t('reset_password.page_title')}</title>
      <meta name="description" content={t('reset_password.page_title')} />
      {loading ? (
        <section className="position-absolute top-0 start-0 end-0 bottom-0 bg-main-light d-flex justify-content-center align-items-center w-100 vh-100">
          <PulseLoader color="#05755c" size={30} />
        </section>
      ) : (
        <>
          <NavBar />
          <section className="form-container my-5 py-5" dir={i18n.dir()}>
            <section className="mt-5 py-5">
              <h2 className="text-center fw-bold">{t('reset_password.header')}</h2>
              <form onSubmit={formik.handleSubmit} className="mt-4">
                <FormInput
                  label={t('reset_password.new_password_label')}
                  type="password"
                  name="password"
                  id="password"
                  formik={formik}
                />
                {error ? (
                  <section className="alert alert-danger my-4">
                    <p className="text-center fw-bold fs-5 mb-0">{error}</p>
                  </section>
                ) : null}
                <section className="mt-3 d-flex justify-content-end align-items-center">
                  <button
                    type="submit"
                    className={`btn primary-btn text-white ms-auto px-3 py-2`}
                    disabled={!formik.isValid || submitLoading}
                  >
                    {submitLoading ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      t('reset_password.submit_button')
                    )}
                  </button>
                </section>
              </form>
            </section>
          </section>
        </>
      )}
    </>
  );
};

export default ResetPassword;
