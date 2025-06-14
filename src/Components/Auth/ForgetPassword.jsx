import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { authService } from "../../services/authService";
import { useForgotPasswordForm } from "../../hooks/useForgotPasswordForm";
import FormInput from "../common/FormInput";
import Navbar from "../../Components/NavBar/NavBar";

const ForgetPassword = () => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleForgotPassword = async (values) => {
    setSubmitLoading(true);
    try {
      const data = await authService.forgotPassword(values.email);
      if (data.status === 200) {
        navigate("/reset-code");
      }
    } catch (err) {
      const statusMsg = err.response?.data?.statusMsg || 'Error';
      const message = err.response?.data?.message || 'Something went wrong';
      setError(`${statusMsg.charAt(0).toUpperCase() + statusMsg.slice(1)}, ${message}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const formik = useForgotPasswordForm(handleForgotPassword, t);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <section className="position-absolute bg-main-light top-0 end-0 bottom-0 start-0 d-flex justify-content-center align-items-center w-100 vh-100">
        <PulseLoader color="#05755c" size={30} />
      </section>
    );
  }

  return (
    <>
      <title>{t('forget_password.page_title')}</title>
      <meta name="description" content={t('forget_password.page_title')} />
      <Navbar />
      <section className="form-container my-5 py-5" dir={i18n.dir()}>
        <section className="mt-5 py-5">
          <h2 className="fw-bold text-center">{t('forget_password.header')}</h2>
          <form onSubmit={formik.handleSubmit} className="mt-4">
            <FormInput
              label={t('forget_password.email_label')}
              type="email"
              name="email"
              id="email"
              formik={formik}
            />
            {error && (
              <section className="alert alert-danger my-4">
                <p className="text-center fw-bold fs-5 mb-0">{error}</p>
              </section>
            )}
            <section className="mt-3 d-flex justify-content-end align-items-center">
              <button
                type="submit"
                className="btn primary-btn text-white ms-auto px-3 py-2"
                disabled={!formik.isValid || submitLoading}
              >
                {submitLoading ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  t('forget_password.submit_button')
                )}
              </button>
            </section>
          </form>
        </section>
      </section>
    </>
  );
};

export default ForgetPassword;
