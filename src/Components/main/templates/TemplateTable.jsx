import React from "react";
import { Link } from "react-router-dom";
import { PulseLoader } from "react-spinners";

const TemplateTable = ({
  templates,
  loading,
  formatDate,
  onEdit,
  onDelete,
  onUploadFile,
}) => {
  const getFileName = (url) => {
    if (!url) return "";
    const fullFileName = url.split('/').pop();
    const decodedFileName = decodeURIComponent(fullFileName);
    if (decodedFileName.includes('_')) {
      return decodedFileName.split('_').slice(1).join('_');
    }
    return decodedFileName;
  };

  return (
    <div className="position-relative mt-5">
      {loading && (
        <div
          className="position-absolute bg-light top-0 end-0 bottom-0 start-0 d-flex justify-content-center align-items-center w-100"
          style={{ zIndex: 9999 }}
        >
          <PulseLoader color="#0aad0a" size={15} />
        </div>
      )}
          {loading && (
            <div className="text-center py-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          <div className="table-responsive table-wrapper">
            <table className="table table-hover table-light table-striped table-bordered shadow align-middle custom-table">
              <thead className="table-dark">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">عنوان القالب</th>
                  <th scope="col">الموضوع</th>
                  <th scope="col">الملفات</th>
                  <th scope="col">تاريخ الإنشاء</th>
                  <th scope="col" className="action-column">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {templates.map((template, index) => (
                  <tr key={template.id}>
                    <td>{index + 1}</td>
                    <td>{template.name}</td>
                    <td>{template.description}</td>
                    <td>
                      {template.word_file ? (
                        <a
                          href={template.word_file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="main-color"
                        >
                          <i className="fas fa-file-word me-1"></i>
                          {getFileName(template.word_file)}
                        </a>
                      ) : (
                        <span className="text-muted">لا يوجد ملف</span>
                      )}
                    </td>
                    <td>{formatDate(template.created_at)}</td>
                    <td className="action-column">
                      <div className="d-flex gap-2  justify-content-center">
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => onUploadFile(template)}
                          title="رفع ملف"
                        >
                            رفع ملف
                          <i className="fas fa-upload me-1"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => onEdit(template)}
                        >
                           تعديل القالب
                          <i className="fas fa-edit me-1"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => onDelete(template)}
                        >
                           حذف القالب
                          <i className="fas fa-trash me-1"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
    </div>
  );
};

export default TemplateTable;
