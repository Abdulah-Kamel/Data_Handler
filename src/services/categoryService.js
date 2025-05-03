import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;
export const categoryService = {
  getAll: async (token) => {
    try {
      const response = await axios.get(`${baseUrl}/categories/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: "خطأ فى جلب التصنيفات" };
    }
  },

  create: async (token, categoryData) => {
    try {
      const response = await axios.post(
        `${baseUrl}/categories/`,
        categoryData,
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
        error: error?.response?.data?.name?.[0] || "Failed to create category",
      };
    }
  },

  update: async (token, id, categoryData) => {
    try {
      const response = await axios.put(
        `${baseUrl}/categories/${id}/`,
        categoryData,
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
        error: error?.response?.data?.name?.[0] || "Failed to update category" 
      };
    }
  },

  delete: async (token, id) => {
    try {
      await axios.delete(`${baseUrl}/categories/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { error: null };
    } catch (error) {
      return { 
        error: error?.response?.data?.detail || "Failed to delete category" 
      };
    }
  },
};

export default categoryService;
