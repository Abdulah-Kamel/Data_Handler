import React from "react";
import { PulseLoader } from "react-spinners";
import DataTable from "react-data-table-component";

const BulkDataDetails = ({ selectedData, loading, onBack, onEditRow, onDeleteRow }) => {
  // Function to generate columns dynamically based on the first row's data
  const generateColumns = () => {
    if (!selectedData || !selectedData.rows || selectedData.rows.length === 0) {
      return [];
    }

    // Get keys from the first row's data
    const firstRowData = selectedData.rows[0].data;
    const keys = Object.keys(firstRowData);

    // Create columns for each key
    const dynamicColumns = keys.map(key => ({
      name: key,
      selector: row => row.data[key],
      sortable: true,
    }));

    // Add action column
    return [
      ...dynamicColumns,
      {
        name: "الإجراءات",
        cell: (row) => (
          <div className="d-flex gap-2 justify-content-center">
            <button
              className="btn btn-outline-success btn-sm rounded-pill"
              onClick={() => onEditRow(row)}
            >
              تعديل
              <i className="fas fa-edit me-1"></i>
            </button>
            <button
              className="btn btn-outline-danger btn-sm rounded-pill"
              onClick={() => onDeleteRow(row)}
            >
              حذف
              <i className="fas fa-trash me-1"></i>
            </button>
          </div>
        ),
        width: '200px',
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      }
    ];
  };

  return (
    <div className="position-relative mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="m-0">{selectedData?.name}</h3>
        <button 
          className="btn btn-outline-secondary"
          onClick={onBack}
        >
          <i className="fas fa-arrow-right me-1"></i>
          العودة
        </button>
      </div>

      {loading && (
        <div className="position-absolute bg-light top-0 end-0 bottom-0 start-0 d-flex justify-content-center align-items-center w-100" style={{ zIndex: 9999 }}>
          <PulseLoader color="#0aad0a" size={15} />
        </div>
      )}

      <DataTable
        columns={generateColumns()}
        data={selectedData?.rows || []}
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

export default BulkDataDetails;