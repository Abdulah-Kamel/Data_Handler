import React from "react";
import customerService from "../../../assets/customer-service.jpg";

const Contact = () => {
  return (
    <section className="bg-white py-5">
      <div className="container py-5">
        <h4 className="text-center fs-2 text-success fw-bold mb-4">CONTACT US</h4>
        <div className="row align-items-center mt-3 gy-5">
          <div className="col-lg-6">
            <img
              src={customerService}
              alt="call center service illustration"
              className="w-100"
            />
          </div>
          <form className="col-lg-6">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="الاسم الكامل"
            />
            <input
              type="text"
              className="form-control mb-3"
              placeholder="رقم الهاتف"
            />
            <input
              type="email"
              className="form-control mb-3"
              placeholder="البريد الإلكتروني"
            />
            <input
              type="text"
              className="form-control mb-3"
              placeholder="اسم الشركة"
            />
            <textarea
              className="form-control mb-3"
              placeholder="الرسالة"
              rows={4}
            ></textarea>
            <button className="btn btn-success w-100">إرسال</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
