import React from "react";
import { Link } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import DataTable from "react-data-table-component";

const CategoryTable = ({ categories, loading, formatDate, onEdit, onDelete }) => {
  
const columns = [
  {
    name: "#",
    selector: (row, index) => index + 1,
    sortable: true,
    width: '60px',
  },
  {
    name: "اسم الفئة",
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: "الوصف",
    selector: (row) => {
      return row.description.length > 50
        ? `${row.description.substring(0, 50)}...`
        : row.description;
    },
    sortable: true,
  },
  {
    name: "عدد القوالب",
    selector: (row) => row.templates.length,
    sortable: true,
    width: '120px',
    cell: (row) => (
      <span className="badge bg-info">
        {row.templates.length}
      </span>
    ),
  },
  {
    name: "تاريخ الإنشاء",
    selector: (row) => row.created_at,
    sortable: true,
    width: '150px',
    cell: (row) => formatDate(row.created_at),
  },
  {
    name: "الإجراءات",
    cell: (row) => (
      <div className="d-flex gap-2 justify-content-center">
        <Link
          to={`/dashboard/templates/${row.id}`}
          className="btn btn-outline-primary btn-sm rounded-pill"
        >
          <i className="fas fa-eye me-1"></i>
          عرض القوالب
        </Link>
        <button
          className="btn btn-outline-success btn-sm rounded-pill"
          onClick={() => onEdit(row)}
        >
          <i className="fas fa-edit me-1"></i>
          تعديل
        </button>
        <button
          className="btn btn-outline-danger btn-sm rounded-pill"
          onClick={() => onDelete(row)}
        >
          <i className="fas fa-trash me-1"></i>
          حذف
        </button>
      </div>
    ),
    width: '350px',
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  }
];

  return (
    <div className="position-relative mt-5">
      {loading && (
        <div className="position-absolute bg-light top-0 end-0 bottom-0 start-0 d-flex justify-content-center align-items-center w-100" style={{ zIndex: 9999 }}>
          <PulseLoader color="#0aad0a" size={15} />
        </div>
      )}
      <DataTable
        columns={columns}
        data={categories}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 20, 30]}
        fixedHeader
        highlightOnHover
        customStyles={{
          headCells: {
            style: {
              fontSize: '16px',
              fontWeight: 'bold',
            },
          },
          cells: {
            style: {
              fontSize: '15px',
              paddingTop: '12px',
              paddingBottom: '12px',
            },
          },
        }}
      />
    </div>
  );
};

export default CategoryTable;
