import axios from "axios";

const BASE_URL = "https://data-handler-gjdd.onrender.com";


const BulkDataService = {
  getAllBulkData: async (accessToken) => {
    return axios.get(`${BASE_URL}/bulkdata/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  getBulkDataById: async (id, accessToken) => {
    return axios.get(`${BASE_URL}/bulkdata/${id}/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  createBulkData: async (data, accessToken) => {
    return axios.post(`${BASE_URL}/bulkdata/`, data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  updateBulkData: async (id, data, accessToken) => {
    return axios.put(`${BASE_URL}/bulkdata/${id}/`, data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  deleteBulkData: async (id, accessToken) => {
    return axios.delete(`${BASE_URL}/bulkdata/${id}/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  createRow: async (bulkDataId, rowData, accessToken) => {
    return axios.post(`${BASE_URL}/bulkdata/${bulkDataId}/add-row/`, rowData, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  updateRow: async (bulkDataId, rowId, rowData, accessToken) => {
    return axios.patch(`${BASE_URL}/bulkdata/${bulkDataId}/edit-row/${rowId}/`, rowData, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  deleteRow: async (bulkDataId, rowId, accessToken) => {
    return axios.delete(`${BASE_URL}/bulkdata/${bulkDataId}/delete-row/${rowId}/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  uploadExcelToBulkData: async (id, formData, accessToken) => {
    return axios.post(`${BASE_URL}/bulkdata/${id}/upload-excel/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
};

export default BulkDataService;

