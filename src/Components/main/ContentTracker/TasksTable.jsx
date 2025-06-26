
import React from "react";
import { useTranslation } from 'react-i18next';
import DataTable from "react-data-table-component";

const TasksTable = ({ tasks, onDelete, handleShowResults }) => {
  const { t } = useTranslation();
  const columns = [
    {
      name: "#",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "60px",
    },
    {
      name: t('content_tracker.tasks_table.title'),
      selector: (row) => row.title,
      sortable: true,
      cell: (row) => (
        <div style={{ maxWidth: "300px", whiteSpace: "normal" }}>
          {row.title}
        </div>
      ),
    },
    {
      name: t('content_tracker.tasks_table.original_link'),
      selector: (row) => row.url,
      sortable: true,
      cell: (row) => (
        <a
          href={row.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn primary-btn"
        >
          {t('content_tracker.tasks_table.article_link_button')}
        </a>
      ),
      
    },
    {
      name: t('content_tracker.tasks_table.results_count'),
      selector: (row) => row.results?.length || 0,
      sortable: true,
      width: "150px",
    },
    {
      name: t('content_tracker.tasks_table.actions'),
      cell: (row) => (
        <div className="d-flex gap-2 justify-content-center">
          <button
            className="btn btn-outline-primary btn-sm rounded-pill"
            onClick={() => handleShowResults(row)}
          >
            {t('content_tracker.tasks_table.show_results_button')}
            <i className="fas fa-eye me-1"></i>
          </button>

          <button
            className="btn btn-outline-danger btn-sm rounded-pill"
            onClick={() => onDelete(row)}
          >
            {t('content_tracker.tasks_table.delete_button')}
            <i className="fas fa-trash me-1"></i>
          </button>
        </div>
      ),
      width: "300px",
      ignoreRowClick: true,
    },
  ];

  return (
    <div className="position-relative mt-5">
      <DataTable
        columns={columns}
        data={tasks}
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
              marginTop: "20px",
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
              fontSize: "20px",
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

export default TasksTable;
