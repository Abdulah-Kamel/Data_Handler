import React, { useState, useEffect } from "react";
import { PulseLoader } from "react-spinners";
import DataTable from "react-data-table-component";
import RowEditModal from "./RowEditModal";
import RowDeleteModal from "./RowDeleteModal";
import BulkDataService from "../../../services/BulkDataService";

const BulkDataDetails = ({
  selectedData,
  loading,
  onBack,
  onEditRow,
  onDeleteRow,
  setSelectedData,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [allKeys, setAllKeys] = useState([]);

  // Extract all unique keys from data and update state
  useEffect(() => {
    if (selectedData && selectedData.rows && selectedData.rows.length > 0) {
      const keySet = new Set();
      selectedData.rows.forEach((row) => {
        if (row.data) {
          Object.keys(row.data).forEach((key) => keySet.add(key));
        }
      });
      setAllKeys(Array.from(keySet));
    }
  }, [selectedData]);

  // Handle edit row
  const handleEditRow = (row) => {
    setSelectedRow(row);
    setIsEditing(true);
    setFormError("");
    setShowEditModal(true);
  };

  // Handle add new row
  const handleAddRow = () => {
    setSelectedRow(null);
    setIsEditing(false);
    setFormError("");
    setShowEditModal(true);
  };

  // Handle delete row
  const handleDeleteRow = (row) => {
    setSelectedRow(row);
    setDeleteError("");
    setShowDeleteModal(true);
  };

  // Handle submit form
  const handleSubmit = async (formData) => {
    setFormSubmitting(true);
    setFormError("");

    try {
      if (isEditing && selectedRow) {
        // Update existing row
        const response = await BulkDataService.updateRow(
          selectedData.id,
          selectedRow.id,
          {
            data: formData,
          }
        );

        // Call the parent component's callback if provided
        if (onEditRow) {
          onEditRow(selectedData.id, selectedRow.id, formData);
        }
      } else {
        // Create new row
        const response = await BulkDataService.createRow(selectedData.id, {
          data: formData,
        });

        // Call the parent component's callback if provided
        if (onEditRow) {
          onEditRow(selectedData.id, formData);
        }
      }

      // Close modal and potentially refresh data
      setShowEditModal(false);
      const response = await BulkDataService.getBulkDataById(selectedData.id);
      setSelectedData(response.data);
    } catch (error) {
      console.error("Error saving row:", error);
      setFormError(
        error.response?.data?.message || "حدث خطأ أثناء حفظ البيانات"
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle confirm delete
  const handleDelete = async () => {
    setFormSubmitting(true);
    setDeleteError("");

    try {
      // Call the parent component's callback if provided
      if (onDeleteRow) {
        onDeleteRow(selectedData.id, selectedRow.id);
      }

      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting row:", error);
      setDeleteError(
        error.response?.data?.message || "حدث خطأ أثناء حذف البيانات"
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  // Function to generate columns dynamically based on all rows' data
  const generateColumns = () => {
    if (!selectedData || !selectedData.rows || selectedData.rows.length === 0) {
      return [];
    }

    // Create columns for each key
    const dynamicColumns = allKeys.map((key) => {
      // Set different widths based on column type/name
      let columnWidth; // Default width

      if (key.toLowerCase().includes("email")) {
        columnWidth = "250px"; // Wider for email columns
      }

      return {
        name: key,
        selector: (row) =>
          row.data && row.data[key] !== undefined ? row.data[key] : "",
        sortable: true,
        width: columnWidth ? columnWidth : "auto" ,
      };
    });

    // Add action column
    return [
      ...dynamicColumns,
      {
        name: "الإجراءات",
        cell: (row) => (
          <div className="d-flex gap-2 justify-content-center">
            <button
              className="btn btn-outline-success btn-sm rounded-pill"
              onClick={() => handleEditRow(row)}
            >
              تعديل
              <i className="fas fa-edit me-1"></i>
            </button>
            <button
              className="btn btn-outline-danger btn-sm rounded-pill"
              onClick={() => handleDeleteRow(row)}
            >
              حذف
              <i className="fas fa-trash me-1"></i>
            </button>
          </div>
        ),
        width: "200px",
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      },
    ];
  };

  return (
    <div className="position-relative mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="m-0">{selectedData?.name}</h3>
        <div className="d-flex gap-2">
          <button className="btn btn-primary" onClick={handleAddRow}>
            إضافة سجل جديد
            <i className="fas fa-plus me-1"></i>
          </button>
          <button className="btn btn-outline-secondary" onClick={onBack}>
            العودة
            <i className="fas fa-arrow-left me-1"></i>
          </button>
        </div>
      </div>

      {loading && (
        <div
          className="position-absolute bg-light top-0 end-0 bottom-0 start-0 d-flex justify-content-center align-items-center w-100"
          style={{ zIndex: 9999 }}
        >
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
              fontSize: "15px",
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

      {/* Modal backdrop */}
      {(showEditModal || showDeleteModal) && (
        <div className="modal-backdrop fade show"></div>
      )}

      {/* Row Edit Modal */}
      <RowEditModal
        show={showEditModal}
        isEditing={isEditing}
        selectedRow={selectedRow}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleSubmit}
        formSubmitting={formSubmitting}
        error={formError}
        allKeys={allKeys}
      />

      {/* Delete Confirmation Modal */}
      <RowDeleteModal
        show={showDeleteModal}
        row={selectedRow}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isSubmitting={formSubmitting}
        error={deleteError}
      />
    </div>
  );
};

export default BulkDataDetails;
