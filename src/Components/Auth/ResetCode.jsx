import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { authService } from "../../services/authService.js";
import { useResetCodeForm } from "../../hooks/useResetCodeForm.js";
import FormInput from "../common/FormInput";
import Navbar from "../NavBar/NavBar";

const ResetCode = () => {
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleVerifyCode = async (values) => {
    setSubmitLoading(true);
    try {
      const data = await authService.verifyResetCode(values.resetCode);
      if (data.status === "Success") {
        navigate("/reset-password");
      }
    } catch (err) {
      const statusMsg = err.response?.data?.statusMsg || "Error";
      const message = err.response?.data?.message || "Something went wrong";
      setError(
        `${statusMsg.charAt(0).toUpperCase() + statusMsg.slice(1)}, ${message}`
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const formik = useResetCodeForm(handleVerifyCode);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="position-absolute bg-main-light top-0 end-0 bottom-0 start-0 d-flex justify-content-center align-items-center w-100 vh-100">
        <PulseLoader color="#0aad0a" size={30} />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container my-5 py-5">
        <div className="mt-5 py-5">
          <div className="alert alert-warning my-4">
            <p className="text-center fw-bold fs-5 mb-0">
              تم إرسال رمز إعادة التعيين إلى بريدك الإلكتروني
            </p>
          </div>
          <form onSubmit={formik.handleSubmit} className="mt-4">
            <FormInput
              label="كود التحقق"
              type="text"
              name="resetCode"
              id="resetCode"
              formik={formik}
            />
            {error && (
              <div className="alert alert-danger my-4">
                <p className="text-center fw-bold fs-5 mb-0">{error}</p>
              </div>
            )}
            <div className="mt-3 d-flex justify-content-end align-items-center">
              <button
                type="submit"
                className="btn primary-btn text-white ms-auto px-3 py-2"
                disabled={!formik.isValid}
              >
                {submitLoading ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  "تأكيد"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetCode;
