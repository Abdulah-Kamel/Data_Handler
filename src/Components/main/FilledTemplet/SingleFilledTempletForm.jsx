import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import FilledtemplateService from "../../../services/FilledtemplateService";
import { PulseLoader } from "react-spinners";

const FilledTemplateSchema = Yup.object().shape({
  template_id: Yup.string().required("يرجى اختيار قالب"),
  file_name: Yup.string().required("اسم الملف مطلوب"),
  file_type: Yup.string().required("نوع الملف مطلوب"),
  filled_data: Yup.object().required("البيانات مطلوبة"),
});

const SingleFilledTempletForm = ({ token, onCancel }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateFields, setTemplateFields] = useState([]);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [loadingVariables, setLoadingVariables] = useState(false);
  const [downloadLinks, setDownloadLinks] = useState(null);
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const result = await FilledtemplateService.getAllTemplates(token);
        if (result.data) {
          setTemplates(result.data);
        }
      } catch (err) {
        console.error("Error fetching templates:", err);
        setFormError("حدث خطأ أثناء جلب القوالب");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [token]);

  useEffect(() => {
    if (!selectedTemplate) {
      setTemplateFields([]);
      return;
    }

    const fetchTemplateVariables = async () => {
      setLoadingVariables(true);
      try {
        const result = await FilledtemplateService.getVariablesOfTemplate(
          token,
          selectedTemplate.id
        );

        if (result.data && result.data.data && result.data.data.variables) {
          setTemplateFields(result.data.data.variables);
        } else {
          setTemplateFields([]);
          console.error("No variables found in response:", result);
        }
      } catch (err) {
        console.error("Error fetching template variables:", err);
        setFormError("حدث خطأ أثناء جلب متغيرات القالب");
        setTemplateFields([]);
      } finally {
        setLoadingVariables(false);
      }
    };

    fetchTemplateVariables();
  }, [selectedTemplate, token]);

  const handleTemplateChange = (e, setFieldValue) => {
    const templateId = e.target.value;
    const template = templates.find((t) => t.id === templateId);
    setSelectedTemplate(template || null);

    setFieldValue("filled_data", {});
    setFieldValue("template_id", templateId);

    if (downloadLinks) {
      setDownloadLinks(null);
      setFormSuccess(false);
    }
  };

  // Add this state at the beginning of your component
  const [formEntries, setFormEntries] = useState([0]); // Array to track form entries

  // Add this function after your existing handlers
  const addNewForm = () => {
    setFormEntries([...formEntries, formEntries.length]);
  };

  // Modify the removeForm function to accept setFieldValue and values
  const removeForm = (index, setFieldValue, values) => {
    if (formEntries.length > 1) {
      const newEntries = formEntries.filter((i) => i !== index);
      setFormEntries(newEntries);

      // Update the filled_data by removing the entry
      const newFilledData = {};
      Object.entries(values.filled_data).forEach(([key, value]) => {
        if (!key.endsWith(`_${index}`)) {
          newFilledData[key] = value;
        }
      });
      setFieldValue("filled_data", newFilledData);
    }
  };

  // Modify the handleSubmit function
  const handleSubmit = async (values) => {
    setFormSubmitting(true);
    setFormError(null);
    setDownloadLinks(null);
    setFormSuccess(false);

    try {
      // Restructure the filled_data to be an array
      const filledDataArray = formEntries.map((index) => {
        const entryData = {};
        Object.keys(values.filled_data).forEach((key) => {
          if (key.endsWith(`_${index}`)) {
            const originalKey = key.replace(`_${index}`, "");
            entryData[originalKey] = values.filled_data[key];
          }
        });
        return entryData;
      });

      const requestData = {
        ...values,
        filled_data: filledDataArray,
      };

      const response = await FilledtemplateService.createFilledTemplate(
        token,
        requestData
      );

      if (response?.data.status === 201) {
        setDownloadLinks(response?.data?.data);
        setFormSuccess(true);
      }
    } catch (error) {
      console.error("Error creating filled template:", error);
      setFormError("حدث خطأ أثناء حفظ البيانات");
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <>
      {loading && (
        <div
          className="position-absolute bg-light top-0 end-0 bottom-0 start-0 d-flex justify-content-center align-items-center w-100"
          style={{ zIndex: 1 }}
        >
          <PulseLoader color="#0aad0a" size={15} />
        </div>
      )}
      <div className="card mb-4">
        <div className="card-header primary-bg text-white">
          <h5 className="mb-0">انشاء مستند فردى</h5>
        </div>
        <div className="card-body">
          {formSuccess && downloadLinks && (
            <div className="alert alert-success mb-4">
              <h5 className="mb-3">
                تم إنشاء القوالب بنجاح! يمكنك تحميل الملفات من الروابط التالية:
              </h5>
              {downloadLinks.results.map((result, idx) => (
                <div key={idx} className="mb-4">
                  <h6 className="mb-2">نموذج {result.index}</h6>
                  <div className="d-flex justify-content-center flex-wrap gap-2">
                    {result.links.pdf && (
                      <a
                        href={result.links.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-success"
                      >
                        تحميل ملف PDF
                        <i className="fas fa-file-pdf me-2"></i>
                      </a>
                    )}
                    {result.links.word && (
                      <a
                        href={result.links.word}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary"
                      >
                        تحميل ملف Word
                        <i className="fas fa-file-word me-2"></i>
                      </a>
                    )}
                  </div>
                  {/* <div className="mt-2 text-muted small">
                    <strong>البيانات:</strong>{" "}
                    {Object.entries(result.data)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(", ")}
                  </div> */}
                </div>
              ))}
            </div>
          )}

          <Formik
            initialValues={{
              template_id: "",
              filled_data: {},
              file_name: "",
              file_type: "both",
            }}
            validationSchema={FilledTemplateSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, setFieldValue }) => (
              <Form>
                {formError && (
                  <div className="alert alert-danger" role="alert">
                    {formError}
                  </div>
                )}

                <div className="row">
                  {/* Template Selection */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="template_id" className="form-label">
                      اختر القالب
                    </label>
                    <select
                      className={`form-select ${
                        touched.template_id && errors.template_id
                          ? "is-invalid"
                          : ""
                      }`}
                      id="template_id"
                      name="template_id"
                      onChange={(e) => handleTemplateChange(e, setFieldValue)}
                      value={values.template_id}
                      disabled={formSubmitting}
                    >
                      <option value="">اختر قالب</option>
                      {templates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                    <ErrorMessage
                      name="template_id"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>

                  {/* File Name */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="file_name" className="form-label">
                      اسم الملف
                    </label>
                    <Field
                      type="text"
                      className={`form-control ${
                        touched.file_name && errors.file_name
                          ? "is-invalid"
                          : ""
                      }`}
                      id="file_name"
                      name="file_name"
                      placeholder="أدخل اسم الملف"
                      disabled={formSubmitting}
                    />
                    <ErrorMessage
                      name="file_name"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                </div>

                {/* File Type */}
                <div className="mb-3">
                  <label htmlFor="file_type" className="form-label">
                    نوع الملف
                  </label>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <Field
                        type="radio"
                        className="form-check-input"
                        id="file_type_pdf"
                        name="file_type"
                        value="pdf"
                        disabled={formSubmitting}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="file_type_pdf"
                      >
                        PDF
                      </label>
                    </div>
                    <div className="form-check">
                      <Field
                        type="radio"
                        className="form-check-input"
                        id="file_type_word"
                        name="file_type"
                        value="word"
                        disabled={formSubmitting}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="file_type_word"
                      >
                        Word
                      </label>
                    </div>
                    <div className="form-check">
                      <Field
                        type="radio"
                        className="form-check-input"
                        id="file_type_both"
                        name="file_type"
                        value="both"
                        disabled={formSubmitting}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="file_type_both"
                      >
                        كلاهما
                      </label>
                    </div>
                  </div>
                  <ErrorMessage
                    name="file_type"
                    component="div"
                    className="text-danger"
                  />
                </div>

                {/* Dynamic Fields based on API variables */}
                {selectedTemplate && (
                  <div>
                    <label className="form-label fs-5 fw-bold mt-3">بيانات القالب</label>
                    <div className="card border-0">
                      <div className="card-body">
                        {loadingVariables ? (
                          <div className="text-center py-3">
                            <PulseLoader color="#0aad0a" size={10} />
                            <p className="mt-2">جاري تحميل المتغيرات...</p>
                          </div>
                        ) : templateFields.length > 0 ? (
                          <>
                            {formEntries.map((entryIndex) => (
                              <div
                                key={entryIndex}
                                className="mb-3 rounded border p-3"
                              >
                                {formEntries.length > 1 && (
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm "
                                    onClick={() =>
                                      removeForm(
                                        entryIndex,
                                        setFieldValue,
                                        values
                                      )
                                    }
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                )}
                                <h6 className="mb-3 fs-5 fw-bold text-center">نموذج {entryIndex + 1}</h6>
                                <div className="row mt-3">
                                  {templateFields.map((field) => (
                                    <div
                                      className="col-md-6 mb-2"
                                      key={`${field}_${entryIndex}`}
                                    >
                                      <label
                                        htmlFor={`filled_data.${field}_${entryIndex}`}
                                        className="form-label"
                                      >
                                        {field}
                                      </label>
                                      <Field
                                        type="text"
                                        className="form-control"
                                        id={`filled_data.${field}_${entryIndex}`}
                                        name={`filled_data.${field}_${entryIndex}`}
                                        placeholder={`أدخل ${field}`}
                                        disabled={formSubmitting}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          
                          </>
                        ) : (
                          <div className="alert alert-info mb-0">
                            لا توجد متغيرات لهذا القالب
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="d-flex justify-content-between px-3">
                              <button
                                type="button"
                                className="btn primary-btn"
                                onClick={addNewForm}
                                disabled={formSubmitting}
                              >
                                إضافة نموذج جديد
                                <i className="fas fa-plus me-2"></i>
                              </button>
                  {onCancel && (
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={onCancel}
                      disabled={formSubmitting}
                    >
                      إلغاء
                    </button>
                  )}
                  <button
                    type="submit"
                    className="btn primary-btn px-4"
                    disabled={formSubmitting}
                  >
                    {formSubmitting ? (
                      <>
                        جاري الانشاء...
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      </>
                    ) : (
                      "انشاء ملفات"
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default SingleFilledTempletForm;
