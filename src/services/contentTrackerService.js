import axios from "axios";

const catchTheThiefBaseUrl = import.meta.env.VITE_CATCH_THE_THIEF_URL;

const contentTrackerService = {
  getAllTasks: async (token) => {
    try {
      const response = await axios.get(`${catchTheThiefBaseUrl}/get_the_thief/tasks-with-results/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { data: response.data, error: null };
    } catch (err) {
      return { 
        data: null, 
        error: "خطأ في جلب مهام تتبع المحتوى" 
      };
    }
  },

  createTask: async (token, taskData) => {
    try {
      const response = await axios.post(
        `${catchTheThiefBaseUrl}/get_the_thief/check-articles/`,
        taskData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { data: response.data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error.response?.data?.detail || "خطأ في إنشاء مهمة جديدة"
      };
    }
  },

  updateTask: async (token, taskId, taskData) => {
    try {
      const response = await axios.patch(
        `${catchTheThiefBaseUrl}/get_the_thief/tasks-with-results/${taskId}/`,
        taskData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { data: response.data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error.response?.data?.detail || "خطأ في تحديث المهمة"
      };
    }
  },

  deleteTask: async (token, taskId) => {
    try {
      await axios.delete(
        `${catchTheThiefBaseUrl}/get_the_thief/tasks-with-results/${taskId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { error: null };
    } catch (error) {
      return {
        error: error.response?.data?.detail || "خطأ في حذف المهمة"
      };
    }
  },

  deleteResult: async (token, taskId, resultId) => {
    try {
      await axios.delete(
        `${catchTheThiefBaseUrl}/get_the_thief/tasks-with-results/${taskId}/delete-result/${resultId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { error: null };
    } catch (error) {
      return {
        error: error.response?.data?.detail || "خطأ في حذف النتيجة"
      };
    }
  },

  getDownloadLink: async (token, taskId) => {
    try {
      const response = await axios.get(
        `${catchTheThiefBaseUrl}/get_the_thief/search-tasks/${taskId}/download-link/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { data: response.data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error.response?.data?.detail || "Error generating download link",
      };
    }
  },

  getExternalTasks: async (token) => {
    try {
      const response = await axios.get('https://catch-the-thief.onrender.com/get_the_thief/search-tasks/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { data: response.data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error.response?.data?.detail || 'فشل في جلب المهام الخارجية'
      };
    }
  }
};

export default contentTrackerService;
