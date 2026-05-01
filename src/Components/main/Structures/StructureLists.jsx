import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import DataTable from "react-data-table-component";
import structureService from "../../../services/structureService";
import { useAuth } from "../../../Context/AuthContext";
import ListModal from "./ListModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import SearchInput from "../../common/SearchInput";

const StructureLists = () => {
  const { t, i18n } = useTranslation();
  const { structureId } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const [structureName, setStructureName] = useState("");
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const fetchLists = async () => {
    const { data, error } = await structureService.getLists(
      accessToken,
      structureId,
    );
    if (data) {
      setLists(Array.isArray(data) ? data : data.lists || []);
      if (data.name) setStructureName(data.name);
      setError(null);
    } else {
      setError(error || t("structures.lists.errors.fetch"));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!accessToken || !structureId) return;
    setLoading(true);
    fetchLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, structureId, refreshTrigger]);

  const handleSearch = async () => {
    setLoading(true);
    const { data, error } = await structureService.searchLists(
      accessToken,
      structureId,
      searchTerm,
    );
    if (data) {
      setLists(Array.isArray(data) ? data : data.lists || []);
      setError(null);
    } else {
      setError(error);
    }
    setLoading(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language);
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setFormSubmitting(true);
    setFormError(null);
    try {
      let result;
      if (isEditing && selectedList) {
        result = await structureService.updateList(
          accessToken,
          structureId,
          selectedList.id,
          values,
        );
      } else {
        result = await structureService.createList(
          accessToken,
          structureId,
          values,
        );
      }
      if (result.error) {
        setFormError(result.error);
        return;
      }
      resetForm();
      setShowModal(false);
      setIsEditing(false);
      setSelectedList(null);
      setRefreshTrigger((prev) => prev + 1);
    } catch {
      setFormError(t("structures.lists.errors.save"));
    } finally {
      setFormSubmitting(false);
      setSubmitting(false);
    }
  };

  const handleEdit = (list) => {
    setSelectedList(list);
    setIsEditing(true);
    setFormError(null);
    setShowModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedList) return;
    setFormSubmitting(true);
    setDeleteError(null);
    try {
      const result = await structureService.deleteList(
        accessToken,
        structureId,
        selectedList.id,
      );
      if (result.error) {
        setDeleteError(result.error);
        return;
      }
      setShowDeleteModal(false);
      setSelectedList(null);
      setRefreshTrigger((prev) => prev + 1);
    } catch {
      setDeleteError(t("structures.lists.errors.delete"));
    } finally {
      setFormSubmitting(false);
    }
  };

  const columns = [
    {
      name: "#",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "70px",
    },
    {
      name: t("structures.lists.table.name"),
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: t("structures.lists.table.status"),
      selector: (row) => row?.status,
      sortable: true,
      cell: (row) => (
        <span
          className={`text-white p-2 badge text-bg-${row?.status === "completed" ? "success" : "warning"}`}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: t("structures.lists.table.records_count"),
      selector: (row) => row.rows?.total_rows_input || 0,
      sortable: true,
      width: "150px",
      cell: (row) => (
        <span className="badge primary-bg">{row.total_rows_input || 0}</span>
      ),
    },
    {
      name: t("structures.lists.table.creation_date"),
      selector: (row) => row.created_at,
      sortable: true,
      width: "180px",
      cell: (row) => formatDate(row.created_at),
    },
    {
      name: t("structures.lists.table.actions"),
      cell: (row) => (
        <div className="d-flex gap-2 justify-content-center">
          <button
            className="btn btn-outline-primary btn-sm rounded-pill d-flex align-items-center"
            onClick={() =>
              navigate(`/dashboard/structures/${structureId}/lists/${row.id}`)
            }
          >
            {t("structures.lists.table.view_data")}
            <i className="fas fa-eye me-1"></i>
          </button>
          <button
            className="btn btn-outline-success btn-sm rounded-pill d-flex align-items-center"
            onClick={() => handleEdit(row)}
          >
            {t("structures.lists.table.edit")}
            <i className="fas fa-edit me-1"></i>
          </button>
          <button
            className="btn btn-outline-danger btn-sm rounded-pill d-flex align-items-center"
            onClick={() => {
              setSelectedList(row);
              setDeleteError(null);
              setShowDeleteModal(true);
            }}
          >
            {t("structures.lists.table.delete")}
            <i className="fas fa-trash me-1"></i>
          </button>
        </div>
      ),
      width: "400px",
      ignoreRowClick: true,
    },
  ];

  if (loading && lists.length === 0) {
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
    <div className="container-fluid py-4 position-relative">
      <title>{t("structures.lists.page_title")}</title>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="card-title m-0">
            {structureName
              ? t("structures.lists.main_title", { name: structureName })
              : t("structures.lists.main_title_default")}
          </h2>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <button
            className="btn btn-outline-secondary small-text d-flex align-items-center"
            onClick={() => navigate("/dashboard/structures")}
          >
            {t("structures.lists.back_button")}
            <i className="fas fa-arrow-left me-1"></i>
          </button>
          <button
            className="btn primary-btn-outline small-text d-flex align-items-center"
            onClick={() => {
              setIsEditing(false);
              setSelectedList(null);
              setFormError(null);
              setShowModal(true);
            }}
          >
            {t("structures.lists.add_new")}
            <i className="fas fa-plus me-1"></i>
          </button>
        </div>
      </div>

      <div className="mb-3">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          onSearch={handleSearch}
          placeholder={t("structures.lists.search_placeholder")}
        />
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

      <div className="position-relative mt-3">
        <DataTable
          columns={columns}
          data={lists}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 30]}
          fixedHeader
          highlightOnHover
          noDataComponent={
            <div className="text-center py-4 text-muted">
              {t("structures.lists.no_lists")}
            </div>
          }
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
                fontSize: "18px",
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
      </div>

      <ListModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setIsEditing(false);
          setSelectedList(null);
          setFormError(null);
        }}
        onSubmit={handleSubmit}
        list={selectedList}
        isEditing={isEditing}
        formSubmitting={formSubmitting}
        error={formError}
      />

      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false);
          setSelectedList(null);
          setDeleteError(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={selectedList?.name}
        isSubmitting={formSubmitting}
        error={deleteError}
      />

      {(showModal || showDeleteModal) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default StructureLists;
