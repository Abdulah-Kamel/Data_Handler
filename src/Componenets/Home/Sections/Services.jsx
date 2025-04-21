import React from "react";

const Services = () => {
  return (
    <section className="bg-light py-5">
      <div className="container text-center py-5">
        <h4 className="text-success fw-bold mb-4">OUR SERVICES</h4>
        <div className="row mt-3 gy-5 justify-content-center align-items-center">
          <div className="col-lg-4">
            <div className="p-3 border rounded shadow">
              <i
                className="fa-solid fa-envelope fa-3x main-color"
              ></i>
              <h6 className="text-success h3 fw-bold my-3">إرسال متعدد</h6>
              <p className="fs-5">أرسل رسائل نصية وبريدية جماعية بسهولة.</p>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="p-3 border rounded shadow">
              <i
                className="fa-solid fa-copy  fa-3x main-color"
              ></i>
              <h6 className="text-success h3 fw-bold my-3">قوالب البريد</h6>
              <p className="fs-5">
                أنشئ قوالب بريدية احترافية باستخدام أدوات مرنة.
              </p>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="p-3 border rounded shadow">
              <i
                className="fa-solid fa-phone fa-3x main-color"
              ></i>
              <h6 className="text-success h3 fw-bold my-3">
                دعم على مدار الساعة
              </h6>
              <p className="fs-5">
                فريق دعم متواجد دائمًا لحل مشاكلك ومساعدتك.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
