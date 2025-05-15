import React, { useState, useEffect } from "react";
import BulkDataTable from "./BulkDataTable";
import BulkDataDetails from "./BulkDataDetails";
import BulkDataModal from "./BulkDataModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import BulkDataService from "../../../services/BulkDataService";
import ExcelUploadModal from "./ExcelUploadModal";
import { useAuth } from "../../../Context/AuthContext";

const BulkData = () => {
  const [bulkData, setBulkData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [viewingDetails, setViewingDetails] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const { accessToken } = useAuth(); 

  const fetchBulkData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await BulkDataService.getAllBulkData(accessToken);
      setBulkData(response.data);
    } catch (error) {
      setError("حدث خطأ أثناء جلب البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBulkData();
  }, [refreshTrigger]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("ar-EG", options);
  };

  const handleViewDetails = (data) => {
    setSelectedData(data);
    setViewingDetails(true);
  };

  const handleAddNew = () => {
    setModalData(null);
    setIsEditing(false);
    setError("");
    setShowModal(true);
  };

  const handleEdit = (data) => {
    setModalData(data);
    setIsEditing(true);
    setError("");
    setShowModal(true);
  };

  const handleModalSubmit = async (values, { setSubmitting, setErrors }) => {
    setError("");
    try {
      if (isEditing) {
        await BulkDataService.updateBulkData(modalData.id, values,accessToken);
      } else {
        await BulkDataService.createBulkData(values,accessToken);
      }
      fetchBulkData();
      setShowModal(false);
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        setError("حدث خطأ أثناء حفظ البيانات");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRow = async (selectedData, rowId) => {
    setLoading(true);
    setError("");
    try {
      await BulkDataService.deleteRow(selectedData, rowId,accessToken);

      const response = await BulkDataService.getBulkDataById(selectedData,accessToken);
      setSelectedData(response.data);
    } catch (error) {
      setError("حدث خطأ أثناء حذف السجل");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setViewingDetails(false);
    setSelectedData(null);
    setError("");
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState("");

  const handleDelete = (data) => {
    setItemToDelete(data);
    setDeleteType("data");
    setShowDeleteModal(true);
  };

  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      await BulkDataService.deleteBulkData(itemToDelete.id,accessToken);
      fetchBulkData();

      setShowDeleteModal(false);
    } catch (error) {
      setError(`حدث خطأ أثناء حذف "السجل"}`);
    } finally {
      setDeleting(false);
    }
  };

  const [showExcelModal, setShowExcelModal] = useState(false);
  const [excelUploadId, setExcelUploadId] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const handleOpenExcelUpload = (data) => {
    setExcelUploadId(data.id);
    setShowExcelModal(true);
  };

  const handleExcelUpload = async (file, { setSubmitting, resetForm }) => {
    if (!file || !excelUploadId) return;
    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      await BulkDataService.uploadExcelToBulkData(excelUploadId, formData,accessToken);
      setShowExcelModal(false);
      resetForm();

      if (viewingDetails && selectedData && selectedData.id === excelUploadId) {
        const response = await BulkDataService.getBulkDataById(excelUploadId,accessToken);
        setSelectedData(response.data);
      } else {
        await fetchBulkData();
      }
    } catch (error) {
    } finally {
      setUploadLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <>
   <title>Data Handler - اداره البيانات</title>
   <meta name="description" content="Data Handler - اداره البيانات" />
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="card-title m-0">
            {viewingDetails ? "تفاصيل البيانات" : "اداره البيانات"}
          </h2>

          {!viewingDetails && (
            <button
              className="btn primary-btn-outline small-text"
              onClick={handleAddNew}
            >
              إضافة بيانات جديدة
              <i className="fas fa-plus me-1"></i>
            </button>
          )}
        </div>

        {error && (
          <div className="alert alert-danger text-center my-4" role="alert">
            {error}
            <button
              className="btn btn-sm btn-outline-danger me-3"
              onClick={() => {
                setError("");
                setRefreshTrigger((prev) => prev + 1);
              }}
            >
              إعادة المحاولة
            </button>
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
