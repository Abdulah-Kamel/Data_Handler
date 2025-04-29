import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import Navbar from "../NavBar/NavBar";
import { useLoginForm } from "../../hooks/useLoginForm";
import FormInput from "../common/FormInput";
import { authService } from "../../services/authService";

const Login = () => {
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoginLoading(true);
    try {
      const data = await authService.login(values);
      if (data.access) {
        sessionStorage.setItem("User", JSON.stringify(data));
        navigate("/dashboard");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail;
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
    const user = JSON.parse(sessionStorage.getItem("User"));
    if (user && user.access) {
      navigate("/dashboard");
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="position-absolute bg-main-light top-0 end-0 bottom-0 start-0 d-flex justify-content-center align-items-center w-100 vh-100">
        <PulseLoader color="#0aad0a" size={30} />
      </div>
    );
  }

  return (
    <>
      <title>تسجيل الدخول</title>
      <meta name="description" content="تسجيل الدخول" />
      <Navbar />
      <div className="form-container my-5 py-5">
        <div className="mt-5 py-5">
          <h2 className="fw-bold text-center">تسجيل الدخول</h2>
          <form onSubmit={formik.handleSubmit} className="mt-4">
            <FormInput
              label="اسم المستخدم:"
              type="text"
              name="username"
              id="username"
              formik={formik}
            />
            <FormInput
              label="الباسورد:"
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
            <div className="mt-5 d-flex justify-content-between align-items-center  gap-3">
             
              <button
                type="submit"
                className="btn primary-btn text-white px-2 px-sm-4 py-2"
                disabled={!formik.isValid || loginLoading}
              >
                {loginLoading ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  "تسجيل الدخول"
                )}
              </button>
              <Link to="/forget-password" className="main-color register fs-5">
                هل نسيت كلمه السر؟
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
