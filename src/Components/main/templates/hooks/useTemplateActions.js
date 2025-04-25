import { useState } from "react";
import templateService from "../../../../services/templateService";

export const useTemplateActions = (categoryId, setRefreshTrigger) => {
  // Template form state
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  
  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  
  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const user = JSON.parse(sessionStorage.getItem("User"));
  const token = user.access;

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setFormSubmitting(true);
    setFormError(null);

    try {
      // Create template data with just name, description, and category
      const templateData = {
        name: values.name,
        description: values.description,
        category: categoryId,
      };

      let result;

      if (isEditing && selectedTemplate) {
        result = await templateService.update(
          token,
          selectedTemplate.id,
          templateData
        );
      } else {
        result = await templateService.create(token, templateData);
      }

      if (result.error) {
        setFormError(result.error);
        return;
      }

      // Reset form and close modal
      resetForm();
      setShowModal(false);
      setIsEditing(false);
      setSelectedTemplate(null);

      // Trigger refresh
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to save template:", err);
      setFormError(
        isEditing
          ? "فشل في تعديل القالب. يرجى المحاولة مرة أخرى."
          : "فشل في إضافة القالب. يرجى المحاولة مرة أخرى."
      );
    } finally {
      setFormSubmitting(false);
      setSubmitting(false);
    }
  };

  const handleEdit = (template) => {
    setSelectedTemplate(template);
    setIsEditing(true);
    setFormError(null);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!selectedTemplate) return;

    setFormSubmitting(true);
    setDeleteError(null);

    try {
      const result = await templateService.delete(token, selectedTemplate.id);

      if (result.error) {
        setDeleteError(result.error);
        return;
      }

      setShowDeleteModal(false);
      setSelectedTemplate(null);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to delete template:", err);
      setDeleteError("فشل في حذف القالب. يرجى المحاولة مرة أخرى.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleFileUpload = async (templateId, file) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const result = await templateService.uploadWordFile(
        token,
        templateId,
        file
      );

      if (result.error) {
        setUploadError(result.error);
        return;
      }

      // Close modal and refresh data
      setShowUploadModal(false);
      setSelectedTemplate(null);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to upload file:", err);
      setUploadError("فشل في رفع الملف. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadFile = (template) => {
    setSelectedTemplate(template);
    setUploadError(null);
    setShowUploadModal(true);
  };

  return {
    // Template form state
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
    
    // Delete modal state
    showDeleteModal,
    setShowDeleteModal,
    deleteError,
    handleDelete,
    
    // Upload modal state
    showUploadModal,
    setShowUploadModal,
    isUploading,
    uploadError,
    handleFileUpload,
    handleUploadFile
  };
};