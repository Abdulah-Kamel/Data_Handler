import React from "react";
import { Link } from "react-router-dom";
import { PulseLoader } from "react-spinners";

const CategoryTable = ({
  categories,
  loading,
  formatDate,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="position-relative">
        {loading && (
            <div className="position-absolute bg-light top-0 end-0 bottom-0 start-0 d-flex justify-content-center align-items-center w-100" style={{zIndex: 9999}}>
            <PulseLoader color="#0aad0a" size={15} />
          </div>
        )}
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover table-striped align-middle">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">اسم الفئة</th>
                <th scope="col">الوصف</th>
                <th scope="col">عدد القوالب</th>
                <th scope="col">تاريخ الإنشاء</th>
                <th scope="col">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr key={category.id}>
                  <td>{index + 1}</td>
                  <td>{category.name}</td>
                  <td>
                    {category.description.length > 50
                      ? `${category.description.substring(0, 50)}...`
                      : category.description}
                  </td>
                  <td>
                    <span className="badge bg-info">
                      {category.templates.length}
                    </span>
                  </td>
                  <td>{formatDate(category.created_at)}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link
                        to={`/dashboard/templates/${category.id}`}
                        className="btn btn-sm btn-primary"
                      >
                         عرض القوالب
                        <i className="fas fa-eye me-1"></i>
                      </Link>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => onEdit(category)}
                      >
                         تعديل
                        <i className="fas fa-edit me-1"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => onDelete(category)}
                      >
                         حذف
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
    </div>
        </div>
  );
};

export default CategoryTable;
