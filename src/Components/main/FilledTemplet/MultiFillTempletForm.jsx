import React, {useEffect, useState} from "react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {useTranslation} from "react-i18next";
import FilledtemplateService from "../../../services/FilledtemplateService";
import BulkDataService from "../../../services/BulkDataService";
import categoryService from "../../../services/categoryService";
import {PulseLoader} from "react-spinners";

const validFileExtensions = ["xlsx", "xls"];

const MultiFillTempletForm = ({token}) => {
    const {t} = useTranslation();

    const MultiFillTemplateSchema = Yup.object().shape({
        template_id: Yup.string().test(
            "conditional-requirement",
            t("multi_fill_templet_form.validation.template_or_word_required"),
            function (value) {
                return value || this.parent.word_file;
            }
        ),
        word_file: Yup.mixed().test(
            "fileFormat",
            t("multi_fill_templet_form.validation.word_file_format"),
            function (value) {
                if (!value) return true;
                return ["docx", "doc"].includes(
                    value.name.split(".").pop().toLowerCase()
                );
            }
        ),
        bulk_data_id: Yup.string().test(
            "conditional-requirement",
            t("multi_fill_templet_form.validation.bulk_data_or_excel_required"),
            function (value) {
                return this.parent.excel_file || value;
            }
        ),
        excel_file: Yup.mixed().test(
            "fileFormat",
            t("multi_fill_templet_form.validation.excel_file_format"),
            function (value) {
                if (!value) return true;
                return validFileExtensions.includes(
                    value.name.split(".").pop().toLowerCase()
                );
            }
        ),
        file_name: Yup.string().required(t("multi_fill_templet_form.validation.file_name_required")),
        folder_name: Yup.string().required(t("multi_fill_templet_form.validation.folder_name_required")),
        file_type: Yup.string().required(t("multi_fill_templet_form.validation.file_type_required")),
    });

    const [templates, setTemplates] = useState([]);
    const [categories, setCategories] = useState([]);
    const [bulkDataSets, setBulkDataSets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState(null);
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [downloadLinks, setDownloadLinks] = useState(null);
    const [selectedTemplateVars, setSelectedTemplateVars] = useState([]);
    const [excelFile, setExcelFile] = useState(null);
    const [wordFile, setWordFile] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const result = await categoryService.getAll(token);
                if (result.data) {
                    setCategories(result.data);
                }
            } catch (err) {
                setFormError(t("multi_fill_templet_form.errors.fetch_categories"));
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, [token, t]);

    useEffect(() => {
        const fetchBulkData = async () => {
            try {
                const bulkDataResult = await BulkDataService.getAllBulkData(token);
                if (bulkDataResult.data) {
                    setBulkDataSets(bulkDataResult.data);
                }
            } catch (err) {
                setFormError(t("multi_fill_templet_form.errors.fetch_bulk_data"));
            }
        };

        fetchBulkData();
    }, [token, t]);

    const handleCategoryChange = async (e, setFieldValue) => {
        const categoryId = e.target.value;
        setSelectedCategory(categoryId);
        setFieldValue("template_id", "");
        setSelectedTemplateVars([]);
        setFormError(null);

        if (!categoryId) {
            setTemplates([]);
            return;
        }

        setLoading(true);
        try {
            const result = await categoryService.getById(token, categoryId);
            if (result) {
                setTemplates(result?.data?.templates || []);
            } else {
                setTemplates([]);
            }
        } catch (err) {
            setFormError({
                message: t("multi_fill_templet_form.errors.fetch_templates"),
                details: err.message ? [err.message] : [],
            });
            setTemplates([]);
        } finally {
            setLoading(false);
        }
    };

    const handleExcelChange = (event, setFieldValue) => {
        const file = event.target.files[0];
        if (file) {
            setExcelFile(file);
            setFieldValue("excel_file", file);
            setFieldValue("bulk_data_id", "");
        }
    };

    const handleWordFileChange = (event, setFieldValue) => {
        const file = event.target.files[0];
        if (file) {
            setWordFile(file);
            setFieldValue("word_file", file);
            setFieldValue("template_id", "");
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
                message: t("multi_fill_templet_form.errors.create_documents"),
                details: [],
            });
        } finally {
            setFormSubmitting(false);
        }
    };

    const handleTemplateChange = async (templateId, setFieldValue) => {
        if (!templateId) {
            setSelectedTemplateVars([]);
            setFieldValue("word_file", null);
            setWordFile(null);
            return;
        }

        const template = templates.find((t) => t.id === templateId);
        if (template) {
            setSelectedTemplateVars(template.variables || []);
        }

        try {
            const response = await FilledtemplateService.getVariablesOfTemplate(
                token,
                templateId
            );
            if (response?.data?.status === 200) {
                setSelectedTemplateVars(response?.data?.data?.variables || []);
            }
        } catch (error) {
            console.error("Error fetching template variables:", error);
        }
    };

    return (
        <>
            {loading && (
                <div
                    className="position-absolute bg-light top-0 end-0 bottom-0 start-0 d-flex justify-content-center align-items-center w-100"
                    style={{zIndex: 1}}
                >
                    <PulseLoader color="#05755c" size={15}/>
                </div>
            )}
            <div className="card mb-4">
                <div className="card-header primary-bg text-white">
                    <h5 className="mb-0">{t("multi_fill_templet_form.header")}</h5>
                </div>
                <div className="card-body d-flex flex-column gap-3">
                    {downloadLinks && (
                        <div className="alert alert-success mb-4">
                            <h5 className="mb-3">{t("multi_fill_templet_form.success.documents_created")}</h5>
                            <div className="d-flex justify-content-center">
                                {downloadLinks && (
                                    <>
                                        <a
                                            href={downloadLinks.download_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn primary-btn fs-5"
                                        >
                                            {t("multi_fill_templet_form.success.download_files_button")}
                                            <i className="fas fa-file-download me-2"></i>
                                        </a>
                                        <a
                                            href={downloadLinks.excel_summary_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn primary-btn-outline fs-5 me-3"
                                        >
                                            {t("multi_fill_templet_form.success.download_summary_button")}
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
                        {({values, errors, touched, handleChange, setFieldValue}) => (
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

                                <div className="row">
                                    {/* Category Selection */}
                                    <div className="col-md-5 mb-3">
                                        <label htmlFor="category_id" className="form-label">
                                            {t("multi_fill_templet_form.category_label")}
                                        </label>
                                        <Field
                                            as="select"
                                            className="form-select"
                                            id="category_id"
                                            name="category_id"
                                            onChange={(e) => handleCategoryChange(e, setFieldValue)}
                                            value={selectedCategory}
                                            disabled={formSubmitting}
                                        >
                                            <option
                                                value="">{t("multi_fill_templet_form.select_category_placeholder")}</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </Field>
                                    </div>

                                    <div className="row">
                                        {/* Template Selection */}
                                        <div className="col-md-5 mb-3">
                                            <label htmlFor="template_id" className="form-label">
                                                {t("multi_fill_templet_form.template_label")}
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
                                                disabled={
                                                    loading ||
                                                    formSubmitting ||
                                                    values.word_file ||
                                                    !selectedCategory
                                                }
                                                onChange={(e) => {
                                                    handleTemplateChange(e.target.value, setFieldValue);
                                                    handleChange(e);
                                                }}
                                            >
                                                <option
                                                    value="">{t("multi_fill_templet_form.select_template_placeholder")}</option>
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
                                        <div
                                            className="col-md-2 divider d-flex align-items-center justify-content-center fs-5">
                                            {t("multi_fill_templet_form.or_divider")}
                                        </div>
                                        {/* Word File Upload */}
                                        <div className="col-md-5 mb-3 mt-3 mt-sm-0">
                                            <label htmlFor="word_file" className="form-label">
                                                {t("multi_fill_templet_form.word_file_label")}
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
                                                {t("multi_fill_templet_form.word_file_hint")}
                                            </small>
                                            <ErrorMessage
                                                name="word_file"
                                                component="div"
                                                className="invalid-feedback"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    {/* Bulk Data Selection */}
                                    <div className="col-md-5">
                                        <label htmlFor="bulk_data_id" className="form-label">
                                            {t("multi_fill_templet_form.bulk_data_label")}
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
                                            <option
                                                value="">{t("multi_fill_templet_form.select_bulk_data_placeholder")}</option>
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
                                    <div
                                        className="col-md-2 divider d-flex align-items-center justify-content-center fs-5">
                                        {t("multi_fill_templet_form.or_divider")}
                                    </div>
                                    {/* Excel File Upload */}
                                    <div className="col-md-5 mt-3 mt-sm-0">
                                        <label htmlFor="excel_file" className="form-label">
                                            {t("multi_fill_templet_form.excel_file_label")}
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
                                            {t("multi_fill_templet_form.excel_file_hint")}
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
                                    <div className="col-md-5 mb-3">
                                        <label htmlFor="file_name" className="form-label">
                                            {t("multi_fill_templet_form.file_name_label")}
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
                                            placeholder={t("multi_fill_templet_form.file_name_placeholder")}
                                            disabled={formSubmitting}
                                        />
                                        <ErrorMessage
                                            name="file_name"
                                            component="div"
                                            className="invalid-feedback"
                                        />
                                    </div>
                                    <div
                                        className="col-md-2 divider d-flex align-items-center justify-content-center fs-5">
                                        {t("multi_fill_templet_form.or_divider")}
                                    </div>
                                    {/* Folder Name */}
                                    <div className="col-md-5 mb-3">
                                        <label htmlFor="folder_name" className="form-label">
                                            {t("multi_fill_templet_form.folder_name_label")}
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
                                            placeholder={t("multi_fill_templet_form.folder_name_placeholder")}
                                            disabled={formSubmitting}
                                        />
                                        <ErrorMessage
                                            name="folder_name"
                                            component="div"
                                            className="invalid-feedback"
                                        />
                                    </div>
                                    {/* File Type */}
                                    <div className="col-md-5 mb-3">
                                        <label htmlFor="file_type" className="form-label">
                                            {t("multi_fill_templet_form.file_type_label")}
                                        </label>
                                        <Field
                                            as="select"
                                            className={`form-select ${
                                                touched.file_type && errors.file_type ? "is-invalid" : ""
                                            }`}
                                            id="file_type"
                                            name="file_type"
                                            disabled={formSubmitting}
                                        >
                                            <option
                                                value="">{t("multi_fill_templet_form.select_file_type_placeholder")}</option>
                                            <option value="pdf">PDF</option>
                                            <option value="word">Word</option>
                                            <option value="both">{t("multi_fill_templet_form.file_type_both")}</option>
                                        </Field>
                                        <ErrorMessage
                                            name="file_type"
                                            component="div"
                                            className="text-danger"
                                        />
                                    </div>
                                </div>


                                {selectedTemplateVars.length > 0 && (
                                    <div className="mb-4">
                                        <h6 className="mb-3">{t("multi_fill_templet_form.available_variables_label")}</h6>
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
                                                {t("multi_fill_templet_form.creating_button")}
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                            </>
                                        ) : (
                                            t("multi_fill_templet_form.create_files_button")
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
