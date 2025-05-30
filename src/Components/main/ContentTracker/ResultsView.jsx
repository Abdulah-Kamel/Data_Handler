import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { useAuth } from "../../../Context/AuthContext";
import contentTrackerService from "../../../services/contentTrackerService";

const ResultsView = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      setLoading(true);
      try {
        const { data, error } = await contentTrackerService.getAllTasks(accessToken);
        if (data) {
          const foundTask = data.find(t => t.id === taskId);
          if (foundTask) {
            setTask(foundTask);
            setError(null);
          } else {
            setError("لم يتم العثور على المهمة");
            setTask(null);
          }
        } else {
          setError(error || "حدث خطأ في جلب بيانات المهمة");
          setTask(null);
        }
      } catch (err) {
        setError("حدث خطأ في جلب بيانات المهمة");
        setTask(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [accessToken, taskId, refreshTrigger]);

  const handleDeleteResult = async (resultId) => {
    if (window.confirm("هل أنت متأكد من حذف هذه النتيجة؟")) {
      try {
        await contentTrackerService.deleteResult(accessToken, taskId, resultId);
        setRefreshTrigger(prev => prev + 1); // Refresh the data
      } catch (error) {
        console.error("Error deleting result:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
        <PulseLoader color="#05755c" size={15} />
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
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="px-3 mt-5">
        <div className="alert alert-warning text-center my-4">
          لم يتم العثور على المهمة
          <Link to="/dashboard/content-tracker" className="btn btn-sm btn-outline-primary ms-3">
            العودة إلى القائمة
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="m-0">نتائج البحث: </h2>
        <Link 
          to="/dashboard/content-tracker" 
          className="btn btn-outline-secondary d-flex align-items-center"
        >
          العودة للقائمة
          <i className="fas fa-arrow-left me-2"></i>
        </Link>
      </div>
      <h2 className="m-0 mb-3">{task.title}</h2>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">المقال الأصلي</h5>
          <div className="mb-3">
            <strong>العنوان:</strong> {task.title}
          </div>
          <div>
            <strong>الرابط الأصلي:</strong>
            <a href={task.url} target="_blank" rel="noopener noreferrer" className="me-3 text-break btn primary-btn btn-sm">
              الرابط 
              <i className="fas fa-external-link-alt me-1"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3>المواقع التي نقلت المحتوى <span className="badge primary-bg">{task.results?.length || 0}</span></h3>
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
                    style={{ maxHeight: "400px", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/300x200?text=صورة+غير+متوفرة";
                    }}
                  />
                  <div 
                    className={`position-absolute top-0 end-0 m-2 badge ${result.same_event === 'نعم' ? 'bg-success' : 'bg-warning'}`}
                  >
                    {result.same_event === 'نعم' ? 'نفس المحتوى' : 'محتوى مختلف'}
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
                      زيارة الموقع
                      <i className="fas fa-external-link-alt me-1"></i>
                    </a>
                    <button
                      onClick={() => handleDeleteResult(result.id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      حذف
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
          لا توجد نتائج لهذه المهمة
        </div>
      )}
    </div>
  );
};

export default ResultsView;
