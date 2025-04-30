import React from "react";

const Services = () => {
  return (
    <section className="bg-light py-5">
      <div className="container text-center py-5">
        <h4 className="text-success fs-2 fw-bold mb-4">خدماتنا</h4>
        <div className="row mt-3 gy-5 justify-content-center align-items-center">
          <div className="col-lg-4">
            <div className="p-3 border rounded shadow">
              <i className="fa-solid fa-file-word fa-3x main-color"></i>
              <h6 className="text-success h3 fw-bold my-3">إنشاء القوالب</h6>
              <p className="fs-5">إنشاء وتخصيص قوالب المستندات بسهولة وكفاءة</p>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="p-3 border rounded shadow">
              <i className="fa-solid fa-database fa-3x main-color"></i>
              <h6 className="text-success h3 fw-bold my-3">إدارة البيانات</h6>
              <p className="fs-5">
                تنظيم وإدارة البيانات لملء القوالب بشكل تلقائي
              </p>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="p-3 border rounded shadow">
              <i className="fa-solid fa-file-export fa-3x main-color"></i>
              <h6 className="text-success h3 fw-bold my-3">
                تصدير المستندات
              </h6>
              <p className="fs-5">
                تصدير المستندات بصيغ متعددة (Word و PDF) بسهولة
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
