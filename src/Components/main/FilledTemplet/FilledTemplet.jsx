import React, { useState } from "react";
import SingleFilledTempletForm from "./SingleFilledTempletForm";
import MultiFillTempletForm from "./MultiFillTempletForm";

const FilledTemplet = () => {
  const [formType, setFormType] = useState("single");
  const user = JSON.parse(sessionStorage.getItem("User"));
  const token = user.access;

  return (
    <div className="container py-3 position-relative px-3 mt-5">
      <title>Data Handler - Fill Templet</title>
      <meta name="description" content="Data Handler - Fill Templet" />
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="m-0">انشاء القوالب</h2>
        <div className="btn-group" role="group">
          <button
            type="button"
            className={`btn rounded-end-2  rounded-start-0 ${formType === "single" ? "primary-btn" : "primary-btn-outline"}`}
            onClick={() => setFormType("single")}
          >
            قالب فردى
          </button>
          <button
            type="button"
            className={`btn rounded-start-2 rounded-end-0 ${formType === "multi" ? "primary-btn" : "primary-btn-outline"}`}
            onClick={() => setFormType("multi")}
          >
            قوالب متعددة
          </button>
        </div>
      </div>

      {/* Render the appropriate form based on formType */}
      {formType === "single" ? (
        <SingleFilledTempletForm 
          token={token}
        />
      ) : (
        <MultiFillTempletForm 
          token={token}
        />
      )}
    </div>
  );
};

export default FilledTemplet;
