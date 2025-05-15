import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import FilledtemplateService from "../../../services/FilledtemplateService";
import categoryService from "../../../services/categoryService";
import { PulseLoader } from "react-spinners";

const FilledTemplateSchema = Yup.object().shape({
  category_id: Yup.string().required("يرجى اختيار قسم"),
  template_id: Yup.string().required("يرجى اختيار قالب"),
  file_name: Yup.string().required("اسم الملف مطلوب"),
  file_type: Yup.string().required("نوع الملف مطلوب"),
  filled_data: Yup.object().required("البيانات مطلوبة"),
});

const SingleFilledTempletForm = ({ token, onCancel }) => {
  const [categories, setCategories] = useState([]);
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
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const result = await categoryService.getAll(token);
        
        if (result.data) {
          setCategories(result.data);
        }
      } catch (err) {
        setFormError("حدث خطأ أثناء جلب الأقسام");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [token]);

  const handleCategoryChange = async (e, setFieldValue) => {
    const categoryId = e.target.value;
    setFieldValue("category_id", categoryId);
    setFieldValue("template_id", "");
    setSelectedTemplate(null);
    setTemplateFields([]);
    setFormError(null); // Reset form error at the start

    if (!categoryId) {
      setTemplates([]);
      return;
    }

    setLoading(true);
    try {
      const result = await categoryService.getById(
        token,
        categoryId
      );
      if (result) {
        setTemplates(result?.data?.templates);
      } else {
        setFormError({
          message: "لم يتم العثور على قوالب لهذا القسم",
          details: []
        });
      }
    } catch (err) {
      setFormError({
        message: "حدث خطأ أثناء جلب القوالب",
        details: err.message ? [err.message] : []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const result = await FilledtemplateService.getAllTemplates(token);
        if (result.data) {
          setTemplates(result.data);
        }
      } catch (err) {
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
        }
      } catch (err) {
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

      if (response?.data?.status === 201) {
        setDownloadLinks(response?.data?.data);
        setFormSuccess(true);
      } else if (response?.error) {
        setFormError({
          message: response?.error?.message,
          details: response?.error?.details,
        });
      }
    } catch (error) {
      setFormError({
        message: "حدث خطأ أثناء إنشاء المستندات",
        details: [],
      });
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
          <PulseLoader color="#05755c" size={15} />
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
                تم إنشاء الملفات بنجاح! يمكنك تحميل الملفات من الروابط التالية:
              </h5>
              {downloadLinks.results.map((result, idx) => (
                <div key={idx} className="mb-4">
                  <h6 className="mb-2">ملف {result.index}</h6>
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
              category_id: "",
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
                    <p className="mb-2">{formError.message}</p>
                    {formError.details && formError.details.length > 0 && (
                      <ul className="mb-0 mt-2">
                        {formError.details.map((detail, index) => (
                          <li key={index}>{detail}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                <div className="row gy-3">
                  {/* Category Selection */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="category_id" className="form-label">
                      اختر القسم
                    </label>
                    <select
                      className={`form-select ${
                        touched.category_id && errors.category_id
                          ? "is-invalid"
                          : ""
                      }`}
                      id="category_id"
                      name="category_id"
                      onChange={(e) => handleCategoryChange(e, setFieldValue)}
                      value={values.category_id}
                      disabled={formSubmitting}
                    >
                      <option value="">اختر قسم</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <ErrorMessage
                      name="category_id"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>

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
                      disabled={formSubmitting || !values.category_id}
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
                  {/* File Type */}
                  <div className="col-md-6">
                    <label htmlFor="file_type" className="form-label">
                      نوع الملف
                    </label>
                    <Field
                      as="select"
                      className={`form-select ${
                        touched.file_type && errors.file_type
                          ? "is-invalid"
                          : ""
                      }`}
                      id="file_type"
                      name="file_type"
                      disabled={formSubmitting}
                    >
                      <option value="pdf">PDF</option>
                      <option value="word">Word</option>
                      <option value="both">كلاهما</option>
                    </Field>
                    <ErrorMessage
                      name="file_type"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                </div>

                {/* Dynamic Fields based on API variables */}
                {selectedTemplate && (
                  <div>
                    <label className="form-label fs-5 fw-bold mt-3">
                      بيانات القالب
                    </label>
                    <div className="card border-0">
                      <div className="card-body">
                        {loadingVariables ? (
                          <div className="text-center py-3">
                            <PulseLoader color="#05755c" size={10} />
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
                                <h6 className="mb-3 fs-5 fw-bold text-center">
                                  ملف {entryIndex + 1}
                                </h6>
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
