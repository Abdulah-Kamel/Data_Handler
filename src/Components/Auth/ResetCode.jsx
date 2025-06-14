import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import Navbar from "../NavBar/NavBar";

const ResetCode = () => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const message =
    location.state?.message || t("reset_code.default_message");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="position-absolute bg-main-light top-0 end-0 bottom-0 start-0 d-flex justify-content-center align-items-center w-100 vh-100">
        <PulseLoader color="#05755c" size={30} />
      </div>
    );
  }

  return (
    <>
      <title>{t("reset_code.page_title")}</title>
      <meta name="description" content={t("reset_code.page_title")} />
      <Navbar />
      <div className="form-container my-5 py-5" dir={i18n.dir()}>
        <div className="mt-5 py-5">
          <div className="alert alert-warning my-4 d-flex align-items-center justify-content-center">
            <p className="text-center fw-bold fs-5 mb-0">
             {message}
            </p>
            <Link
              to="/login"
              className="fs-5 me-3 main-color fw-bold"
            >
              <span className="text-decoration-underline">
                {t("reset_code.login_link")}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetCode;
