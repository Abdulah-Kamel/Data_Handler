import React, { useState, useEffect } from "react";
import BulkDataTable from "./BulkDataTable";
import BulkDataDetails from "./BulkDataDetails";
import BulkDataModal from "./BulkDataModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import BulkDataService from "../../../services/BulkDataService";
import ExcelUploadModal from "./ExcelUploadModal";

const BulkData = () => {
  const [bulkData, setBulkData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [viewingDetails, setViewingDetails] = useState(false);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  // Fetch bulk data from API
  const fetchBulkData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await BulkDataService.getAllBulkData();
      setBulkData(response.data);
    } catch (error) {
      console.error("Error fetching bulk data:", error);
      setError("حدث خطأ أثناء جلب البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBulkData();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("ar-EG", options);
  };

  // Handle viewing details of a bulk data
  const handleViewDetails = (data) => {
    setSelectedData(data);
    setViewingDetails(true);
  };

  // Open modal for creating new bulk data
  const handleAddNew = () => {
    setModalData(null);
    setIsEditing(false);
    setError("");
    setShowModal(true);
  };

  // Open modal for editing bulk data
  const handleEdit = (data) => {
    setModalData(data);
    setIsEditing(true);
    setError("");
    setShowModal(true);
  };

  // Handle modal submission (create or update)
  const handleModalSubmit = async (values, { setSubmitting, setErrors }) => {
    
    // Don't set the main loading state for form submission
    setError("");
    try {
      if (isEditing) {
        await BulkDataService.updateBulkData(modalData.id, values);
      } else {
        await BulkDataService.createBulkData(values);
      }
      // After successful submission, fetch the updated data
      fetchBulkData();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving bulk data:", error);
      if (error.response && error.response.data) {
        // Set form-specific errors if available
        setErrors(error.response.data);
      } else {
        // Set general error
        setError("حدث خطأ أثناء حفظ البيانات");
      }
    } finally {
      // Only setSubmitting to false, don't modify the main loading state
      setSubmitting(false);
    }
  };

  // Handle deleting a bulk data


  // Handle deleting a row in bulk data
  const handleDeleteRow = async (selectedData,rowId) => {
    console.log(selectedData,rowId);
    
    setLoading(true);
    setError("");
    try {
      await BulkDataService.deleteRow(selectedData, rowId);

      // Refresh the selected data
      const response = await BulkDataService.getBulkDataById(selectedData);
      setSelectedData(response.data);
    } catch (error) {
      console.error("Error deleting row:", error);
      setError("حدث خطأ أثناء حذف السجل");
    } finally {
      setLoading(false);
    }
  };

  // Handle going back to the bulk data list
  const handleBack = () => {
    setViewingDetails(false);
    setSelectedData(null);
    setError("");
  };

  // Add these new state variables for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(""); // 'data' or 'row'

  // Update the handleDelete function
  const handleDelete = (data) => {
    setItemToDelete(data);
    setDeleteType("data");
    setShowDeleteModal(true);
  };

  // Add a new function to handle the actual deletion
  // Add a state for tracking deletion in progress
  const [deleting, setDeleting] = useState(false);

  // Update the confirmDelete function
  const confirmDelete = async () => {
    setDeleting(true);
    setError("");
    try {
        await BulkDataService.deleteBulkData(itemToDelete.id);
        // Only show loading when fetching data
        fetchBulkData();
      
      setShowDeleteModal(false);
    } catch (error) {
      console.error(`Error deleting ${deleteType}:`, error);
      setError(
        `حدث خطأ أثناء حذف "السجل"}`
      );
    } finally {
      setDeleting(false);
    }
  };

// Add state for Excel upload modal
const [showExcelModal, setShowExcelModal] = useState(false);
const [excelUploadId, setExcelUploadId] = useState(null);
const [uploadLoading, setUploadLoading] = useState(false);

// Handle opening Excel upload modal
const handleOpenExcelUpload = (data) => {
  setExcelUploadId(data.id);
  setShowExcelModal(true);
};

// Handle Excel file upload
const handleExcelUpload = async (file, { setSubmitting, resetForm }) => {
  if (!file || !excelUploadId) return;
  
  setUploadLoading(true);
  
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    // Upload the file
    await BulkDataService.uploadExcelToBulkData(excelUploadId, formData);
    
    // Close the modal first
    setShowExcelModal(false);
    resetForm();
    
    // Then refresh the data
    if (viewingDetails && selectedData && selectedData.id === excelUploadId) {
      const response = await BulkDataService.getBulkDataById(excelUploadId);
      setSelectedData(response.data);
    } else {
      // Otherwise refresh the main list
      await fetchBulkData();
    }
    
    // Show success message (you can add a toast notification here if you have one)
    
  } catch (error) {
    console.error("Error uploading Excel file:", error);
    // You can handle specific error messages here if needed
  } finally {
    setUploadLoading(false);
    setSubmitting(false);
  }
};

  return (
    <>
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="card-title m-0">
            {viewingDetails ? "تفاصيل البيانات" : "البيانات المجمعة"}
          </h2>

          {!viewingDetails && (
            <button className="btn btn-outline-success" onClick={handleAddNew}>
              إضافة بيانات جديدة
              <i className="fas fa-plus me-1"></i>
            </button>
          )}
        </div>

        {error && (
          <div className="alert alert-danger mb-4" role="alert">
            {error}
          </div>
        )}

        {viewingDetails ? (
          <BulkDataDetails
            selectedData={selectedData}
            loading={loading}
            onBack={handleBack}
            onDeleteRow={handleDeleteRow}
             setSelectedData={setSelectedData}
          />
        ) : (
          <BulkDataTable
            bulkData={bulkData}
            loading={loading}
            formatDate={formatDate}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetails={handleViewDetails}
            onUploadExcel={handleOpenExcelUpload}
          />
        )}

        {/* Modal for creating/editing bulk data */}
        <BulkDataModal
          show={showModal}
          onHide={() => setShowModal(false)}
          onSubmit={handleModalSubmit}
          initialValues={modalData}
          isEditing={isEditing}
          loading={loading}
        />
         <ExcelUploadModal
          show={showExcelModal}
          onHide={() => setShowExcelModal(false)}
          onSubmit={handleExcelUpload}
          loading={uploadLoading}
        />
      </div>
      {showModal && (
        <div
          className="modal-backdrop fade show"
          onClick={() => setShowModal(false)}
        ></div>
      )}

      {/* Add the DeleteConfirmationModal */}
      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.name || "هذا العنصر"}
        loading={deleting}
      />
    </>
  );
};

export default BulkData;
