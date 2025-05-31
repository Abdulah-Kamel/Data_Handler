import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import contentTrackerService from '../../../services/contentTrackerService';
import TasksTable from './TasksTable';
import ExternalTasksTable from './ExternalTasksTable';
import TaskModal from './forms/TaskModal';
import ConfirmationModal from '../../common/ConfirmationModal';
import { useAuth } from '../../../Context/AuthContext';

const ContentTracker = () => {
  const [tasks, setTasks] = useState([]);
  const [externalTasks, setExternalTasks] = useState([]);
  const [showExternalTasks, setShowExternalTasks] = useState(false);
  const [loading, setLoading] = useState(true);
  const [externalLoading, setExternalLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [modalMode, setModalMode] = useState('create');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const { data, error } = await contentTrackerService.getAllTasks(accessToken);
      if (data) {
        setTasks(data);
        setError(null);
      } else {
        setError(error);
      }
      setLoading(false);
    };

    fetchTasks();
  }, [accessToken, refreshTrigger]);

  const handleTaskUpdate = (updatedData) => {
    if (updatedData) {
      setTasks(updatedData);
    }
  };

  const fetchExternalTasks = async () => {
    setExternalLoading(true);
    try {
      const { data, error } = await contentTrackerService.getExternalTasks(accessToken);
      if (data) {
        setExternalTasks(data);
        setError(null);
      } else {
        setError(error);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'فشل في تحميل التتبع الجارى');
      console.error('Error fetching external tasks:', err);
    } finally {
      setExternalLoading(false);
    }
  };

  const handleRefresh = () => {
    if (showExternalTasks) {
      fetchExternalTasks();
    } else {
      setRefreshTrigger(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (showExternalTasks) {
      fetchExternalTasks();
    }
  }, [showExternalTasks]);

  const handleShowModal = (mode, task = null) => {
    setModalMode(mode);
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleShowResults = (task) => {
    navigate(`/dashboard/content-tracker/results/${task.id}`);
  };

  const handleModalSubmit = async (values) => {
    setModalLoading(true);
    try {
      if (modalMode === 'edit') {
        await contentTrackerService.updateTask(accessToken, selectedTask.id, values);
      } else if (modalMode === 'create') {
        await contentTrackerService.createTask(accessToken, values);
      }
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
      setError("حدث خطأ أثناء حذف المهمة");
    } finally {
      setDeleteLoading(false);
      setTaskToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
        <PulseLoader color="#05755c" size={15} />
      </div>
    );
  }

  return (
    <div className="px-3 mt-5">
      <title>Data Handler - تتبع المحتوى</title>
      <meta name="description" content="Data Handler - تتبع المحتوى" />
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="m-0">تتبع المحتوى</h2>
        <div className="d-flex gap-3">
          <button
            className="btn d-flex align-items-center primary-btn-outline"
            onClick={() => setShowExternalTasks(prev => !prev)}
          >
            {showExternalTasks ? 'إخفاء التتبع الجارى' : 'عرض التتبع الجارى'}
          </button>
          <button
            className="btn d-flex align-items-center primary-btn"
            onClick={() => handleShowModal('create')}
          >
            إضافة مهمة جديدة
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
            إعادة المحاولة
          </button>
        </div>
      )}

      {showExternalTasks ? (
        <ExternalTasksTable
          tasks={externalTasks}
          loading={externalLoading}
          error={error}
          onRefresh={fetchExternalTasks}
        />
      ) : tasks.length === 0 && !loading ? (
        <div className="alert alert-info text-center">
          لا توجد مهام تتبع حالياً
        </div>
      ) : (
        <TasksTable
          tasks={tasks}
          loading={loading}
          onUpdate={handleTaskUpdate}
          handleRefresh={handleRefresh}
          onDelete={handleDeleteTask}
          onEdit={(task) => handleShowModal('edit', task)}
          handleShowResults={handleShowResults}
        />
      )}
      
      <TaskModal
        show={showModal}
        onHide={() => setShowModal(false)}
        mode={modalMode}
        task={selectedTask}
        onSubmit={handleModalSubmit}
        loading={modalLoading}
      />
      
      <ConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteTask}
        title="تأكيد حذف المهمة"
        message={`هل أنت متأكد من حذف المهمة "${taskToDelete?.title || 'هذه'}"؟`}
        confirmText={deleteLoading ? 'جاري الحذف...' : 'حذف'}
        loading={deleteLoading}
        confirmVariant="danger"
      />
    </div>
  );
};

export default ContentTracker;
