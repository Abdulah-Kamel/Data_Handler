import React from "react";
import customerService from "../../../assets/customer-service.jpg";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t } = useTranslation();
  return (
    <section className="bg-white py-5">
      <div className="container py-5">
        <h4 className="text-center fs-2 text-success fw-bold mb-4">
          {t("contact_section.title")}
        </h4>
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
              placeholder={t("contact_section.name_placeholder")}
            />
            <input
              type="text"
              className="form-control mb-3"
              placeholder={t("contact_section.phone_placeholder")}
            />
            <input
              type="email"
              className="form-control mb-3"
              placeholder={t("contact_section.email_placeholder")}
            />
            <input
              type="text"
              className="form-control mb-3"
              placeholder={t("contact_section.company_placeholder")}
            />
            <textarea
              className="form-control mb-3"
              placeholder={t("contact_section.message_placeholder")}
              rows={4}
            ></textarea>
            <button className="btn btn-success w-100">
              {t("contact_section.send_button")}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
