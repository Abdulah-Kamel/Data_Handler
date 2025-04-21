import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { PulseLoader } from "react-spinners";
import Navbar from "../NavBar/NavBar";
import { useLoginForm } from "../../hooks/useLoginForm";
import FormInput from "../Common/FormInput";
const Login = () => {
  const [loading, setLoading] = useState(true);
  const [loginLodaing, setLoginLodaing] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const baseUrl = "https://ecommerce.routemisr.com";
  async function handleLogin(values) {
    setLoginLodaing(true);
    try {
      const { data } = await axios.post(
        `${baseUrl}/api/v1/auth/signin`,
        values
      );
      if (data.message === "success") {
        localStorage.setItem("userToken", data.token);
        navigate("/");
      }
    } catch (err) {
      const statusMsg = err.response?.data?.statusMsg || "Error";
      const message = err.response?.data?.message || "Something went wrong";
      setError(
        `${statusMsg.charAt(0).toUpperCase() + statusMsg.slice(1)}, ${message}`
      );
    } finally {
      setLoginLodaing(false);
    }
  }
  const formik = useLoginForm(handleLogin);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <title>Login</title>
      <meta name="description" content="Login page" />
      {loading ? (
        <section className="position-absolute bg-main-light top-0 end-0 bottom-0 start-0 d-flex justify-content-center align-items-center w-100 vh-100">
          <PulseLoader color="#0aad0a" size={30} />
        </section>
      ) : (
        <>
          <Navbar />
          <section className="container my-5 py-5">
            <section className="mt-5 py-5">
              <h2 className="fw-bold text-center">تسجيل الدخول</h2>
              <form onSubmit={formik.handleSubmit} className="mt-4">
                <FormInput
                  label="الايميل:"
                  type="email"
                  name="email"
                  id="email"
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
                  <section className="alert alert-danger my-4">
                    <p className="text-center fw-bold fs-5 mb-0">{error}</p>
                  </section>
                )}
                <section className="mt-5 d-flex justify-content-end align-items-center">
                  <p className="fs-5 mb-0">
                    <span>هل نسيت كلمه السر؟</span>{" "}
                    <Link to="/forget-password" className="main-color register">
                      اعادة تعيين كلمه السر
                    </Link>
                  </p>
                  <button
                    type="submit"
                    className={`btn primary-btn text-white me-auto px-3 py-2`}
                    disabled={!formik.isValid}
                  >
                    {loginLodaing ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      "تسجيل الدخول"
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

export default Login;
