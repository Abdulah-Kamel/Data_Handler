import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import FilledtemplateService from "../../../services/FilledtemplateService";
import BulkDataService from "../../../services/BulkDataService";
import { PulseLoader } from "react-spinners";

const MultiFillTemplateSchema = Yup.object().shape({
  template_id: Yup.string().required("يرجى اختيار قالب"),
  bulk_data_id: Yup.string().required("يرجى اختيار مجموعة البيانات"),
  file_name: Yup.string().required("اسم الملف مطلوب"),
  folder_name: Yup.string().required("اسم المجلد مطلوب"),
  file_type: Yup.string().required("نوع الملف مطلوب"),
});

const MultiFillTempletForm = ({ token }) => {
  const [templates, setTemplates] = useState([]);
  const [bulkDataSets, setBulkDataSets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [downloadLinks, setDownloadLinks] = useState(null);
  const [selectedTemplateVars, setSelectedTemplateVars] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const templatesResult = await FilledtemplateService.getAllTemplates(
          token
        );
        if (templatesResult) {
          setTemplates(templatesResult.data);
        }
        const bulkDataResult = await BulkDataService.getAllBulkData(token);
        if (bulkDataResult.data) {
          setBulkDataSets(bulkDataResult.data);
        }
      } catch (err) {
        setFormError("حدث خطأ أثناء جلب البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleSubmit = async (values) => {
    setFormSubmitting(true);
    setFormError(null);

    try {
      const response = await FilledtemplateService.createBulkFilledTemplates(
        token,
        values
      );
      if (response?.data?.status === 201) {
        setDownloadLinks(response?.data?.data?.download_link);
      } else {
        setFormError(response.error || "حدث خطأ أثناء إنشاء المستندات");
      }
    } catch (error) {
      setFormError("حدث خطأ أثناء إنشاء المستندات");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleTemplateChange = async (templateId) => {
    if (!templateId) {
      setSelectedTemplateVars([]);
      return;
    }

    try {
      const response = await FilledtemplateService.getVariablesOfTemplate(
        token,
        templateId
      );
      if (response?.data?.status === 200) {
        setSelectedTemplateVars(response?.data?.data?.variables);
      }
    } catch (error) {
      console.error("Failed to fetch template variables:", error);
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
          <h5 className="mb-0">انشاء مستندات متعددة</h5>
        </div>
        <div className="card-body">
          {downloadLinks && (
            <div className="alert alert-success mb-4">
              <h5 className="mb-3">
                تم إنشاء القالب بنجاح! يمكنك تحميل الملفات من الروابط التالية:
              </h5>
              <div className="d-flex flex-column gap-2">
                {downloadLinks && (
                  <a
                    href={downloadLinks}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-success"
                  >
                    تحميل ملف
                    <i className="fas fa-file-download me-2"></i>
                  </a>
                )}
              </div>
            </div>
          )}
          <Formik
            initialValues={{
              template_id: "",
              bulk_data_id: "",
              file_name: "",
              folder_name: "",
              file_type: "both",
            }}
            validationSchema={MultiFillTemplateSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange }) => (
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
                    <Field
                      as="select"
                      className={`form-select ${
                        touched.template_id && errors.template_id
                          ? "is-invalid"
                          : ""
                      }`}
                      id="template_id"
                      name="template_id"
                      disabled={loading || formSubmitting}
                      onChange={(e) => {
                        handleTemplateChange(e.target.value);
                        handleChange(e); // Use handleChange from Formik props
                      }}
                    >
                      <option value="">اختر قالب</option>
                      {templates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="template_id"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>

                  {/* Bulk Data Selection */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="bulk_data_id" className="form-label">
                      اختر مجموعة البيانات
                    </label>
                    <Field
                      as="select"
                      className={`form-select ${
                        touched.bulk_data_id && errors.bulk_data_id
                          ? "is-invalid"
                          : ""
                      }`}
                      id="bulk_data_id"
                      name="bulk_data_id"
                      disabled={loading || formSubmitting}
                    >
                      <option value="">اختر مجموعة البيانات</option>
                      {bulkDataSets.map((bulkData) => (
                        <option key={bulkData.id} value={bulkData.id}>
                          {bulkData.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="bulk_data_id"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                </div>

                <div className="row">
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

                  {/* Folder Name */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="folder_name" className="form-label">
                      اسم المجلد
                    </label>
                    <Field
                      type="text"
                      className={`form-control ${
                        touched.folder_name && errors.folder_name
                          ? "is-invalid"
                          : ""
                      }`}
                      id="folder_name"
                      name="folder_name"
                      placeholder="أدخل اسم المجلد"
                      disabled={formSubmitting}
                    />
                    <ErrorMessage
                      name="folder_name"
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
                {selectedTemplateVars.length > 0 && (
                  <div className="mb-4">
                    <h6 className="mb-3">متغيرات القالب المتاحة:</h6>
                    <div className="card">
                      <div className="card-body">
                        <div className="row">
                          {selectedTemplateVars.map((variable, index) => (
                            <div key={index} className="col-2 mb-2">
                              <div className="d-flex align-items-center">
                                <i className="fas fa-chevron-left text-primary ms-2"></i>
                                <code>{variable}</code>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="d-flex justify-content-end mt-3">
                  <button
                    type="submit"
                    className="btn primary-btn px-4"
                    disabled={formSubmitting}
                  >
                    {formSubmitting ? (
                      <>
                        جاري الإنشاء...
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      </>
                    ) : (
                      "إنشاء ملفات"
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

export default MultiFillTempletForm;
