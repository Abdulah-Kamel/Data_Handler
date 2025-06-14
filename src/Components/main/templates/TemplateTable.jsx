import React from "react";
import { useTranslation } from "react-i18next";
import { PulseLoader } from "react-spinners";
import DataTable from "react-data-table-component";

const TemplateTable = ({
  templates,
  loading,
  formatDate,
  onEdit,
  onDelete,
  onUploadFile,
}) => {
  const { t } = useTranslation();

  const columns = [
    {
      name: "#",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "60px",
    },
    {
      name: t("template_table.name"),
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: t("template_table.description"),
      selector: (row) => row.description,
      sortable: true,
      cell: (row) => {
        return row.description.length > 50
          ? `${row.description.substring(0, 50)}...`
          : row.description;
      },
    },
    {
      name: t("template_table.files"),
      selector: (row) => row.word_file,
      sortable: false,
      cell: (row) =>
        row.word_file ? (
          <a
            href={row.word_file}
            target="_blank"
            rel="noopener noreferrer"
            className=" btn primary-btn"
          >
            {t("template_table.view_template_button")}
          </a>
        ) : (
          <span className="text-muted">{t("template_table.no_file")}</span>
        ),
    },
    {
      name: t("template_table.creation_date"),
      selector: (row) => row.created_at,
      sortable: true,
      width: "150px",
      cell: (row) => formatDate(row.created_at),
    },
    {
      name: t("template_table.actions"),
      cell: (row) => (
        <div className="d-flex gap-2 justify-content-center">
          <button
            className="btn btn-outline-info btn-sm rounded-pill d-flex align-items-center"
            onClick={() => onUploadFile(row)}
            title={t("template_table.upload_word_file_title")}
          >
            {t("template_table.upload_word_file_button")}
            <i className="fas fa-upload me-1"></i>
          </button>
          <button
            className="btn btn-outline-success btn-sm rounded-pill d-flex align-items-center"
            onClick={() => onEdit(row)}
          >
            {t("template_table.edit_button")}
            <i className="fas fa-edit me-1"></i>
          </button>
          <button
            className="btn btn-outline-danger btn-sm rounded-pill d-flex align-items-center"
            onClick={() => onDelete(row)}
          >
            {t("template_table.delete_button")}
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
        data={templates}
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
          headCells: {
            style: {
              fontSize: "16px",
              fontWeight: "bold",
              backgroundColor: "#05755c",
              color: "white",
              paddingTop: "15px",
              paddingBottom: "15px",
            },
          },
          cells: {
            style: {
              fontSize: "16px",
              paddingTop: "12px",
              paddingBottom: "12px",
            },
          },
          pagination: {
            style: {
              borderTop: "1px solid #e0e0e0",
            },
          },
        }}
      />
    </div>
  );
};

export default TemplateTable;
