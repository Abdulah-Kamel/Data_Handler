import React from 'react';
import DataTable from 'react-data-table-component';
import { PulseLoader } from 'react-spinners';

const ExternalTasksTable = ({ tasks, loading, error, onRefresh }) => {
  const columns = [
    {
      name: '#',
      selector: (row, index) => index + 1,
      sortable: true,
      width: '60px',
    },
    {
      name: 'العنوان',
      selector: (row) => row.title,
      sortable: true,
      cell: (row) => (
        <div style={{ maxWidth: '300px', whiteSpace: 'normal' }}>
          {row.title}
        </div>
      ),
    },
    {
      name: 'الرابط الأصلي',
      selector: (row) => row.url,
      sortable: true,
      cell: (row) => (
        <a
          href={row.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn primary-btn"
        >
          رابط المقال
        </a>
      ),
    },
    {
      name: 'تاريخ الإنشاء',
      selector: (row) => new Date(row.created_at).toLocaleDateString(),
      sortable: true,
      width: '150px',
    },
    {
      name: 'الحالة',
      cell: (row) => (
        <span className={`badge ${row.is_active ? 'bg-success' : 'bg-secondary'}`}>
          {row.is_active ? 'نشط' : 'غير نشط'}
        </span>
      ),
      width: '120px',
    },
    {
      name: 'التنزيل',
      cell: (row) => (
        <a
          href={row.download_link || '#'}
          className={`btn btn-sm ${row.download_link ? 'btn-primary' : 'btn-secondary disabled'}`}
          target="_blank"
          rel="noopener noreferrer"
          download
        >
          <i className="fas fa-download"></i>
        </a>
      ),
      width: '100px',
    },
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <PulseLoader color="#05755c" size={15} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center my-4">
        {error}
        <button
          className="btn btn-sm btn-outline-danger me-3"
          onClick={onRefresh}
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="table-responsive">
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

export default ExternalTasksTable;
