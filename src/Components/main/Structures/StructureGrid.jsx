import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { useTranslation } from "react-i18next";

const StructureGrid = ({
  structures,
  loading,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    console.log(structures);
  }, []);

  return (
    <div className="mt-3">
      {loading && (
        <div
          className="position-absolute bg-light top-0 end-0 bottom-0 start-0 d-flex justify-content-center align-items-center w-100"
          style={{ zIndex: 1 }}
        >
          <PulseLoader color="#05755c" size={15} />
        </div>
      )}

      <div className="row g-4 justify-content-evenly">
        {structures.map((structure) => (
          <div key={structure.id} className="col-12 col-md-6 col-lg-5">
            <div
              className="card h-100 shadow-sm hover-shadow border-0"
              style={{ transition: "all 0.3s ease" }}
            >
              <div className="card-body d-flex flex-column">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="card-title fw-bold mb-0">{structure.name}</h6>
                  <div className="badge primary-bg rounded-pill px-3 py-2">
                    {t("structures.lists_count")}:
                    <span className="fw-bold">
                      {" "}
                      {structure?.data_lists_count}
                    </span>
                  </div>
                </div>

                <hr className="my-3" />

                {/* Lists preview */}
                {structure.lists && structure.lists.length > 0 && (
                  <div className="mb-3">
                    {structure.lists.map((list) => (
                      <div
                        key={list.id}
                        className="d-flex align-items-center gap-2 mb-1"
                      >
                        <i className="fas fa-check-circle text-success small"></i>
                        <span className="small">{list.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="d-flex gap-2 flex-wrap justify-content-between mt-auto">
                  <Link
                    to={`/dashboard/structures/${structure.id}/lists`}
                    className="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center"
                    style={{ flex: "1" }}
                  >
                    {t("structures.view_lists")}
                    <i className="fas fa-eye me-1"></i>
                  </Link>
                  <button
                    className="btn btn-outline-success btn-sm d-flex align-items-center"
                    onClick={() => onEdit(structure)}
                    title={t("structures.edit")}
                  >
                    <i className="fas fa-edit"></i>
                  </button>

                  <button
                    className="btn btn-outline-danger btn-sm d-flex align-items-center"
                    onClick={() => onDelete(structure)}
                    title={t("structures.delete")}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StructureGrid;
