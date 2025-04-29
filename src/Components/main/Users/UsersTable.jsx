import React, { useState } from "react";
import { PulseLoader } from "react-spinners";
import DataTable from "react-data-table-component";
import UserModal from "./UserModal";

const UsersTable = ({ users, loading,handleRefresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const [modalLoading, setModalLoading] = useState(false);

  const handleShowModal = (mode, user = null) => {
    setModalMode(mode);
    setSelectedUser(user);
    setShowModal(true);
  };


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

      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="m-0">إدارة المستخدمين</h2>
        <button
          className="btn primary-btn-outline"
          onClick={() => handleShowModal('create')}
        >
          إضافة مستخدم جديد
          <i className="fas fa-plus me-2"></i>
        </button>
      </div>

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

      <UserModal
        show={showModal}
        onHide={() => setShowModal(false)}
        mode={modalMode}
        user={selectedUser}
        loading={modalLoading}
        handleRefresh={handleRefresh}
      />
    </div>
  );
};

export default UsersTable;