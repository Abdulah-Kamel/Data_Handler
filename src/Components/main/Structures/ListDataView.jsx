import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import DataTable from "react-data-table-component";
import structureService from "../../../services/structureService";
import { useAuth } from "../../../Context/AuthContext";
import ExcelUploadModal from "./ExcelUploadModal";

const ListDataView = () => {
  const { t } = useTranslation();
  const { structureId, listId } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const [listData, setListData] = useState(null);
  const [listName, setListName] = useState("");
  const [rows, setRows] = useState([]);
  const [allKeys, setAllKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mission states
  const [missionLoading, setMissionLoading] = useState(false);
  const [missionSuccess, setMissionSuccess] = useState(null);
  const [missionError, setMissionError] = useState(null);
  const [missionOptions, setMissionOptions] = useState({
    add_language: true,
    add_last_updated: true,
    remove_duplicates: true,
  });

  // Export states
  const [exportLoading, setExportLoading] = useState(null);

  // Excel upload
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await structureService.getLists(
      accessToken,
      structureId,
    );
    if (data) {
      // Find the specific list within structure data
      const allLists = Array.isArray(data) ? data : data.lists || [];
      const currentList = allLists.find((l) => String(l.id) === String(listId));
      console.log("currentList", currentList);

      if (currentList) {
        setListName(currentList.original_filename);
        const listRows = currentList.rows || [];
        setRows(listRows);
        setListData(currentList);

        // Extract all keys from row data
        const keySet = new Set();
        listRows.forEach((row) => {
          if (row.data) {
            Object.keys(row.data).forEach((key) => keySet.add(key));
          }
        });
        setAllKeys(Array.from(keySet));
      }
      setError(null);
    } else {
      setError(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!accessToken || !structureId || !listId) return;
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, structureId, listId]);

  const handleStartMission = async () => {
    setMissionLoading(true);
    setMissionError(null);
    setMissionSuccess(null);
    const { error } = await structureService.startMission(
      accessToken,
      structureId,
      listId,
      missionOptions,
    );
    if (error) {
      setMissionError(error);
    } else {
      setMissionSuccess(t("structures.data_view.mission_success"));
      // Refresh data after mission
      setTimeout(() => fetchData(), 1500);
    }
    setMissionLoading(false);
  };

  const handleExport = async (type) => {
    setExportLoading(type);
    try {
      const exportFn =
        type === "pdf"
          ? structureService.exportPdf
          : structureService.exportExcel;
      const { data, error } = await exportFn(accessToken, structureId, listId);
      if (error) {
        setError(error);
      } else if (data) {
        // Download the blob
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `${listName || "export"}.${type === "pdf" ? "pdf" : "xlsx"}`,
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch {
      setError(t("structures.data_view.export_error"));
    }
    setExportLoading(null);
  };

  const handleExcelUpload = async (file) => {
    if (!file) return;
    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      await structureService.uploadExcel(accessToken, structureId, formData);
      setShowExcelModal(false);
      fetchData();
    } catch {
      // handled
    } finally {
      setUploadLoading(false);
    }
  };

  const generateColumns = () => {
    if (allKeys.length === 0) return [];

    return [
      {
        name: "#",
        selector: (row, index) => index + 1,
        width: "70px",
        sortable: true,
      },
      ...allKeys.map((key) => ({
        name: key,
        selector: (row) =>
          row.data && row.data[key] !== undefined ? row.data[key] : "",
        sortable: true,
      })),
    ];
  };

  if (loading) {
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
    <div className="container-fluid py-4">
      <title>{t("structures.data_view.page_title")}</title>

      {/* Header with back + title */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3 className="m-0 fs-4">
            {t("structures.data_view.title", {
              list: listName,
            })}
          </h3>
        </div>
        <button
          className="btn btn-outline-secondary small-text d-flex align-items-center"
          onClick={() => navigate(`/dashboard/structures/${structureId}/lists`)}
        >
          {t("structures.data_view.back_button")}
          <i className="fas fa-arrow-left me-1"></i>
        </button>
      </div>

      {/* Info bar */}
      <div className="card mb-4 border-0 shadow-sm">
        <div className="card-body d-flex justify-content-between">
          <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between">
            {/* Action buttons */}
            <div className="d-flex flex-wrap gap-2">
              <button
                className="btn primary-btn-outline btn-sm d-flex align-items-center"
                onClick={() => setShowExcelModal(true)}
              >
                {t("structures.data_view.upload_excel")}
                <i className="fas fa-file-upload me-1"></i>
              </button>

              <button
                className="btn primary-btn btn-sm d-flex align-items-center"
                onClick={handleStartMission}
                disabled={missionLoading}
              >
                {missionLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-1"
                      role="status"
                    ></span>
                    {t("structures.data_view.mission_loading")}
                  </>
                ) : (
                  <>
                    {t("structures.data_view.start_mission")}
                    <i className="fas fa-play me-1"></i>
                  </>
                )}
              </button>

              <button
                className="btn btn-outline-danger btn-sm d-flex align-items-center"
                onClick={() => handleExport("pdf")}
                disabled={exportLoading === "pdf"}
              >
                {t("structures.data_view.export_pdf")}
                {exportLoading === "pdf" ? (
                  <span className="spinner-border spinner-border-sm me-1"></span>
                ) : (
                  <i className="fas fa-file-pdf me-1"></i>
                )}
              </button>

              <button
                className="btn btn-outline-success btn-sm d-flex align-items-center"
                onClick={() => handleExport("excel")}
                disabled={exportLoading === "excel"}
              >
                {t("structures.data_view.export_excel")}
                {exportLoading === "excel" ? (
                  <span className="spinner-border spinner-border-sm me-1"></span>
                ) : (
                  <i className="fas fa-file-excel me-1"></i>
                )}
              </button>
            </div>
          </div>

          {/* Mission options */}
          <div className="d-flex gap-4 mt-3 flex-wrap">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="addLanguage"
                checked={missionOptions.add_language}
                onChange={(e) =>
                  setMissionOptions((prev) => ({
                    ...prev,
                    add_language: e.target.checked,
                  }))
                }
              />
              <label className="form-check-label small" htmlFor="addLanguage">
                {t("structures.data_view.option_add_language")}
              </label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="addLastUpdated"
                checked={missionOptions.add_last_updated}
                onChange={(e) =>
                  setMissionOptions((prev) => ({
                    ...prev,
                    add_last_updated: e.target.checked,
                  }))
                }
              />
              <label
                className="form-check-label small"
                htmlFor="addLastUpdated"
              >
                {t("structures.data_view.option_add_last_updated")}
              </label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="removeDuplicates"
                checked={missionOptions.remove_duplicates}
                onChange={(e) =>
                  setMissionOptions((prev) => ({
                    ...prev,
                    remove_duplicates: e.target.checked,
                  }))
                }
              />
              <label
                className="form-check-label small"
                htmlFor="removeDuplicates"
              >
                {t("structures.data_view.option_remove_duplicates")}
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {missionSuccess && (
        <div className="alert alert-success text-center">
          <i className="fas fa-check-circle me-2"></i>
          {missionSuccess}
        </div>
      )}
      {missionError && (
        <div className="alert alert-danger text-center">{missionError}</div>
      )}
      {error && <div className="alert alert-danger text-center">{error}</div>}

      {/* Data Table */}
      <DataTable
        columns={generateColumns()}
        data={rows}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 20, 30]}
        fixedHeader
        highlightOnHover
        noDataComponent={
          <div className="text-center py-5 text-muted">
            <i className="fas fa-inbox fa-3x mb-3 d-block"></i>
            {t("structures.data_view.no_data")}
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

      <ExcelUploadModal
        show={showExcelModal}
        onHide={() => setShowExcelModal(false)}
        onSubmit={handleExcelUpload}
        loading={uploadLoading}
        selectedStructureId={structureId}
      />

      {showExcelModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default ListDataView;
