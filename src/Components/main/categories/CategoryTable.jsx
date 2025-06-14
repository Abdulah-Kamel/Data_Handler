import React from "react";
import { Link } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";

const CategoryTable = ({ categories, loading, formatDate, onEdit, onDelete }) => {
  const { t } = useTranslation();

  const columns = [
    {
      name: "#",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "60px",
    },
    {
      name: t("category_table.name"),
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: t("category_table.description"),
      selector: (row) => {
        return row.description.length > 50
          ? `${row.description.substring(0, 50)}...`
          : row.description;
      },
      sortable: true,
    },
    {
      name: t("category_table.templates_count"),
      selector: (row) => row.templates.length,
      sortable: true,
      width: "250px",
      cell: (row) => (
        <span className="badge primary-bg">{row.templates.length}</span>
      ),
    },
    {
      name: t("category_table.creation_date"),
      selector: (row) => row.created_at,
      sortable: true,
      width: "150px",
      cell: (row) => formatDate(row.created_at),
    },
    {
      name: t("category_table.actions"),
      cell: (row) => (
        <div className="d-flex gap-2 justify-content-center">
          <Link
            to={`/dashboard/templates/${row.id}`}
            className="btn btn-outline-primary btn-sm rounded-pill"
          >
            {t("category_table.view_templates_button")}
            <i className="fas fa-eye me-1"></i>
          </Link>
          <button
            className="btn btn-outline-success btn-sm rounded-pill"
            onClick={() => onEdit(row)}
          >
            {t("category_table.edit_button")}
            <i className="fas fa-edit me-1"></i>
          </button>
          <button
            className="btn btn-outline-danger btn-sm rounded-pill"
            onClick={() => onDelete(row)}
          >
            {t("category_table.delete_button")}
            <i className="fas fa-trash me-1"></i>
          </button>
        </div>
      ),
      width: "350px",
      ignoreRowClick: true,
    },
  ];

  return (
    <div className="position-relative mt-5">
      {loading && (
        <div
          className="position-absolute bg-light top-0 end-0 bottom-0 start-0 d-flex justify-content-center align-items-center w-100"
          style={{ zIndex: 9999 }}
        >
          <PulseLoader color="#05755c" size={15} />
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
          table: {
            style: {
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              overflow: "hidden",
            },
          },
          header: {
            style: {
              backgroundColor: "#f8f9fa",
              fontWeight: "bold",
              fontSize: "16px",
            },
          },
          headRow: {
            style: {
              backgroundColor: "#f1f1f1",
            },
          },
          rows: {
            style: {
              "&:nth-of-type(odd)": {
                backgroundColor: "#f9f9f9",
              },
              minHeight: "60px",
            },
            highlightOnHoverStyle: {
              backgroundColor: "#e9ecef",
              transitionDuration: "0.3s",
            },
          },
          pagination: {
            style: {
              borderTop: "1px solid #dee2e6",
            },
          },
        }}
      />
    </div>
  );
};

export default CategoryTable;
