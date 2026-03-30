import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const structureService = {
  // ─── Structures CRUD ───
  getAll: async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/data-cleaner/structures/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { data: response.data, error: null };
    } catch {
      return { data: null, error: "خطأ في جلب الهياكل" };
    }
  },

  search: async (token, query) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/data-cleaner/structures/?search=${query || ""}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { data: response.data, error: null };
    } catch {
      return { data: null, error: "خطأ في البحث عن الهياكل" };
    }
  },

  create: async (token, data) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/data-cleaner/structures/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return { data: response.data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error?.response?.data?.name?.[0] || "فشل في إنشاء الهيكل",
      };
    }
  },

  update: async (token, id, data) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/data-cleaner/structures/${id}/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return { data: response.data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error?.response?.data?.name?.[0] || "فشل في تعديل الهيكل",
      };
    }
  },

  delete: async (token, id) => {
    try {
      await axios.delete(`${BASE_URL}/data-cleaner/structures/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { error: null };
    } catch (error) {
      return {
        error: error?.response?.data?.detail || "فشل في حذف الهيكل",
      };
    }
  },

  // ─── Lists CRUD ───
  getLists: async (token, structureId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/data-cleaner/structures/${structureId}/lists/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { data: response.data, error: null };
    } catch {
      return { data: null, error: "خطأ في جلب القوائم" };
    }
  },

  searchLists: async (token, structureId, query) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/data-cleaner/structures/${structureId}/lists/?search=${query || ""}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { data: response.data, error: null };
    } catch {
      return { data: null, error: "خطأ في البحث عن القوائم" };
    }
  },

  createList: async (token, structureId, data) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/data-cleaner/structures/${structureId}/lists/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return { data: response.data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error?.response?.data?.name?.[0] || "فشل في إنشاء القائمة",
      };
    }
  },

  updateList: async (token, structureId, listId, data) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/data-cleaner/structures/${structureId}/lists/${listId}/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return { data: response.data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error?.response?.data?.name?.[0] || "فشل في تعديل القائمة",
      };
    }
  },

  deleteList: async (token, structureId, listId) => {
    try {
      await axios.delete(
        `${BASE_URL}/data-cleaner/structures/${structureId}/lists/${listId}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { error: null };
    } catch (error) {
      return {
        error: error?.response?.data?.detail || "فشل في حذف القائمة",
      };
    }
  },

  // ─── Upload Excel (at structure level) ───
  uploadExcel: async (token, structureId, formData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/data-cleaner/structures/${structureId}/upload/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return { data: response.data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error?.response?.data?.detail || "فشل في رفع الملف",
      };
    }
  },

  // ─── Start Mission ───
  startMission: async (token, structureId, listId, options = {}) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/data-cleaner/structures/${structureId}/lists/${listId}/process/`,
        {
          add_language: options.add_language ?? true,
          add_last_updated: options.add_last_updated ?? true,
          remove_duplicates: options.remove_duplicates ?? true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return { data: response.data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error?.response?.data?.detail || "فشل في بدء المهمة",
      };
    }
  },

  // ─── Export ───
  exportExcel: async (token, structureId, listId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/data-cleaner/structures/${structureId}/lists/${listId}/download_excel/`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      return { data: response.data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error?.response?.data?.detail || "فشل في تصدير ملف Excel",
      };
    }
  },

  exportPdf: async (token, structureId, listId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/data-cleaner/structures/${structureId}/lists/${listId}/download_pdf/`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      return { data: response.data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error?.response?.data?.detail || "فشل في تصدير ملف PDF",
      };
    }
  },
};

export default structureService;
