import React from "react";
import { useTranslation } from "react-i18next";

const Services = () => {
  const { t } = useTranslation();
  return (
    <section className="bg-light py-5">
      <div className="container text-center py-5">
        <h4 className="text-success fs-2 fw-bold mb-4">
          {t("services_section.title")}
        </h4>
        <div className="row mt-3 gy-5 justify-content-center align-items-center">
          <div className="col-lg-4">
            <div className="p-3 border rounded shadow">
              <i className="fa-solid fa-file-word fa-3x main-color"></i>
              <h6 className="text-success h3 fw-bold my-3">
                {t("services_section.service1_title")}
              </h6>
              <p className="fs-5">
                {t("services_section.service1_description")}
              </p>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="p-3 border rounded shadow">
              <i className="fa-solid fa-database fa-3x main-color"></i>
              <h6 className="text-success h3 fw-bold my-3">
                {t("services_section.service2_title")}
              </h6>
              <p className="fs-5">
                {t("services_section.service2_description")}
              </p>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="p-3 border rounded shadow">
              <i className="fa-solid fa-file-export fa-3x main-color"></i>
              <h6 className="text-success h3 fw-bold my-3">
                {t("services_section.service3_title")}
              </h6>
              <p className="fs-5">
                {t("services_section.service3_description")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
