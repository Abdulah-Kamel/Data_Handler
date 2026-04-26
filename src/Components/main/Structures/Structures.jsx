import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";
import structureService from "../../../services/structureService";
import StructureGrid from "./StructureGrid";
import StructureModal from "./StructureModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import ExcelUploadModal from "./ExcelUploadModal";
import { useAuth } from "../../../Context/AuthContext";
import SearchInput from "../../common/SearchInput";

const Structures = () => {
  const { t } = useTranslation();
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { accessToken } = useAuth();

  const fetchStructures = async () => {
    const { data, error } = await structureService.getAll(accessToken);
    if (data) {
      setStructures(data);
      setError(null);
    } else {
      setError(error || t("structures.errors.fetch"));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!accessToken) return;
    setLoading(true);
    fetchStructures();
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    fetchStructures();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger, accessToken]);

  const handleSearch = async () => {
    setLoading(true);
    const { data, error } = await structureService.search(
      accessToken,
      searchTerm,
    );
    if (data) {
      setStructures(data);
      setError(null);
    } else {
      setError(error || t("structures.errors.fetch"));
    }
    setLoading(false);
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setFormSubmitting(true);
    setFormError(null);
    try {
      let result;
      if (isEditing && selectedStructure) {
        result = await structureService.update(
          accessToken,
          selectedStructure.id,
          values,
        );
      } else {
        result = await structureService.create(accessToken, values);
      }
      if (result.error) {
        setFormError(result.error);
        return;
      }
      resetForm();
      setShowModal(false);
      setIsEditing(false);
      setSelectedStructure(null);
      setRefreshTrigger((prev) => prev + 1);
    } catch {
      setFormError(
        isEditing
          ? t("structures.errors.update")
          : t("structures.errors.create"),
      );
    } finally {
      setFormSubmitting(false);
      setSubmitting(false);
    }
  };

  const handleEdit = (structure) => {
    setSelectedStructure(structure);
    setIsEditing(true);
    setFormError(null);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!selectedStructure) return;
    setFormSubmitting(true);
    setDeleteError(null);
    try {
      const result = await structureService.delete(
        accessToken,
        selectedStructure.id,
      );
      if (result.error) {
        setDeleteError(result.error);
        return;
      }
      setShowDeleteModal(false);
      setSelectedStructure(null);
      setRefreshTrigger((prev) => prev + 1);
    } catch {
      setDeleteError(t("structures.errors.delete"));
    } finally {
      setFormSubmitting(false);
    }
  };

  if (loading && structures.length === 0) {
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
    <div className="px-3 mt-5 position-relative">
      <title>{t("structures.page_title")}</title>
      <meta name="description" content={t("structures.page_description")} />

      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="fw-bold">{t("structures.main_title")}</h2>
        <p className="text-muted">{t("structures.subtitle")}</p>
      </div>

      <div className="d-flex category-header justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={handleSearch}
            placeholder={t("structures.search_placeholder")}
          />
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn d-flex align-items-center primary-btn-outline mt-4 mt-md-0"
            onClick={() => {
              setIsEditing(false);
              setSelectedStructure(null);
              setFormError(null);
              setShowModal(true);
            }}
          >
            {t("structures.add_new_structure")}
            <i className="fas fa-plus me-2"></i>
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger text-center my-4">
          {error}
          <button
            className="btn btn-sm btn-outline-danger me-3"
            onClick={() => setRefreshTrigger((prev) => prev + 1)}
          >
            {t("structures.retry_button")}
          </button>
        </div>
      )}

      {structures.length === 0 && !loading ? (
        <div className="alert alert-info text-center">
          {t("structures.no_structures")}
        </div>
      ) : (
        <StructureGrid
          structures={structures}
          loading={loading}
          onEdit={handleEdit}
          onDelete={(structure) => {
            setSelectedStructure(structure);
            setDeleteError(null);
            setShowDeleteModal(true);
          }}
        />
      )}

      <StructureModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setIsEditing(false);
          setSelectedStructure(null);
          setFormError(null);
        }}
        onSubmit={handleSubmit}
        structure={selectedStructure}
        isEditing={isEditing}
        formSubmitting={formSubmitting}
        error={formError}
      />

      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false);
          setSelectedStructure(null);
          setDeleteError(null);
        }}
        onConfirm={handleDelete}
        itemName={selectedStructure?.name}
        listsCount={selectedStructure?.lists?.length || 0}
        isSubmitting={formSubmitting}
        error={deleteError}
      />
      {(showModal || showDeleteModal) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default Structures;
