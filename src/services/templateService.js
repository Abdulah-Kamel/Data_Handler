import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

export const templateService = {
  getByCategoryId: async (token, categoryId) => {
    try {
      const response = await axios.get(`${baseUrl}/categories/${categoryId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return {
        data: response.data,
        templates: response.data.templates || [],
        error: null,
      };
    } catch (error) {
      return { data: null, templates: [], error: "Failed to load templates" };
    }
  },

  getById: async (token, id) => {
    try {
      const response = await axios.get(`${baseUrl}/templates/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: "Failed to load template" };
    }
  },

  search: async (token, searchParam) => {
    try {
      const response = await axios.get(
        `${baseUrl}/templates/?search=${searchParam || ""}`,
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
        error:
          error?.response?.data?.name?.[0] || "Failed to search categories",
      };
    }
  },
  create: async (token, templateData) => {
    try {
      const response = await axios.post(`${baseUrl}/templates/`, templateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return { data: response.data, error: null };
    } catch (error) {
      const errorMessage =
        error?.response?.data?.name?.[0] ||
        error?.response?.data?.description?.[0] ||
        error?.response?.data?.detail ||
        "Failed to create template";
      return { data: null, error: errorMessage };
    }
  },

  update: async (token, id, templateData) => {
    try {
      const response = await axios.put(
        `${baseUrl}/templates/${id}/`,
        templateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return { data: response.data, error: null };
    } catch (error) {
      const errorMessage =
        error?.response?.data?.name?.[0] ||
        error?.response?.data?.description?.[0] ||
        error?.response?.data?.detail ||
        "Failed to update template";
      return { data: null, error: errorMessage };
    }
  },

  delete: async (token, id) => {
    try {
      await axios.delete(`${baseUrl}/templates/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { error: null };
    } catch (error) {
      return {
        error: error?.response?.data?.detail || "Failed to delete template",
      };
    }
  },

  uploadWordFile: async (token, templateId, file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${baseUrl}/templates/${templateId}/upload_word/`,
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
      const errorMessage =
        error?.response?.data?.word_file?.[0] ||
        error?.response?.data?.detail ||
        "Failed to upload file";
      return { data: null, error: errorMessage };
    }
  },
};

export default templateService;