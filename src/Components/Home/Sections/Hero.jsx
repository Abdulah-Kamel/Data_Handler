import React from "react";
import email from "../../../assets/email.svg";

const Hero = () => {
  return (
    <section className="text-center my-5 min-vh-100 bg-light py-5">
      <div className="container py-5">
        <div className="row gy-5 align-items-center justify-content-center">
          <div className="col-lg-6">
            <h1 className="fw-bold" style={{ fontSize: "3rem" }}>
              استمتع بأحدث وأقوى منصة
            </h1>
            <h2 className="main-color" style={{ fontSize: "2.5rem" }}>
              للرسائل البريدية
            </h2>
            <p className="mt-3 h4">
              نظام مراسلة بمفهوم جديد يوفر كل ما تحتاجه في عالم الرسائل.
            </p>
            <div className="d-flex justify-content-center gap-3 mt-4">
              <button className="btn btn-success px-2 px-sm-4 fs-4">
                حجز المنصة
              </button>
              <button className="btn btn-outline-success px-2 px-sm-4 fs-4">
                استكشاف الخدمات
              </button>
            </div>
          </div>
          <div className="col-lg-6">
            <img src={email} alt="email illustration" className="w-100" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
