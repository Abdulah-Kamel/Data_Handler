import React from "react";
import { useParams, Link } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { useTemplates } from "./hooks/useTemplates";
import { useTemplateActions } from "./hooks/useTemplateActions";
import TemplateTable from "./TemplateTable";
import TemplateModal from "./TemplateModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import FileUploadModal from "./FileUploadModal";

const Templates = () => {
  const { categoryId } = useParams();
  const {
    templates,
    category,
    loading,
    error,
    refreshTrigger,
    setRefreshTrigger,
  } = useTemplates(categoryId);
  const {
    showModal,
    setShowModal,
    isEditing,
    setIsEditing,
    selectedTemplate,
    setSelectedTemplate,
    formSubmitting,
    formError,
    handleSubmit,
    handleEdit,
    showDeleteModal,
    setShowDeleteModal,
    deleteError,
    handleDelete,
    showUploadModal,
    setShowUploadModal,
    isUploading,
    uploadError,
    handleFileUpload,
    handleUploadFile,
  } = useTemplateActions(categoryId, setRefreshTrigger);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG");
  };

  if (loading && templates.length === 0) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
        <PulseLoader color="#05755c" size={15} />
      </div>
    );
  }

  return (
    <div className="px-3 mt-5">
      <title>Emailer Templates</title>
      <meta name="description" content="Emailer Templates" />
        <div className="d-flex justify-content-between align-items-center mb-4 mt-5 pt-5">
          <div>
            <h2 className="fs-3">نماذج قسم : {category?.name}</h2>
            <p className="text-muted fs-5">{category?.description}</p>
          </div>
          <div className="d-flex flex-column flex-sm-row gap-2">
            <Link to="/dashboard" className="btn btn-outline-secondary small-text">
              العودة للاقسام
              <i className="fas fa-arrow-left me-2"></i>
            </Link>
            <button
              className="btn primary-btn small-text"
              onClick={() => {
                setIsEditing(false);
                setSelectedTemplate(null);
                setShowModal(true);
              }}
            >
              إضافة نموذج جديد
              <i className="fas fa-plus me-2"></i>
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger text-center mb-4">
            {error}
            <button
              className="btn btn-sm btn-outline-danger ms-3"
              onClick={() => setRefreshTrigger((prev) => prev + 1)}
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {templates.length === 0 && !loading ? (
          <div className="alert alert-info text-center">
            لا توجد قوالب متاحة في هذه الفئة
          </div>
        ) : (
          <TemplateTable
            templates={templates}
            loading={loading}
            formatDate={formatDate}
            onEdit={handleEdit}
            onDelete={(template) => {
              setSelectedTemplate(template);
              setShowDeleteModal(true);
            }}
            onUploadFile={handleUploadFile}
          />
        )}

        {/* Template Modal */}
        <TemplateModal
          show={showModal}
          isEditing={isEditing}
          selectedTemplate={selectedTemplate}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          formSubmitting={formSubmitting}
          error={formError}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          show={showDeleteModal}
          template={selectedTemplate}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          isSubmitting={formSubmitting}
          error={deleteError}
        />

        {/* File Upload Modal */}
        <FileUploadModal
          show={showUploadModal}
          template={selectedTemplate}
          onClose={() => setShowUploadModal(false)}
          onUpload={handleFileUpload}
          isUploading={isUploading}
          error={uploadError}
        />
        {/* Modal backdrop */}
        {(showModal || showDeleteModal || showUploadModal) && (
          <div className="modal-backdrop fade show"></div>
        )}
    </div>
  );
};

export default Templates;
