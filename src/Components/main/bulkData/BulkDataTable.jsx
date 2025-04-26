import React from "react";
import { Link } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import DataTable from "react-data-table-component";

const BulkDataTable = ({ bulkData, loading, formatDate, onEdit, onDelete, onViewDetails }) => {
  
  const columns = [
    {
      name: "#",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "اسم البيانات",
      selector: (row) => row.name,
      sortable: true,
      width: '180px',
    },
    {
      name: "عدد السجلات",
      selector: (row) => row.rows.length,
      sortable: true,
      width: '150px',
      cell: (row) => (
        <span className="badge bg-info">
          {row.rows.length}
        </span>
      ),
    },
    {
      name: "تاريخ الإنشاء",
      selector: (row) => row.created_at,
      sortable: true,
      width: '180px',
      cell: (row) => formatDate(row.created_at),
    },
    {
      name: "الإجراءات",
      cell: (row) => (
        <div className="d-flex gap-2 justify-content-center">
          <button
            className="btn btn-outline-primary btn-sm rounded-pill"
            onClick={() => onViewDetails(row)}
          >
            عرض البيانات
            <i className="fas fa-eye me-1"></i>
          </button>
          <button
            className="btn btn-outline-success btn-sm rounded-pill"
            onClick={() => onEdit(row)}
          >
            تعديل
            <i className="fas fa-edit me-1"></i>
          </button>
          <button
            className="btn btn-outline-danger btn-sm rounded-pill"
            onClick={() => onDelete(row)}
          >
            حذف
            <i className="fas fa-trash me-1"></i>
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
        data={bulkData}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 20, 30]}
        fixedHeader
        highlightOnHover
        customStyles={{
          table: {
            style: {
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              overflow: 'hidden',
            },
          },
          headCells: {
            style: {
              fontSize: '16px',
              fontWeight: 'bold',
              backgroundColor: '#109b58',
              color: 'white',
              paddingTop: '15px',
              paddingBottom: '15px',
            },
          },
          cells: {
            style: {
              fontSize: '15px',
              paddingTop: '12px',
              paddingBottom: '12px',
            },
          },
          pagination: {
            style: {
              borderTop: '1px solid #e0e0e0',
            },
          },
        }}
      />
    </div>
  );
};

export default BulkDataTable;