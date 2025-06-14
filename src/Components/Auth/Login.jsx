import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import Navbar from "../NavBar/NavBar";
import { useLoginForm } from "../../hooks/useLoginForm";
import FormInput from "../common/FormInput";
import { authService } from "../../services/authService";
import { useAuth } from "../../Context/AuthContext";
import loginImage from "../../assets/login.jpg";

const Login = () => {
  const { t } = useTranslation();
  const { login, user } = useAuth(); // from context
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoginLoading(true);
    try {
      await login(values);
      navigate("/dashboard");
    } catch (err) {
      const errorMessage = err.response?.data?.detail || "Login failed";
      setError(errorMessage);
    } finally {
      setLoginLoading(false);
    }
  };

  const formik = useLoginForm(handleLogin);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate, user]);

  if (loading) {
    return (
      <div className="position-absolute bg-main-light top-0 end-0 bottom-0 start-0 d-flex justify-content-center align-items-center w-100 vh-100">
        <PulseLoader color="#05755c" size={30} />
      </div>
    );
  }

  return (
    <>
      <title>{t("login.page_title")}</title>
      <meta name="description" content={t("login.page_title")} />
      <Navbar />
      <div className="container-lg py-5 mt-5">
        <div className="row px-4 align-items-center">
          <div className="col-md-6 order-2 order-md-1">
            <div className="mt-5 py-5">
              <h2 className="fw-bold text-center">{t("login.header")}</h2>
              <form onSubmit={formik.handleSubmit} className="mt-4">
                <FormInput
                  label={t("login.username_label")}
                  type="text"
                  name="username"
                  id="username"
                  formik={formik}
                />
                <FormInput
                  label={t("login.password_label")}
                  type="password"
                  name="password"
                  id="password"
                  formik={formik}
                />
                {error && (
                  <div className="alert alert-danger my-4">
                    <p className="text-center fw-bold fs-5 mb-0">{error}</p>
                  </div>
                )}
                <div className="mt-5 d-flex justify-content-between align-items-center flex-wrap">
                  <button
                    type="submit"
                    className="btn primary-btn text-white px-2 px-sm-4 py-2 d-flex align-items-center gap-2"
                    disabled={!formik.isValid || loginLoading}
                  >
                    {loginLoading ? (
                      <PulseLoader color="#fff" size={10} />
                    ) : (
                      t("login.login_button")
                    )}
                  </button>
                  <Link
                    to="/forget-password"
                    className="main-color register fs-5 mt-3 mt-md-0"
                  >
                    {t("login.forgot_password_link")}
                  </Link>
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-6 order-1 order-md-2">
            <div className="d-flex justify-content-center align-items-center h-100">
              <img src={loginImage} alt="login" className="w-100" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
