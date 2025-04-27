import axios from "axios";

const BASE_URL = "https://data-handler-gjdd.onrender.com";

const getToken = () => {
  const user = JSON.parse(sessionStorage.getItem("User"));
  return user?.access || "";
};

const BulkDataService = {
  // Get all bulk data
  getAllBulkData: async () => {
    return axios.get(`${BASE_URL}/bulkdata/`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
  },

  // Get single bulk data by ID
  getBulkDataById: async (id) => {
    return axios.get(`${BASE_URL}/bulkdata/${id}/`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
  },

  // Create new bulk data
  createBulkData: async (data) => {
    return axios.post(`${BASE_URL}/bulkdata/`, data, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
  },

  // Update bulk data
  updateBulkData: async (id, data) => {
    return axios.put(`${BASE_URL}/bulkdata/${id}/`, data, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
  },

  // Delete bulk data
  deleteBulkData: async (id) => {
    return axios.delete(`${BASE_URL}/bulkdata/${id}/`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
  },

  createRow: async (bulkDataId, rowData) => {
    return axios.post(`${BASE_URL}/bulkdata/${bulkDataId}/add-row/`, rowData, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
  },
  
  updateRow: async (bulkDataId,rowId, rowData) => {
    return axios.patch(`${BASE_URL}/bulkdata/${bulkDataId}/edit-row/${rowId}/`, rowData, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
  },

  // Delete a row from bulk data
  deleteRow: async (bulkDataId, rowId) => {
    return axios.delete(
      `${BASE_URL}/bulkdata/${bulkDataId}/delete-row/${rowId}/`,
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );
  },

  // Add these methods to your existing BulkDataService
  // Upload Excel file to bulk data
  uploadExcelToBulkData: async (id, formData) => {
    return axios.post(
      `https://data-handler-gjdd.onrender.com/bulkdata/${id}/upload-excel/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
  },
};

export default BulkDataService;
