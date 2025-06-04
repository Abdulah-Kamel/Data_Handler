import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import contentTrackerService from "../../../services/contentTrackerService";
import ExternalTasksTable from "./ExternalTasksTable";
import { useAuth } from "../../../Context/AuthContext";

const ExternalTasksPage = () => {
  const [externalTasks, setExternalTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const fetchExternalTasks = async () => {
    setLoading(true);
    try {
      const { data, error } = await contentTrackerService.getExternalTasks(
        accessToken
      );
      if (data) {
        setExternalTasks(data);
        setError(null);
      } else {
        setError(error);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "فشل في تحميل التتبع الجارى");
      console.error("Error fetching external tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExternalTasks();
  }, [accessToken]);

  const handleRefresh = () => {
    fetchExternalTasks();
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
    <div className="px-3 mt-5">
      <title>Data Handler - التتبع الجارى</title>
      <meta name="description" content="Data Handler - التتبع الجارى" />
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="m-0">التتبع الجارى</h2>
        <div className="d-flex gap-3">
          <button
            className="btn d-flex align-items-center primary-btn-outline"
            onClick={handleRefresh}
            disabled={loading}
          >
            تحديث
            <i className="fas fa-sync-alt me-2"></i>
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger text-center my-4">
          {error}
          <button
            className="btn btn-sm btn-outline-danger me-3"
            onClick={handleRefresh}
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      <ExternalTasksTable
        tasks={externalTasks}
        loading={loading}
        error={error}
        onRefresh={handleRefresh}
      />
    </div>
  );
};

export default ExternalTasksPage;
