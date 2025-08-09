import React, {useCallback, useEffect, useState} from "react";

import {useTranslation} from "react-i18next";
import DataTable from "react-data-table-component";
import {PulseLoader} from "react-spinners";
import {useAuth} from "../../../Context/AuthContext";
import excludedDomainsService from "../../../services/excludedDomainsService";

const ExcludedDomains = () => {
    const {t, i18n} = useTranslation();
    const {accessToken} = useAuth();
    const [domains, setDomains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [domainToDelete, setDomainToDelete] = useState(null);
    const [newDomain, setNewDomain] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alert, setAlert] = useState({show: false, message: '', type: ''});

    const fetchExcludedDomains = useCallback(async () => {
        if (!accessToken) return;
        setLoading(true);
        setError(null);
        const {data, error} = await excludedDomainsService.getExcludedDomains(accessToken);
        setLoading(false);
        if (error) {
            setError(t("excluded_domains.fetch_error"));
        } else {
            setDomains(data);
        }
    }, [t, accessToken]);

    useEffect(() => {
        if (accessToken) {
            fetchExcludedDomains();
        }
    }, [fetchExcludedDomains, accessToken]);

    const handleAddModalClose = () => {
        setShowAddModal(false);
        setNewDomain("");
    };
    const handleAddModalShow = () => setShowAddModal(true);

    const handleDeleteModalClose = () => {
        setShowDeleteModal(false);
        setDomainToDelete(null);
    };
    const handleDeleteModalShow = (domain) => {
        setDomainToDelete(domain);
        setShowDeleteModal(true);
    };

    const handleAddDomain = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const {error} = await excludedDomainsService.addExcludedDomain(accessToken, {domain: newDomain});
        setIsSubmitting(false);
        if (error) {
            setAlert({show: true, message: t("excluded_domains.add_modal_error_message"), type: 'danger'});
        } else {
            setAlert({show: true, message: t("excluded_domains.add_modal_success_message"), type: 'success'});
            fetchExcludedDomains();
            handleAddModalClose();
        }
    };

    const handleDeleteDomain = async () => {
        if (!domainToDelete) return;
        setIsSubmitting(true);
        const {error} = await excludedDomainsService.deleteExcludedDomain(accessToken, domainToDelete.id);
        setIsSubmitting(false);
        if (error) {
            setAlert({show: true, message: t("excluded_domains.delete_modal_error_message"), type: 'danger'});
        } else {
            setAlert({show: true, message: t("excluded_domains.delete_modal_success_message"), type: 'success'});
            fetchExcludedDomains();
            handleDeleteModalClose();
        }
    };

    const columns = [
        {
            name: "#",
            selector: (row, index) => index + 1,
            sortable: true,
            width: "80px",
        },
        {
            name: t("excluded_domains.domain_name"),
            selector: (row) => row.domain,
            sortable: true,
        },
        {
            name: t("excluded_domains.actions"),
            cell: (row) => (
                <div className="d-flex justify-content-center">
                    <button
                        className="btn btn-outline-danger btn-sm rounded-pill"
                        onClick={() => handleDeleteModalShow(row)}
                    >
                        {t("excluded_domains.delete_button")}
                        <i className="fas fa-trash me-1"></i>
                    </button>
                </div>
            ),
            width: "150px",
        },
    ];

    return (
        <div className="container-fluid py-4" dir={i18n.dir()}>
            {alert.show && (
                <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                    {alert.message}
                    <button type="button" className="btn-close"
                            onClick={() => setAlert({show: false, message: '', type: ''})}></button>
                </div>
            )}
            <div className="row">
                <div className="col-12">
                    <div className=" mb-4">
                        <div className=" pb-0 d-flex justify-content-between align-items-center">
                            <h2>{t("excluded_domains.title")}</h2>
                            <button className="btn primary-btn" onClick={handleAddModalShow}>
                                {t("excluded_domains.add_button")}
                            </button>
                        </div>
                        <div className="px-0 pt-0 pb-2 mt-3">
                            {loading ? (
                                <div
                                    className="d-flex justify-content-center align-items-center"
                                    style={{height: "200px"}}
                                >
                                    <PulseLoader color="#05755c" size={15}/>
                                </div>
                            ) : error ? (
                                <div className="alert alert-danger text-center mx-4">
                                    {error}
                                    <button
                                        className="btn btn-sm btn-outline-danger ms-3"
                                        onClick={fetchExcludedDomains}
                                    >
                                        {t("excluded_domains.retry_button")}
                                    </button>
                                </div>
                            ) : (
                                <DataTable
                                    columns={columns}
                                    data={domains}
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
                                                marginTop: "20px",
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
                                                fontSize: "20px",
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
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Modal */}
            <div
                className={`modal fade ${showAddModal ? "show" : ""}`}
                style={{display: showAddModal ? "block" : "none"}}
                tabIndex="-1"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {t("excluded_domains.add_modal_title")}
                            </h5>
                            <button
                                type="button"
                                className="btn-close me-auto ms-0"
                                onClick={handleAddModalClose}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleAddDomain}>
                                <div className="mb-3 py-3">
                                    <label htmlFor="domainName" className="form-label">
                                        {t("excluded_domains.add_modal_domain_label")}
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="domainName"
                                        placeholder="example.com"
                                        value={newDomain}
                                        onChange={(e) => setNewDomain(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="d-flex justify-content-end">
                                    <button
                                        type="button"
                                        className="btn btn-secondary ms-2"
                                        onClick={handleAddModalClose}
                                    >
                                        {t("excluded_domains.add_modal_cancel_button")}
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn primary-btn"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting
                                            ? t("excluded_domains.loading")
                                            : t("excluded_domains.add_modal_save_button")}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            <div
                className={`modal fade ${showDeleteModal ? "show" : ""}`}
                style={{display: showDeleteModal ? "block" : "none"}}
                tabIndex="-1"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {t("excluded_domains.delete_modal_title")}
                            </h5>
                            <button
                                type="button"
                                className="btn-close me-auto ms-0"
                                onClick={handleDeleteModalClose}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <p>
                                {t("excluded_domains.delete_modal_message", {
                                    domain: domainToDelete?.domain,
                                })}
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleDeleteModalClose}
                            >
                                {t("excluded_domains.delete_modal_cancel_button")}
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={handleDeleteDomain}
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? t("excluded_domains.deleting_button")
                                    : t("excluded_domains.delete_modal_confirm_button")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {(showAddModal || showDeleteModal) && (
                <div className="modal-backdrop fade show"></div>
            )}
        </div>
    );
};

export default ExcludedDomains;
