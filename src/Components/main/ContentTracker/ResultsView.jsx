import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {PulseLoader} from "react-spinners";
import {useAuth} from "../../../Context/AuthContext";
import contentTrackerService from "../../../services/contentTrackerService";
import ConfirmationModal from "../../common/ConfirmationModal";

const ResultsView = () => {
    const {t} = useTranslation();
    const {taskId} = useParams();
    const {accessToken} = useAuth();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedResult, setSelectedResult] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [downloadLink, setDownloadLink] = useState(null);
    const [generatingLink, setGeneratingLink] = useState(false);
    const [generationError, setGenerationError] = useState(null);
    const [updating, setUpdating] = useState(false);

    const fetchTaskDetails = async () => {
        try {
            const {data, error: apiError} = await contentTrackerService.getAllTasks(accessToken);
            if (data) {
                const foundTask = data.find(t => t.id === taskId);
                if (foundTask) {
                    setTask(foundTask);
                    setError(null);
                } else {
                    setError(t('content_tracker.results_view.task_not_found_error'));
                    setTask(null);
                }
            } else {
                setError(apiError || t('content_tracker.results_view.fetch_error'));
                setTask(null);
            }
        } catch (err) {
            setError(t('content_tracker.results_view.fetch_error'));
            setTask(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!accessToken) return;
        setLoading(true);
        fetchTaskDetails();
    }, [accessToken, taskId, t]);
    useEffect(() => {
        if (!accessToken) return;
        fetchTaskDetails();
    }, [refreshTrigger]);

    const handleDeleteResult = (result) => {
        setSelectedResult(result);
        setShowDeleteModal(true);
    };

    const confirmDeleteResult = async () => {
        if (!selectedResult) return;

        setDeleting(true);
        try {
            await contentTrackerService.deleteResult(accessToken, taskId, selectedResult.id);
            setRefreshTrigger(prev => prev + 1);
            setShowDeleteModal(false);
        } catch (error) {
            console.error("Error deleting result:", error);
            setError(t('content_tracker.results_view.delete_error'));
        } finally {
            setDeleting(false);
            setSelectedResult(null);
        }
    };

    const handleGenerateLink = async () => {
        setGeneratingLink(true);
        setGenerationError(null);
        try {
            const {data, error} = await contentTrackerService.getDownloadLink(accessToken, taskId);
            if (data && data.download_link) {
                setDownloadLink(data.download_link);
            } else {
                setGenerationError(error || t('content_tracker.results_view.generate_link_error'));
            }
        } catch (err) {
            setGenerationError(t('content_tracker.results_view.generate_link_error'));
        } finally {
            setGeneratingLink(false);
        }
    };

    const handleUpdateTask = async () => {
        setUpdating(true);
        try {
            const {data, error} = await contentTrackerService.updateTask(accessToken, taskId);
            console.log(data);

            if (data && data.status === 200) {
                console.log(data);
                console.log(updating);
                setRefreshTrigger(prev => prev + 1);
            }
        } catch (err) {
            setError(t('content_tracker.results_view.update_error'));
            setUpdating(false);
        } finally {
            setUpdating(false);
        }
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{height: "70vh"}}>
                <PulseLoader color="#05755c" size={15}/>
            </div>
        );
    }

    if (error) {
        return (
            <div className="px-3 mt-5">
                <div className="alert alert-danger text-center my-4">
                    {error}
                    <button
                        className="btn btn-sm btn-outline-danger me-3"
                        onClick={() => setRefreshTrigger(prev => prev + 1)}
                    >
                        {t('content_tracker.results_view.retry_button')}
                    </button>
                </div>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="px-3 mt-5">
                <div className="alert alert-warning text-center my-4">
                    {t('content_tracker.results_view.task_not_found')}
                    <Link to="/dashboard/content-tracker" className="btn btn-sm btn-outline-primary ms-3">
                        {t('content_tracker.results_view.back_to_list_button')}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="px-3 mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="m-0">{t('content_tracker.results_view.search_results_title')}</h2>
                <div className="d-flex align-items-center gap-2">
                    <button className="btn primary-btn" onClick={handleUpdateTask} disabled={updating}>
                        {t('content_tracker.results_view.update_task_button')}
                        {updating === true ? (
                                <span className="spinner-border spinner-border-sm me-2" role="status"
                                      aria-hidden="true"></span>
                            ) :
                            <i className="fas fa-sync me-2"></i>
                        }
                    </button>
                    {!downloadLink ? (
                        <button
                            className="btn primary-btn"
                            onClick={handleGenerateLink}
                            disabled={generatingLink}
                        >
                            {generatingLink ? (
                                <>
                                    {t('content_tracker.results_view.generating_file_button')}
                                    <span className="spinner-border spinner-border-sm me-2" role="status"
                                          aria-hidden="true"></span>
                                </>
                            ) : (
                                <>
                                    {t('content_tracker.results_view.create_file_button')}
                                    <i className="fas fa-file-alt me-2"></i>
                                </>
                            )}
                        </button>
                    ) : (
                        <a
                            href={downloadLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-success d-flex align-items-center"
                        >
                            {t('content_tracker.results_view.download_file_button')}
                            <i className="fas fa-download me-2"></i>
                        </a>
                    )}

                    <Link
                        to="/dashboard/content-tracker"
                        className="btn btn-outline-secondary d-flex align-items-center"
                    >
                        {t('content_tracker.results_view.back_to_list_button')}
                        <i className="fas fa-arrow-left me-2"></i>
                    </Link>
                </div>
            </div>
            {generationError && (
                <div className="alert alert-danger text-center my-2">
                    {generationError}
                </div>
            )}
            <h2 className="m-0 mb-3">{task.title}</h2>

            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">{t('content_tracker.results_view.original_article_card_title')}</h5>
                    <div className="mb-3">
                        <strong>{t('content_tracker.results_view.original_article_title_label')}</strong> {task.title}
                    </div>
                    <div>
                        <strong>{t('content_tracker.results_view.original_article_url_label')}</strong>
                        <a href={task.url} target="_blank" rel="noopener noreferrer"
                           className="me-3 text-break btn primary-btn btn-sm">
                            {t('content_tracker.results_view.link_button')}
                            <i className="fas fa-external-link-alt me-1"></i>
                        </a>
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <h3>{t('content_tracker.results_view.copied_content_sites_title')} <span
                    className="badge primary-bg">{task.results?.length || 0}</span></h3>
            </div>

            {task.results && task.results.length > 0 ? (
                <div className="row g-4">
                    {task.results.map((result, index) => (
                        <div key={index} className="col-md-6">
                            <div className="card h-100 shadow-sm">
                                <div className="position-relative">
                                    <img
                                        src={result.image_url}
                                        className="card-img-top"
                                        alt={result.title}
                                        style={{maxHeight: "400px", objectFit: "cover"}}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = `https://via.placeholder.com/300x200?text=${t('content_tracker.results_view.image_not_available')}`;
                                        }}
                                    />
                                    <div
                                        className={`position-absolute top-0 end-0 m-2 badge ${result.same_event === 'نعم' ? 'bg-success' : 'bg-warning'}`}
                                    >
                                        {result.same_event === 'نعم' ? t('content_tracker.results_view.same_content_badge') : t('content_tracker.results_view.different_content_badge')}
                                    </div>
                                </div>
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{result.title}</h5>
                                    <p className="card-text text-muted mb-3">{result.snippet}</p>
                                    <div className="d-flex justify-content-between align-items-center mt-auto">
                                        <a
                                            href={result.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-sm btn-outline-primary"
                                        >
                                            {t('content_tracker.results_view.visit_site_button')}
                                            <i className="fas fa-external-link-alt me-1"></i>
                                        </a>
                                        <button
                                            onClick={() => handleDeleteResult(result)}
                                            className="btn btn-sm btn-outline-danger"
                                            disabled={deleting}
                                        >
                                            {t('content_tracker.results_view.delete_button')}
                                            <i className="fas fa-trash me-1"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="alert alert-info text-center">
                    {t('content_tracker.results_view.no_results_message')}
                </div>
            )}

            <ConfirmationModal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                onConfirm={confirmDeleteResult}
                title={t('content_tracker.results_view.confirm_delete_title')}
                message={t('content_tracker.results_view.confirm_delete_message', {title: selectedResult?.title || t('content_tracker.results_view.this_result')})}
                confirmText={deleting ? t('content_tracker.results_view.deleting_button') : t('content_tracker.results_view.delete_button')}
                cancelText={t('content_tracker.results_view.cancel_button')}
                loading={deleting}
                confirmVariant="danger"
            />
        </div>
    );
};

export default ResultsView;
