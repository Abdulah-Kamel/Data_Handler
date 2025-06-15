import React from "react";
import invite from "../../../assets/invite.svg";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();
  return (
    <section className="container my-5">
      <div className="row gy-5 align-items-center justify-content-center">
        <div className="col-lg-6">
          <img src={invite} alt="mobile email invite illustration" />
        </div>
        <div className="col-lg-6">
          <h4 className="text-success fw-bold align-self-start fs-2">
            {t("about_section.title")}
          </h4>
          <p className="mb-0" style={{ fontSize: "1.1rem" }}>
            {t("about_section.description_p1")}
            <br />
            <br />• {t("about_section.feature1")}
            <br />
            <br />• {t("about_section.feature2")}
            <br />
            <br />• {t("about_section.feature3")}
            <br />
            <br />
            {t("about_section.conclusion")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
