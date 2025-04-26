import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const validFileExtensions = ['xlsx', 'xls'];

const ExcelUploadSchema = Yup.object().shape({
  file: Yup.mixed()
    .required("الملف مطلوب")
    .test(
      "fileFormat",
      "صيغة الملف غير صالحة. يجب أن يكون الملف بصيغة Excel (.xlsx, .xls)",
      value => value && validFileExtensions.includes(value.name.split('.').pop().toLowerCase())
    )
});

const ExcelUploadModal = ({ show, onHide, onSubmit, loading }) => {
  const [fileName, setFileName] = useState("");

  return (
    <div className={`modal fade ${show ? 'show' : ''}`} 
         style={{ display: show ? 'block' : 'none' }} 
         tabIndex="-1" 
         role="dialog"
         aria-hidden={!show}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">رفع ملف Excel</h5>
            <button type="button" className="btn-close me-auto ms-0" onClick={onHide} aria-label="Close"></button>
          </div>
          
          <Formik
            initialValues={{ file: null }}
            validationSchema={ExcelUploadSchema}
            onSubmit={(values, actions) => {
              onSubmit(values.file, actions);
            }}
          >
            {({
              errors,
              touched,
              setFieldValue,
              handleSubmit,
              isSubmitting,
            }) => (
              <Form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="file" className="form-label">ملف Excel</label>
                    <div className="input-group">
                      <input
                        type="file"
                        className={`form-control ${touched.file && errors.file ? 'is-invalid' : ''}`}
                        id="file"
                        accept=".xlsx,.xls"
                        onChange={(event) => {
                          const file = event.currentTarget.files[0];
                          setFieldValue("file", file);
                          setFileName(file ? file.name : "");
                        }}
                        disabled={loading || isSubmitting}
                      />
                      <label className="input-group-text" htmlFor="file">
                        اختر ملف
                      </label>
                    </div>
                    {fileName && <div className="mt-2">الملف المختار: {fileName}</div>}
                    {touched.file && errors.file && (
                      <div className="invalid-feedback d-block">
                        {errors.file}
                      </div>
                    )}
                  </div>
                  
                  <div className="alert alert-info">
                    <small>
                      يجب أن يكون الملف بصيغة Excel (.xlsx, .xls) ويحتوي على البيانات المطلوبة.
                    </small>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={onHide} 
                    disabled={loading || isSubmitting}
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || isSubmitting}
                  >
                    {loading || isSubmitting ? "جاري الرفع..." : "رفع الملف"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ExcelUploadModal;