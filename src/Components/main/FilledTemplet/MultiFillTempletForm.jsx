import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import FilledtemplateService from "../../../services/FilledtemplateService";
import BulkDataService from "../../../services/BulkDataService";
import { PulseLoader } from "react-spinners";

const validFileExtensions = ['xlsx', 'xls'];

const MultiFillTemplateSchema = Yup.object().shape({
  template_id: Yup.string().test(
    'conditional-requirement',
    "يرجى اختيار قالب أو رفع ملف Word",
    function(value) {
      return value || this.parent.word_file;
    }
  ),
  word_file: Yup.mixed().test(
    "fileFormat",
    "صيغة الملف غير صالحة. يجب أن يكون الملف بصيغة Word (.docx, .doc)",
    function(value) {
      if (!value) return true; 
      return ['docx', 'doc'].includes(value.name.split('.').pop().toLowerCase());
    }
  ),
  bulk_data_id: Yup.string().test(
    'conditional-requirement',
    "يرجى اختيار مجموعة البيانات أو رفع ملف Excel",
    function(value) {
      return this.parent.excel_file || value;
    }
  ),
  excel_file: Yup.mixed().test(
    "fileFormat",
    "صيغة الملف غير صالحة. يجب أن يكون الملف بصيغة Excel (.xlsx, .xls)",
    function(value) {
      if (!value) return true; 
      return validFileExtensions.includes(value.name.split('.').pop().toLowerCase());
    }
  ),
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
  const [excelFile, setExcelFile] = useState(null);
    const [wordFile, setWordFile] = useState(null);
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

  const handleExcelChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setExcelFile(file);
      setFieldValue('excel_file', file);
      setFieldValue('bulk_data_id', ''); 
    }
  };
  const handleWordFileChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setWordFile(file);
      setFieldValue('word_file', file);
      setFieldValue('template_id', ''); 
    }
  };
  
  const handleSubmit = async (values) => {
    setFormSubmitting(true);
    setFormError(null);
    setDownloadLinks(null);

    try {
      const formData = new FormData();
      formData.append("file_name", values.file_name);
      formData.append("folder_name", values.folder_name);
      formData.append("file_type", values.file_type);
      if (wordFile) {
        formData.append("word_file", wordFile);
      } else {
        formData.append("template_id", values.template_id);
      }

      if (excelFile) {
        formData.append("excel_file", excelFile);
      } else {
        formData.append("bulk_data_id", values.bulk_data_id);
      }

      const response = await FilledtemplateService.createBulkFilledTemplates(
        token,
        formData
      );
      if (response?.data?.status === 201) {
        setDownloadLinks({
          download_link: response?.data?.data?.download_link,
          excel_summary_link: response?.data?.data?.excel_summary_link,
        });
      } else if (response.error) {
        setFormError({
          message: response.error.message,
          details: response.error.details,
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
    } catch (error) {}
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
          <h5 className="mb-0">انشاء مستندات متعددة</h5>
        </div>
        <div className="card-body">
          {downloadLinks && (
            <div className="alert alert-success mb-4">
              <h5 className="mb-3">
                تم إنشاء المستندات بنجاح! يمكنك تحميل الملفات من الروابط
                التالية:
              </h5>
              <div className="d-flex justify-content-center">
                {downloadLinks && (
                  <>
                    <a
                      href={downloadLinks.download_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn primary-btn fs-5"
                    >
                      تحميل الملفات
                      <i className="fas fa-file-download me-2"></i>
                    </a>
                    <a
                      href={downloadLinks.excel_summary_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn primary-btn-outline fs-5 me-3"
                    >
                      تحميل ملخص البيانات
                      <i className="fa-solid fa-file-excel me-2"></i>
                    </a>
                  </>
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
              excel_file: "",
              word_file: "",
            }}
            validationSchema={MultiFillTemplateSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, setFieldValue }) => (
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

                <div className="row justify-content-between ">
                  {/* Template Selection */}
                  <div className="col-md-5 mb-3">
                    <label htmlFor="template_id" className="form-label">
                      اختر القالب
                    </label>
                    <Field
                      as="select"
                      className={`form-select ${
                        touched.template_id &&
                        errors.template_id &&
                        !values.word_file
                          ? "is-invalid"
                          : ""
                      }`}
                      id="template_id"
                      name="template_id"
                      disabled={loading || formSubmitting || values.word_file}
                      onChange={(e) => {
                        handleTemplateChange(e.target.value);
                        handleChange(e);
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
                  <div className="col-md-2 divider d-flex align-items-center justify-content-center mb-3 fs-5">
                    او
                  </div>

                  {/* Word File Upload */}
                  <div className="col-md-5 mb-3">
                    <label htmlFor="word_file" className="form-label">
                      رفع ملف Word
                    </label>
                    <input
                      type="file"
                      className={`form-control ${
                        touched.word_file && errors.word_file
                          ? "is-invalid"
                          : ""
                      }`}
                      id="word_file"
                      accept=".docx,.doc"
                      onChange={(e) => handleWordFileChange(e, setFieldValue)}
                      disabled={loading || formSubmitting || values.template_id}
                    />
                    <small className="text-muted d-block mt-1">
                      يرجى رفع ملف Word (.docx, .doc)
                    </small>
                    <ErrorMessage
                      name="word_file"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  {/* Bulk Data Selection */}
                  <div className="col-md-5">
                    <label htmlFor="bulk_data_id" className="form-label">
                      اختر مجموعة البيانات
                    </label>
                    <Field
                      as="select"
                      className={`form-select ${
                        touched.bulk_data_id &&
                        errors.bulk_data_id &&
                        !values.excel_file
                          ? "is-invalid"
                          : ""
                      }`}
                      id="bulk_data_id"
                      name="bulk_data_id"
                      disabled={loading || formSubmitting || values.excel_file}
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
                  <div className="col-md-2 divider d-flex align-items-center justify-content-center my-3 my-md-0  fs-5">
                    او
                  </div>
                  {/* Excel File Upload */}
                  <div className="col-md-5">
                    <label htmlFor="excel_file" className="form-label">
                      رفع ملف Excel
                    </label>
                    <input
                      type="file"
                      className={`form-control ${
                        touched.excel_file && errors.excel_file
                          ? "is-invalid"
                          : ""
                      }`}
                      id="excel_file"
                      accept=".xlsx,.xls"
                      onChange={(e) => handleExcelChange(e, setFieldValue)}
                      disabled={
                        loading || formSubmitting || values.bulk_data_id
                      }
                    />
                    <small className="text-muted d-block mt-1">
                      يرجى رفع ملف Excel (.xlsx, .xls)
                    </small>
                    <ErrorMessage
                      name="excel_file"
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
