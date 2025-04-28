import React, { useState, useEffect } from "react";
import { PulseLoader } from "react-spinners";
import categoryService from "../../../services/categoryService";
import CategoryTable from "./CategoryTable";
import CategoryModal from "./CategoryModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const user = JSON.parse(sessionStorage.getItem("User"));
  const token = user.access;

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const { data, error } = await categoryService.getAll(token);

      if (data) {
        setCategories(data);
        setError(null);
      } else {
        setError(error);
      }
      setLoading(false);
    };

    fetchCategories();
  }, [token, refreshTrigger]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG");
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setFormSubmitting(true);
    setFormError(null);
    try {
      let result;
      if (isEditing && selectedCategory) {
        result = await categoryService.update(
          token,
          selectedCategory.id,
          values
        );
      } else {
        result = await categoryService.create(token, values);
      }
      if (result.error) {
        setFormError(result.error);
        return;
      }
      // Reset form and close modal
      resetForm();
      setShowModal(false);
      setIsEditing(false);
      setSelectedCategory(null);

      // Trigger refresh
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to save category:", err);
      setFormError(
        isEditing
          ? "فشل في تعديل الفئة. يرجى المحاولة مرة أخرى."
          : "فشل في إضافة الفئة. يرجى المحاولة مرة أخرى."
      );
    } finally {
      setFormSubmitting(false);
      setSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsEditing(true);
    setFormError(null);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    setFormSubmitting(true);
    setDeleteError(null);
    try {
      const result = await categoryService.delete(token, selectedCategory.id);

      if (result.error) {
        // Don't throw a new Error, just set the error message directly
        setDeleteError(result.error);
        return;
      }
      setShowDeleteModal(false);
      setSelectedCategory(null);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to delete category:", err);
      setDeleteError("فشل في حذف الفئة. يرجى المحاولة مرة أخرى.");
    } finally {
      setFormSubmitting(false);
    }
  };
  if (loading && categories.length === 0) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
        <PulseLoader color="#0aad0a" size={15} />
      </div>
    );
  }
  return (
    <div className="px-3 mt-5">
      <title>Data Handler Categories</title>
      <meta name="description" content="Data Handler Categories" />

      <button
        className="btn btn-outline-success"
        onClick={() => {
          setIsEditing(false);
          setSelectedCategory(null);
          setFormError(null);
          setShowModal(true);
        }}
      >
        إضافة فئة جديدة
        <i className="fas fa-plus me-2"></i>
      </button>

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

      {categories.length === 0 && !loading ? (
        <div className="alert alert-info text-center">
          لا توجد فئات متاحة حالياً
        </div>
      ) : (
        <CategoryTable
          categories={categories}
          loading={loading}
          formatDate={formatDate}
          onEdit={handleEdit}
          onDelete={(category) => {
            setSelectedCategory(category);
            setDeleteError(null);
            setShowDeleteModal(true);
          }}
        />
      )}

      {/* Category Modal */}
      <CategoryModal
        show={showModal}
        isEditing={isEditing}
        selectedCategory={selectedCategory}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        formSubmitting={formSubmitting}
        error={formError}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        show={showDeleteModal}
        category={selectedCategory}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isSubmitting={formSubmitting}
        error={deleteError}
      />

      {/* Modal backdrop */}
      {(showModal || showDeleteModal) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};
export default Categories;
