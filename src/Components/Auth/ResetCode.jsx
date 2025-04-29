import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { authService } from "../../services/authService.js";
import { useResetCodeForm } from "../../hooks/useResetCodeForm.js";
import FormInput from "../common/FormInput.jsx";
import Navbar from "../NavBar/NavBar";

const ResetCode = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();




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
        <title>Reset Code</title>
        <meta name="description" content="Reset Code page" />
      <Navbar />
      <div className="form-container my-5 py-5">
        <div className="mt-5 py-5">
          <div className="alert alert-warning my-4 d-flex align-items-center justify-content-center">
            <p className="text-center fw-bold fs-5 mb-0">
            تم إرسال رابط إعادة التعيين إلى بريدك الإلكترونى
            </p>
              <Link to="/auth/reset-password" className="fs-5 me-3 main-color fw-bold">
                <span className="text-decoration-underline">
                  اعادة تعيين كلمة المرور
                </span>
              </Link>
          </div>
        
        </div>
      </div>
    </>
  );
};

export default ResetCode;
