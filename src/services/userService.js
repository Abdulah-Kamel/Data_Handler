import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

export const userService = {
  getAllUsers: async (token) => {
    try {
      const response = await axios.get(`${baseUrl}/auth/users/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { data: response.data, error: null };
    } catch (error) {
      console.error("Error fetching users:", error);
      return { 
        data: null, 
        error:  "خطأ في جلب المستخدمين" 
      };
    }
  },

  createUser: async (token, userData) => {
    try {
      const response = await axios.post(
        `${baseUrl}/auth/users/`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { data: response.data, error: null };
    } catch (error) {
      console.error("Error creating user:", error);
      return {
        data: null,
        error: error.response?.data?.detail || "Failed to create user"
      };
    }
  },

  updateUser: async (token, userId, userData) => {
    try {
      const response = await axios.patch(
        `${baseUrl}/auth/users/${userId}/`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { data: response.data, error: null };
    } catch (error) {
      console.error("Error updating user:", error);
      return {
        data: null,
        error: error.response?.data?.detail || "Failed to update user"
      };
    }
  },

  deleteUser: async (token, userId) => {
    try {
      await axios.delete(`${baseUrl}/auth/users/${userId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { error: null };
    } catch (error) {
      console.error("Error deleting user:", error);
      return {
        error: error.response?.data?.detail || "Failed to delete user"
      };
    }
  },
};

export default userService;