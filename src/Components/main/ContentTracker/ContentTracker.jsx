import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {PulseLoader} from 'react-spinners';
import contentTrackerService from '../../../services/contentTrackerService';
import TasksTable from "./TasksTable";
import TaskModal from './forms/TaskModal';
import ConfirmationModal from '../../common/ConfirmationModal';
import {useAuth} from '../../../Context/AuthContext';
import {useTranslation} from 'react-i18next';

const ContentTracker = () => {
    const {t} = useTranslation();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const navigate = useNavigate();
    const {accessToken} = useAuth();
    const fetchTasks = async () => {
        const {data, error} = await contentTrackerService.getAllTasks(accessToken);
        if (data) {
            setTasks(data);
            setError(null);
        } else {
            setError(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (!accessToken) return;
        setLoading(true);
        fetchTasks();
    }, [accessToken]);

    useEffect(() => {
        if (!accessToken) return;
        fetchTasks();
    }, [refreshTrigger]);

    const handleTaskUpdate = (updatedData) => {
        if (updatedData) {
            setTasks(updatedData);
        }
    };

    const handleRefresh = () => {
        setRefreshTrigger((prev) => prev + 1);
    };

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleShowResults = (task) => {
        navigate(`/dashboard/content-tracker/results/${task.id}`);
    };

    const handleModalSubmit = async (values) => {
        setModalLoading(true);
        try {
            await contentTrackerService.createTask(accessToken, values);
            handleRefresh();
            setShowModal(false);
        } catch (error) {
            console.error("Error in modal submit:", error);
        } finally {
            setModalLoading(false);
        }
    };

    const handleDeleteTask = (task) => {
        setTaskToDelete(task);
        setShowDeleteModal(true);
    };

    const confirmDeleteTask = async () => {
        if (!taskToDelete) return;

        setDeleteLoading(true);
        try {
            await contentTrackerService.deleteTask(accessToken, taskToDelete.id);
            handleRefresh();
            setShowDeleteModal(false);
        } catch (error) {
            console.error("Error deleting task:", error);
            setError(t('content_tracker.errors.delete_task'));
        } finally {
            setDeleteLoading(false);
            setTaskToDelete(null);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{height: "70vh"}}>
                <PulseLoader color="#05755c" size={15}/>
            </div>
        );
    }

    return (
        <div className="px-3 mt-5">
            <title>{t('content_tracker.page_title')}</title>
            <meta name="description" content={t('content_tracker.page_description')}/>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2 className="m-0">{t('content_tracker.main_title')}</h2>
                <div className="d-flex gap-3">
                    <button
                        className="btn d-flex align-items-center primary-btn"
                        onClick={handleShowModal}
                    >
                        {t('content_tracker.add_new_task_button')}
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
                        {t('content_tracker.retry_button')}
                    </button>
                </div>
            )}

            {tasks.length === 0 && !loading ? (
                <div className="alert alert-info text-center">
                    {t('content_tracker.no_tasks_message')}
                </div>
            ) : (
                <TasksTable
                    tasks={tasks}
                    loading={loading}
                    onUpdate={handleTaskUpdate}
                    handleRefresh={handleRefresh}
                    onDelete={handleDeleteTask}
                    handleShowResults={handleShowResults}
                />
            )}

            <TaskModal
                show={showModal}
                onHide={() => setShowModal(false)}
                onSubmit={handleModalSubmit}
                loading={modalLoading}
            />

            <ConfirmationModal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                onConfirm={confirmDeleteTask}
                title={t('content_tracker.delete_modal.title')}
                message={t('content_tracker.delete_modal.message', {title: taskToDelete?.title || t('content_tracker.delete_modal.this_task')})}
                confirmText={deleteLoading ? t('content_tracker.delete_modal.deleting_button') : t('content_tracker.delete_modal.delete_button')}
                loading={deleteLoading}
                confirmVariant="danger"
            />
        </div>
    );
};

export default ContentTracker;
