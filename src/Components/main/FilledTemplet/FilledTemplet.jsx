import React, { useState } from "react";
import SingleFilledTempletForm from "./SingleFilledTempletForm";
import MultiFillTempletForm from "./MultiFillTempletForm";
import { useAuth } from "../../../Context/AuthContext";
import { useTranslation } from "react-i18next";

const FilledTemplet = () => {
  const [formType, setFormType] = useState("single");
  const { user, accessToken } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="container py-3 position-relative px-3 mt-5">
      <title>{t("filled_templet.page_title")}</title>
      <meta name="description" content={t("filled_templet.page_description")} />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="m-0">{t("filled_templet.header")}</h2>
        <div className="btn-group" role="group">
          <button
            type="button"
            className={`btn rounded-end-2 small-text  rounded-start-0 ${
              formType === "single" ? "primary-btn" : "primary-btn-outline"
            }`}
            onClick={() => setFormType("single")}
          >
            {t("filled_templet.single_document_button")}
          </button>
          <button
            type="button"
            className={`btn small-text rounded-start-2 rounded-end-0 ${
              formType === "multi" ? "primary-btn" : "primary-btn-outline"
            }`}
            onClick={() => setFormType("multi")}
          >
            {t("filled_templet.multiple_documents_button")}
          </button>
        </div>
      </div>

      {/* Render the appropriate form based on formType */}
      {formType === "single" ? (
        <SingleFilledTempletForm token={accessToken} />
      ) : (
        <MultiFillTempletForm token={accessToken} />
      )}
    </div>
  );
};

export default FilledTemplet;
