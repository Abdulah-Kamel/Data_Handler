import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

export const contentTrackerService = {
  getAllTasks: async (token) => {
    try {
      const response = await axios.get(`${baseUrl}/get_the_thief/tasks-with-results/`, {
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
        `${baseUrl}/get_the_thief/check-articles/`,
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
    console.log(taskData)
    try {
      const response = await axios.patch(
        `${baseUrl}/get_the_thief/tasks-with-results/${taskId}/`,
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
      const response = await axios.delete(`${baseUrl}/get_the_thief/tasks-with-results/${taskId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { error: null, data: response };
    } catch (error) {
      return {
        error: error.response?.data?.detail || "خطأ في حذف المهمة"
      };
    }
  },

  deleteResult: async (token, taskId, resultId) => {
    try {
      const response = await axios.delete(`${baseUrl}/get_the_thief/tasks-with-results/${taskId}/delete-result/${resultId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { error: null, data: response };
    } catch (error) {
      return {
        error: error.response?.data?.detail || "خطأ في حذف النتيجة"
      };
    }
  },
};

export default contentTrackerService;
