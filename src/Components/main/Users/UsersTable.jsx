import React from "react";
import { PulseLoader } from "react-spinners";
import DataTable from "react-data-table-component";
import UserModal from "./UserModal";

const UsersTable = ({ users, loading,handleShowModal }) => {
  const columns = [
    {
      name: "#",
      selector: (row, index) => index + 1,
      sortable: true,
      width: '60px',
    },
    {
      name: "الاسم",
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: "البريد الإلكتروني",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "نوع المستخدم",
      selector: (row) => row.is_admin,
      sortable: true,
      cell: (row) => (
        <span className={`badge ${row.is_admin ? 'bg-primary' : 'bg-info'}`}>
          {row.is_admin ? 'مسؤول' : 'مستخدم'}
        </span>
      ),
    },
    {
        name:"organization",
        selector: (row) => row.organization,
        sortable: true,
        width: "200px"
    },
    {
      name: "الإجراءات",
      cell: (row) => (
        <div className="d-flex gap-2 justify-content-center">
          <button
            className="btn btn-outline-success btn-sm rounded-pill"
            onClick={() => handleShowModal('update', row)}
          >
            تعديل
            <i className="fas fa-edit me-1"></i>
          </button>
          <button
            className="btn btn-outline-danger btn-sm rounded-pill"
            onClick={() => handleShowModal('delete', row)}
          >
            حذف
            <i className="fas fa-trash me-1"></i>
          </button>
        </div>
      ),
      width: '250px',
      ignoreRowClick: true,
    }
  ];

  return (
    <div className="position-relative mt-5">
     

      

      <DataTable
        columns={columns}
        data={users}
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
              marginTop: '20px',
            },
          },
          headCells: {
            style: {
              fontSize: '16px',
              fontWeight: 'bold',
              backgroundColor: '#05755c',
              color: 'white',
              paddingTop: '15px',
              paddingBottom: '15px',
            },
          },
          cells: {
            style: {
              fontSize: '20px',
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

export default UsersTable;