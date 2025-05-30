import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import contentTrackerService from '../../../services/contentTrackerService';
import TasksTable from './TasksTable';
import TaskModal from './TaskModal';
import { useAuth } from '../../../Context/AuthContext';

const ContentTracker = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [modalMode, setModalMode] = useState('create');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
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

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

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
      if (modalMode === 'delete') {
        await contentTrackerService.deleteTask(accessToken, selectedTask.id);
      } else if (modalMode === 'edit') {
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
        <button
          className="btn d-flex align-items-center primary-btn-outline"
          onClick={() => handleShowModal('create')}
        >
          إضافة مهمة جديدة
          <i className="fas fa-plus me-2"></i>
        </button>
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

      {tasks.length === 0 && !loading ? (
        <div className="alert alert-info text-center">
          لا توجد مهام تتبع حالياً
        </div>
      ) : (
        <TasksTable
          tasks={tasks}
          loading={loading}
          onUpdate={handleTaskUpdate}
          handleRefresh={handleRefresh}
          handleShowModal={handleShowModal}
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
        handleRefresh={handleRefresh}
      />
    </div>
  );
};

export default ContentTracker;
